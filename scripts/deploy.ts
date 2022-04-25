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

// memo

// [rinkeby]
// GuildToken address: 0x871fAee277bC6D7A695566F6f60C22CD9d8714Ef
// Admin address: 0x5312f4968901Ec9d4fc43d2b0e437041614B14A2
// UpgradeableProxy address: 0x50Ea71c70D2399037A1bAeeC15Afbfb3417aFeff

// npx hardhat run dist/scripts/deploy.js --network rinkeby

// npx hardhat verify --network rinkeby 0x871fAee277bC6D7A695566F6f60C22CD9d8714Ef
// npx hardhat verify --contract contracts/proxy/Admin.sol:Admin --network rinkeby 0x5312f4968901Ec9d4fc43d2b0e437041614B14A2
// npx hardhat verify --contract contracts/proxy/UpgradeableProxy.sol:UpgradeableProxy --network rinkeby --constructor-args scripts/arg.js 0x50Ea71c70D2399037A1bAeeC15Afbfb3417aFeff

// [polygon mumbai]
// GuildToken address: 0xF1BC8219d218bEF851E4a99df85C40E533ee97C1
// Admin address: 0xaF526119DC779a250aa2Bfa184B5dB383ac0bAD7
// UpgradeableProxy address: 0x864009445089A4144DB6dDf947aF25B7Ae3D90d1

// npx hardhat verify --network polygonMumbai 0xF1BC8219d218bEF851E4a99df85C40E533ee97C1
// npx hardhat verify --contract contracts/proxy/Admin.sol:Admin --network polygonMumbai 0xaF526119DC779a250aa2Bfa184B5dB383ac0bAD7
// npx hardhat verify --contract contracts/proxy/UpgradeableProxy.sol:UpgradeableProxy --network polygonMumbai --constructor-args scripts/arg.js 0x864009445089A4144DB6dDf947aF25B7Ae3D90d1

// initialize & setTrustedRemote
