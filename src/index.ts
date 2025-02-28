import { getUserData } from '~system/UserIdentity'
import { DclUser } from '../shared-dcl/src/playfab/dcluser'
import { GameManager } from './gamemanager'
import { som } from './som'
import { svr } from './svr'
import './polyfill'
import { XMLHttpRequest } from './xmlRequest'
import { executeTask } from '@dcl/sdk/ecs'
import { getRealm } from '~system/Runtime'
import { getPlayer } from '@dcl/sdk/src/players'
import { Eventful, MovePlayerEvent } from './events'
import { movePlayerTo } from '~system/RestrictedActions'
export async function main(): Promise<void> {
  ;(globalThis as any).XMLHttpRequest = XMLHttpRequest
  console.log('scene: ' + som.scene.title)
  GameManager.createAndAddToEngine(svr.t)
  fetchPlayerData()
}
function fetchPlayerData(): void {
  executeTask(async () => {
    /**
     * The main game.ts file sets up system-level services, like Input and Systems
     */
    await GameManager.instance?.init()
    const Request = {}
    const userData = await getUserData(Request)
    console.log('HERE', userData)
    if (userData.data != null) {
      if (userData.data.publicKey != null) {
        DclUser.setUserInfo(userData.data.userId, userData.data.displayName, userData.data.publicKey)
      }
    }
    const { realmInfo } = await getRealm({})
    if (realmInfo !== undefined) {
      DclUser.setRealm(realmInfo)
    }
    const myPlayer = getPlayer()
    const avatar = myPlayer
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (avatar?.wearables) {
      if (GameManager.instance !== null) {
        GameManager.instance.calcWearBonus(avatar?.wearables)
      }
    }

    void GameManager.instance?.getCurrentUser()
    Eventful.instance.addListener(MovePlayerEvent, null, ({ newPos }) => {
      console.log('*** MOVE TO ***:', newPos)
      void movePlayerTo({
        newRelativePosition: newPos
      })
    })
  })
}
