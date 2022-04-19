import { ethers } from 'hardhat'
import {
	Admin__factory,
	UpgradeableProxy__factory,
	GuildToken__factory,
} from '../typechain-types'

async function main() {
	const exampleFactory = (await ethers.getContractFactory(
		'GuildToken'
	)) as GuildToken__factory
	const example = await exampleFactory.deploy()

	const adminFactory = (await ethers.getContractFactory(
		'Admin'
	)) as Admin__factory
	const admin = await adminFactory.deploy()
	await admin.deployed()

	const upgradeableProxyFactory = (await ethers.getContractFactory(
		'UpgradeableProxy'
	)) as UpgradeableProxy__factory
	const upgradeableProxy = await upgradeableProxyFactory.deploy(
		example.address,
		admin.address,
		ethers.utils.arrayify('0x')
	)
	await upgradeableProxy.deployed()

	console.log('Example address:', example.address)
	console.log('Admin address:', admin.address)
	console.log('UpgradeableProxy address:', upgradeableProxy.address)
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})

// やること
// テストケース
// ソースざっと確認不要な拡張子とか
// おすすめ実装確認
