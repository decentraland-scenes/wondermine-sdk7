/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { som } from './som'
import { ProjectLoader } from './projectloader'
import { executeTask, AvatarModifierArea, AvatarModifierType, engine, Transform } from '@dcl/sdk/ecs'
import { DclUser } from '../shared-dcl/src/playfab/dcluser'
import { WondermineApi } from '../shared-dcl/src/playfab/wondermineapi'
import { CoinShop, type StoreItem } from './coinshop'
import { CraftingMachine } from './craftingmachine'
import * as utils from '@dcl-sdk/utils'
import { type Quaternion, Vector3 } from '@dcl/sdk/math'
import { Eventful, CraftItemEvent, BenchmarkEvent, HitMeteorEvent, ChangeToolEvent, MeteorLootEvent } from './events'
import { svr } from './svr'
import { type EventManager } from './eventManager'
import { Leaderboard } from './leaderboard'
import { GameUi } from './ui/gameui'
import { WearableClaimerContract } from './contracts/wearableClaimerContract'
import { ContractManager } from './contracts/contractManager'
import { WzNftContract } from './contracts/wzNftContract'
import { getProviderPromise } from './contracts/nftChecker'
import { MeteorTypeList } from './wondermine/meteortypelist'
import { SharedMeteor, type MeteorSpawnerInstance } from './projectdata'
import { MeteorSpawner } from './wondermine/meteorspawner'
import { ChainId, MeteorTypeId, PopupWindowType, ToolIds } from './enums'

import { Pickaxe } from './pickaxe'
import { ItemInfo } from 'shared-dcl/src/playfab/iteminfo'
import { PickaxeInstance } from './projectdata'
import { Meteor } from './wondermine/meteor'
import { PickaxeTypeList } from './pickaxetypelist'
import { PopupQueue } from './ui/popupqueue'
import { type Item } from './ui/uipopuppanel'
import { LootItem } from './wondermine/lootitem'
import { LootVault } from './wondermine/lootvault'
import { transform } from 'typescript'
import { GameData } from './gamedata'
import calcWearablesBonus from './bonusmanager'

export class GameManager {
  static instance: GameManager | null = null
  static eventMgr: EventManager | null = null
  public static test: string = 'GM test'

  public api: WondermineApi | null = null
  public loader: ProjectLoader | null = null

  public paused: boolean = false

  private board: Leaderboard | null = null

  // game-specific properties

  // the current list of meteors visible to this player
  public meteors: Meteor[] = []

  public spawner: MeteorSpawner | null = null

  public axe: Pickaxe | null = null
  public axeJustBroke: boolean = false
  public axeUses: number = 0

  public machine: CraftingMachine | null = null

  public delayTime: number = 0
  public delayElapsed: number = 0
  public delayCallback: (() => void) | undefined

  private readonly coinCost: number = 5
  private readonly lootHomePos: number[] = [6.5, 0, 57]

  public shop: CoinShop | null = null
  public shopData: StoreItem[] = []

  public lootItems: Item[] | null = null
  // eslint-disable-next-line @typescript-eslint/ban-types
  public sharedLootItems: Object[] | null = null
  public miningErrorMessage: string = '' // "Something's wrong with this meteor.\nTry a different one."
  public popupQueue: PopupQueue | null = null

  private readonly enableShared: boolean = true

  constructor(titleId: string) {
    this.api = new WondermineApi(titleId)
    this.checkContracts()
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
    this.loadScenery()
    this.setUpMeteors()
    this.setUpPickaxes()

    this.loadResourceModels()

    this.loadCrafting()

    // //Load the leaderboard model itself and initialize it,
    // //then load the actual stats from inside loginToPlayFab()
    this.loadLeaderboard()
  }

  connectToMeteorServer(): void {}

  async getCurrentUser(): Promise<void> {
    executeTask(async () => {
      console.log('########################## calling loginToPlayFab()')
      await this.loginToPlayFab()

      if (this.enableShared) {
        utils.timers.setTimeout(() => {
          this.connectToMeteorServer()
        }, 5000)
        console.log('enable true')
      }
      Eventful.instance.addListener(MeteorLootEvent, null, ({ msg, result }) => {
        console.log('MeteorLootEvent: ' + msg)
        // this.onMeteorLootReceived(msg, result)
      })

      // pull out the first (0,0,0) camera rotation (old bug; is this still necessary?)
      const temp: Quaternion = Transform.get(engine.CameraEntity).rotation

      // start with
      utils.timers.setTimeout(() => {
        this.spawnMeteor()
      }, 5000)
    })
  }

