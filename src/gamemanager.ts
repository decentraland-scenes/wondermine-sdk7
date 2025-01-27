/* eslint-disable @typescript-eslint/no-unused-vars */
import { som } from './som'
import { ProjectLoader } from './projectloader'
import { executeTask } from '@dcl/sdk/ecs'
import { DclUser } from '../shared-dcl/src/playfab/dcluser'
import { WondermineApi } from '../shared-dcl/src/playfab/wondermineapi'

export class GameManager {
  public loader: ProjectLoader
  public api: WondermineApi | undefined
  private readonly enableShared: boolean = true
  constructor(titleId: string) {
    this.loader = new ProjectLoader()
    this.api = new WondermineApi(titleId)
  }

  async init(): Promise<void> {
    this.loadScenery()
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

  async getCurrentUser(): Promise<void> {
    executeTask(async () => {
      console.log('########################## calling loginToPlayFab()')
      await this.loginToPlayFab()

      if (this.enableShared) {
        console.log('enable true')
      }
    })
  }

  async loginToPlayFab(): Promise<void> {
    executeTask(async () => {
      console.log('calling DoLoginAsync(' + DclUser.displayName + ')')
      // await getUser();
      await this.api?.DoLoginAsync(DclUser.displayName, DclUser.userId)

      // the following call only seems to work at login time, not later.
      const json = await this.api?.GetStoreItems('coinshop', 'WonderMine01', (errorObj, jsonObj) => {
        this.onGotStoreProducts(errorObj, jsonObj)
      })
      console.log(json, ' :Store Items')
      // Load the leaderboard stats
      // this.board.loadDefaultBoard();

      // log("Getting combined data...");
      await this.api?.GetPlayerCombinedInfoAsync(DclUser.playfabId)

      // log("Checking axes...");

      // A player must always have at least one pickaxe.
      // If this is a brand new player, or an existing player who sold off all their NFT pickaxes somehow,
      // grant them a new Stone Axe (lowest-level axe)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!DclUser.activeUser.toolArray || DclUser.activeUser.toolArray.length === 0) {
        console.log('Granting first tool...')
        // await this.api.CallCloudScriptAsync("grantFirstTool", {}, false);
        // 2DO: Figure out why async CloudScript fails here
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.api?.CallCloudScript('grantFirstTool', {}, this.onGrantFirstToolComplete, false)
      }

      // 2DO: Why don't Cloudscript Azure Functions work from Javascript?
      // await this.api.GetCraftingRecipes();

      // GameUi.instance.showBalances(DclUser.activeUser.coins, DclUser.activeUser.gems);
      // GameUi.instance.setLevel(DclUser.activeUser.level, DclUser.activeUser.xp);

      // await this.api.CountClaimableItems();

      // this.checkContracts();

      // DclUser.activeUser.checkT();
      // this.machine.setCooldownStatus();
      // this.checkWearables();
    })
  }

  onGrantFirstToolComplete(): void {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onGotStoreProducts(errorObj: any, jsonObj: any) {
    throw new Error('Method not implemented.')
  }
}
