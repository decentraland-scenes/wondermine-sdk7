import abi from '../abis/wearableClaimer'
import { DclUser } from '../../shared-dcl/src/playfab/dcluser'
import * as eth from 'eth-connect'
import { createEthereumProvider } from '@dcl/sdk/ethereum-provider'

type WearableClaimerContractInterface = {
  remainingSupply: (collIndex: number, wearableName: string) => Promise<string>
  canMint: (collIndex: number, wearableName: string, quantity: number) => Promise<boolean>
  checkSender: (
    collIndex: number,
    wearIndex: number,
    claimNum: number,
    sig: string,
    flag: boolean,
    options: { from: string }
  ) => Promise<boolean>
  claim: (
    collIndex: number,
    wearIndex: number,
    claimNum: number,
    signature: string,
    options: { from: string }
  ) => Promise<any>
} & eth.Contract

export class WearableClaimerContract {
  public address: string
  public requestMgr?: eth.RequestManager
  public callback?: (funcName: string, returnVal: any) => void
  public contract?: WearableClaimerContractInterface
  public isLoaded: boolean = false

  constructor(contractAddress: string, callback?: (funcName: string, returnVal: any) => void) {
    this.address = contractAddress
    this.callback = callback
  }

  async loadContract(): Promise<void> {
    try {
      const provider = createEthereumProvider()
      this.requestMgr = new eth.RequestManager(provider)
      const factory = new eth.ContractFactory(this.requestMgr, abi)

      this.contract = (await factory.at(this.address)) as WearableClaimerContractInterface

      this.isLoaded = true
      this.callback?.('loadContract', this.contract.address)

      console.log('WearableClaimerContract provider=', provider)
      console.log('WearableClaimerContract contract=', this.contract)
    } catch (error) {
      console.error('Error loading contract:', error)
      this.callback?.('loadContractError', error)
    }
  }

  async getItemSupply(collIndex: number, wearableName: string): Promise<number | undefined> {
    if (this.contract == null || !this.isLoaded) return

    try {
      const res = await this.contract.remainingSupply(collIndex, wearableName)
      const supply = parseInt(res)
      this.callback?.('getItemSupply', supply)
      return supply
    } catch (error) {
      console.error('Error getting item supply:', error)
      this.callback?.('getItemSupplyError', error)
    }
  }

  async canMint(collIndex: number, wearableName: string): Promise<boolean | undefined> {
    if (this.contract == null || !this.isLoaded) return

    try {
      const res = await this.contract.canMint(collIndex, wearableName, 1)
      this.callback?.('canMint', res)
      return res
    } catch (error) {
      console.error('Error checking mint:', error)
      this.callback?.('canMintError', error)
    }
  }

  async checkSender(collIndex: number, wearIndex: number, claimNum: number, sig: string): Promise<boolean | undefined> {
    if (this.contract == null || !this.isLoaded) return

    try {
      const res = await this.contract.checkSender(collIndex, wearIndex, claimNum, sig, true, {
        from: DclUser.activeUser.userId
      })
      console.log('checkSender result =', res)
      this.callback?.('checkSender', res)
      return res
    } catch (error) {
      console.error('Error in checkSender:', error)
      this.callback?.('checkSenderError', error)
    }
  }

  async claim(collIndex: number, wearIndex: number, claimNum: number, signature: string): Promise<void> {
    if (this.contract == null || !this.isLoaded) return

    try {
      console.log('Calling claim() with signature:', signature)

      const res = await this.contract.claim(collIndex, wearIndex, claimNum, signature, {
        from: DclUser.activeUser.userId
      })

      this.callback?.('minted', res)
    } catch (error) {
      console.error('Error claiming wearable:', error)
      this.callback?.('claimError', error)
    }
  }
}
