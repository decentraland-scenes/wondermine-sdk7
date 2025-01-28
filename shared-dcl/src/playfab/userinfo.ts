// import { UserData } from "@decentraland/Identity";
import { ToolIds } from '../../../src/enums'
import { ChangeToolEvent, Eventful } from '../../../src/events'
import { type ItemInfo } from './iteminfo'

export class UserInfo {
  // --- User Profile ---
  public userId: string
  public displayName: string
  public publicKey: string

  // --- Statistics ---
  public bestScore: number = 0
  public numRaces: number = 0
  public totalVisits: number = 0

  // --- Currencies ---
  public coins: number = 0
  public gems: number = 0

  // --- Level ---
  public level: number = 0
  public xp: number = 0

  public levelXpLow: number | undefined
  public levelXpHigh: number | undefined

  public wearables: string[] = []

  public heldItem:
    | ItemInfo
    // ItemInstanceId of the selected pickaxe
    // public heldItemId:string;
    // ItemInstanceId of the selected pickaxe
    // public heldItemId:string;
    // ItemInstanceId of the selected pickaxe
    // public heldItemId:string;
    // ItemInstanceId of the selected pickaxe
    // public heldItemId:string;
    // ItemInstanceId of the selected pickaxe
    // public heldItemId:string;
    // ItemInstanceId of the selected pickaxe
    // public heldItemId:string;
    // ItemInstanceId of the selected pickaxe
    // public heldItemId:string;
    // ItemInstanceId of the selected pickaxe
    // public heldItemId:string;
    | undefined
  // ItemInstanceId of the selected pickaxe
  // public heldItemId:string;
  // ItemInstanceId of the selected pickaxe
  // public heldItemId:string;
  // ItemInstanceId of the selected pickaxe
  // public heldItemId:string;
  // ItemInstanceId of the selected pickaxe
  // public heldItemId:string;

  // ItemInstanceId of the selected pickaxe
  // public heldItemId:string;
  // ItemInstanceId of the selected pickaxe
  // public heldItemId:string;

  // ItemInstanceId of the selected pickaxe
  // public heldItemId:string;

  // ItemInstanceId of the selected pickaxe
  // public heldItemId:string;
  public isAxeBusy: boolean = false

  public wearablesBonus: number = 0
  public itemBonus: number = 0
  public levelBonus: number = 0
  public tokenBonus: number = 0

  public lastCraftingTime: number = 0
  public collectedCoinBonus: boolean = false

  // --- Inventory ---
  public inventoryArray: ItemInfo[] = []
  // sorted array of pickaxes and tools
  public toolArray: ItemInfo[] = []
  // limited items this player has already crafted
  public limitOneItems: string[] = []

  public firstTime: boolean = true
  public isT: boolean = false

  constructor(_id: string, _name: string, _publicKey: string, _isTemp: boolean = false) {
    this.userId = _id
    this.displayName = _name
    this.publicKey = _publicKey
    this.isT = _isTemp
  }

  setInventory(invArray: ItemInfo[]): void {
    // log("setInventory(), heldItemId=", this.heldItemId);
    this.inventoryArray = invArray
    // update the axe data
    let toolChanged: boolean = false
    this.toolArray = this.getAllTools('pickaxe')

    let item: ItemInfo | null
    let updateServer: boolean = false
    if (this.heldItem?.ItemInstanceId != null) {
      // already have a heldItem specified
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      item = this.getToolByInstanceId(this.heldItem.ItemInstanceId)

      // if previously held tool is gone, select a new one
      if (item == null) {
        this.heldItem = this.toolArray[0]
        // this.heldItemId = this.toolArray[0].ItemInstanceId;
        // 2DO: this is a change, and the server should be updated
        toolChanged = true
        updateServer = true
      } else {
        this.heldItem = item
        if (this.firstTime) {
          toolChanged = true
          this.firstTime = false
        }
      }
    } else if (this.toolArray.length > 0) {
      // we have tools, but no instance was selected before
      this.heldItem = this.toolArray[0]
      // this.heldItemId = this.toolArray[0].ItemInstanceId;
      toolChanged = true
      updateServer = true
    }

    this.itemBonus = this.getItemBonus()

    if (toolChanged) {
      Eventful.instance.fireEvent(new ChangeToolEvent(this.heldItem, updateServer))
    }
  }

  getItemBonus(): number {
    let bonusPct: number = 0
    if (this.heldItem != null) {
      switch (this.heldItem.ItemId) {
        case 'AxeCopper':
          bonusPct += 10
          break
        case 'AxeIron':
          bonusPct += 20
          break
        case 'AxeTitanium':
          bonusPct += 30
          break
        case 'AxeGolden':
          bonusPct += 40
          break
        case 'AxeDiamond':
        case 'AxeWondergem':
        case 'AxeIce':
        case 'AxeExtra':
        case 'AxeLava':
        case 'AxeVroomway':
        case 'AxeSteam':
        case 'AxeGhost':
        case 'AxeSausage':
          bonusPct += 50
          break
      }
      // log("getItemBonus()=" + bonusPct + " for " + this.heldItem.ItemId);
    }
    return bonusPct
  }

