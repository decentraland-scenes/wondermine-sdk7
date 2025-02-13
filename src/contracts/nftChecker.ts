// NOTE: Remember to add &ENABLE_WEB3 to the url when running locally
import * as eth from 'eth-connect'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
import { abi } from '../abis/raribleMetakey'
import { ChainId } from 'src/enums'
import voxters from 'src/abis/voxters'
import { getPlayer } from '@dcl/sdk/src/players'
import { type Provider } from './contractManager'

// import { getContract } from "decentraland-transactions";
// import * as dclTx from 'decentraland-transactions';
// import { ChainId } from '@dcl/schemas';

// Config
// Example token from the contract: https://opensea.io/assets/0x10DaA9f4c0F985430fdE4959adB2c791ef2CCF83/1
// Contract address on Etherscan: https://etherscan.io/address/0x10daa9f4c0f985430fde4959adb2c791ef2ccf83
const contractAddress = '0x10daa9f4c0f985430fde4959adb2c791ef2ccf83' // Contract The Meta Key
const tokenID = 10004 // Metakey Edition Four

async function doesUserHaveNFT(contractAddress: string, typeOfKey: number): Promise<number> {
  try {
    const userData = getPlayer()
    const address = userData?.userId
    if (address == null) {
      throw new Error('User address not found')
    }

    const provider = createEthereumProvider()
    const requestManager = new eth.RequestManager(provider)
    const factory = new eth.ContractFactory(requestManager, abi)
    const contract = (await factory.at(contractAddress)) as any

    const value = await contract.balanceOf(address, typeOfKey)
    return value
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message)
    } else {
      console.log('Unknown error', error)
      throw new Error('Unknown error occurred')
    }
  }
}

export async function getEthContractAt(
  contractAddress: string,
  abi: Array<Record<string, unknown>>
): Promise<eth.Contract> {
  try {
    const provider = createEthereumProvider()
    const requestManager = new eth.RequestManager(provider)
    const factory = new eth.ContractFactory(requestManager, abi)
    const contract = await factory.at(contractAddress)
    return contract
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      throw new Error(error.message)
    } else {
      console.log('Unknown error', error)
      throw new Error('Unknown error occurred')
    }
  }
}

export async function getL2ContractAt(
  contractAddress: string,
  abi: Array<Record<string, unknown>>
): Promise<eth.Contract> {
  try {
    const metaProvider = new eth.HTTPProvider('https://polygon-rpc.com')
    const metaRequestManager = new eth.RequestManager(metaProvider)

    const factory = new eth.ContractFactory(metaRequestManager, abi)
    const contract = await factory.at(contractAddress)

    return contract // Retorna el contrato directamente
  } catch (error) {
    console.error(error) // Usa `console.error` para mostrar el error
    throw error // Lanza el error para que la promesa sea rechazada
  }
}
type Network = 'main' | 'ropsten' | 'matic' | 'mumbai'

