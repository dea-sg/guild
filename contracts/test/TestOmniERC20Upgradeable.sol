// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.9;

import "../layerzero/OmniERC20Upgradeable.sol";

contract TestOmniERC20Upgradeable is OmniERC20Upgradeable {
	function initialize(
		string memory _name,
		string memory _symbol,
		address _endpoint
	) external initializer {
		__OmniERC20_init(_name, _symbol, _endpoint);
	}
}
