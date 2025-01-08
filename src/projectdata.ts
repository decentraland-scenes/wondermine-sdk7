import { type MeteorState, type MeteorTypeId } from './enums'

export enum Metal {
  Iron = 1,
  Copper = 2,
  Titanium = 3,
  Gold = 4,
  Platinum = 5
}

export enum IconSymbol {
  Coins,
  Gems,
  Iron,
  Copper,
  Titanium,
  Gold,
  Platinum,
  Sapphire,
  Ruby,
  Emerald,
  Diamond,
  AxeStone,
  MoleCoinSmall,
  MoleCoinLarge,
  numSymbols
}

export class PickaxeType {
  public ItemId: string = ''
  public metalType: Metal = Metal.Iron

  public filename: string = ''
  public scale: number[] = [1, 1, 1]

  /**
   * The total number of hits this meteorite can take before it disappears
   */
  public maxHits: number = 10

  public miningClip: string = ''
  public extraClip1: string = ''
  public extraClip2: string = ''
  public miningSound: string = ''
}

export class PickaxeInstance {
  // extends ItemInfo
  public ItemId: string = '' // from ItemInfo
  public DisplayName: string = ''
  public RemainingUses: number = 0
  public Efficiency: number = 0.25

  public type: PickaxeType = new PickaxeType()
  public typeName: string = ''

  public metalType: Metal = Metal.Iron

  public filename: string = ''
  public pos: number[] = []
  public angles: number[] = [0, 0, 0]
  public scale: number[] = [1, 1, 1]

  /**
   * The total number of hits this meteorite can take before it disappears
   */
  public maxHits: number = 10
}

export class MeteorType {
  public name: string = ''
  public filename: string = ''
  public scale: number[] = [1, 1, 1]

  public metalType: Metal = Metal.Iron

  public chance: number = 1
  /**
   * Number of seconds until this meteorite disappears
   */
  public duration: number = 60
  /**
   * The total number of hits this meteorite can take before it disappears
   */
  public maxHits: number = 10

  public idleClip: string = ''
  public idleSound: string = ''
  public dropClip: string = ''
  public dropSound: string = ''
  public hitClip: string = ''
  public hitSound: string = ''
  public depleteClip: string = ''
  public depleteSound: string = ''
}

export class MeteorInstance {
  public id: string = ''

  /**
   * A numeric code defining the material type of this rock
   * 1 = stone
   * 2 = iron
   * 3 = copper
   * 4 = gold
   * 5 = platinum
   */
  public typeId?: number = 0
  public type: MeteorType = new MeteorType()
  public typeName: string = ''

  public pos: number[] = []
  public angles: number[] = [0, 0, 0]
  public scale: number[] = [1, 1, 1]

  /**
   * A numeric code defining the current state of this rock
   * 0 = dormant/falling
   * 1 = idle/active
   * 2 = depleted
   */
  public state?: number = 0

  /**
   * The ID of the scene in the scene collection.
   */
  public sceneId?: string = ''
  /**
   * The base coordinates of the scene.
   */
  public baseParcel?: number[] = []
  /**
   * x,y,z arrival position within the chosen scene
   */
  public position?: number[] = []

  /**
   * Number of seconds until this meteorite disappears
   */
  public duration: number = 60

  /**
   * The total number of hits this meteorite can take before it disappears
   */
  public maxHits?: number = 10

  /**
   * The number of hits made so far
   */
  public hits?: number = 0

  // a list of all the playerIds that have hit this meteor
  public hitters?: [] = []

  public startTime?: number = 0
  public endTime?: number = 0
}

export class LootItemInstance {
  public filename: string = ''
  public itemId: string = ''

  public pos: number[] = [0, 0, 0]
  public angles: number[] = [0, 0, 0]
  public scale: number[] = [1, 1, 1]

  public idleClip: string = ''
  public idleSound: string = ''
}

