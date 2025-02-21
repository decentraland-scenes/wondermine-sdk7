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
import { Eventful, CraftItemEvent, BenchmarkEvent, HitMeteorEvent, ChangeToolEvent } from './events'
import { svr } from './svr'
import { type EventManager } from './eventManager'
import { Leaderboard } from './leaderboard'
import { GameUi } from './ui/gameui'
import { WearableClaimerContract } from './contracts/wearableClaimerContract'
import { ContractManager } from './contracts/contractManager'
import { WzNftContract } from './contracts/wzNftContract'

import { getProviderPromise } from './contracts/nftChecker'

// import { MeteorSpawner } from './wondermine/meteorspawner'
import { MeteorTypeList } from './wondermine/meteortypelist'
import { type MeteorSpawnerInstance } from './projectdata'
import { MeteorSpawner } from './wondermine/meteorspawner'
import { ChainId, MeteorTypeId, PopupWindowType } from './enums'

import { Pickaxe } from './pickaxe'
import { type ItemInfo } from 'shared-dcl/src/playfab/iteminfo'
import { PickaxeInstance } from './projectdata'
import { Meteor } from './wondermine/meteor'
import { PickaxeTypeList } from './pickaxetypelist'
import { PopupQueue } from './ui/popupqueue'
import { type Item } from './ui/uipopuppanel'
import { type LootItem } from './wondermine/lootitem'
import { LootVault } from './wondermine/lootvault'
import { transform } from 'typescript'

export class GameManager {
  static instance: GameManager | null = null
  static eventMgr: EventManager | null = null
  public static test: string = 'GM test'

  public api: WondermineApi | null = null
  public loader: ProjectLoader | null = null
  public meteors: Meteor[] = []

  public spawner: MeteorSpawner | null = null
  public paused: boolean = false

  public axeJustBroke: boolean = false
  public axeUses: number = 0
  public wearClaimer: WearableClaimerContract | null = null
  private readonly enableShared: boolean = true
  public shop: CoinShop | null = null
  public machine: CraftingMachine | null = null
  private board: Leaderboard | null = null

  public axe: Pickaxe | null = null
  private readonly lootHomePos: number[] = [6.5, 0, 57]
  public popupQueue: PopupQueue | null = null

  public lootItems: Item[] | null = null
  // eslint-disable-next-line @typescript-eslint/ban-types
  public sharedLootItems: Object[] | null = null
  public miningErrorMessage: string = '' // "Something's wrong with this meteor.\nTry a different one."
  constructor(titleId: string) {
    this.api = new WondermineApi(titleId)
    this.checkContracts()
  }

  checkContracts(): void {
    this.wearClaimer = new WearableClaimerContract(
      '0x276b661495720ae4EE09118C48D1D4871116083f',
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.onClaimerContractCalled
    ) // 0xADdFAC1B5D735Ca684caFF1b94D523e906155938
    void this.wearClaimer.loadContract()

    executeTask(async () => {
      const providers = await getProviderPromise()
      console.log('providers:', providers)

      const contractMgr: ContractManager = ContractManager.create()

      const [mana3, rm1] = await contractMgr.getContract('mana', ChainId.MATIC_MAINNET)
      console.log('mana3', mana3)
      const wzClass = new WzNftContract()
      await wzClass.loadContract()
      const bal = await wzClass.getPlayerBalance()
      console.log('balance of wzNfts', bal)
    })
  }

  onClaimerContractCalled(funcName: string, returnVal: any): void {}