export async function getContractAt(
  netCode: Network,
  contractAddress: string,
  abi: Array<Record<string, unknown>>
): Promise<eth.Contract> {
  try {
    let provider: Provider, requestMgr: eth.RequestManager

    if (netCode === 'main') {
      provider = createEthereumProvider()
      requestMgr = new eth.RequestManager(provider)
    } else {
      const rpcUrl = networks[netCode].rpcUrl
      provider = new eth.HTTPProvider(rpcUrl)
      requestMgr = new eth.RequestManager(provider)
    }

    const factory = new eth.ContractFactory(requestMgr, abi)
    const contract = await factory.at(contractAddress)

    return contract
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function checkNfts(): Promise<void> {
  const allowed = await doesUserHaveNFT(contractAddress, tokenID)
  if (Number(allowed) > 0) {
    console.log('Player has a metakey!')
  } else {
    console.log('No metakey!')
  }
}

type VoxterContract = {
  balanceOf: (address: string) => Promise<number>
}

export async function getVoxBalance(): Promise<number> {
  try {
    const userData = getPlayer()
    const address = userData?.userId

    if (address == null) {
      throw new Error('User address not found')
    }
    const contract = (await getContractAt(
      'matic',
      contractAddresses.voxter.matic,
      voxters
    )) as unknown as VoxterContract
    const balance = await contract.balanceOf(address)

    console.log('vox balance=', balance)

    return balance
  } catch (error) {
    console.error('Error fetching Vox balance:', error)
    throw error
  }
}

type ProviderData = {
  address: string
  provider: any
  requestManager: eth.RequestManager
}

export async function getProviderPromise(): Promise<ProviderData> {
  try {
    const userData = getPlayer()
    const address = userData?.userId
    if (address == null) {
      throw new Error('User address not found')
    }
    const provider = createEthereumProvider() // Cambiado para SDK7
    const requestManager = new eth.RequestManager(provider)
    return { address, provider, requestManager }
  } catch (error) {
    console.error('Error fetching provider data:', error)
    throw error
  }
}

type ProvidersData = {
  requestManager: eth.RequestManager
  metaProvider: eth.HTTPProvider
  metaRequestManager: eth.RequestManager
  fromAddress: string
}

export async function getProviders(): Promise<ProvidersData> {
  try {
    const userData = getPlayer()
    const fromAddress = userData?.userId
    if (fromAddress == null) {
      throw new Error('User address not found')
    }

    const provider = createEthereumProvider() // Usamos `createEthereumProvider` para SDK7
    const requestManager = new eth.RequestManager(provider)

    const metaProvider = new eth.HTTPProvider('https://polygon-rpc.com')
    const metaRequestManager = new eth.RequestManager(metaProvider)

    return { requestManager, metaProvider, metaRequestManager, fromAddress }
  } catch (error) {
    console.error('Error fetching providers:', error)
    throw error
  }
}

export async function getProvidersL2(): Promise<ProvidersData> {
  try {
    const userData = getPlayer()
    const fromAddress = userData?.userId
    if (fromAddress == null) {
      throw new Error('User address not found')
    }

    const provider = createEthereumProvider() // Usamos `createEthereumProvider` para SDK7
    const requestManager = new eth.RequestManager(provider)

    const metaProvider = new eth.HTTPProvider('https://polygon-rpc.com')
    const metaRequestManager = new eth.RequestManager(metaProvider)

    return { requestManager, metaProvider, metaRequestManager, fromAddress }
  } catch (error) {
    console.error('Error fetching L2 providers:', error)
    throw error
  }
}

export const networks = {
  main: {
    chainId: ChainId.ETHEREUM_MAINNET,
    rpcUrl: ''
  },
  ropsten: {
    chainId: ChainId.ETHEREUM_ROPSTEN,
    rpcUrl: 'https://ropsten.infura.io/v3/'
  },
  matic: {
    chainId: ChainId.MATIC_MAINNET,
    rpcUrl: 'https://polygon-rpc.com/'
  },
  mumbai: {
    chainId: ChainId.MATIC_MUMBAI,
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com'
  }
}

export const contractAddresses = {
  wznft: {
    matic: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    mumbai: '0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb'
  },
  mana: {
    main: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    ropsten: '0x2a8fd99c19271f4f04b1b7b9c4f7cf264b626edb',
    matic: '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4',
    mumbai: '0x882Da5967c435eA5cC6b09150d55E8304B838f45'
  },
  voxter: {
    matic: '0x764E5A8C9ca14b456F5AfBf31bFb2fA7F1e002b6'
  },
  metakey: {
    main: '0x10daa9f4c0f985430fde4959adb2c791ef2ccf83'
  }
}

export async function getContract(
  reqMgr: eth.RequestManager,
  abi: Array<Record<string, unknown>>,
  address: string
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contract: eth.Contract = await new eth.ContractFactory(reqMgr, abi).at(address)
}
