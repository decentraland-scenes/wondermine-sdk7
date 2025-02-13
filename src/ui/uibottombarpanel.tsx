/* eslint-disable @typescript-eslint/no-unsafe-argument */
// 1DO Add inventory button and panel
// 1DO Add music/volume controls
// 1DO Show XP progress bar
// 3DO + button for coins and show purchase UI

import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { getUvs } from './utils/utils'
import { som } from 'src/som'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import { DclUser } from 'shared-dcl/src/playfab/dcluser'
import { type ItemInfo } from 'shared-dcl/src/playfab/iteminfo'
import { Eventful, ShowErrorEvent, ChangeToolEvent } from 'src/events'
import { type IGameUi } from './igameui'
import { GameData } from 'src/gamedata'

/**
 * A UI layer with a bottom bar display and inventory popup menu
 */
export class UiBottomBarPanel {
  public parentUi: IGameUi
  mainPanel_visible: boolean = false
  public progressValue: number = 0
  public progBar_positionX: number = -26 // equals = 0
  barLeft: number[] = []
  barCenter: number[] = []
  barRight: number[] = []
  barTools: number[] = []
  toolIcon: number[] = []
  toolBtn: number[] = []
  coinIcon: number[] = []
  gemIcon: number[] = []
  inventoryBtn: number[] = []
  progBarBg: number[] = []
  progBar: number[] = []
  levelCircle: number[] = []
  inventoryBg: number[] = []
  coinsTxt: string = ''
  gemsTxt: string = ''
  toolTxt: string = 'Crescent Lava Pickaxe #333\nRemaining: 400'
  levelTxt: string = '1'
  public isToolTxtVisible: boolean = false
  inventoryPopup_visible: boolean = false
  constructor(ui: IGameUi) {
    this.parentUi = ui
    this.init()
  }

  init(): void {
    this.addBottomBar()
    this.addDisplayRow()
    this.showBalances(0, 0)
    this.addInventoryPopup()
  }

  addBottomBar(): void {
    this.barLeft = getUvs(som.ui.bottomBarPanel.image.barLeft, { x: 1024, y: 1024 })
    this.barCenter = getUvs(som.ui.bottomBarPanel.image.barCenter, { x: 1024, y: 1024 })
    this.barRight = getUvs(som.ui.bottomBarPanel.image.barRight, { x: 1024, y: 1024 })
    this.barTools = getUvs(som.ui.bottomBarPanel.image.barTools, { x: 1024, y: 1024 })
    this.toolIcon = getUvs(som.ui.resourceIcons.image.ToolIcon, { x: 1024, y: 1024 })
    this.toolBtn = getUvs(som.ui.bottomBarPanel.image.toolBtn, { x: 1024, y: 1024 })
  }

  showToolText(showIt: boolean): void {
    this.isToolTxtVisible = showIt
  }

  addDisplayRow(): void {
    this.coinIcon = getUvs(som.ui.resourceIcons.image.WC, { x: 1024, y: 1024 })
    this.gemIcon = getUvs(som.ui.resourceIcons.image.WG, { x: 1024, y: 1024 })
    this.inventoryBtn = getUvs(som.ui.bottomBarPanel.image.inventoryBtn, { x: 1024, y: 1024 })
    this.addLevelBar()
  }

  addLevelBar(): void {
    this.progBarBg = getUvs(som.ui.bottomBarPanel.image.progBarBg, { x: 1024, y: 1024 })
    this.progBar = getUvs(som.ui.bottomBarPanel.image.progBar, { x: 1024, y: 1024 })
    this.levelCircle = getUvs(som.ui.bottomBarPanel.image.levelCircle, { x: 1024, y: 1024 })
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
    this.inventoryBg = getUvs(som.ui.bottomBarPanel.image.inventoryBg, { x: 1024, y: 1024 })
  }

  showBalances(coins: number, gems: number): void {
    this.coinsTxt = coins.toString()
    this.gemsTxt = gems.toString()
  }

  hide(): void {
    if (this.mainPanel_visible == null) return
    this.mainPanel_visible = false
  }

