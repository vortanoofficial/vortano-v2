// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {VortanoStaking} from "../src/VortanoStaking.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(string memory n, string memory s) ERC20(n, s) {}
    function mint(address to, uint256 amt) external {
        _mint(to, amt);
    }
}

contract VortanoStakingTest is Test {
    VortanoStaking staking;
    MockToken vrtn;
    MockToken usdg;

    address owner = address(0xA11CE);
    address alice = address(0xB0B);
    address bob = address(0xCa1);

    function setUp() public {
        vrtn = new MockToken("Vortano", "VRTN");
        usdg = new MockToken("Global Dollar", "USDG");
        staking = new VortanoStaking(address(vrtn), address(usdg), owner);

        vrtn.mint(alice, 1_000e18);
        vrtn.mint(bob, 1_000e18);
        vm.prank(alice);
        vrtn.approve(address(staking), type(uint256).max);
        vm.prank(bob);
        vrtn.approve(address(staking), type(uint256).max);
    }

    function test_StakeAndWithdraw() public {
        vm.prank(alice);
        staking.stake(100e18);
        assertEq(staking.balanceOf(alice), 100e18);
        assertEq(staking.totalSupply(), 100e18);

        vm.prank(alice);
        staking.withdraw(40e18);
        assertEq(staking.balanceOf(alice), 60e18);
        assertEq(vrtn.balanceOf(alice), 940e18);
    }

    function test_RewardsAccrueAndClaim() public {
        // alice stakes 100
        vm.prank(alice);
        staking.stake(100e18);

        // owner funds 700 USDG over 7 days (1e18/sec... actually 700e18/604800)
        usdg.mint(address(staking), 700e18);
        vm.prank(owner);
        staking.notifyRewardAmount(700e18);

        // after full duration alice should have earned ~700 USDG (sole staker)
        vm.warp(block.timestamp + 7 days);
        uint256 earned = staking.earned(alice);
        assertApproxEqRel(earned, 700e18, 0.01e18); // within 1%

        vm.prank(alice);
        staking.getReward();
        assertApproxEqRel(usdg.balanceOf(alice), 700e18, 0.01e18);
    }

    function test_RewardsSplitProRata() public {
        vm.prank(alice);
        staking.stake(100e18);
        vm.prank(bob);
        staking.stake(300e18); // bob has 3x

        usdg.mint(address(staking), 800e18);
        vm.prank(owner);
        staking.notifyRewardAmount(800e18);

        vm.warp(block.timestamp + 7 days);
        // alice 1/4, bob 3/4
        assertApproxEqRel(staking.earned(alice), 200e18, 0.02e18);
        assertApproxEqRel(staking.earned(bob), 600e18, 0.02e18);
    }

    function test_ExitWithdrawsAndClaims() public {
        vm.prank(alice);
        staking.stake(100e18);
        usdg.mint(address(staking), 700e18);
        vm.prank(owner);
        staking.notifyRewardAmount(700e18);
        vm.warp(block.timestamp + 7 days);

        vm.prank(alice);
        staking.exit();
        assertEq(staking.balanceOf(alice), 0);
        assertEq(vrtn.balanceOf(alice), 1_000e18);
        assertGt(usdg.balanceOf(alice), 690e18);
    }

    function test_OnlyOwnerCanNotify() public {
        usdg.mint(address(staking), 100e18);
        vm.expectRevert();
        vm.prank(alice);
        staking.notifyRewardAmount(100e18);
    }

    function test_CannotStakeZero() public {
        vm.expectRevert("cannot stake 0");
        vm.prank(alice);
        staking.stake(0);
    }
}
