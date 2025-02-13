import { ChainId } from 'src/enums'
import { ContractManager } from './contractManager'
import type * as eth from 'eth-connect'
import { getPlayer } from '@dcl/sdk/src/players'

export class WzNftContract {
  public contract: any
  public reqMgr: eth.RequestManager | undefined

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {}

  async loadContract(): Promise<void> {
    const [c, r] = (await ContractManager.instance.getContract('wznft', ChainId.MATIC_MAINNET)) as any
    this.contract = c
    this.reqMgr = r

    console.log('WzNft contract=', this.contract)
  }

  async getPlayerBalance(): Promise<number> {
    if (this.contract === null) await this.loadContract()

    const userData = getPlayer()
    const address = userData?.userId
    if (address == null) {
      throw new Error('User address not found')
    }
    console.log('wallet address', address)

    return this.contract.balanceOf(address)
  }
}
