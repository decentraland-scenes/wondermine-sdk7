import { getUserData } from '~system/UserIdentity'
import { DclUser } from '../shared-dcl/src/playfab/dcluser'
import { GameManager } from './gamemanager'
import { som } from './som'
import { svr } from './svr'

export async function main(): Promise<void> {
  /**
   * The main game.ts file sets up system-level services, like Input and Systems
   */
  const Request = {}
  console.log('scene: ' + som.scene.title)
  const response = await getUserData(Request)
  console.log('HERE', response)
  const gameManager = new GameManager(svr.t)
  void gameManager.init()
  await gameManager.getCurrentUser()
  if (response.data != null) {
    if (response.data.publicKey != null) {
      DclUser.setUserInfo(response.data.userId, response.data.displayName, response.data.publicKey)
    }
  }
}
// function getUserData(Request: any): Promise<Response>
