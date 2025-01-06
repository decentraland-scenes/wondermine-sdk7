import { engine } from '@dcl/sdk/ecs'
export class GameManager {
  static instance: GameManager | null = null
  constructor(titleId: string) {}
  static createAndAddToEngine(titleId: string): GameManager {
    if (this.instance == null) {
      this.instance = new GameManager(titleId)
      this.instance = engine.addEntity()
    }
    return this.instance
  }
}
