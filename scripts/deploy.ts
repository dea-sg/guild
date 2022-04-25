import { ethers } from 'hardhat'
import {
	Admin__factory,
	UpgradeableProxy__factory,
	GuildToken__factory,
} from '../typechain-types'

async function main() {
	const guildTokenFactory = (await ethers.getContractFactory(
		'GuildToken'
	)) as GuildToken__factory
	const guildToken = await guildTokenFactory.deploy()
	await guildToken.deployed()

	const adminFactory = (await ethers.getContractFactory(
		'Admin'
	)) as Admin__factory
	const admin = await adminFactory.deploy()
	await admin.deployed()

	const upgradeableProxyFactory = (await ethers.getContractFactory(
		'UpgradeableProxy'
	)) as UpgradeableProxy__factory
	const upgradeableProxy = await upgradeableProxyFactory.deploy(
		guildToken.address,
		admin.address,
		ethers.utils.arrayify('0x')
	)
	await upgradeableProxy.deployed()

	console.log('GuildToken address:', guildToken.address)
	console.log('Admin address:', admin.address)
	console.log('UpgradeableProxy address:', upgradeableProxy.address)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
