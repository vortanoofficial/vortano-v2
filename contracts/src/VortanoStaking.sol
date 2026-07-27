// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VortanoStaking
 * @notice Stake $VRTN, earn a share of protocol revenue paid in a rewards token
 *         (USDG on mainnet). Implements the well-audited Synthetix StakingRewards
 *         accrual model: rewards stream linearly over a funded period, distributed
 *         pro-rata to staked balance.
 *
 * @dev Deployed on Robinhood Chain (chainId 4663). The owner (protocol treasury /
 *      multisig) funds reward epochs via {notifyRewardAmount}. Stakers can stake,
 *      withdraw and claim at any time — this contract is non-custodial beyond the
 *      tokens a user chooses to stake, and holds no admin key over user principal.
 *
 *      This is the canonical, battle-tested staking pattern; lock-tier multipliers
 *      (30d / 90d) are layered in a future revision to keep the core minimal and
 *      auditable.
 */
contract VortanoStaking is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable stakingToken; // $VRTN
    IERC20 public immutable rewardsToken; // USDG (or VRTN)

    uint256 public periodFinish;
    uint256 public rewardRate; // rewards per second
    uint256 public rewardsDuration = 7 days;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardAdded(uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);

    constructor(address _stakingToken, address _rewardsToken, address _owner) Ownable(_owner) {
        require(_stakingToken != address(0) && _rewardsToken != address(0), "zero token");
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
    }

    // ----------------------------------------------------------------- views

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) return rewardPerTokenStored;
        return rewardPerTokenStored
            + ((lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18) / _totalSupply;
    }

    function earned(address account) public view returns (uint256) {
        return (_balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18
            + rewards[account];
    }

    // ------------------------------------------------------------- mutations

    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "cannot stake 0");
        _totalSupply += amount;
        _balances[msg.sender] += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "cannot withdraw 0");
        require(_balances[msg.sender] >= amount, "insufficient");
        _totalSupply -= amount;
        _balances[msg.sender] -= amount;
        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    /// @notice Withdraw everything and claim rewards in one call.
    function exit() external {
        withdraw(_balances[msg.sender]);
        getReward();
    }

    // ------------------------------------------------------------- owner ops

    /// @notice Fund a new reward epoch. Transfer `reward` rewardsToken to this
    ///         contract first (or approve + this pulls it). Streams over duration.
    function notifyRewardAmount(uint256 reward) external onlyOwner updateReward(address(0)) {
        if (block.timestamp >= periodFinish) {
            rewardRate = reward / rewardsDuration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            rewardRate = (reward + leftover) / rewardsDuration;
        }
        // sanity: contract must hold enough rewardsToken to cover the rate
        uint256 balance = rewardsToken.balanceOf(address(this));
        require(rewardRate <= balance / rewardsDuration, "reward too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + rewardsDuration;
        emit RewardAdded(reward);
    }

    function setRewardsDuration(uint256 _duration) external onlyOwner {
        require(block.timestamp > periodFinish, "epoch active");
        require(_duration > 0, "zero duration");
        rewardsDuration = _duration;
        emit RewardsDurationUpdated(_duration);
    }

    // ---------------------------------------------------------------- modifier

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
}
