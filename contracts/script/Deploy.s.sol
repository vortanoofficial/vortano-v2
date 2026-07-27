// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {VortanoStaking} from "../src/VortanoStaking.sol";

/**
 * Deploy VortanoStaking to Robinhood Chain (chainId 4663).
 *
 * Usage:
 *   forge script script/Deploy.s.sol \
 *     --rpc-url robinhood \
 *     --private-key $DEPLOYER_KEY \
 *     --broadcast --verify
 *
 * Env:
 *   VRTN   — $VRTN token (0xe81DC008231035C91F09633c541394B9DdF53673)
 *   USDG   — rewards token (Global Dollar) on Robinhood Chain
 *   OWNER  — treasury / multisig that funds reward epochs
 */
contract Deploy is Script {
    function run() external returns (VortanoStaking staking) {
        address vrtn = vm.envAddress("VRTN");
        address usdg = vm.envAddress("USDG");
        address owner = vm.envAddress("OWNER");

        vm.startBroadcast();
        staking = new VortanoStaking(vrtn, usdg, owner);
        vm.stopBroadcast();

        console2.log("VortanoStaking deployed at:", address(staking));
    }
}
