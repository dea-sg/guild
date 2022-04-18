import { expect, use } from 'chai'
import { solidity } from 'ethereum-waffle'
import { deploy } from './utils'
import { ExampleToken } from '../typechain'

use(solidity)

describe('Example', () => {
	describe('name', () => {
		it('0 by default', async () => {
			const example = await deploy<ExampleToken>('ExampleToken')
			await example.initialize()
			const value = await example.name()
			expect(value.toString()).to.equal('token')
		})
	})
	describe('symbol', () => {
		it('0 by default', async () => {
			const example = await deploy<ExampleToken>('ExampleToken')
			await example.initialize()
			const symbol = await example.symbol()
			expect(symbol.toString()).to.equal('TOKEN')
		})
	})
})
