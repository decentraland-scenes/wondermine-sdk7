/* eslint-disable @typescript-eslint/no-unsafe-argument */
// 1DO Add inventory button and panel
// 1DO Add music/volume controls
// 1DO Show XP progress bar
// 3DO + button for coins and show purchase UI

import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { getSizeAsNumber, getUvs } from './utils/utils'
import { som } from 'src/som'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { DclUser } from 'shared-dcl/src/playfab/dcluser'
import { type ItemInfo } from 'shared-dcl/src/playfab/iteminfo'
import { Eventful, ShowErrorEvent, ChangeToolEvent } from 'src/events'
import { type UIImage, type IGameUi } from './igameui'
import { GameData } from 'src/gamedata'

/**
 * A UI layer with a bottom bar display and inventory popup menu
 */

export type IconValue = {
  value: string
}

type MyObject = Record<string, any>

export class UiBottomBarPanel {
  public parentUi: IGameUi
  mainPanel_visible: boolean = false
  public progressValue: number = 0
  public progBar_positionX: number = -26 // equals = 0
  barLeft: UIImage = { uvs: [], som: null, atlas: '' }
  barCenter: UIImage = { uvs: [], som: null, atlas: '' }
  barRight: UIImage = { uvs: [], som: null, atlas: '' }
  barTools: UIImage = { uvs: [], som: null, atlas: '' }
  toolIcon: UIImage = { uvs: [], som: null, atlas: '' }
  toolBtn: UIImage = { uvs: [], som: null, atlas: '' }
  coinIcon: UIImage = { uvs: [], som: null, atlas: '' }
  gemIcon: UIImage = { uvs: [], som: null, atlas: '' }
  inventoryBtn: UIImage = { uvs: [], som: null, atlas: '' }
  progBarBg: UIImage = { uvs: [], som: null, atlas: '' }
  progBar: UIImage = { uvs: [], som: null, atlas: '' }
  levelCircle: UIImage = { uvs: [], som: null, atlas: '' }
  inventoryBg: UIImage = { uvs: [], som: null, atlas: '' }
  coinsTxt: string = ''
  gemsTxt: string = ''
  toolTxt: string = 'Crescent Lava Pickaxe #333\nRemaining: 400'
  levelTxt: string = '1'
  iconImages: Record<string, UIImage> = {}
  iconValues: Record<string, IconValue> = {}
  public bonusPctTxt: string = ''
  public isToolTxtVisible: boolean = false
  inventoryPopup_visible: boolean = false
  public atlas: string = ''
  public resourceAtlas: string = ''
  public axeType: string = 'AxeStone'
  constructor(ui: IGameUi) {
    this.parentUi = ui
    this.init()
  }

  init(): void {
    this.atlas = this.parentUi.getUiAtlas()
    this.resourceAtlas = this.parentUi.getResourceAtlas()
    this.addBottomBar()
    this.addDisplayRow()
    this.showBalances(0, 0)
    this.addInventoryPopup()
    this.toggleInventory()
  }

