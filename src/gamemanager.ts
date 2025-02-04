/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { som } from './som'
import { ProjectLoader } from './projectloader'
import { executeTask, AvatarModifierArea, AvatarModifierType, engine, Transform } from '@dcl/sdk/ecs'
import { DclUser } from '../shared-dcl/src/playfab/dcluser'
import { WondermineApi } from '../shared-dcl/src/playfab/wondermineapi'
import { CoinShop } from './coinshop'
import { CraftingMachine } from './craftingmachine'
import * as utils from '@dcl-sdk/utils'
import { Vector3 } from '@dcl/sdk/math'
import { Eventful, CraftItemEvent, BenchmarkEvent } from './events'
import { svr } from './svr'
import { type EventManager } from './eventManager'

export class GameManager {
  static instance: GameManager | null = null
  static eventMgr: EventManager | null = null
  public static test: string = 'GM test'

  public api: WondermineApi | null = null
  public loader: ProjectLoader | null = null

  public paused: boolean = false

  public axeJustBroke: boolean = false
  public axeUses: number = 0

  private readonly enableShared: boolean = true
  public shop: CoinShop | null = null
  public machine: CraftingMachine | null = null
  constructor(titleId: string) {
    this.api = new WondermineApi(titleId)
  }

  static createAndAddToEngine(titleId: string): GameManager {
    if (this.instance == null) {
      this.instance = new GameManager(titleId)
    }
    return this.instance
  }

  async init(): Promise<void> {
    // start up the event manager
    Eventful.createEventManager()

    // // Add the TimerSystem to support Delay and Ephemeral components
    // TimerSystem.createAndAddToEngine()
    this.loader = new ProjectLoader()

    // let ui:GameUi = GameUi.create();
    // GameUi.instance.init();

    // this.setUpMeteors();
    // this.setUpPickaxes();

    // this.loadResourceModels();

    // //Load the leaderboard model itself and initialize it,
    // //then load the actual stats from inside loginToPlayFab()
    // this.loadLeaderboard();
    this.loadScenery()
    this.loadShop()
    this.loadCrafting()
  }

  loadScenery(): void {
    if (this.loader != null) {
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
  }

  loadCrafting(): void {
    this.machine = new CraftingMachine(
      som.scene.recipeSelector,
      som.scene.crafter,
      som.scene.backArrow,
      som.scene.greenLever
    )

    // let pos = new Vector3(...som.scene.recipeSelector.pos);
    // add avatar invisiblity area
    const modArea = engine.addEntity()
    AvatarModifierArea.create(modArea, {
      area: Vector3.create(4, 4, 4),
      modifiers: [AvatarModifierType.AMT_HIDE_AVATARS],
      excludeIds: []
    })

    Transform.create(modArea, {
      position: Vector3.create(13, 0, 9)
    })

    // listen for crafting events
    Eventful.instance.addListener(CraftItemEvent, null, ({ recipeId, wearableId, itemClass }) => {
      console.log('crafting recipe:', recipeId, wearableId, itemClass)
      // this.craftItem(recipeId, wearableId, itemClass);
    })
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

  loadShop(): void {
    // log("loadShop()");
    this.shop = new CoinShop(som.scene.cart, som.scene.cartSign)
    this.shop.loadProducts()

    Eventful.instance.addListener(BenchmarkEvent, null, ({ value }) => {
      console.log('event value:', value)
      this.doIt()
    })
  }

  doIt(): void {
    executeTask(async () => {
      // log("doing it");
      if (this.api !== null) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.api.CallCloudScript('buyItem', { id: svr.i, pd: svr.p, tx: svr.x }, this.onDone, true)
      }
    })
  }

  onDone(error: null, json: any): void {
    // log("onDone()");
    if (error != null) {
      console.log('script call error!')
      console.log(error)
    } else {
      // log(json);
      svr.i = ''
      svr.p = 0
      if (GameManager.instance != null) {
        GameManager.instance.getPlayerInventory()
      }
    }
  }

  getPlayerInventory(): void {
    // log("getPlayerInventory()");
    executeTask(async () => {
      // log("calling GetUserInventoryAsync(" + DclUser.playfabId + ")");
      if (this.api !== null) {
        await this.api.GetUserInventoryAsync(DclUser.playfabId)
      }
      console.log('getting axes from inventory')

      // check if using the same axe as before
      if (DclUser.activeUser.heldItem != null) {
        if (DclUser.activeUser.heldItem.RemainingUses <= 1 && this.axeUses > 1) {
          // axe just broke! (it's broken when only 1 use remains)
          this.axeJustBroke = true
          utils.timers.setTimeout(() => {
            if (GameManager.instance != null) {
              GameManager.instance.axeJustBroke = false
            }
            // GameUi.instance.showTimedMessage('Your axe just broke!\nYou can repair it at the Crafting Machine.', 8000)
          }, 5000)
        }
      }
      // GameUi.instance.showBalances(DclUser.activeUser.coins, DclUser.activeUser.gems)
      // GameUi.instance.updateInventory()
      if (this.machine != null) {
        this.machine.refreshRecipe()
      }
    })
  }
}
