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

/**
 * A UI layer with a bottom bar display and inventory popup menu
 */
export class UiBottomBarPanel {
  mainPanel_visible: boolean = false
  barLeft: number[] = []
  barCenter: number[] = []
  barRight: number[] = []
  barTools: number[] = []
  toolIcon: number[] = []
  toolBtn: number[] = []
  coinIcon: number[] = []
  gemIcon: number[] = []
  inventoryBtn: number[] = []
  coinsTxt: string = ''
  gemsTxt: string = ''
  toolTxt: string = 'Crescent Lava Pickaxe #333\nRemaining: 400'
  public isToolTxtVisible: boolean = false
  inventoryPopup_visible: boolean = false
  constructor() {
    this.init()
  }

  init(): void {
    this.addBottomBar()
    this.addDisplayRow()
    this.showBalances(0, 0)
  }

  addBottomBar(): void {
    this.barLeft = getUvs(som.ui.bottomBarPanel.image.barLeft, { x: 1024, y: 1024 })
    this.barCenter = getUvs(som.ui.bottomBarPanel.image.barCenter, { x: 1024, y: 1024 })
    this.barRight = getUvs(som.ui.bottomBarPanel.image.barRight, { x: 1024, y: 1024 })
    this.barTools = getUvs(som.ui.bottomBarPanel.image.barTools, { x: 1024, y: 1024 })
    this.toolIcon = getUvs(som.ui.resourceIcons.image.ToolIcon, { x: 1024, y: 1024 })
    this.toolBtn = getUvs(som.ui.bottomBarPanel.image.toolBtn, { x: 1024, y: 1024 })
  }

  addDisplayRow(): void {
    this.coinIcon = getUvs(som.ui.resourceIcons.image.WC, { x: 1024, y: 1024 })
    this.gemIcon = getUvs(som.ui.resourceIcons.image.WG, { x: 1024, y: 1024 })
    this.inventoryBtn = getUvs(som.ui.bottomBarPanel.image.inventoryBtn, { x: 1024, y: 1024 })
    this.addLevelBar()
  }

  addLevelBar(): void {}

  renderUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'row',
          width: canvasInfo.height * 0.9,
          height: canvasInfo.height * 0.5,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          positionType: 'absolute',
          position: { bottom: '0%', right: '0%' }
        }}
        // uiBackground={{
        //   color: {r:1,g:1,b:1,a:1}
        // }}
      >
        {/* Tool Text */}
        <UiEntity
          uiTransform={{
            position: { bottom: '2%', right: '0%' },
            width: som.ui.bottomBarPanel.textField.toolTxt.width,
            height: som.ui.bottomBarPanel.textField.toolTxt.height,
            positionType: 'relative',
            display: this.isToolTxtVisible ? 'flex' : 'none'
          }}
        >
          <Label
            uiTransform={{
              width: som.ui.bottomBarPanel.textField.toolTxt.width,
              height: som.ui.bottomBarPanel.textField.toolTxt.height
            }}
            value={`<b>${this.toolTxt}</b>`}
            fontSize={som.ui.bottomBarPanel.textField.toolTxt.fontSize}
            textAlign="middle-right"
            font="sans-serif"
            color={Color4.fromHexString(som.ui.bottomBarPanel.textField.toolTxt.hexColor)}
          />
        </UiEntity>
        {/* Bar Tools */}
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            position: { top: '1%', right: '0%' },
            positionType: 'relative',
            width: som.ui.bottomBarPanel.image.barTools.width,
            height: som.ui.bottomBarPanel.image.barTools.height
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
              width: som.ui.resourceIcons.image.ToolIcon.width,
              height: som.ui.resourceIcons.image.ToolIcon.height
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
              width: som.ui.bottomBarPanel.image.toolBtn.width,
              height: som.ui.bottomBarPanel.image.toolBtn.height
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
            width: som.ui.bottomBarPanel.image.barLeft.width,
            height: som.ui.bottomBarPanel.image.barLeft.height
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
              width: som.ui.resourceIcons.image.WC.width,
              height: som.ui.resourceIcons.image.WC.height
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
              width: som.ui.bottomBarPanel.textField.coinsTxt.width,
              height: som.ui.bottomBarPanel.textField.coinsTxt.height
            }}
          >
            <Label
              uiTransform={{
                width: som.ui.bottomBarPanel.textField.coinsTxt.width,
                height: som.ui.bottomBarPanel.textField.coinsTxt.height
              }}
              value={`<b>${this.coinsTxt}</b>`}
              fontSize={som.ui.bottomBarPanel.textField.coinsTxt.fontSize}
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
            width: som.ui.bottomBarPanel.image.barCenter.width,
            height: som.ui.bottomBarPanel.image.barCenter.height
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
              width: som.ui.resourceIcons.image.WG.width,
              height: som.ui.resourceIcons.image.WG.height
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
              width: som.ui.bottomBarPanel.textField.gemsTxt.width,
              height: som.ui.bottomBarPanel.textField.gemsTxt.height
            }}
          >
            <Label
              uiTransform={{
                width: som.ui.bottomBarPanel.textField.gemsTxt.width,
                height: som.ui.bottomBarPanel.textField.gemsTxt.height
              }}
              value={`<b>${this.gemsTxt}</b>`}
              fontSize={som.ui.bottomBarPanel.textField.gemsTxt.fontSize}
              textAlign="middle-left"
              font="sans-serif"
              color={Color4.fromHexString(som.ui.bottomBarPanel.textField.gemsTxt.hexColor)}
            />
          </UiEntity>
        </UiEntity>
        {/* Bar Right */}
        <UiEntity
          uiTransform={{
            positionType: 'relative',
            width: som.ui.bottomBarPanel.image.barRight.width,
            height: som.ui.bottomBarPanel.image.barRight.height
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
              width: som.ui.bottomBarPanel.image.inventoryBtn.width,
              height: som.ui.bottomBarPanel.image.inventoryBtn.height
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.inventoryBtn,
              texture: { src: 'assets/models/textures/new_ui_1024.png' }
            }}
            onMouseDown={() => {
              // this.parentUi.showInventoryPopup();
              this.toggleInventory()
            }}
          />
        </UiEntity>
      </UiEntity>
    )
  }

  showBalances(coins: number, gems: number): void {
    this.coinsTxt = coins.toString()
    this.gemsTxt = gems.toString()
  }

  showToolText(showIt: boolean): void {
    this.isToolTxtVisible = showIt
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
}
