import { ContractFactory, RequestManager } from 'eth-connect'
import abi from '../abis/erc721Collection'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'
import { executeTask } from '@dcl/sdk/ecs'

export class ERC721CollectionContract {
  public address: string
  public callback: ((funcName: string, returnVal: any) => void) | null

  public contract: any
  public isLoaded: boolean = false

  constructor(contractAddress: string, callback: ((funcName: string, returnVal: any) => void) | null = null) {
    this.address = contractAddress
    this.callback = callback
  }

  loadContract(): void {
    executeTask(async () => {
      // create an instance of the web3 provider to interface with Metamask
      const provider = createEthereumProvider()
      // Create the object that will handle the sending and receiving of RPC messages
      const requestManager = new RequestManager(provider)
      // Create a factory object based on the abi
      const factory = new ContractFactory(requestManager, abi)
      // Use the factory object to instance a `contract` object, referencing a specific contract
      this.contract = (await factory.at(this.address)) as any

      this.isLoaded = true
      if (this.callback != null) {
        this.callback('loadContract', this.contract.address)
      }
    })
  }

  getSupply(): void {
    if (this.contract == null && !this.isLoaded) return

    executeTask(async () => {
      const res = await this.contract.totalSupply()
      if (this.callback != null) {
        const resString = String(res)
        this.callback('getSupply', parseInt(resString))
      }
    })
  }
}
