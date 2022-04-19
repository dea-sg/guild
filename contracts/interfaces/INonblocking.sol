// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.9;

interface INonblocking {
	event MessageFailed(
		uint16 _srcChainId,
		bytes _srcAddress,
		uint64 _nonce,
		bytes _payload
	);

	function retryMessage(
		uint16 _srcChainId,
		bytes memory _srcAddress,
		uint64 _nonce,
		bytes calldata _payload
	) external;
}
