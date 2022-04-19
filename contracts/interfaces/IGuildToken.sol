// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.9;

/**
 * @dev Interface of the OFT standard
 */
interface IGuildToken {
	function mint(address _account, uint256 _amount) external;

	function burn(address _account, uint256 _amount) external;

	function addToBlockList(address _account) external;

	function removeFromBlockList(address _account) external;

	function isBlockList(address _account) external view returns (bool);
}
