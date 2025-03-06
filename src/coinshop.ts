/* eslint-disable @typescript-eslint/dot-notation */
import {
  type Entity,
  Transform,
  engine,
  type TransformType,
  type Vector3Type,
  type PBTextShape,
  TextShape,
  TextAlignMode,
  executeTask
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'
import { ProjectLoader } from './projectloader'
import { ShopItem } from './shopitem'
import { som } from './som'
import { type ShopItemInstance } from './projectdata'
import { ItemIcons } from './enums'
import { ItemAmountPanel } from './ui/itemamountpanel'
import { svr } from './svr'
import { ManaContract2 } from './contracts/manaContract2'
import { BenchmarkEvent, Eventful } from './events'
import { GameUi } from './ui/gameui'

export type BuildingData = {
  filename: string
  pos: [number, number, number] // assuming pos is an array of 3 numbers
  angles: [number, number, number] // assuming angles is an array of 3 numbers
}

export type PriceData = {
  VirtualCurrencyPrices?: {
    MA?: number
  }
}

export type StoreItem = {
  ItemId: string
  // Add any other properties that are expected in the store item
}

export class CoinShop {
  private readonly entity = engine.addEntity()
  public trans: TransformType = { position: Vector3.create(), scale: Vector3.create(), rotation: Quaternion.create() }
  // the main cart or building model
  public modelEntity: Entity = engine.addEntity()
  public modelFile: string = ''
  // public modelShape:GLTFShape;

  public signEntity: Entity = engine.addEntity()

  // the model to use for various coin packages?
  public productModelFile: string = ''

  public products: ShopItem[] = []
  public storeData: StoreItem[] = []
  public textureFile: string = 'assets/models/textures/resources_atlas_1024.png'

  public txInProgress: boolean = false

  constructor(_buildingData: BuildingData, _signData: object) {
    // console.log("creating shop...");
    this.loadBuilding(_buildingData, _signData)
  }

  loadBuilding(_buildingData: BuildingData, _signData: object): void {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.modelFile = _buildingData.filename

    // use building object as parent transform
    const pos: Vector3 = Vector3.create(..._buildingData.pos)

    // create and position the parent entity (holder)
    Transform.create(this.entity, {
      position: pos,
      rotation: Quaternion.fromEulerDegrees(_buildingData.angles[0], _buildingData.angles[1], _buildingData.angles[2])
    })

    // the position and angles for the building model should be zero, since the parent handles positioning
    _buildingData.pos = [0, 0, 0]
    _buildingData.angles = [0, 0, 0]
    this.modelEntity = ProjectLoader.instance.spawnSceneObject(_buildingData, true)
    Transform.getOrCreateMutable(this.modelEntity).parent = this.entity

    // make sure sign object has relative pos and angles
    this.signEntity = ProjectLoader.instance.spawnSceneObject(_signData, true)
    Transform.getOrCreateMutable(this.signEntity).parent = this.entity
  }

  getItemData(itemId: string): PriceData | null {
    let item
    for (let i: number = 0; i < this.storeData.length; i++) {
      item = this.storeData[i]
      if (item.ItemId === itemId) {
        return item as PriceData // Se asegura de que el item tiene el tipo PriceData
      }
    }
    return null
  }

  loadProducts(): void {
    // log("CoinShop.loadProducts()");
    // log(this.storeData);
    const itemNames: string[] = ['CoinPackB', 'CoinPackC', 'CoinPackD', 'CoinPackE', 'CoinPackF']
    let item: ShopItem
    let itemName: string
    for (let i: number = 0; i < itemNames.length; i++) {
      itemName = itemNames[i]
      const baseItem = som.shop[itemName]

      if (this.storeData.length > 0) {
        // override with server prices if we have them
        const priceData = this.getItemData(itemName)
        if (priceData?.VirtualCurrencyPrices != null) {
          const price = priceData.VirtualCurrencyPrices?.MA
          if (price != null && price > 0) {
            baseItem.manaPrice = price
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      item = new ShopItem(baseItem)
      item.instanceData.itemId = itemName
      // log("loading " + itemNames[i]);
      item.enabled = true
      Transform.getMutable(item.entity).parent = this.entity
      this.addProduct(item)
      // this.products[itemName] = item;
      this.addPriceSign(item)
    }
  }

  addProduct(product: ShopItem): void {
    product.onClickCallback = (itemData: ShopItemInstance): boolean => {
      console.log('click callback:', itemData)
      return this.onProductClicked(itemData) // Ensure `onProductClicked` only uses itemData
    }
  }

  addPriceSign(item: ShopItem): void {
    const sign1Entity = engine.addEntity()
    Transform.create(sign1Entity, {
      position: Vector3.create(-0.9, -3.2, 0),
      scale: Vector3.create(1.8, 1.8, 1.8),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0),
      parent: item.modelEntity
    })
    let fontSize: number = 1.4
    if (item.instanceData.manaPrice >= 1000) {
      fontSize = 1.1
    }
    const itemTile1 = new ItemAmountPanel(
      sign1Entity,
      Vector3.create(0, 2, 0.1),
      '#333333',
      '773344',
      this.textureFile,
      8,
      8,
      ItemIcons.Mana,
      fontSize,
      false
    )
    if (item.instanceData.manaPrice >= 1000) {
      // shift text to the left a bit
      const textTrans = Transform.get(itemTile1.textEntity)
      const tPos: Vector3Type = textTrans.position
      tPos.x = tPos.x - 0.04
      Transform.getMutable(itemTile1.textEntity).position = tPos
    }
    // itemTile1.showText("1000");
    itemTile1.showText(item.instanceData.manaPrice.toString())

    const ts: PBTextShape = this.addTextField(
      2,
      Vector3.create(-0.35, 1.25, 0),
      Vector3.create(0, 90, 0),
      item.modelEntity
    )
    ts.text = item.instanceData.itemQty.toString()
  }

  onProductClicked(itemData: ShopItemInstance, hitPoint?: Vector3): boolean {
    if (this.txInProgress) {
      if (GameUi.instance != null) {
      GameUi.instance.showTimedMessage("Please wait for your transaction to complete.", 300000);
      }
      return true
    }

    this.txInProgress = true

    let paymentAmount: number = itemData.manaPrice
    const address: string = '0' + 'x' + svr.a
    console.log(address)
    svr.i = itemData.itemId
    svr.p = paymentAmount
    // log("id=" + svr.i + " price=" + svr.p);
    // pop up confirmation ui
    if (GameUi.instance != null) {
    GameUi.instance.showTimedMessage("Thanks! First confirm your transaction.\nThen wait in the scene for a few minutes\nuntil the transaction completes...", 600000);
    }

    // pay mana

    executeTask(async () => {
      const manaEth = new ManaContract2()
      const manaBal = await manaEth.getPlayerBalance()
      console.log('mana on mainnet', manaBal / 1e18)

      const weiAmount = (paymentAmount *= 1e18)

      manaEth
        .send(weiAmount, true)
        .then((tx) => {
          console.log('PAYMENT SUCCEEDED', tx)
          if (GameUi.instance != null) {
          GameUi.instance.showTimedMessage("Transaction complete!\nYour WonderCoins will arrive soon.", 12000);
          }

          // GameManager.instance.doIt();
          Eventful.instance.fireEvent(new BenchmarkEvent(paymentAmount))

          this.txInProgress = false

          const txId: string = tx['transactionHash']
          if (txId.length > 0) {
            svr.x = txId.toString()
          }
        })
        .catch((error) => {
          console.log(error)
          let msg: string = 'The transaction was canceled.' 
          if (error['message'] !== null) {
            msg += '\n' + error['message']
          } else if (error['data'] != null || error['data']['message'] != null) {
            msg += '\n' + (error['data'] != null || error['data']['message'])
          }
          console.log(msg)
          if (GameUi.instance != null) {
          GameUi.instance.showTimedMessage(msg);
          }
          this.txInProgress = false
        })
    })

    return false
  }

  addTextField(_fontSize: number, _pos: Vector3, _angles: Vector3, _parent: Entity): PBTextShape {
    // create text shape
    const ent: Entity = engine.addEntity()
    TextShape.create(ent, {
      text: ''
    })
    const ts: PBTextShape = TextShape.getMutable(ent)

    // log("created textShape");

    ts.fontSize = _fontSize
    // ts.color = Color3.White();
    ts.textColor = Color4.fromHexString('#221100')

    ts.width = 80
    ts.height = 40

    ts.textAlign = TextAlignMode.TAM_TOP_CENTER
    // ts.fontWeight = "bold";

    ts.textWrapping = false
    Transform.create(ent, {
      position: _pos,
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(_angles.x, _angles.y, _angles.z),
      parent: _parent
    })
    return ts
  }
}
