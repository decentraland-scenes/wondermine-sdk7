/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { engine, UiCanvasInformation, type Entity } from '@dcl/sdk/ecs'
import { type IGameUi } from './igameui'
import { SoundManager } from 'shared-dcl/src/sound/soundmanager'
import { som } from 'src/som'
import { getSizeAsNumber, getUvs } from './utils/utils'
import { type IconValue } from './uibottombarpanel'
import { PopupWindowType } from 'src/enums'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'

/**
 * A UI layer with a central popup window plus OK, Close and Cancel buttons.
 */
export class UiPopupPanel {
  public mainPanel_visible: boolean = false
  public mainPanel_positionY: number = 0
  public parentUi: IGameUi
  public entity: Entity | null = null
  public atlas: string = ''
  public resourceAtlas: string = ''
  public windowBg: number[] = []
  public splashImage: number[] = []
  public arrowUpImage: number[] = []
  public wearablesImage: number[] = []
  public headerTextImage: number[] = []
  public subheadTextImage: number[] = []
  public closeBtnImage: number[] = []
  public messageTxt: string = ''
  public iconBadges: number[][] = []
  public iconImages: number[][] = []
  public iconValues: IconValue[] = []
  public splashImage_visible: boolean = false
  public arrowUpImage_visible: boolean = false
  public wearablesImage_visible: boolean = false
  public currentType: PopupWindowType = PopupWindowType.Mined
  private readonly hiddenY: number = -980
  private readonly visibleY: number = 80
  constructor(ui: IGameUi) {
    this.parentUi = ui
    this.init()
    this.entity = engine.addEntity()
    SoundManager.attachSoundFile(this.entity, 'levelup', 'LevelUpSoundEffect.mp3')
  }

  init(): void {
    this.atlas = this.parentUi.getUiAtlas()
    this.resourceAtlas = this.parentUi.getResourceAtlas()

    this.mainPanel_visible = true

    this.addWindowBg()
    this.addTitles()
    this.addButtons()
    this.messageTxt = som.ui.popupPanel.textField.message
    this.addPrizeList()
  }

  addWindowBg(): void {
    this.windowBg = getUvs(som.ui.popupPanel.image.windowBg, { x: 1024, y: 1024 })
    this.splashImage = getUvs(som.ui.popupPanel.image.splashImage, { x: 1024, y: 1024 })
    this.arrowUpImage = getUvs(som.ui.popupPanel.image.arrowUpImage, { x: 1024, y: 1024 })
    this.wearablesImage = getUvs(som.ui.popupPanel.image.wearablesImage, { x: 1024, y: 1024 })
  }

  addTitles(): void {
    this.headerTextImage = getUvs(som.ui.popupPanel.image.meteorMined, { x: 1024, y: 1024 })
    this.subheadTextImage = getUvs(som.ui.popupPanel.image.youGotLoot, { x: 1024, y: 1024 })
  }

  addButtons(): void {
    this.closeBtnImage = getUvs(som.ui.popupPanel.image.closeBtn, { x: 1024, y: 1024 })
  }