  addBottomBar(): void {
    this.barLeft = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.bottomBarPanel.image.barLeft, { x: 1024, y: 1024 }),
      som.ui.bottomBarPanel.image.barLeft,
      this.atlas
    )
    this.barCenter = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.bottomBarPanel.image.barCenter, { x: 1024, y: 1024 }),
      som.ui.bottomBarPanel.image.barCenter,
      this.atlas
    )
    this.barRight = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.bottomBarPanel.image.barRight, { x: 1024, y: 1024 }),
      som.ui.bottomBarPanel.image.barRight,
      this.atlas
    )
    this.barTools = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.bottomBarPanel.image.barTools, { x: 1024, y: 1024 }),
      som.ui.bottomBarPanel.image.barTools,
      this.atlas
    )

    this.toolIcon = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.ToolIcon, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.ToolIcon,
      this.resourceAtlas
    )
    this.toolBtn = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.bottomBarPanel.image.toolBtn, { x: 1024, y: 1024 }),
      som.ui.bottomBarPanel.image.toolBtn,
      this.atlas
    )
  }

  showToolText(showIt: boolean): void {
    this.isToolTxtVisible = showIt
  }

  addDisplayRow(): void {
    this.coinIcon = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.WC, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.WC,
      this.resourceAtlas
    )
    this.gemIcon = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.WG, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.WG,
      this.resourceAtlas
    )
    this.inventoryBtn = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.bottomBarPanel.image.inventoryBtn, { x: 1024, y: 1024 }),
      som.ui.bottomBarPanel.image.inventoryBtn,
      this.atlas
    )
    this.addLevelBar()
  }

  addLevelBar(): void {
    this.progBarBg = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.bottomBarPanel.image.progBarBg, { x: 1024, y: 1024 }),
      som.ui.bottomBarPanel.image.progBarBg,
      this.atlas
    )
    this.progBar = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.bottomBarPanel.image.progBar, { x: 1024, y: 1024 }),
      som.ui.bottomBarPanel.image.progBar,
      this.atlas
    )
    this.levelCircle = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.bottomBarPanel.image.levelCircle, { x: 1024, y: 1024 }),
      som.ui.bottomBarPanel.image.levelCircle,
      this.atlas
    )
  }

  setLevel(currentLevel: number, xp: number): void {
    // log("setLevel(" + currentLevel + ", " + xp + ")");
    const levelIdx = currentLevel - 1

    const xpStart = GameData.thresholds[levelIdx]
    const xpEnd = GameData.thresholds[levelIdx + 1]
    const xpRange = Math.max(1, xpEnd - xpStart)
    const xpProgress = Math.max(0, xp - xpStart)

    // log("xpStart=" + xpStart + ", xpEnd=" + xpEnd);
    this.showLevel(currentLevel, xpProgress / xpRange)
  }

  showLevel(level: number, pct: number): void {
    // log("showLevel(" + level + ", " + pct + ")");
    // change progress by moving the prog bar x value
    // scaling did not work
    // range is 0% =-26, 100% = 13
    if (pct < 0) pct = 0
    if (pct > 1) pct = 1
    this.progressValue = pct

    const xOffset = Math.floor(pct * 13)
    const newX = xOffset - 26
    this.progBar_positionX = newX
    console.log('progress bar', this.progBar_positionX)

    this.levelTxt = level.toString()
  }

  addInventoryPopup(): void {
    this.inventoryBg = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.bottomBarPanel.image.inventoryBg, { x: 1024, y: 1024 }),
      som.ui.bottomBarPanel.image.inventoryBg,
      this.atlas
    )
    this.iconImages.GemDiamond = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.GemDiamond, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.GemDiamond,
      this.resourceAtlas
    )
    this.iconImages.GemRuby = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.GemRuby, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.GemRuby,
      this.resourceAtlas
    )
    this.iconImages.GemEmerald = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.GemEmerald, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.GemEmerald,
      this.resourceAtlas
    )
    this.iconImages.GemSapphire = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.GemSapphire, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.GemSapphire,
      this.resourceAtlas
    )
    this.iconImages.AxeStone = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.AxeStone, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.AxeStone,
      this.resourceAtlas
    )

    this.iconValues.GemDiamond = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.GemRuby = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.GemEmerald = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.GemSapphire = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.AxeStone = som.ui.bottomBarPanel.textField.invItemTxt

    this.iconImages.MetalPlatinum = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.MetalPlatinum, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.MetalPlatinum,
      this.resourceAtlas
    )
    this.iconImages.MetalGold = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.MetalGold, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.MetalGold,
      this.resourceAtlas
    )
    this.iconImages.MetalTitanium = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.MetalTitanium, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.MetalTitanium,
      this.resourceAtlas
    )
    this.iconImages.MetalIron = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.MetalIron, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.MetalIron,
      this.resourceAtlas
    )
    this.iconImages.MetalCopper = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.MetalCopper, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.MetalCopper,
      this.resourceAtlas
    )

    this.iconValues.MetalPlatinum = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.MetalGold = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.MetalTitanium = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.MetalIron = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.MetalCopper = som.ui.bottomBarPanel.textField.invItemTxt

    this.iconImages.BlueFabric = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.BlueFabric, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.BlueFabric,
      this.resourceAtlas
    )
    this.iconImages.Glowmetal = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.Glowmetal, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.Glowmetal,
      this.resourceAtlas
    )
    this.iconImages.WearablesToken = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.WearablesToken, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.WearablesToken,
      this.resourceAtlas
    )
    this.iconImages.GiftBox = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.resourceIcons.image.GiftBox, { x: 1024, y: 1024 }),
      som.ui.resourceIcons.image.GiftBox,
      this.resourceAtlas
    )

    this.iconValues.BlueFabric = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.Glowmetal = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.WearablesToken = som.ui.bottomBarPanel.textField.invItemTxt
    this.iconValues.GiftBox = som.ui.bottomBarPanel.textField.invItemTxt

    const keys = Object.keys(this.iconValues)
    for (var i: number = 0; i < keys.length; i++) {
      if (this.iconValues[keys[i]] != null) {
        this.iconValues[keys[i]].value = '0'
        console.log('icon value array', this.iconValues[keys[i]].value)
      }
    }
  }

  showBalances(coins: number, gems: number): void {
    this.coinsTxt = coins.toString()
    this.gemsTxt = gems.toString()
  }

  toggleInventory(): void {
    // this.isInventoryShown = !this.isInventoryShown;
    if (!this.inventoryPopup_visible) {
      this.updateInventory()
    }
    this.inventoryPopup_visible = !this.inventoryPopup_visible
  }

  updateInventory(): void {
    console.log('updateInventory()')
    if (DclUser.activeUser != null) {
      const inv: ItemInfo[] = DclUser.activeUser.inventoryArray
      if (inv != null) {
        let id: string
        let item: object | null
        let qty: number = 0
        let hasGift: boolean = false
        // log(inv);

        // set held axe info
        const axe: ItemInfo | null = DclUser.activeUser.getHeldItem()
        // log("heldItem", axe);

        // we show axe uses at one less, so we can stop mining when there is just 1 use remaining
        // (otherwise PlayFab removes their axe completely)
        if (axe != null) {
          const axeQty = axe.RemainingUses - 1
          this.updateAxeQty(axeQty)
        } else {
          this.iconValues.AxeStone.value = '1'
        }
        for (var i: number = 0; i < inv.length; i++) {
          id = inv[i].ItemId
          qty = inv[i].RemainingUses
          if (inv[i].ItemClass !== 'pickaxe' && this.iconValues[id] != null) {
            // NOTE: GiftBox can't be set Stackable in PlayFab, or else this logic will fail
            if (id === 'GiftBox' && qty == null) {
              // log("GiftBox qty=" + qty);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              hasGift = true
              this.iconValues[id].value = '1'
            } else {
              this.iconValues[id].value = qty.toString()
            }
          }
        }
        if (!hasGift) {
          this.iconValues.GiftBox.value = '0'
        }

        // find if any values must be set to zero (no data from server for those items)

        const textFieldNames: string[] = Object.keys(this.iconValues)
        // log(textFieldNames);
        textFieldNames.forEach((id: string, index: number, arr: string[]) => {
          // why can't we use find() ?
          // inv.find((item) => item.ItemId === id)
          const prefix: string = id.substr(0, 3)
          if (prefix !== 'Axe' && prefix !== 'Gif') {
            item = this.findFirst(inv, 'ItemId', id)
            if (item == null) {
              this.iconValues[id].value = '0'
            }
          }
        }, this)
      }
      this.showBonus()
    }
  }

  findFirst(objArray: MyObject[], propName: string, matchVal: string): object | null {
    for (var i = 0; i < objArray.length; i++) {
      if (objArray[i][propName] === matchVal) {
        return objArray[i]
      }
    }
    return null
  }

  showBonus(): void {
    this.bonusPctTxt = 'Mining Bonus: ' + DclUser.activeUser.getTotalBonus() + '%'
  }

  closeInventory(): void {
    this.inventoryPopup_visible = false
  }

  changeAxeIcon(itemData: ItemInfo): void {
    const data = som.ui.resourceIcons.image[itemData.ItemId]
    if (data != null) {
      this.axeType = itemData.ItemId
      // this.parentUi.loader.populate(img, data);

      // show tool text
      const qty: number = itemData.RemainingUses - 1
      this.toolTxt = itemData.DisplayName + '\n' + 'Remaining: ' + qty
      this.iconValues.AxeStone.value = qty.toString()
    }
  }

  updateAxeQty(qty: number): void {
    console.log('updateAxeQty(' + qty + ')')
    const current: string = this.toolTxt
    const idx: number = current.lastIndexOf(':')

    this.toolTxt = current.substr(0, idx + 2) + qty
    this.iconValues.AxeStone.value = qty.toString()
  }

  hide(): void {
    if (this.mainPanel_visible == null) return
    this.mainPanel_visible = false
  }

  show(): void {
    if (this.mainPanel_visible == null) return
    this.mainPanel_visible = true
  }

  renderUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    const uiScaleFactor = (Math.min(canvasInfo.width, canvasInfo.height) / 1080) * 1.2
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: canvasInfo.height * 0.9,
          height: canvasInfo.height * 0.5,
          alignItems: 'center',
          justifyContent: 'center',
          positionType: 'absolute',
          position: { bottom: '0%', right: '0%' }
        }}
      >
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            width: canvasInfo.height * 0.9,
            height: canvasInfo.height * 0.34,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            positionType: 'relative',
            position: { top: '2%', right: '0%' }
          }}
        >
          {/* Inventory BG */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              positionType: 'relative',
              position: { top: '0%', right: '1%' },
              width: getSizeAsNumber(this.inventoryBg.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.inventoryBg.som.height) * uiScaleFactor,
              display: this.inventoryPopup_visible ? 'flex' : 'none',
              justifyContent: 'space-between'
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.inventoryBg.uvs,
              texture: { src: this.inventoryBg.atlas }
            }}
          >
            {/* Inventory - First Column */}
            <UiEntity
              uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '33%',
                padding: '6px',
                margin: { top: '25px', left: '5px' }
              }}
            >
              {Object.entries(this.iconImages)
                .slice(0, 5)
                .map(([key, ImageData], index) => (
                  <UiEntity
                    uiTransform={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      padding: '0px',
                      margin: { top: '0px', left: '40px' }
                    }}
                  >
                    <UiEntity
                      key={key}
                      uiTransform={{
                        width: getSizeAsNumber(som.ui.resourceIcons.image[key].width) * uiScaleFactor,
                        height: getSizeAsNumber(som.ui.resourceIcons.image[key].height) * uiScaleFactor,
                        margin: { bottom: '0px' }
                      }}
                      uiBackground={{
                        textureMode: 'stretch',
                        uvs: ImageData.uvs,
                        texture: { src: this.resourceAtlas }
                      }}
                    />
                    {/* Label */}
                    <UiEntity
                      uiTransform={{
                        width: getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.width) * uiScaleFactor,
                        height: getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.height) * uiScaleFactor
                      }}
                    >
                      <Label
                        value={this.iconValues[key].value}
                        fontSize={getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.fontSize) * uiScaleFactor}
                        color={Color4.fromHexString(som.ui.bottomBarPanel.textField.invItemTxt.hexColor)}
                        font="sans-serif"
                      />
                    </UiEntity>
                  </UiEntity>
                ))}
            </UiEntity>

            {/* Inventory - Second Column */}
            <UiEntity
              uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '20%',
                padding: '6px',
                margin: { top: '25px', right: '10px' }
              }}
            >
              {Object.entries(this.iconImages)
                .slice(5, 10)
                .map(([key, ImageData], index) => (
                  <UiEntity
                    uiTransform={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      padding: '0px',
                      margin: { top: '0px', left: '40px' }
                    }}
                  >
                    <UiEntity
                      key={key}
                      uiTransform={{
                        width: getSizeAsNumber(som.ui.resourceIcons.image[key].width) * uiScaleFactor,
                        height: getSizeAsNumber(som.ui.resourceIcons.image[key].height) * uiScaleFactor,
                        margin: { bottom: '0px' }
                      }}
                      uiBackground={{
                        textureMode: 'stretch',
                        uvs: ImageData.uvs,
                        texture: { src: this.resourceAtlas }
                      }}
                    />
                    {/* Label */}
                    <UiEntity
                      uiTransform={{
                        width: getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.width) * uiScaleFactor,
                        height: getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.height) * uiScaleFactor
                      }}
                    >
                      <Label
                        value={this.iconValues[key].value}
                        fontSize={getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.fontSize) * uiScaleFactor}
                        color={Color4.fromHexString(som.ui.bottomBarPanel.textField.invItemTxt.hexColor)}
                        font="sans-serif"
                      />
                    </UiEntity>
                  </UiEntity>
                ))}
            </UiEntity>

            {/* Inventory - Third Column */}
            <UiEntity
              uiTransform={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                width: '33%',
                padding: '6px',
                margin: { top: '25px', right: '40px' }
              }}
            >
              {Object.entries(this.iconImages)
                .slice(10, 14)
                .map(([key, ImageData], index) => (
                  <UiEntity
                    uiTransform={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      padding: '0px',
                      margin: { top: '0px', left: '40px' }
                    }}
                  >
                    <UiEntity
                      key={key}
                      uiTransform={{
                        width: getSizeAsNumber(som.ui.resourceIcons.image[key].width) * uiScaleFactor,
                        height: getSizeAsNumber(som.ui.resourceIcons.image[key].height) * uiScaleFactor,
                        margin: { bottom: '0px' }
                      }}
                      uiBackground={{
                        textureMode: 'stretch',
                        uvs: ImageData.uvs,
                        texture: { src: this.resourceAtlas }
                      }}
                    />
                    {/* Label */}
                    <UiEntity
                      uiTransform={{
                        width: getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.width) * uiScaleFactor,
                        height: getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.height) * uiScaleFactor
                      }}
                    >
                      <Label
                        value={this.iconValues[key].value}
                        fontSize={getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.fontSize) * uiScaleFactor}
                        color={Color4.fromHexString(som.ui.bottomBarPanel.textField.invItemTxt.hexColor)}
                        font="sans-serif"
                      />
                    </UiEntity>
                  </UiEntity>
                ))}
            </UiEntity>
          </UiEntity>
        </UiEntity>
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            width: canvasInfo.height * 0.9,
            height: canvasInfo.height * 0.08,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            positionType: 'absolute',
            position: { bottom: '0%', right: '0%' }
          }}
        >
          {/* Tool Text */}
          <UiEntity
            uiTransform={{
              position: { bottom: '10%', right: '0%' },
              width: getSizeAsNumber(som.ui.bottomBarPanel.textField.toolTxt.width) * uiScaleFactor,
              height: getSizeAsNumber(som.ui.bottomBarPanel.textField.toolTxt.height) * uiScaleFactor,
              positionType: 'relative',
              display: this.isToolTxtVisible ? 'flex' : 'none'
            }}
          >
            <Label
              uiTransform={{
                width: getSizeAsNumber(som.ui.bottomBarPanel.textField.toolTxt.width) * uiScaleFactor,
                height: getSizeAsNumber(som.ui.bottomBarPanel.textField.toolTxt.height) * uiScaleFactor
              }}
              value={`<b>${this.toolTxt}</b>`}
              fontSize={getSizeAsNumber(som.ui.bottomBarPanel.textField.toolTxt.fontSize) * uiScaleFactor}
              textAlign="middle-right"
              font="sans-serif"
              color={Color4.fromHexString(som.ui.bottomBarPanel.textField.toolTxt.hexColor)}
            />
          </UiEntity>
          {/* Bar Tools */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              position: { top: '5%', right: '0%' },
              positionType: 'relative',
              width: getSizeAsNumber(this.barTools.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.barTools.som.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.barTools.uvs,
              texture: { src: this.barTools.atlas }
            }}
            onMouseDown={() => {
              console.log('clicked on Tools bar')
              this.showToolText(!this.isToolTxtVisible)
            }}
          >
            {/* Tool Icon */}
            <UiEntity
              uiTransform={{
                position: { top: '7%', left: '5%' },
                positionType: 'absolute',
                width: getSizeAsNumber(this.toolIcon.som.width) * uiScaleFactor,
                height: getSizeAsNumber(this.toolIcon.som.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.toolIcon.uvs,
                texture: { src: this.toolIcon.atlas }
              }}
            />
            {/* Tool Button */}
            <UiEntity
              uiTransform={{
                position: { top: '0%', right: '3%' },
                positionType: 'absolute',
                width: getSizeAsNumber(this.toolBtn.som.width) * uiScaleFactor,
                height: getSizeAsNumber(this.toolBtn.som.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.toolBtn.uvs,
                texture: { src: this.toolBtn.atlas } 
              }}
              onMouseDown={() => {
                console.log('clicked on Tools button')

                if (DclUser.activeUser.isAxeBusy) {
                  Eventful.instance.fireEvent(new ShowErrorEvent('Please wait until your axe is finished mining!'))
                } else {
                  // get the next pickaxe
                  const nextTool: ItemInfo | null = DclUser.activeUser.getNextTool()
                  // DONE: only update server later when they mine with this axe?
                  this.showToolText(true)
                  if (nextTool != null) {
                    Eventful.instance.fireEvent(new ChangeToolEvent(nextTool, false))
                  }
                }
              }}
            />
          </UiEntity>
          {/* Bar Left */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              positionType: 'relative',
              width: getSizeAsNumber(this.barLeft.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.barLeft.som.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.barLeft.uvs,
              texture: { src: this.barLeft.atlas }
            }}
          >
            {/* Coin Icon */}
            <UiEntity
              uiTransform={{
                position: { bottom: '12%', left: '14%' },
                positionType: 'absolute',
                width: getSizeAsNumber(this.coinIcon.som.width) * uiScaleFactor,
                height: getSizeAsNumber(this.coinIcon.som.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.coinIcon.uvs,
                texture: { src: this.coinIcon.atlas }
              }}
            />
            {/* Coin Text */}
            <UiEntity
              uiTransform={{
                position: { bottom: '14%', left: '43%' },
                positionType: 'absolute',
                width: getSizeAsNumber(som.ui.bottomBarPanel.textField.coinsTxt.width) * uiScaleFactor,
                height: getSizeAsNumber(som.ui.bottomBarPanel.textField.coinsTxt.height) * uiScaleFactor
              }}
            >
              <Label
                uiTransform={{
                  width: getSizeAsNumber(som.ui.bottomBarPanel.textField.coinsTxt.width) * uiScaleFactor,
                  height: getSizeAsNumber(som.ui.bottomBarPanel.textField.coinsTxt.height) * uiScaleFactor
                }}
                value={`<b>${this.coinsTxt}</b>`}
                fontSize={getSizeAsNumber(som.ui.bottomBarPanel.textField.coinsTxt.fontSize) * uiScaleFactor}
                textAlign="middle-left"
                font="sans-serif"
                color={Color4.fromHexString(som.ui.bottomBarPanel.textField.coinsTxt.hexColor)}
              />
            </UiEntity>
          </UiEntity>
          {/* Bar Center */}
          <UiEntity
            uiTransform={{
              positionType: 'relative',
              width: getSizeAsNumber(this.barCenter.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.barCenter.som.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.barCenter.uvs,
              texture: { src: this.barCenter.atlas }
            }}
          >
            {/* Gem Icon */}
            <UiEntity
              uiTransform={{
                position: { bottom: '12%', left: '0%' },
                positionType: 'absolute',
                width: getSizeAsNumber(this.gemIcon.som.width) * uiScaleFactor,
                height: getSizeAsNumber(this.gemIcon.som.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.gemIcon.uvs,
                texture: { src: this.gemIcon.atlas }
              }}
            />
            {/* Gem Text */}
            <UiEntity
              uiTransform={{
                position: { bottom: '14%', left: '35%' },
                positionType: 'absolute',
                width: getSizeAsNumber(som.ui.bottomBarPanel.textField.gemsTxt.width) * uiScaleFactor,
                height: getSizeAsNumber(som.ui.bottomBarPanel.textField.gemsTxt.height) * uiScaleFactor
              }}
            >
              <Label
                uiTransform={{
                  width: getSizeAsNumber(som.ui.bottomBarPanel.textField.gemsTxt.width) * uiScaleFactor,
                  height: getSizeAsNumber(som.ui.bottomBarPanel.textField.gemsTxt.height) * uiScaleFactor
                }}
                value={`<b>${this.gemsTxt}</b>`}
                fontSize={getSizeAsNumber(som.ui.bottomBarPanel.textField.gemsTxt.fontSize) * uiScaleFactor}
                textAlign="middle-left"
                font="sans-serif"
                color={Color4.fromHexString(som.ui.bottomBarPanel.textField.gemsTxt.hexColor)}
              />
            </UiEntity>
          </UiEntity>
          {/* Bar Right */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              positionType: 'relative',
              width: getSizeAsNumber(this.barRight.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.barRight.som.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.barRight.uvs,
              texture: { src: this.barRight.atlas }
            }}
          >
            {/* Inventory */}
            <UiEntity
              uiTransform={{
                position: { bottom: '0%', left: '0%' },
                positionType: 'absolute',
                width: getSizeAsNumber(this.inventoryBtn.som.width) * uiScaleFactor,
                height: getSizeAsNumber(this.inventoryBtn.som.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.inventoryBtn.uvs,
                texture: { src: this.inventoryBtn.atlas }
              }}
              onMouseDown={() => {
                this.parentUi.showInventoryPopup()
              }}
            />
            {/* Progress Bar BG */}
            <UiEntity
              uiTransform={{
                position: { bottom: '20%', right: '10%' },
                positionType: 'absolute',
                width: getSizeAsNumber(this.progBarBg.som.width) * uiScaleFactor,
                height: getSizeAsNumber(this.progBarBg.som.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.progBarBg.uvs,
                texture: { src: this.progBarBg.atlas }
              }}
            >
              {/* Progress Bar */}
              <UiEntity
                uiTransform={{
                  position: { top: '22%', left: this.progBar_positionX },
                  positionType: 'absolute',
                  width: getSizeAsNumber(this.progBar.som.width) * uiScaleFactor,
                  height: getSizeAsNumber(this.progBar.som.height) * uiScaleFactor
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: this.progBar.uvs,
                  texture: { src: this.progBar.atlas }
                }}
              />
            </UiEntity>
            {/* Level Circle */}
            <UiEntity
              uiTransform={{
                position: { bottom: '5%', left: '40%' },
                positionType: 'absolute',
                width: getSizeAsNumber(this.levelCircle.som.width) * uiScaleFactor,
                height: getSizeAsNumber(this.levelCircle.som.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.levelCircle.uvs,
                texture: { src: this.levelCircle.atlas }
              }}
            >
              <Label
                uiTransform={{
                  position: { top: '10%', left: '8%' },
                  positionType: 'absolute',
                  width: getSizeAsNumber(som.ui.bottomBarPanel.textField.levelTxt.width) * uiScaleFactor,
                  height: getSizeAsNumber(som.ui.bottomBarPanel.textField.levelTxt.height) * uiScaleFactor
                }}
                value={`<b>${this.levelTxt}</b>`}
                fontSize={getSizeAsNumber(som.ui.bottomBarPanel.textField.levelTxt.fontSize) * uiScaleFactor}
                textAlign="middle-center"
                font="sans-serif"
                color={Color4.fromHexString(som.ui.bottomBarPanel.textField.levelTxt.hexColor)}
              />
            </UiEntity>
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
