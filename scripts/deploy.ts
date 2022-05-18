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
