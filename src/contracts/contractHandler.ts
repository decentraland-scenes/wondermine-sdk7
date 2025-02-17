import { ContractFactory, RequestManager, fromWei } from 'eth-connect'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'

// import { getProvider } from '@decentraland/web3-provider'
// import { getUserAccount } from '@decentraland/EthereumController'
import MANAContract from '../abis/mana'

import contract from '../abis/burningStore'
import { DclUser } from '../../shared-dcl/src/playfab/dcluser'

const mainnetAddress = '0x0822d44c2e2f96d4cccad80610134861802b2cca'
const ropstenAddress = '0x19460D0BDc8942E5e23A6b80A04Aac662788Bae2'

const MANAMainnet = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942'
const MANAropsten = '0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb'

const ropsten: boolean = false

export function isMainnet(): boolean {
  return !ropsten
}

export async function getItemName(collection: string, itemId: number): Promise<any> {
  const provider = createEthereumProvider()
  const rm = new RequestManager(provider)

  const tokenFactory = new ContractFactory(rm, contract)
  const contractInstance = (await tokenFactory.at(ropsten ? ropstenAddress : mainnetAddress)) as any

  const itemInfo = await contractInstance.itemByOptionId(collection, itemId)
  console.log('item name: ', itemInfo)
  return itemInfo
}

export async function getItemInfo(collection: string, itemId: number): Promise<string[]> {
  console.log('fetching item info for ', collection, ' id: ', itemId)
  const provider = createEthereumProvider()
  const rm = new RequestManager(provider)

  const tokenFactory = new ContractFactory(rm, contract)
  const contractInstance = (await tokenFactory.at(ropsten ? ropstenAddress : mainnetAddress)) as any

  // log('balance of: ', await contractInstance.balanceOf(tokenId))
  const itemInfo: [string, string] = await contractInstance.collectionData(collection, itemId)
  const fmWei = [itemInfo[0], fromWei(itemInfo[1], 'ether').toString()]

  console.log('item info: ', fmWei)
  return fmWei
}

export async function getBalance(): Promise<string> {
  if (DclUser.activeUser.userId === null) return ''
  console.log('getting balance for ' + DclUser.activeUser.userId)
  const provider = createEthereumProvider()
  const rm = new RequestManager(provider)

  const tokenFactory = new ContractFactory(rm, MANAContract)
  const contractInstance = (await tokenFactory.at(ropsten ? MANAropsten : MANAMainnet)) as any

  // log('balance of: ', await contractInstance.balanceOf(tokenId))
  const playerBalance = await contractInstance.balanceOf(DclUser.activeUser.userId)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const fmWei = fromWei(playerBalance.toString(), 'ether').toString() // (playerBalance / 1e18).toString() // eth.fromWei(playerBalance.toString(), 'ether').toString()

  console.log('player MANA balance: ', fmWei, ' original value: ', playerBalance)
  return fmWei
}

export async function checkAllowance(): Promise<any> {
  const provider = createEthereumProvider()
  const rm = new RequestManager(provider)

  const tokenFactory = new ContractFactory(rm, MANAContract)
  const contractInstance = (await tokenFactory.at(ropsten ? MANAropsten : MANAMainnet)) as any

  const allowed = await contractInstance.allowance(DclUser.activeUser.userId, ropsten ? ropstenAddress : mainnetAddress)
  console.log('contract allowed: ', allowed)
  return allowed
}

export async function approveContract(): Promise<any> {
  const provider = createEthereumProvider()
  const rm = new RequestManager(provider)

  const tokenFactory = new ContractFactory(rm, MANAContract)
  const contractInstance = (await tokenFactory.at(ropsten ? MANAropsten : MANAMainnet)) as any

  const allowed = await contractInstance.approve(ropsten ? ropstenAddress : mainnetAddress, -1, {
    from: DclUser.activeUser.userId
  })
  console.log('contract allowed: ', allowed)
  return allowed
}

export async function buyItem(collection: string, itemId: number): Promise<any> {
  const provider = createEthereumProvider()
  const rm = new RequestManager(provider)

  const tokenFactory = new ContractFactory(rm, contract)
  const contractInstance = (await tokenFactory.at(ropsten ? ropstenAddress : mainnetAddress)) as any

  return contractInstance.buy(collection, [itemId], DclUser.activeUser.userId, {
    from: DclUser.activeUser.userId
  })
}

export async function buyOutfit(collection: string): Promise<any> {
  const provider = createEthereumProvider()
  const rm = new RequestManager(provider)

  const tokenFactory = new ContractFactory(rm, contract)
  const contractInstance = (await tokenFactory.at(ropsten ? ropstenAddress : mainnetAddress)) as any

  return contractInstance.buy(collection, [0, 1, 2, 3, 4, 5], DclUser.activeUser.userId, {
    from: DclUser.activeUser.userId
  })
}