  setPrices(json: any): void {
    console.log('setPrices()', json)
    const data = json.data
    if (data != null) {
      const prices = data.Store
      if (Boolean(prices) && Array.isArray(prices) && prices.length > 0) {
        this.shopData = prices
      }
    }
    // log(this.shopData);
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
            if (GameUi.instance != null) {
              GameUi.instance.showTimedMessage('Your axe just broke!\nYou can repair it at the Crafting Machine.', 8000)
            }
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

  onGrantFirstToolComplete(error: any, json: any): void {
    // log("onGrantFirstToolComplete()");
    if (error != null) {
      console.log('Script call error!')
      console.log(error)
    } else {
      // console.log(json);
      const data = json.data
      console.log(data)
      if (data != null) {
        const result = data.FunctionResult
        if (result != null) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          const items: ItemInfo[] = result.ItemGrantResults
          // console.log(items);
          if (items != null && items.length > 0) {
            // console.log(items[0]);
            const item = items[0]

            // console.log(newItem);
            if (item != null) {
              const newItem: ItemInfo = new ItemInfo()
              newItem.ItemId = item.ItemId
              newItem.ItemClass = item.ItemClass
              newItem.ItemInstanceId = item.ItemInstanceId
              newItem.RemainingUses = item.RemainingUses
              newItem.DisplayName = item.DisplayName

              // console.log("GRANTED AXE");
              DclUser.activeUser.addInventoryItem(newItem)
              DclUser.activeUser.heldItem = newItem
              // DclUser.activeUser.heldItemId = newItem.ItemInstanceId;
              if (GameManager.instance != null) {
                GameManager.instance.spawnPickaxe(newItem)
              }
              if (GameUi.instance != null) {
                GameUi.instance.changeAxeIcon(newItem)
              }
            }
          }
        }
      }
    }
  }