  show(): void {
    if (this.mainPanel_visible == null) return
    this.mainPanel_visible = true
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
        // uiBackground={{
        //   color: { r: 1, g: 1, b: 1, a: 1 }
        // }}
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
          // uiBackground={{
          //   color: { r: 0, g: 100, b: 0, a: 1 }
          // }}
        >
          {/* Inventory BG */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              positionType: 'relative',
              position: { top: '0%', right: '1%' },
              width: this.getSizeAsNumber(som.ui.bottomBarPanel.image.inventoryBg.width) * uiScaleFactor,
              height: this.getSizeAsNumber(som.ui.bottomBarPanel.image.inventoryBg.height) * uiScaleFactor,
              display: this.inventoryPopup_visible ? 'flex' : 'none'
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.inventoryBg,
              texture: { src: 'assets/models/textures/new_ui_1024.png' }
            }}
          />
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
          // uiBackground={{
          //   color: { r: 100, g: 0, b: 0, a: 1 }
          // }}
        >
          {/* Tool Text */}
          <UiEntity
            uiTransform={{
              position: { bottom: '10%', right: '0%' },
              width: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.toolTxt.width) * uiScaleFactor,
              height: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.toolTxt.height) * uiScaleFactor,
              positionType: 'relative',
              display: this.isToolTxtVisible ? 'flex' : 'none'
            }}
          >
            <Label
              uiTransform={{
                width: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.toolTxt.width) * uiScaleFactor,
                height: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.toolTxt.height) * uiScaleFactor
              }}
              value={`<b>${this.toolTxt}</b>`}
              fontSize={this.getSizeAsNumber(som.ui.bottomBarPanel.textField.toolTxt.fontSize) * uiScaleFactor}
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
              width: this.getSizeAsNumber(som.ui.bottomBarPanel.image.barTools.width) * uiScaleFactor,
              height: this.getSizeAsNumber(som.ui.bottomBarPanel.image.barTools.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.barTools,
              texture: { src: 'assets/models/textures/new_ui_1024.png' }
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
                width: this.getSizeAsNumber(som.ui.resourceIcons.image.ToolIcon.width) * uiScaleFactor,
                height: this.getSizeAsNumber(som.ui.resourceIcons.image.ToolIcon.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.toolIcon,
                texture: { src: 'assets/models/textures/resources_atlas_1024.png' }
              }}
            />
            {/* Tool Button */}
            <UiEntity
              uiTransform={{
                position: { top: '0%', right: '3%' },
                positionType: 'absolute',
                width: this.getSizeAsNumber(som.ui.bottomBarPanel.image.toolBtn.width) * uiScaleFactor,
                height: this.getSizeAsNumber(som.ui.bottomBarPanel.image.toolBtn.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.toolBtn,
                texture: { src: 'assets/models/textures/new_ui_1024.png' }
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
              width: this.getSizeAsNumber(som.ui.bottomBarPanel.image.barLeft.width) * uiScaleFactor,
              height: this.getSizeAsNumber(som.ui.bottomBarPanel.image.barLeft.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.barLeft,
              texture: { src: 'assets/models/textures/new_ui_1024.png' }
            }}
          >
            {/* Coin Icon */}
            <UiEntity
              uiTransform={{
                position: { bottom: '12%', left: '14%' },
                positionType: 'absolute',
                width: this.getSizeAsNumber(som.ui.resourceIcons.image.WC.width) * uiScaleFactor,
                height: this.getSizeAsNumber(som.ui.resourceIcons.image.WC.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.coinIcon,
                texture: { src: 'assets/models/textures/resources_atlas_1024.png' }
              }}
            />
            {/* Coin Text */}
            <UiEntity
              uiTransform={{
                position: { bottom: '14%', left: '43%' },
                positionType: 'absolute',
                width: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.coinsTxt.width) * uiScaleFactor,
                height: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.coinsTxt.height) * uiScaleFactor
              }}
            >
              <Label
                uiTransform={{
                  width: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.coinsTxt.width) * uiScaleFactor,
                  height: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.coinsTxt.height) * uiScaleFactor
                }}
                value={`<b>${this.coinsTxt}</b>`}
                fontSize={this.getSizeAsNumber(som.ui.bottomBarPanel.textField.coinsTxt.fontSize) * uiScaleFactor}
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
              width: this.getSizeAsNumber(som.ui.bottomBarPanel.image.barCenter.width) * uiScaleFactor,
              height: this.getSizeAsNumber(som.ui.bottomBarPanel.image.barCenter.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.barCenter,
              texture: { src: 'assets/models/textures/new_ui_1024.png' }
            }}
          >
            {/* Gem Icon */}
            <UiEntity
              uiTransform={{
                position: { bottom: '12%', left: '0%' },
                positionType: 'absolute',
                width: this.getSizeAsNumber(som.ui.resourceIcons.image.WG.width) * uiScaleFactor,
                height: this.getSizeAsNumber(som.ui.resourceIcons.image.WG.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.gemIcon,
                texture: { src: 'assets/models/textures/resources_atlas_1024.png' }
              }}
            />
            {/* Gem Text */}
            <UiEntity
              uiTransform={{
                position: { bottom: '14%', left: '35%' },
                positionType: 'absolute',
                width: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.gemsTxt.width) * uiScaleFactor,
                height: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.gemsTxt.height) * uiScaleFactor
              }}
            >
              <Label
                uiTransform={{
                  width: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.gemsTxt.width) * uiScaleFactor,
                  height: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.gemsTxt.height) * uiScaleFactor
                }}
                value={`<b>${this.gemsTxt}</b>`}
                fontSize={this.getSizeAsNumber(som.ui.bottomBarPanel.textField.gemsTxt.fontSize) * uiScaleFactor}
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
              width: this.getSizeAsNumber(som.ui.bottomBarPanel.image.barRight.width) * uiScaleFactor,
              height: this.getSizeAsNumber(som.ui.bottomBarPanel.image.barRight.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.barRight,
              texture: { src: 'assets/models/textures/new_ui_1024.png' }
            }}
          >
            {/* Inventory */}
            <UiEntity
              uiTransform={{
                position: { bottom: '0%', left: '0%' },
                positionType: 'absolute',
                width: this.getSizeAsNumber(som.ui.bottomBarPanel.image.inventoryBtn.width) * uiScaleFactor,
                height: this.getSizeAsNumber(som.ui.bottomBarPanel.image.inventoryBtn.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.inventoryBtn,
                texture: { src: 'assets/models/textures/new_ui_1024.png' }
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
                width: this.getSizeAsNumber(som.ui.bottomBarPanel.image.progBarBg.width) * uiScaleFactor,
                height: this.getSizeAsNumber(som.ui.bottomBarPanel.image.progBarBg.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.progBarBg,
                texture: { src: 'assets/models/textures/new_ui_1024.png' }
              }}
            >
              {/* Progress Bar */}
              <UiEntity
                uiTransform={{
                  position: { top: '22%', left: this.progBar_positionX },
                  positionType: 'absolute',
                  width: this.getSizeAsNumber(som.ui.bottomBarPanel.image.progBar.width) * uiScaleFactor,
                  height: this.getSizeAsNumber(som.ui.bottomBarPanel.image.progBar.height) * uiScaleFactor
                }}
                uiBackground={{
                  textureMode: 'stretch',
                  uvs: this.progBar,
                  texture: { src: 'assets/models/textures/new_ui_1024.png' }
                }}
              />
            </UiEntity>
            {/* Level Circle */}
            <UiEntity
              uiTransform={{
                position: { bottom: '5%', left: '40%' },
                positionType: 'absolute',
                width: this.getSizeAsNumber(som.ui.bottomBarPanel.image.levelCircle.width) * uiScaleFactor,
                height: this.getSizeAsNumber(som.ui.bottomBarPanel.image.levelCircle.height) * uiScaleFactor
              }}
              uiBackground={{
                textureMode: 'stretch',
                uvs: this.levelCircle,
                texture: { src: 'assets/models/textures/new_ui_1024.png' }
              }}
            >
              <Label
                uiTransform={{
                  position: { top: '10%', left: '8%' },
                  positionType: 'absolute',
                  width: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.levelTxt.width) * uiScaleFactor,
                  height: this.getSizeAsNumber(som.ui.bottomBarPanel.textField.levelTxt.height) * uiScaleFactor
                }}
                value={`<b>${this.levelTxt}</b>`}
                fontSize={this.getSizeAsNumber(som.ui.bottomBarPanel.textField.levelTxt.fontSize) * uiScaleFactor}
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

  getSizeAsNumber(size: string | undefined): number {
    return size != null ? parseInt(size, 10) : 0
  }
}