export class ShopItemInstance {
  public filename: string = ''
  public itemId: string = ''

  public pos: number[] = [0, 0, 0]
  public angles: number[] = [0, 0, 0]
  public scale: number[] = [1, 1, 1]

  public idleClip: string = ''
  public idleSound: string = ''

  public itemQty: number = 0
  public manaPrice: number = 0
  public dollarPrice: number = 0
}

export class TextBoardObject {
  public filename: string = ''
  public pos: number[] = []
  public rotation: number[] = [0, 0, 0, 1]
  public angles: number[] = [0, 0, 0]
  public scale: number[] = [1, 1, 1]

  // optional properties
  public textPos: number[] = [] // relative to the parent's position
  public textAngles: number[] = [0, 0, 0]
  public textWidth: number = 300
  public textHeight: number = 150
  public fontSize: number = 12
  public hexColor: string = '#FFFFFF'

  public isLeaderboard: boolean = false
  public playerListPos: number[] = [] // relative to the parent's position
  public scoreListPos: number[] = [] // relative to the parent's position
  public scoreListWidth: number = 100
}

export class MeteorSpawnerInstance {
  public bottom: number = 0
  public left: number = 0
  public top: number = 0
  public right: number = 0
  public floorHeight: number = 0
  public dropHeight: number = 0
}

export class LeaderboardEntry {
  public place: number = 0
  public name: string = ''
  public score: number = 0
  public date: Date = new Date()
}

export class UiElementData {
  public width: string = ''
  public height: string = ''
  public pos?: number = 0
  public positionX?: number = 0
  public positionY?: number = 0
  public hAlign?: string = ''
  public vAlign?: string = ''
  public paddingLeft?: number = 0
  public paddingTop?: number = 0
  public paddingRight?: number = 0
  public paddingBottom?: number = 0
}
export class UiImageData extends UiElementData {
  public sourceLeft: number = 0
  public sourceTop: number = 0
  public sourceWidth: number = 0
  public sourceHeight: number = 0
}
export class UiTextData extends UiElementData {
  public color?: number = 0
  public fontSize?: number = 0
  public lineSpacing?: number = 0
  public lineCount?: number = 0
  public fontWeight?: string = ''
  public hTextAlign?: string = ''
  public vTextAlign?: string = ''
  public textWrapping?: boolean

  /**
   * Use to set the text color. Doesn't exist on the UIText
   * object, but will trigger a call to Color4.FromHexString().
   */
  public hexColor: string = ''
}

export class CraftMaterial {
  public itemId: string = ''
  public qty: number = 0
  public useAll: boolean = false
}

export class Recipe {
  public id: string = ''
  public name: string = ''
  public desc: string = ''
  public qty: number = 1
  public wi: number = 0
  public itemId: string = ''
  public itemClass: string = ''
  public isActive: boolean = false
  public isNft: boolean = false
  public limitOne: boolean = false
  public levelMin: number = 0
  public consumes: CraftMaterial[] = []
}

export class SharedMeteor {
  // id like "m203" sent and returned from client to know which meteor was hit
  public id: string = ''
  // enum 0=local, 1=medium, 2=large
  public type: MeteorTypeId | null = null
  // future use; blank value means the main WonderMine scene
  public sceneId: string = ''

  // x-coordinate relative to the scene base
  public x: number = 0
  // can always assume y is 0
  public y: number = 0
  // z-coordinate relative to the scene base
  public z: number = 0

  // the max number of hits this meteor can take
  public maxHits: number = 0
  // current number of hits recorded
  public hits: number = 0
  // current state enum
  public state: MeteorState | null = null
  // playfabIDs for everyone who successfully hit the meteor

  // playfabIDs for everyone who successfully hit the meteor
  public hitters: string[] = []
  // array of loot items to give to each player who hit the meteor
  public sharedLootItems: string[] = []

  hitsLeft(): number {
    return this.maxHits - this.hits
  }
}