  // 1DO: Move getMeteorLoot() to the API class
  async getMeteorLoot(m: Meteor): Promise<void> {
    // store this so we know if the axe breaks
    if (DclUser.activeUser.heldItem !== null) {
      this.axeUses = DclUser.activeUser.heldItem.RemainingUses
    }

    executeTask(async () => {
      // log("calling mineMeteor(" + DclUser.displayName + ")");
      const args: object = {
        id: DclUser.activeUser.heldItem?.ItemInstanceId
      }
      if (this.api != null) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.api.CallCloudScript('mineMeteor2', args, this.onMeteorLootComplete, false)
      }
    })
  }

  /**
   * Handles the results from the mineMeteor() API call.
   * Saves the loot items for later display after the mining animation is done.
   * @param error The error message, if any
   * @param json The result json content
   */
  onMeteorLootComplete(error: any, json: any): void {
    console.log('onMeteorLootComplete()')
    if (error != null) {
      console.log('Script call error!')
      console.log(error)
    } else {
      // CloudScript returns arbitrary results, so you have to evaluate them one step and one parameter at a time
      // console.log("CloudScript call successful!");
      console.log(json)
      const data = json.data
      // console.log(data);
      if (data != null) {
        const result = data.FunctionResult
        // console.log(result);
        // this.onMeteorLootReceived("localLoot", result);
        console.log('firing MeteorLootEvent')
        Eventful.instance.fireEvent(new MeteorLootEvent('localLoot', result))
      }
    }
  }

  /**
   * Handles the results from a mineMetor call to the Colyseus room.
   * Invoked in response to a MeteorLootEvent event fired by the MeteorServer class.
   * @param msg The message type, either "meteorLoot", "sharedLoot", "localLoot" or "error"
   * @param result The result object, which contains the loot items
   */
  onMeteorLootReceived(msg: string, result: Item): void {
    console.log('onMeteorLootReceived(): ' + msg)
    console.log(result)
    // TODO
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

  public hasLeveledUp: boolean = false

  checkLevel(): void {
    // log("checkLevel()");
    executeTask(async () => {
      if (this.api != null) {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.api.CallCloudScript('checkLevel', { xp: 5 }, this.onLevelCheckComplete, false)
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public levelUpItems: Object[] = []
  onLevelCheckComplete(_error: any, json: any): void {}

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

  updateLevel(): void {
    // DclUser.activeUser.xp += 5;
    if (GameUi.instance !== null) {
      GameUi.instance.setLevel(DclUser.activeUser.level, DclUser.activeUser.xp)
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

  // --- CRAFTING ---
  craftItem(recipeId: string, wi: number, itemClass: string): void {
    // log("craftItem()");
    executeTask(async () => {
      let canCraft: boolean = true
      if (svr.waitingForCraftResponse) {
        canCraft = false
        if (GameUi.instance !== null) {
          GameUi.instance.showTimedMessage('Please wait...', 8000)
        }
      } else if (itemClass === 'wearable' && wi > 0) {
        // check first if there are any left!
        if (this.api !== null) {
          await this.api.CountClaimableItems()
        }
        if (GameData.getWearableCount(wi) <= 0) {
          // someone else took the last one!
          canCraft = false
          if (GameManager.instance !== null) {
            GameManager.instance.showCraftingError(
              '\n\n\n\n\n\nSorry, that item sold out.\nNo materials were used.\nPlease try a different item.'
            )
          }
          if (this.machine !== null) {
            this.machine.refreshRecipe()
          }
        }
      }

      if (canCraft) {
        const body = {
          recipeId: recipeId,
          addr: DclUser.activeUser.userId,
          toolId: DclUser.activeUser.heldItem?.ItemInstanceId
        }
        console.log('sending call body:', body)
        svr.waitingForCraftResponse = true
        if (this.api !== null) {
          this.api.CallCloudScript(
            'craftItem',
            body,
            (error, json) => {
              this.onCraftingComplete(error, json)
            },
            true
          )
        }
      }
    })
  }

  onCraftingComplete(_error: any, _json: any): void {}

  public wearClaimer: WearableClaimerContract | null = null
  public latestClaim: object | null = null

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

  onClaimerContractCalled(funcName: string, returnVal: any): void {
    // log("wearClaimer." + funcName + "():");
    // log(returnVal);

    if (funcName === 'loadContract') {
      // GameManager.instance.wearCrafter.getItemSupply(0, "meteor_chaser_feet");
      // GameManager.instance.wearCrafter.checkSender("aT5G-98j2-pYu5", "meteor_chaser_feet");
      // GameManager.instance.wearCrafter.checkSender("jrgY-TW03-SSzpTl", "meteorchaser_trousers_lower_body");
    } else if (funcName === 'checkSender') {
      //
    } else if (funcName === 'minted') {
      console.log('WEARABLE MINTED!')
      if (LootVault.instance !== null) {
        const lootEnt: LootItem = LootVault.instance.get('StarGold')
        if (GameManager.instance !== null) {
          GameManager.instance?.machine?.animateMachine(lootEnt)
        }
      }

      const msg: string =
        '\n\n\n\n\nYour wearable is being minted!\nIt might take a few minutes.\nCheck your wallet for transaction status.'
      // GameUi.instance.showTimedPopup(PopupWindowType.Crafted, msg, null, GameManager.instance.machine.craftedRecipe.itemId, 30000, null);
      if (GameManager.instance?.machine?.craftedRecipe != null) {
        this.queuePopup(PopupWindowType.Crafted, msg, null, GameManager.instance.machine.craftedRecipe.itemId, 30000)
      }

      // update supply counts
      if (GameManager.instance !== null) {
        void GameManager.instance.api?.CountClaimableItems()
      }
    } else if (funcName === 'claimError') {
      const err = returnVal
      let msg: string = '\nThe wearable was not minted.\nClaim it later at https://wondermine.wonderzone.io'
      if (err.code === 4001) {
        msg = '\n\n\n\n\nYou rejected the transaction. ' + msg
      } else {
        msg = '\n\n\n\n\nBlockchain transaction failed. ' + msg
      }
      if (GameManager.instance !== null) {
        GameManager.instance.showCraftingError(msg)
        void GameManager.instance.api?.CountClaimableItems()
      }
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

  checkCoinBonus(): void {
    if (DclUser.activeUser.collectedCoinBonus) {
      if (GameManager.instance !== null) {
        GameManager.instance.showStatueMessage()
      }
    } else {
      executeTask(async () => {
        if (this.api != null) {
          // eslint-disable-next-line @typescript-eslint/unbound-method
          this.api.CallCloudScript('claim100', {}, this.onCheckedCoinBonus, false)
        }
      })
    }
  }

  onCheckedCoinBonus(_error: any, _json: any): void {}

  showStatueMessage(): void {
    if (GameManager.instance !== null) {
      GameUi.instance?.showTimedMessage(
        'At this spot, Cole Mole saw the first Glow Meteor\ncrash to earth. 4 June 2020.\n(The WC bonus is over, but might be back one day!).',
        12000
      )
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

  loadShop(): void {
    // log("loadShop()");
    this.shop = new CoinShop(som.scene.cart, som.scene.cartSign)
    this.shop.storeData = this.shopData
    this.shop.loadProducts()

    Eventful.instance.addListener(BenchmarkEvent, null, ({ value }) => {
      console.log('event value:', value)
      this.doIt()
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onGotStoreProducts(errorObj: any, jsonObj: any) {
    if (errorObj !== null) {
      console.log('GetStoreItems call error!')
      console.log('error: ' + errorObj)
    } else {
      console.log('GetStoreItems', jsonObj)
      this.setPrices(jsonObj)
      this.loadShop()
    }
  }

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

  spawnMeteor(): void {
    console.log('spawn meteor once')
    if (this.spawner !== null) {
      const m: Meteor | null = this.spawner.spawn(MeteorTypeId[MeteorTypeId.Local]) // MeteorTypeId[MeteorTypeId.Medium]
      // 1DO A1 Need to provide the right context here!
      Meteor.onHitCallback = (hitPoint: Vector3, m: Meteor) => {
        // log("onHitCallback in GameManager");

        return this.hitMeteor(hitPoint, m)
      }
      // log("spawned meteor at" + m.entity.getComponent(Transform).position);
      // log("model at " + m.modelEntity.getComponent(Transform).position);
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

  loadResourceModels(): void {
    // log("*** LOAD RESOURCE MODELS ***");

    LootVault.create()
    LootItem.homePos = Vector3.create(...this.lootHomePos)

    let lootItem: LootItem

    // cycle through all the resource models in the SOM
    // preload the medium meteor too, in case it helps with initial loading
    const keys: string[] = [
      'MeteorMedium',
      'GemSapphire',
      'GemEmerald',
      'GemRuby',
      'GemDiamond',
      'MetalCopper',
      'MetalIron',
      'MetalTitanium',
      'MetalGold',
      'MetalPlatinum',
      'BlueFabric',
      'Glowmetal',
      'WearablesToken',
      'StarGold'
      // "AxeStone", "AxeCopper", "AxeIron", "AxeTitanium", "AxeGolden", "AxeDiamond", "AxeExtra" //, "AxeWondergem"
    ]
    const toolKeys = Object.keys(ToolIds).filter((x) => !(parseInt(x) >= 0 || x === 'None')) // exclude "None" and numeric reverse keys
    // log("toolKeys", toolKeys);
    keys.push(...toolKeys)
    // log("keys", keys);

    // let obj:object = som.loot;
    // log(Object.keys(obj));
    for (var i: number = 0; i < keys.length; i++) {
      // log("loading " + keys[i]);
      // load the model, but don't add it to the engine
      // ent = this.loader.spawnSceneObject(som.loot[keys[i]], true);
      lootItem = new LootItem(som.loot[keys[i]], keys[i])
      // lootItem.shape.visible = false;
      lootItem.enabled = false

      // store it in the vault
      if (lootItem != null) {
        // log("adding " + keys[i] + " to vault");
        if (LootVault.instance !== null) {
          LootVault.instance.add(keys[i], lootItem)
        }
      }
    }
  }

  checkWearables(): void {
    console.log('checkWearables()')
    executeTask(async () => {
      if (this.api !== null) {
        this.api.CallCloudScript(
          'checkWearables2',
          { address: DclUser.activeUser.userId },
          // eslint-disable-next-line @typescript-eslint/unbound-method
          this.onCheckedWearables,
          false
        ) // , "realm": domain
        // Metakey
        console.log('checkMetakey')
        // eslint-disable-next-line @typescript-eslint/unbound-method
        this.api.CallCloudScript('checkMetakey', { address: DclUser.activeUser.userId }, this.onCheckedMetakey, false) // , "realm": domain
      }
    })
  }

  onCheckedWearables(_error: any, json: any): void {
    // TODO
  }

  onCheckedMetakey(_error: any, json: any): void {
    // TODO
  }

  calcWearBonus(wearables: string[]): void {
    console.log('calcWearBonus()', wearables)
    try {
      // check against new function

      const checkBonus = calcWearablesBonus(wearables)
      console.log('checked bonus: ' + checkBonus)

      DclUser.activeUser.wearables = wearables
      DclUser.activeUser.wearablesBonus = checkBonus
    } catch {
      console.log('an error occurred getting avatar data')
    }
  }

  // -- GAME PLAY ---

  listMeteors(): void {
    console.log('ACTIVE METEORS')
    for (const m of Meteor.activeMeteors) {
      console.log('Meteor ' + m.instanceData?.id + ', dur=' + m.instanceData?.duration + ', hits=' + m.hits)
    }
  }

  removeSharedMeteors(): void {
    console.log('REMOVE SHARED METEORS')
    for (const m of Meteor.activeMeteors) {
      console.log('Meteor ' + m.instanceData?.id + ', hits=' + m.hits)
      if (m.isShared) {
        m.removeMeteor(m, true)
      }
    }
  }

  hitMeteor(hitPoint: Vector3.MutableVector3 | undefined, m: Meteor): boolean {
    return true
  }

  showMiningError(msg: string): void {
    if (GameUi.instance != null) {
      GameUi.instance.showTimedMessage(msg, 8000)
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

  // --- LEADERBOARD ---

  loadLeaderboard(): void {
    if (this.api != null) {
      const leaderboard: Leaderboard = new Leaderboard(som.scene.leaderboard, this.api, null)
      this.board = leaderboard
    }
  }
}