  getTotalBonus(): number {
    const coinBonus: number = this.coins > 100 ? 5 : 0
    this.itemBonus = this.getItemBonus()
    return Math.min(100, this.wearablesBonus + this.itemBonus + this.levelBonus + coinBonus + this.tokenBonus)
  }

  addInventoryItem(item: ItemInfo): void {
    if (item != null) {
      this.inventoryArray.push(item)
    }
  }

  getItem(itemId: string): ItemInfo | null {
    let item: ItemInfo
    for (let i: number = 0; i < this.inventoryArray.length; i++) {
      item = this.inventoryArray[i]
      if (item.ItemId === itemId) {
        return item
      }
    }
    return null
  }

  getFirstItemClass(itemClass: string): ItemInfo | null {
    let item: ItemInfo
    for (let i: number = 0; i < this.inventoryArray.length; i++) {
      item = this.inventoryArray[i]
      if (item.ItemClass === itemClass) {
        return item
      }
    }
    return null
  }

  getAllTools(itemClass: string): ItemInfo[] {
    let it: ItemInfo
    const items: ItemInfo[] = []
    let maxId = 0
    for (let i: number = 0; i < this.inventoryArray.length; i++) {
      it = this.inventoryArray[i]
      if (it.ItemClass === itemClass) {
        if (ToolIds[it.ItemId as keyof typeof ToolIds] > maxId) {
          items.unshift(it)
          maxId = ToolIds[it.ItemId as keyof typeof ToolIds]
        } else {
          items.push(it)
        }
      }
    }
    // log("Tools:", items);
    return items
  }

  getToolByInstanceId(instanceId: string): ItemInfo | null {
    // Typescript has no Array.find() function
    for (let i: number = 0; i < this.toolArray.length; i++) {
      if (this.toolArray[i].ItemInstanceId === instanceId) {
        return this.toolArray[i]
      }
    }
    return null
  }

  getHeldItem(): ItemInfo | null {
    if (this.heldItem != null) {
      return this.heldItem
    }
    // else if (this.heldItemId)
    // {
    //     return this.getToolByInstanceId(this.heldItemId);
    // }
    else if (this.toolArray != null && this.toolArray.length > 0) {
      return this.toolArray[0]
    } else return null
  }

  setHeldItem(id: string): void {
    console.log('***** setHeldItem(' + id + ') *****')
    if (id !== null) {
      // this.activeUser.heldItemId = id;
      const heldItem: ItemInfo | null = this.getToolByInstanceId(id)
      if (heldItem == null) {
        console.log("setHeldItem() couldn't find item " + id)
        this.heldItem = this.toolArray[0]
      } else {
        this.heldItem = heldItem
      }
    }
  }

  getNextTool(): ItemInfo | null {
    console.log('getNextTool()', this.toolArray)
    if (this.toolArray == null || this.toolArray.length < 1) return null

    if (this.heldItem == null) return this.toolArray[0]

    // get the current index in the tool array
    const heldItemId: string = this.heldItem.ItemInstanceId
    let i: number
    for (i = 0; i < this.toolArray.length; i++) {
      if (this.toolArray[i].ItemInstanceId === heldItemId) {
        console.log('current i=' + i)
        break
      }
    }
    i++
    if (i >= this.toolArray.length) i = 0
    console.log('next i=' + i)
    this.heldItem = this.toolArray[i]
    // this.heldItemId = this.heldItem.ItemInstanceId;
    return this.toolArray[i]
  }

  hasAlreadyCrafted(itemId: string): boolean {
    for (let i: number = 0; i < this.limitOneItems.length; i++) {
      // log("checking |" + this.limitOneItems[i] + "|");
      if (this.limitOneItems[i] === itemId) {
        return true
      }
    }
    return false
  }

  // getBestAxe():ItemInfo
  // {
  //     let item:ItemInfo;
  //     let bestItemId = 0;
  //     let bestItemIndex = -1;
  //     for (var i:number = 0; i < this.inventoryArray.length; i++)
  //     {
  //         item = this.inventoryArray[i];
  //         if (item.ItemClass == "pickaxe")
  //         {
  //             if (ToolIds[item.ItemId] > bestItemId)
  //             {
  //                 bestItemId = ToolIds[item.ItemId].value;
  //                 bestItemIndex = i;
  //             }
  //         }
  //     }
  //     if (bestItemIndex >= 0)
  //     {
  //         return this.inventoryArray[bestItemIndex];
  //     }
  //     else
  //     {
  //         return null;
  //     }
  // }

  checkT(): void {
    if (this.getItem('TesterBadge') != null) {
      this.isT = true
    }
  }
}