  setUpMeteors(): void {
    MeteorTypeList.loadTypes(som.meteorTypes)
    if (this.loader !== null) {
      const params: MeteorSpawnerInstance = this.loader.loadMeteorSpawner(som.scene.meteorSpawner)
      this.spawner = new MeteorSpawner(
        1.35,
        params.left,
        params.bottom,
        params.right,
        params.top,
        params.floorHeight,
        params.dropHeight
      )
      Eventful.instance.addListener(HitMeteorEvent, null, ({ meteor, hitPoint }) => {
        console.log('hit meteor at:', hitPoint)
        this.hitMeteor(hitPoint, meteor)
      })
    }
    // log(params);
    // HACK: temporary test
    // params.left = 47;
    // Meteor.onHitCallback = (hitPoint:Vector3, m:Meteor) => {
    //   // log("onHitCallback in GameManager");
    //   return this.hitMeteor(hitPoint, m);
    // }
  }

  spawnMeteor(): void {
    if (this.spawner !== null) {
      const m: Meteor = this.spawner.spawn(MeteorTypeId[MeteorTypeId.Local]) // MeteorTypeId[MeteorTypeId.Medium]
      // 1DO A1 Need to provide the right context here!
      Meteor.onHitCallback = (hitPoint: Vector3, m: Meteor) => {
        // log("onHitCallback in GameManager");

        return this.hitMeteor(hitPoint, m)
      }
      // log("spawned meteor at" + m.entity.getComponent(Transform).position);
      // log("model at " + m.modelEntity.getComponent(Transform).position);
    }
  }

  hitMeteor(hitPoint: Vector3.MutableVector3, meteor: Meteor): boolean {
    return true
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

    const ui: GameUi = GameUi.create()
    if (GameUi.instance != null) {
      GameUi.instance.init()
    }

    this.setUpMeteors()
    this.setUpPickaxes()

    // this.loadResourceModels();

    // //Load the leaderboard model itself and initialize it,
    // //then load the actual stats from inside loginToPlayFab()
    this.loadScenery()
    this.loadShop()
    this.loadCrafting()
    this.loadLeaderboard()
    this.setUpMeteors()
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
      utils.timers.setTimeout(() => {
        this.spawnMeteor()
      }, 5000)
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
      if (this.board != null) {
        this.board.loadDefaultBoard()
      }

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
      if (GameUi.instance != null) {
        GameUi.instance.showBalances(DclUser.activeUser.coins, DclUser.activeUser.gems)
        GameUi.instance.setLevel(DclUser.activeUser.level, DclUser.activeUser.xp)
      }

      if (this.api != null) {
        await this.api.CountClaimableItems()
      }

      // this.checkContracts();

      DclUser.activeUser.checkT()
      if (this.machine != null) {
        this.machine.setCooldownStatus()
      }
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

  setUpPickaxes(): void {
    console.log('setUpPickaxes(), test=' + Pickaxe.test)
    PickaxeTypeList.loadTypes(som.toolTypes)

    // listen for tool events
    Eventful.instance.addListener(ChangeToolEvent, null, ({ newTool, updateServer }) => {
      console.log('*** CHANGED TOOL ***:', newTool)

      this.spawnPickaxe(newTool)
      if (GameUi.instance != null) {
        GameUi.instance.changeAxeIcon(newTool)
        // update the mining bonus display
        GameUi.instance.showBonus()
      }

      // 2DO: after the first time, we don't need to update every time a player plays
      if (updateServer ?? false) {
        executeTask(async () => {
          if (this.api != null) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            this.api.CallCloudScript('changeTool', { id: newTool.ItemInstanceId }, this.onToolChanged, false)
          }
        })
      }
    })
  }

