// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@dea-sg/layerzero/contracts/ERC20/OmniERC20Upgradeable.sol";
import "./interfaces/IGuildToken.sol";

contract GuildToken is
	OwnableUpgradeable,
	UUPSUpgradeable,
	OmniERC20Upgradeable,
	IGuildToken
{
	bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
	bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
	bytes32 public constant BLOCK_LIST_ROLE = keccak256("BLOCK_LIST_ROLE");
	EnumerableSetUpgradeable.AddressSet private blockList;

	using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

	function initialize(
		string memory _name,
		string memory _symbol,
		address _endpoint
	) external initializer {
		__Ownable_init();
		__UUPSUpgradeable_init();
		__OmniERC20_init(_name, _symbol, _endpoint);
		_setupRole(BURNER_ROLE, _msgSender());
		_setupRole(MINTER_ROLE, _msgSender());
		_setupRole(BLOCK_LIST_ROLE, _msgSender());
	}

	function mint(address _account, uint256 _amount)
		external
		onlyRole(MINTER_ROLE)
	{
		_mint(_account, _amount);
	}

	function burn(address _account, uint256 _amount)
		external
		onlyRole(BURNER_ROLE)
	{
		_burn(_account, _amount);
	}

	function addToBlockList(address _account)
		external
		onlyRole(BLOCK_LIST_ROLE)
	{
		blockList.add(_account);
	}

	function removeFromBlockList(address _account)
		external
		onlyRole(BLOCK_LIST_ROLE)
	{
		blockList.remove(_account);
	}

	function isBlockList(address _account) external view returns (bool) {
		return blockList.contains(_account);
	}

	function _afterTokenTransfer(
		address _from,
		address _to,
		uint256 _amount
	) internal virtual override {
		super._afterTokenTransfer(_from, _to, _amount);
		require(
			blockList.contains(_from) == false,
			"illegal access(block list)"
		);
		require(blockList.contains(_to) == false, "illegal access(block list)");
	}

	function _authorizeUpgrade(address) internal override onlyOwner {}
}