  addPrizeList(): void {
    this.iconBadges.push(getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }))
    this.iconBadges.push(getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }))
    this.iconBadges.push(getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }))
    this.iconBadges.push(getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }))

    this.iconImages.push(getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }))
    this.iconImages.push(getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }))
    this.iconImages.push(getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }))
    this.iconImages.push(getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }))

    this.iconValues.push(som.ui.bottomBarPanel.textField.invItemTxt)
    this.iconValues.push(som.ui.bottomBarPanel.textField.invItemTxt)
    this.iconValues.push(som.ui.bottomBarPanel.textField.invItemTxt)
    this.iconValues.push(som.ui.bottomBarPanel.textField.invItemTxt)
  }

  setType(type: PopupWindowType, itemId: string | null = null): void {
    console.log('>>>>>>>>>> setType(' + type + ', ' + itemId + ')')
    switch (type) {
      case PopupWindowType.LevelUp:
        this.splashImage_visible = false
        this.arrowUpImage_visible = true
        this.wearablesImage_visible = false

        this.headerTextImage = getUvs(som.ui.popupPanel.image.levelUp, { x: 1024, y: 1024 })
        this.subheadTextImage = getUvs(som.ui.popupPanel.image.youGotLoot, { x: 1024, y: 1024 })

        if (this.entity != null) {
          SoundManager.playOnce(this.entity, 0.9)
        }

        break

      case PopupWindowType.SharedBonus:
        this.splashImage_visible = true
        this.arrowUpImage_visible = false
        this.wearablesImage_visible = false

        this.headerTextImage = getUvs(som.ui.popupPanel.image.meteorMined, { x: 1024, y: 1024 })
        this.subheadTextImage = getUvs(som.ui.popupPanel.image.yourShare, { x: 1024, y: 1024 })
        if (this.entity != null) {
          SoundManager.playOnce(this.entity, 0.8)
        }
        break

      case PopupWindowType.Mined:
      case PopupWindowType.MinedShared:
        this.splashImage_visible = true
        this.arrowUpImage_visible = false
        this.wearablesImage_visible = false

        this.headerTextImage = getUvs(som.ui.popupPanel.image.meteorMined, { x: 1024, y: 1024 })
        this.subheadTextImage = getUvs(som.ui.popupPanel.image.youGotLoot, { x: 1024, y: 1024 })
        break

      case PopupWindowType.Crafted:
        this.splashImage_visible = false
        this.arrowUpImage_visible = false
        this.wearablesImage_visible = true

        // if (itemId == null)
        // {
        //     this.parentUi.updateImageFromAtlas(this.wearablesImage, som.ui.popupPanel.image.wearablesImage);
        // }
        // else
        // {
        //     log("loading image for " + itemId);
        //     let uiImageObj = som.ui.resourceIcons.image[itemId];
        //     this.parentUi.updateImageFromAtlas(this.wearablesImage, uiImageObj);
        // }

        this.headerTextImage = getUvs(som.ui.popupPanel.image.crafted, { x: 1024, y: 1024 })
        this.subheadTextImage = getUvs(som.ui.popupPanel.image.readyToMint, { x: 1024, y: 1024 })
        break

      case PopupWindowType.CraftError:
        this.splashImage_visible = false
        this.arrowUpImage_visible = false
        this.wearablesImage_visible = true

        this.headerTextImage = getUvs(som.ui.popupPanel.image.crafted, { x: 1024, y: 1024 })
        this.subheadTextImage = getUvs(som.ui.popupPanel.image.problem, { x: 1024, y: 1024 })
        break
    }
    this.currentType = type
  }

  showText(_text: string): void {
    this.messageTxt = _text
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  showRewards(itemArray: Object[]): void {}

  clearRewards(): void {}

  show(): void {
    this.mainPanel_visible = true
    // log("blocker mainPanel=" + this.mainPanel.isPointerBlocker + ", canvas=" + this.canvas.isPointerBlocker);
  }

  moveIntoView(millis: number = 7000, closePopupCallback: () => void): void {
    // log("moveIntoView(" + millis + ")");
    this.mainPanel_positionY = this.visibleY

    // HACK: removed the delay because "this" was not being resolved correctly
    // this.entity.addComponentOrReplace(new Delay(millis, closePopupCallback));
    // this.entity.addComponentOrReplace(new Delay(millis, () => {
    //     //log("closePopup");
    //     this.parentUi.closePopup();
    // }));
  }

  hide(): void {
    // log("PopupUI hide()");
    this.mainPanel_visible = false
    this.mainPanel_positionY = this.hiddenY
    // log("blocker mainPanel=" + this.mainPanel.isPointerBlocker + ", canvas=" + this.canvas.isPointerBlocker);
  }

  renderUI(): ReactEcs.JSX.Element {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    const uiScaleFactor = (Math.min(canvasInfo.width, canvasInfo.height) / 1080) * 1.2
    return (
      <UiEntity
        uiTransform={{
          flexDirection: 'column',
          width: canvasInfo.width,
          height: canvasInfo.height,
          justifyContent: 'center',
          alignItems: 'center',
          display: this.mainPanel_visible ? 'flex' : 'none'
        }}
      >
        {/* Window Bg */}
        <UiEntity
          uiTransform={{
            positionType: 'absolute',
            width: getSizeAsNumber(som.ui.popupPanel.image.windowBg.width) * uiScaleFactor,
            height: getSizeAsNumber(som.ui.popupPanel.image.windowBg.height) * uiScaleFactor
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: this.windowBg,
            texture: { src: this.atlas }
          }}
        >
          {/* Splash Image */}
          <UiEntity
            uiTransform={{
              position: { top: '16%', left: '15%' },
              positionType: 'absolute',
              width: getSizeAsNumber(som.ui.popupPanel.image.splashImage.width) * uiScaleFactor,
              height: getSizeAsNumber(som.ui.popupPanel.image.splashImage.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.splashImage,
              texture: { src: this.atlas }
            }}
          />
          {/* Header Text Image */}
          <UiEntity
            uiTransform={{
              position: { top: '11%', left: '18%' },
              positionType: 'absolute',
              width: getSizeAsNumber(som.ui.popupPanel.image.meteorMined.width) * uiScaleFactor,
              height: getSizeAsNumber(som.ui.popupPanel.image.meteorMined.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.headerTextImage,
              texture: { src: this.atlas }
            }}
          />
          {/* Header Text Image */}
          <UiEntity
            uiTransform={{
              position: { top: '24%', left: '21%' },
              positionType: 'absolute',
              width: getSizeAsNumber(som.ui.popupPanel.image.youGotLoot.width) * uiScaleFactor,
              height: getSizeAsNumber(som.ui.popupPanel.image.youGotLoot.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.subheadTextImage,
              texture: { src: this.atlas }
            }}
          />
          {/* Close Button */}
          <UiEntity
            uiTransform={{
              position: { top: '5%', right: '5%' },
              positionType: 'absolute',
              width: getSizeAsNumber(som.ui.popupPanel.image.closeBtn.width) * uiScaleFactor,
              height: getSizeAsNumber(som.ui.popupPanel.image.closeBtn.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.closeBtnImage,
              texture: { src: this.atlas }
            }}
            onMouseDown={() => {
              this.parentUi.closePopup()
            }}
          />
          {/* invStack01 */}
          <UiEntity
            uiTransform={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '33%',
              padding: '6px',
              margin: { bottom: '0px', left: '0px' }
            }}
          />
        </UiEntity>
      </UiEntity>
    )
  }
}