  onToolChanged(error: any, json: any): void {
    // log("onToolChanged()");
    if (error != null) {
      console.log('onToolChanged call error!')
      console.log(error)
    } else {
      console.log('onToolChanged', json)
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
      if (GameUi.instance != null) {
        GameUi.instance.showBalances(DclUser.activeUser.coins, DclUser.activeUser.gems)
        GameUi.instance.updateInventory()
      }

      if (this.machine != null) {
        this.machine.refreshRecipe()
      }
    })
  }

  changeTool(newTool: ItemInfo): void {
    console.log('changeTool()', newTool)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!newTool) {
      console.log('ERROR: No pickaxe!')
    } else {
      if (newTool.ItemId !== this.axe?.instanceData?.ItemId) {
        console.log('axe type has changed')
        this.spawnPickaxe(newTool)
      } else {
        // can use the same axe model; only instance data changed
      }
    }
  }

  spawnPickaxe(axeData: ItemInfo): void {
    console.log('SPAWN PICKAXE: ' + axeData.ItemId)
    let axeInstance: PickaxeInstance = new PickaxeInstance()
    if (this.loader != null) {
      axeInstance = this.loader.populate(axeInstance, axeData)
    }
    axeInstance.typeName = axeData.ItemId
    axeInstance.pos = this.lootHomePos
    axeInstance.scale = [1, 1, 1]

    console.log('axeInstance: test=' + Pickaxe.test)
    console.log(axeInstance)
    const p: Pickaxe = new Pickaxe(axeInstance)
    if (p != null) {
      if (this.axe != null) {
        // clear out the old axe so it can be garbage-collected
        this.axe.onMiningAnimCompleteCallback = null
        if (this.axe.entity != null && engine.getEntityState(this.axe.entity) === 1) {
          engine.removeEntity(this.axe.entity)
        }
        // do we need to clear out the shape and other objects too?
        this.axe = null
      }

      p.onMiningAnimCompleteCallback = (m: Meteor | null) => {
        // log("onMiningCompleteCallback in GameManager");
        this.onMiningCompleteCallback(m)
      }
      this.axe = p
    }
  }

  /**
   * Called when pickaxe animation is complete
   * @param m
   */
  onMiningCompleteCallback(m: Meteor | null): void {
    if (m !== null) {
      console.log('onMiningCompleteCallback(), hasLootDropped=' + m.hasLootDropped + ', isShared=' + m.isShared)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      m.isMiningDone
      // 2DO: check that server call has completed too´
      if (m.hasLootDropped) {
        // open the meteor
        m.hit()

        let item: any
        let itemClass: string
        let lootEnt: LootItem

        if (this.lootItems != null && this.lootItems.length > 0) {
          for (var i: number = 0; i < this.lootItems.length; i++) {
            item = this.lootItems[i]

            itemClass = item.ItemClass

            if (itemClass === 'metal' || itemClass === 'gem') {
              // log("METAL " + i + ": " + item["DisplayName"]);
              if (LootVault.instance != null) {
                lootEnt = LootVault.instance.get(item.ItemId)
                if (lootEnt != null) {
                  const tPos: Vector3.MutableVector3 = Vector3.clone(Transform.getMutable(m.entity).position)
                  tPos.y = tPos.y + 1
                  // log(tPos);
                  lootEnt.showAt(tPos)
                }
              }
            }
          }
          // show the loot popup
          this.showLootRewards(this.lootItems, m.isShared)
        } else {
          // no loot probably means an error
          if (this.miningErrorMessage !== '') {
            this.showMiningError(this.miningErrorMessage)
          }
          utils.timers.setTimeout(() => {
            this.removePickaxe()
          }, 2000)
        }
      } else {
        // show an error message about the loot not arriving
        this.showMiningError(
          "The loot didn't arrive! It might still be applied to your inventory. We will investigate."
        )
        // hide the pickaxe in a few seconds
        utils.timers.setTimeout(() => {
          this.removePickaxe()
        }, 2000)
      }
    }
  }

  hidePickaxe(): void {
    if (this.axe != null) {
      this.axe.hide()
      // remove the pickaxe in a few seconds (to give sounds a chance to finish)
      utils.timers.setTimeout(() => {
        this.removePickaxe()
      }, 4000)
    }
  }

  removePickaxe(): void {
    if (this.axe != null && !this.axe.isBusy) {
      this.axe.removeEntity()
    }
  }

  showLootRewards(lootItems: Item[], isShared: boolean = false, isSharedBonus: boolean = false): void {
    console.log(
      'showLootRewards() #items: ' + lootItems.length + ', isShared: ' + isShared + ', isSharedBonus: ' + isSharedBonus
    )
    this.hidePickaxe()

    // update level display
    if (GameUi.instance != null) {
      GameUi.instance.setLevel(DclUser.activeUser.level, DclUser.activeUser.xp)
    }

    // show mining loot
    this.showRewards(
      lootItems,
      isSharedBonus ? PopupWindowType.SharedBonus : isShared ? PopupWindowType.MinedShared : PopupWindowType.Mined
    )
    // log("showLootRewards()");
    // log(this.lootItems);
    // let msg:string = "";
    // if (this.lootItems != null)
    // {
    //   for (var i:number = 0; i < this.lootItems.length; i++)
    //   {
    //     //item = this.loader.populate(new ItemInfo(), items[i]);

    //     if (this.lootItems[i]["ItemId"] != "MeteorLootStone")
    //     {
    //       log("ITEM " + i + ": " + this.lootItems[i]["DisplayName"]);
    //       // don't include parent bundle
    //       msg += '\n' + this.lootItems[i]["DisplayName"];
    //     }
    //   }
    // }
  }

  // --- LEADERBOARD ---

  loadLeaderboard(): void {
    if (this.api != null) {
      const leaderboard: Leaderboard = new Leaderboard(som.scene.leaderboard, this.api, null)
      this.board = leaderboard
    }
  }

  showRewards(itemArray: Item[], popupType: PopupWindowType, msg: string = ''): void {
    console.log('showRewards() ' + popupType)
    if (itemArray != null) {
      for (let i: number = 0; i < itemArray.length; i++) {
        if (itemArray[i].ItemId === 'MeteorLootBonus') {
          // log("ITEM " + i + ": " + itemArray[i]["DisplayName"]);
          // don't include parent bundle
          msg = 'Bonus Drop!'
          break
        } else if (itemArray[i].ItemId === 'MeteorDoubleLoot') {
          msg = 'Double Loot!'
          break
        } else if (itemArray[i].ItemId === 'MeteorDoubleBonus') {
          msg = 'Double Bonus Drop!'
          break
        }
      }

      // HACK
      if (popupType === PopupWindowType.MinedShared) {
        msg = 'Large Meteor!'
      } else if (popupType === PopupWindowType.SharedBonus) {
        msg = 'Shared Bonus!'
      }
    }

    const delayMillis = popupType === PopupWindowType.LevelUp ? 20000 : 8000

    this.queuePopup(popupType, msg, itemArray, null, delayMillis)
    if (GameManager.instance != null) {
      GameManager.instance.getPlayerInventory()
    }
  }

  showCraftingError(msg: string): void {
    // GameUi.instance.showTimedPopup(PopupWindowType.CraftError, msg, null, GameManager.instance.machine.craftedRecipe.itemId, 120000, null);
    if (GameManager.instance?.machine?.craftedRecipe != null) {
      this.queuePopup(PopupWindowType.CraftError, msg, null, GameManager.instance.machine.craftedRecipe.itemId, 120000)
    }

    if (GameManager.instance?.machine != null) {
      GameManager.instance.machine.reset(true)
    }
  }

  showMiningError(msg: string): void {
    if (GameUi.instance != null) {
      GameUi.instance.showTimedMessage(msg, 8000)
    }
  }

  // --- POPUPS ---

  queuePopup(
    _type: PopupWindowType,
    _msg: string = '',
    // eslint-disable-next-line @typescript-eslint/ban-types
    _rewards: Item[] | null = null,
    _itemId: string | null = null,
    _millis: number = 8000
  ): void {
    if (this.popupQueue == null) {
      this.popupQueue = new PopupQueue()
    }

    // add will try to show the popup if it's the only one in the queue
    if (_itemId !== null) {
      this.popupQueue.addPopup(_type, _msg, _rewards, _itemId, _millis)
    }
  }
}
