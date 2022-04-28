// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.9;

/**
 * @dev Interface of the Guild token standard
 */
interface IGuildToken {
	/**
	 * @dev mint token
	 * @param _account minted address
	 * @param _amount token amount
	 */
	function mint(address _account, uint256 _amount) external;

	/**
	 * @dev burn token
	 * @param  _account buned address
	 * @param  _amount token amount
	 */
	function burn(address _account, uint256 _amount) external;

	/**
	 * @dev add block list
	 * @param  _account block address
	 */
	function addToBlockList(address _account) external;

	/**
	 * @dev remove block list
	 * @param  _account remove address
	 */
	function removeFromBlockList(address _account) external;

	/**
	 * @dev check block list
	 * @return bool if it is a block list address, return true
	 * @param  _account check address
	 */
	function isBlockList(address _account) external view returns (bool);
}
