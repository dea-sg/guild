/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect, use } from 'chai'
import { ethers, waffle } from 'hardhat'
import { solidity, MockContract } from 'ethereum-waffle'
import { deploy, makeSnapshot, resetChain } from './utils'
import { TestOmniERC20Upgradeable } from '../typechain-types'
import { abi as LayerZeroEndpoint } from '../artifacts/contracts/interfaces/ILayerZeroEndpoint.sol/ILayerZeroEndpoint.json'
const { deployMockContract } = waffle

use(solidity)

describe('OmniERC20', () => {
	let token: TestOmniERC20Upgradeable
	// Let utils: TestUtils
	let mockEndPoint: MockContract
	let snapshot: string

	before(async () => {
		const [deployer] = await ethers.getSigners()
		mockEndPoint = await deployMockContract(deployer, LayerZeroEndpoint)
		token = await deploy<TestOmniERC20Upgradeable>('TestOmniERC20Upgradeable')
		await token.__OmniERC20_init('token', 'TOKEN', mockEndPoint.address)
		// Utils = await deploy<TestUtils>('TestUtils')
	})
	beforeEach(async () => {
		snapshot = await makeSnapshot()
	})
	afterEach(async () => {
		await resetChain(snapshot)
	})

	describe('estimateSendFee', () => {
		it('get gas fee', async () => {
			const [, other] = await ethers.getSigners()
			const coder = new ethers.utils.AbiCoder()
			const payload = coder.encode(['bytes', 'uint256'], [other.address, 100])
			await mockEndPoint.mock.estimateFees
				.withArgs(1, token.address, payload, false, '0x')
				.returns(5, 6)
			const result = await token.estimateSendFee(
				1,
				other.address,
				false,
				100,
				'0x'
			)
			expect(result[0].toString()).to.be.equal('5')
			expect(result[1].toString()).to.be.equal('6')
		})
	})
})
