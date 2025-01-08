/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { som } from './som'
import { ProjectLoader } from './projectloader'
import { CoinShop } from './coinshop'

export class GameManager {
  public loader: ProjectLoader
  public shop: CoinShop | null = null
  constructor(titleId: string) {
    this.loader = new ProjectLoader()
  }

  async init(): Promise<void> {
    this.loadScenery()
    this.loadShop()
  }

  loadScenery(): void {
    const signInstructions = this.loader.spawnSceneObject(som.scene.signInstructions)
    const ground01 = this.loader.spawnSceneObject(som.scene.ground01)
    const ground02 = this.loader.spawnSceneObject(som.scene.ground02)
    const ground03 = this.loader.spawnSceneObject(som.scene.ground03)
    const ground04 = this.loader.spawnSceneObject(som.scene.ground04)
    const ground05 = this.loader.spawnSceneObject(som.scene.ground05)
    const ground06 = this.loader.spawnSceneObject(som.scene.ground06)
    const ground07 = this.loader.spawnSceneObject(som.scene.ground07)
    const ground08 = this.loader.spawnSceneObject(som.scene.ground08)

    const tree01 = this.loader.spawnSceneObject(som.scene.tree01)
    const tree02 = this.loader.spawnSceneObject(som.scene.tree02)
    const tree03 = this.loader.spawnSceneObject(som.scene.tree03)
    const tree04 = this.loader.spawnSceneObject(som.scene.tree04)
    const tree05 = this.loader.spawnSceneObject(som.scene.tree05)
    const tree06 = this.loader.spawnSceneObject(som.scene.tree06)
    const tree07 = this.loader.spawnSceneObject(som.scene.tree07)
    const tree08 = this.loader.spawnSceneObject(som.scene.tree08)
    const tree09 = this.loader.spawnSceneObject(som.scene.tree09)
    const tree10 = this.loader.spawnSceneObject(som.scene.tree10)

    const wall01 = this.loader.spawnSceneObject(som.scene.wall01)
    const wall02 = this.loader.spawnSceneObject(som.scene.wall02)

    const wallCorner01 = this.loader.spawnSceneObject(som.scene.wallCorner01)
    const wallCorner03 = this.loader.spawnSceneObject(som.scene.wallCorner03)

    const tree11 = this.loader.spawnSceneObject(som.scene.tree11)
    const tree12 = this.loader.spawnSceneObject(som.scene.tree12)

    const fence02 = this.loader.spawnSceneObject(som.scene.fence02)
    const fence03 = this.loader.spawnSceneObject(som.scene.fence03)
    const fence04 = this.loader.spawnSceneObject(som.scene.fence04)
    const fence05 = this.loader.spawnSceneObject(som.scene.fence05)

    const crate01 = this.loader.spawnSceneObject(som.scene.crate01)
    const crate02 = this.loader.spawnSceneObject(som.scene.crate02)

    const statue = this.loader.spawnSceneObject(som.scene.statue)

    const tower = this.loader.spawnSceneObject(som.scene.tower)
    const hammer01 = this.loader.spawnSceneObject(som.scene.hammer01)
  }

  loadShop():void {
    // log("loadShop()");
    this.shop = new CoinShop(som.scene.cart, som.scene.cartSign)
  }
}
