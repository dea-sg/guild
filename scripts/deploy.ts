/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ethers, upgrades } from 'hardhat'

async function main() {
	const name = typeof process.env.NAME === 'undefined' ? '' : process.env.NAME
	const symbol =
		typeof process.env.SYMBOL === 'undefined' ? '' : process.env.SYMBOL
	const endpoint =
		typeof process.env.END_POINT === 'undefined' ? '' : process.env.END_POINT

	const tokenFactory = await ethers.getContractFactory('GuildToken')
	const token = await upgrades.deployProxy(
		tokenFactory,
		[name, symbol, endpoint],
		{ kind: 'uups' }
	)
	await token.deployed()
	console.log('proxy was deployed to:', token.address)
	const filter = token.filters.Upgraded()
	const events = await token.queryFilter(filter)
	console.log('logic was deployed to:', events[0].args!.implementation)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
// Memo

// excute setTrustedRemote

// rinkeby
// npx hardhat run dist/scripts/deploy.js --network rinkeby
// proxy was deployed to: 0xcCb3F56AA3e998ee6A662EA822DCd3238C002933
// logic was deployed to: 0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6
// npx hardhat verify --contract contracts/GuildToken.sol:GuildToken --network rinkeby 0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6

// mumbai
// proxy was deployed to: 0x1f40cC97b4d5163Eef61466859ce531C609Cc492
// logic was deployed to: 0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6
// npx hardhat verify --contract contracts/GuildToken.sol:GuildToken --network polygonMumbai 0xF688573D7B154DEc538234CBd2D8e3f0fdadeAd6
