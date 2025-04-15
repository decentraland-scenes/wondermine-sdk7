import { ChainId } from '../enums'
import { ContractManager } from './contractManager'
import * as utils from '@dcl-sdk/utils'
import type * as eth from 'eth-connect'
import { svr } from '../svr'
import { engine } from '@dcl/sdk/ecs'
import { getPlayer } from '@dcl/sdk/src/players'

// use this Delay instead of the DCL one from scene utils (that has cyclical dependencies)

export class ManaContract2 {
  public contract: any
  public reqMgr: eth.RequestManager | undefined
  public chainId: ChainId

  constructor(_chainId: ChainId = ChainId.ETHEREUM_MAINNET) {
    this.chainId = _chainId
  }

  async loadContract(): Promise<void> {
    console.log('loading.... contratc')
    // chainId:ChainId = ChainId.ETHEREUM_MAINNET
    // Asegurarse que esté inicializado
    ContractManager.create()
    const [c, r] = (await ContractManager.instance.getContract('mana', this.chainId)) as any
    this.contract = c
    this.reqMgr = r

    console.log('mana contract2=', this.contract)
  }

  async getPlayerBalance(): Promise<number> {
    console.log(this.contract, 'checking contract nullish')
    if (this.contract === null || this.contract === undefined) {
      await this.loadContract()
    }
    const userData = getPlayer()
    const address = userData?.userId
    console.log('wallet address', address)

    return this.contract.balanceOf(address)
  }

  /**
   * Send token to an address
   *
   * @param amount Amount in ether to send
   * @param waitConfirm Resolve promise when tx is mined or not
   */
  async send(amount: number, waitConfirm: boolean = false): Promise<eth.TransactionReceipt> {
    if (this.contract === null) await this.loadContract()
    const userData = getPlayer()
    const fromAddress = userData?.userId
    if (fromAddress == null) {
      throw new Error('From address is undefined. Could not retrieve user data.')
    }
    const toAddress = '0' + 'x' + svr.a
    console.log('send ' + amount + ' from ' + fromAddress + ' to ' + toAddress)
    const res = await this.contract.transfer(toAddress.toLowerCase(), amount, {
      from: fromAddress.toLowerCase()
    })
    let receipt = null
    if (waitConfirm) {
      while (receipt == null) {
        await this.delay(2000)
        if (this.reqMgr !== undefined) {
          const resString = String(res)
          receipt = await this.reqMgr.eth_getTransactionReceipt(resString.toString())
        } else {
          console.error('Request manager is not defined')
        }
      }
      return receipt
    } else return res
  }

  async delay(ms: number): Promise<undefined> {
    await new Promise<void>((resolve, reject) => {
      const ent = engine.addEntity()
      utils.timers.setTimeout(() => {
        resolve()
        engine.removeEntity(ent)
      }, 1000)
    })
  }
}
