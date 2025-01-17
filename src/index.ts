import { GameManager } from './gamemanager'
import { som } from './som'
import { svr } from './svr'

export function main(): void {
  /**
   * The main game.ts file sets up system-level services, like Input and Systems
   */

  console.log('scene: ' + som.scene.title)
  const gameManager = new GameManager(svr.t)
  void gameManager.init()
}
