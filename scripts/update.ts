/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ethers, upgrades } from 'hardhat'

async function main() {
	const token2 = await ethers.getContractFactory('GuildToken2')
	const proxyAddress =
		typeof process.env.PROXY_ADDRESS === 'undefined'
			? ''
			: process.env.PROXY_ADDRESS
	console.log('proxy address:', proxyAddress)
	const tokenProxy = await upgrades.upgradeProxy(proxyAddress, token2)
	const filter = tokenProxy.filters.Upgraded()
	const events = await tokenProxy.queryFilter(filter)
	console.log(
		'logic was deployed to:',
		events[events.length - 1].args!.implementation
	)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})

// Npx hardhat verify --contract contracts/GuildToken2.sol:GuildToken2 --network rinkeby 0x08A92A99D993F06161B24C2C192E540DC545464b
