import { engine } from '@dcl/sdk/ecs'
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class GameManager {
  static instance: GameManager | null = null
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(titleId: string) {}
  static createAndAddToEngine(titleId: string): GameManager {
    if (this.instance == null) {
      this.instance = new GameManager(titleId)
      this.instance = engine.addEntity()
    }
    return this.instance
  }
}
