/* eslint-disable new-cap */
import { expect, use } from 'chai'
import { solidity } from 'ethereum-waffle'
import { Signer } from 'ethers'
import { deploy, deployProxy, makeSnapshot, resetChain } from './utils'
import { Admin, GuildToken } from '../typechain-types'
import { ethers, waffle } from 'hardhat'
import { abi } from '../artifacts/@dea-sg/layerzero/contracts/interfaces/ILayerZeroEndpoint.sol/ILayerZeroEndpoint.json'
const { deployMockContract } = waffle

use(solidity)

describe('GuildToken', () => {
	let deployer: Signer
	let user: Signer
	let user2: Signer
	let guildToken: GuildToken
	let guildTokenUser: GuildToken
	let guildTokenUser2: GuildToken
	let snapshot: string

	before(async () => {
		;[deployer, user, user2] = await ethers.getSigners()
		const admin = await deploy<Admin>('Admin')
		const tokenInstance = await deploy<GuildToken>('GuildToken')
		const proxy = await deployProxy(
			tokenInstance.address,
			admin.address,
			ethers.utils.arrayify('0x')
		)
		guildToken = tokenInstance.attach(proxy.address)
		guildTokenUser = guildToken.connect(user)
		guildTokenUser2 = guildToken.connect(user2)
		const mockEndPoint = await deployMockContract(deployer, abi)

		await guildToken.initialize('token', 'TOKEN', mockEndPoint.address)
	})
	beforeEach(async () => {
		snapshot = await makeSnapshot()
	})
	afterEach(async () => {
		await resetChain(snapshot)
	})

	describe('name', () => {
		it('name is token', async () => {
			const tmp = await guildToken.name()
			expect(tmp).to.equal('token')
		})
	})

	describe('symbol', () => {
		it('symbol is TOKEN', async () => {
			const tmp = await guildToken.symbol()
			expect(tmp).to.equal('TOKEN')
		})
	})

	describe('initialize', () => {
		describe('fail', () => {
			it('Cannot be executed more than once', async () => {
				await expect(
					guildToken.initialize('token', 'TOKEN', ethers.constants.AddressZero)
				).to.be.revertedWith('Initializable: contract is already initialized')
			})
		})
	})

	describe('default role', () => {
		describe('deployer', () => {
			it('has admin role', async () => {
				const adminRole = await guildToken.DEFAULT_ADMIN_ROLE()
				const result = await guildToken.hasRole(
					adminRole,
					await deployer.getAddress()
				)
				expect(result).to.equal(true)
			})
			it('has burner role', async () => {
				const burnRole = await guildToken.BURNER_ROLE()
				const result = await guildToken.hasRole(
					burnRole,
					await deployer.getAddress()
				)
				expect(result).to.equal(true)
			})
			it('has minter role', async () => {
				const minterRole = await guildToken.MINTER_ROLE()
				const result = await guildToken.hasRole(
					minterRole,
					await deployer.getAddress()
				)
				expect(result).to.equal(true)
			})
			it('has admin role', async () => {
				const blockListRole = await guildToken.BLOCK_LIST_ROLE()
				const result = await guildToken.hasRole(
					blockListRole,
					await deployer.getAddress()
				)
				expect(result).to.equal(true)
			})
		})
		describe('user', () => {
			it('no has admin role', async () => {
				const adminRole = await guildToken.DEFAULT_ADMIN_ROLE()
				const result = await guildToken.hasRole(
					adminRole,
					await user.getAddress()
				)
				expect(result).to.equal(false)
			})
			it('no has burner role', async () => {
				const burnRole = await guildToken.BURNER_ROLE()
				const result = await guildToken.hasRole(
					burnRole,
					await user.getAddress()
				)
				expect(result).to.equal(false)
			})
			it('no has minter role', async () => {
				const minterRole = await guildToken.MINTER_ROLE()
				const result = await guildToken.hasRole(
					minterRole,
					await user.getAddress()
				)
				expect(result).to.equal(false)
			})
			it('no has admin role', async () => {
				const blockListRole = await guildToken.BLOCK_LIST_ROLE()
				const result = await guildToken.hasRole(
					blockListRole,
					await user.getAddress()
				)
				expect(result).to.equal(false)
			})
		})
	})

	describe('mint', () => {
		describe('success', () => {
			it('mint', async () => {
				const userAddress = await user.getAddress()
				const before = await guildToken.balanceOf(userAddress)
				expect(before.toString()).to.equal('0')
				await guildToken.mint(userAddress, 10000)
				const after = await guildToken.balanceOf(userAddress)
				expect(after.toString()).to.equal('10000')
			})
		})
		describe('fail', () => {
			it('no have role', async () => {
				const userAddress = await user.getAddress()
				await expect(guildTokenUser.mint(userAddress, 10000)).to.be.reverted
			})
		})
	})

	describe('burn', () => {
		describe('success', () => {
			it('burn', async () => {
				const userAddress = await user.getAddress()
				await guildToken.mint(userAddress, 10000)
				const before = await guildToken.balanceOf(userAddress)
				expect(before.toString()).to.equal('10000')
				await guildToken.burn(userAddress, 10000)
				const after = await guildToken.balanceOf(userAddress)
				expect(after.toString()).to.equal('0')
			})
		})
		describe('fail', () => {
			it('no have role', async () => {
				const userAddress = await user.getAddress()
				await expect(guildTokenUser.burn(userAddress, 10000)).to.be.reverted
			})
		})
	})

	describe('addToBlockList', () => {
		describe('success', () => {
			it('add block list', async () => {
				const userAddress = await user.getAddress()
				const before = await guildToken.isBlockList(userAddress)
				expect(before).to.equal(false)
				await guildToken.addToBlockList(userAddress)
				const after = await guildToken.isBlockList(userAddress)
				expect(after).to.equal(true)
			})
			it('donot mint', async () => {
				const userAddress = await user.getAddress()
				await guildToken.mint(userAddress, 10000)
				await guildToken.addToBlockList(userAddress)
				await expect(guildToken.mint(userAddress, 10000)).to.be.revertedWith(
					'illegal access(block list)'
				)
			})
			it('donot burn', async () => {
				const userAddress = await user.getAddress()
				await guildToken.mint(userAddress, 10000)
				await guildToken.addToBlockList(userAddress)
				await expect(guildToken.burn(userAddress, 10000)).to.be.revertedWith(
					'illegal access(block list)'
				)
			})
			it('donot transfer', async () => {
				const deployerAddress = await deployer.getAddress()
				const userAddress = await user.getAddress()
				await guildToken.mint(deployerAddress, 10000)
				await guildToken.addToBlockList(userAddress)
				await expect(
					guildToken.transfer(userAddress, 10000)
				).to.be.revertedWith('illegal access(block list)')
			})
			it('donot transferFrom', async () => {
				const deployerAddress = await deployer.getAddress()
				const userAddress = await user.getAddress()
				const user2Address = await user2.getAddress()
				await guildToken.mint(deployerAddress, 10000)
				await guildToken.approve(user2Address, 10000)
				await guildToken.addToBlockList(userAddress)
				await expect(
					guildTokenUser2.transferFrom(deployerAddress, userAddress, 10000)
				).to.be.revertedWith('illegal access(block list)')
			})
		})
		describe('fail', () => {
			it('no have role', async () => {
				const userAddress = await user.getAddress()
				await expect(guildTokenUser.addToBlockList(userAddress)).to.be.reverted
			})
		})
	})

	describe('removeFromBlockList', () => {
		describe('success', () => {
			it('remove block list', async () => {
				const userAddress = await user.getAddress()
				await guildToken.addToBlockList(userAddress)
				const before = await guildToken.isBlockList(userAddress)
				expect(before).to.equal(true)
				await guildToken.removeFromBlockList(userAddress)
				const after = await guildToken.isBlockList(userAddress)
				expect(after).to.equal(false)
			})
		})
		describe('fail', () => {
			it('no have role', async () => {
				const userAddress = await user.getAddress()
				await expect(guildTokenUser.removeFromBlockList(userAddress)).to.be
					.reverted
			})
		})
	})
})
