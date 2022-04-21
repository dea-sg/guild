// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.9;

import "../layerzero/LayerZeroBaseUpgradeable.sol";

contract TestLayerZeroBaseUpgradeable is LayerZeroBaseUpgradeable {
	event Executed(
		uint16 _srcChainId,
		bytes _srcAddress,
		uint64 _nonce,
		bytes _payload
	);

	function initialize(address _endpoint) external initializer {
		__LayerZeroBase_init(_endpoint);
	}

	function _blockingLzReceive(
		uint16 _srcChainId,
		bytes memory _srcAddress,
		uint64 _nonce,
		bytes memory _payload
	) internal virtual override {
		emit Executed(_srcChainId, _srcAddress, _nonce, _payload);
	}
}
