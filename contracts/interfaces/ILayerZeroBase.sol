// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.9;

interface ILayerZeroBase {
	event SetTrustedRemote(uint16 _srcChainId, bytes _srcAddress);

	// @param _chainId - the chainId for the pending config change
	// @param _configType - type of configuration. every messaging library has its own convention.
	function getConfig(
		uint16,
		uint16 _chainId,
		address,
		uint256 _configType
	) external view returns (bytes memory);

	function setTrustedRemote(uint16 _srcChainId, bytes calldata _srcAddress)
		external;

	function isTrustedRemote(uint16 _srcChainId, bytes calldata _srcAddress)
		external
		view
		returns (bool);

	function getTrustedRemote(uint16 _chainId)
		external
		view
		returns (bytes memory);

	function getLzEndpoint() external view returns (address);
}
