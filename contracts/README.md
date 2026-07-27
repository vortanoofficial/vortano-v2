# Vortano Contracts

Smart contracts for the Vortano protocol on **Robinhood Chain** (chainId `4663`).

## `VortanoStaking`

Stake **$VRTN**, earn a share of protocol revenue paid in a rewards token (**USDG**
on mainnet). Implements the battle-tested **Synthetix `StakingRewards`** accrual
model — rewards stream linearly over a funded epoch and are distributed pro-rata
to staked balance.

- Non-custodial: the contract never has admin control over user principal.
- Owner (treasury / multisig) funds reward epochs via `notifyRewardAmount`.
- `stake` · `withdraw` · `getReward` · `exit` for users.

> Status: written and unit-tested, **not yet deployed to mainnet.** Deployment is
> a treasury decision (it moves real funds and requires an audit sign-off). The
> code is public here so anyone can review it before that happens — building in
> the open.

## Layout

```
contracts/
  src/VortanoStaking.sol      # the staking contract
  test/VortanoStaking.t.sol   # Foundry unit tests
  script/Deploy.s.sol         # deploy script (Robinhood Chain)
  foundry.toml
```

## Build & test (Foundry)

```bash
cd contracts
forge install foundry-rs/forge-std OpenZeppelin/openzeppelin-contracts --no-commit
forge build
forge test -vvv
```

## Deploy to Robinhood Chain

```bash
export VRTN=0xe81DC008231035C91F09633c541394B9DdF53673
export USDG=<usdg_token_on_robinhood_chain>
export OWNER=<treasury_multisig>

forge script script/Deploy.s.sol \
  --rpc-url robinhood \
  --private-key $DEPLOYER_KEY \
  --broadcast --verify
```

- RPC: `https://rpc.mainnet.chain.robinhood.com`
- Explorer: `https://robinhoodchain.blockscout.com`
- Testnet first: use `--rpc-url robinhood_testnet` (chainId 46630) with faucet ETH.

## Security notes

- Fund the reward epoch by transferring the rewards token to the contract **before**
  calling `notifyRewardAmount`; the call reverts if the balance can't cover the rate.
- Get an independent audit before mainnet. Lock-tier multipliers (30d / 90d) are a
  planned v2 layered on top of this minimal, auditable core.
