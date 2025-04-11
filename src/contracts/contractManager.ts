import * as eth from 'eth-connect'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
// abi imports
import manaAbi from '../abis/mana'
import voxterAbi from '../abis/voxters'
import { abi as metakeyAbi } from '../abis/raribleMetakey'
import wzNftAbi from '../abis/wzTokenCollection'

// import { ChainId, ProviderType } from '@dcl/schemas';
import { ChainId } from '../enums'
export type Provider = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  send: Function
  // eslint-disable-next-line @typescript-eslint/ban-types
  sendAsync: Function
}
// type NetworkConfig = {
//   rpcUrl: string
//   name: string
// }

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

export class ContractManager {
  public static instance: ContractManager

  public static networks: Record<number, { name: string; chainId: number; rpcUrl: string }> = {}
  public static contractAddresses = {
    wznft: {
      matic: '0x397705BAeE5865C1bC5EaD4147b6e787A7E6db0A',
      mumbai: '0x7e960205e06414352Af6CfC522675fC00361537a'
    },
    wearableClaimer: {
      main: '0x0822d44c2e2f96d4cccad80610134861802b2cca',
      ropsten: '0x19460D0BDc8942E5e23A6b80A04Aac662788Bae2'
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

  public provider: Provider | null = null
  public requestManager: eth.RequestManager | null = null
  public metaProvider: eth.HTTPProvider | null = null
  public metaRequestManager: eth.RequestManager | null = null
  public fromAddress: string | null = null
  public activeAddress: string | null = null

  // public contractAddresses:{} = {};
  constructor() {
    this.init()
  }

  static create(): ContractManager {
    if (ContractManager.instance == null) {
      ContractManager.instance = new ContractManager()
    }
    return ContractManager.instance
  }

  init(): void {
    ContractManager.networks = {
      [ChainId.ETHEREUM_MAINNET]: {
        name: 'main',
        chainId: ChainId.ETHEREUM_MAINNET,
        rpcUrl: ''
      },
      [ChainId.ETHEREUM_ROPSTEN]: {
        name: 'ropsten',
        chainId: ChainId.ETHEREUM_ROPSTEN,
        rpcUrl: 'https://ropsten.infura.io/v3/'
      },
      [ChainId.MATIC_MAINNET]: {
        name: 'matic',
        chainId: ChainId.MATIC_MAINNET,
        rpcUrl: 'https://polygon-rpc.com/'
      },
      [ChainId.MATIC_MUMBAI]: {
        name: 'mumbai',
        chainId: ChainId.MATIC_MUMBAI,
        rpcUrl: 'https://matic-mumbai.chainstacklabs.com'
      }
    }

    console.log('networks:', ContractManager.networks)
  }

  getAbi(contractName: string): Array<Record<string, unknown>> {
    if (contractName === 'mana') {
      return manaAbi
    } else if (contractName === 'metakey') {
      return metakeyAbi
    } else if (contractName === 'voxter') {
      return voxterAbi
    } else if (contractName === 'wznft') {
      return wzNftAbi
    } else {
      return []
    }
  }

  async getContract(contractName: string, chainId: ChainId): Promise<[eth.Contract, eth.RequestManager]> { 
    try {
      let provider: Provider, requestMgr: eth.RequestManager

      if (chainId === ChainId.ETHEREUM_MAINNET) {
        provider = createEthereumProvider()
        requestMgr = new eth.RequestManager(provider)
      } else {
        const rpcUrl = ContractManager.networks[chainId].rpcUrl
        console.log('rpcUrl', rpcUrl)
        provider = new eth.HTTPProvider(rpcUrl)
        requestMgr = new eth.RequestManager(provider)
      }

      const abi = this.getAbi(contractName)
      const factory = new eth.ContractFactory(requestMgr, abi)

      const addresses =
        ContractManager.contractAddresses[contractName as keyof typeof ContractManager.contractAddresses]

      const chainName = ContractManager.networks[chainId].name
      const addr = addresses[chainName as keyof typeof addresses]

      const contract = await factory.at(addr)
      return [contract, requestMgr]
    } catch (error) {
      console.error(error)
      throw new Error(error instanceof Error ? error.message : String(error))
    }
  }

  async getContractAt(chainId: ChainId, contractAddress: string, abi: Array<Record<string, unknown>>): Promise<eth.Contract> {
    try {
      let provider: Provider, requestMgr: eth.RequestManager

      if (chainId === ChainId.ETHEREUM_MAINNET) {
        provider = createEthereumProvider()
        requestMgr = new eth.RequestManager(provider)
      } else {
        const rpcUrl = networks[chainId as unknown as keyof typeof networks].rpcUrl
        provider = new eth.HTTPProvider(rpcUrl)
        requestMgr = new eth.RequestManager(provider)
      }

      const factory = new eth.ContractFactory(requestMgr, abi)
      const contract = await factory.at(contractAddress)

      return contract
    } catch (error) {
      console.error(error)
      throw new Error(error instanceof Error ? error.message : String(error))
    }
  }
}
