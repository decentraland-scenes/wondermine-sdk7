/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { engine, UiCanvasInformation, type Entity } from '@dcl/sdk/ecs'
import { type UIImage, type IGameUi, type UIText } from './igameui'
import { SoundManager } from 'shared-dcl/src/sound/soundmanager'
import { som } from 'src/som'
import { getSizeAsNumber, getSizeAsText, getUvs, trimLeadingSpaces } from './utils/utils'
import { PopupWindowType } from 'src/enums'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { DclUser } from 'shared-dcl/src/playfab/dcluser'
import { type UiImageData } from 'src/projectdata'
import { Color4 } from '@dcl/sdk/math'

/**
 * A UI layer with a central popup window plus OK, Close and Cancel buttons.
 */

export type Item = {
  ItemId: string
  ItemClass: string
  DisplayName: string
  IsBonus: boolean
}

export class UiPopupPanel {
  public mainPanel_visible: boolean = false
  public mainPanel_positionY: number = 0
  public parentUi: IGameUi
  public entity: Entity | null = null
  public atlas: string = ''
  public resourceAtlas: string = ''
  public windowBg: UIImage = { uvs: [], som: null, atlas: '' }
  public splashImage: UIImage = { uvs: [], som: null, atlas: '' }
  public arrowUpImage: UIImage = { uvs: [], som: null, atlas: '' }
  public wearablesImage: UIImage = { uvs: [], som: null, atlas: '' }
  public headerTextImage: UIImage = { uvs: [], som: null, atlas: '' }
  public subheadTextImage: UIImage = { uvs: [], som: null, atlas: '' }
  public closeBtnImage: UIImage = { uvs: [], som: null, atlas: '' }
  public messageTxt: UIText = { som: '', value: '' }
  public iconBadges: UIImage[] = []
  public iconImages: UIImage[] = []
  public iconValues: UIText[] = []
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

    this.addWindowBg()
    this.addTitles()
    this.addButtons()
    this.messageTxt = this.parentUi.loadTextField(som.ui.popupPanel.textField.message, '')
    this.addPrizeList()
  }

  addWindowBg(): void {
    this.windowBg = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.popupPanel.image.windowBg, { x: 1024, y: 1024 }),
      som.ui.popupPanel.image.windowBg,
      this.atlas
    )
    this.splashImage = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.popupPanel.image.splashImage, { x: 1024, y: 1024 }),
      som.ui.popupPanel.image.splashImage,
      this.atlas
    )
    this.arrowUpImage = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.popupPanel.image.arrowUpImage, { x: 1024, y: 1024 }),
      som.ui.popupPanel.image.arrowUpImage,
      this.atlas
    )
    this.wearablesImage = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.popupPanel.image.wearablesImage, { x: 1024, y: 1024 }),
      som.ui.popupPanel.image.wearablesImage,
      this.atlas
    )
  }

  addTitles(): void {
    this.headerTextImage = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.popupPanel.image.meteorMined, { x: 1024, y: 1024 }),
      som.ui.popupPanel.image.meteorMined,
      this.atlas
    )
    this.subheadTextImage = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.popupPanel.image.youGotLoot, { x: 1024, y: 1024 }),
      som.ui.popupPanel.image.youGotLoot,
      this.atlas
    )
  }

  addButtons(): void {
    this.closeBtnImage = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.popupPanel.image.closeBtn, { x: 1024, y: 1024 }),
      som.ui.popupPanel.image.closeBtn,
      this.atlas
    )
  }

  addPrizeList(): void {
    this.iconBadges.push(
      this.parentUi.loadImageFromAtlas(
        getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }),
        som.ui.resourceIcons.image.Empty,
        this.resourceAtlas
      )
    )
    this.iconBadges.push(
      this.parentUi.loadImageFromAtlas(
        getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }),
        som.ui.resourceIcons.image.Empty,
        this.resourceAtlas
      )
    )
    this.iconBadges.push(
      this.parentUi.loadImageFromAtlas(
        getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }),
        som.ui.resourceIcons.image.Empty,
        this.resourceAtlas
      )
    )
    this.iconBadges.push(
      this.parentUi.loadImageFromAtlas(
        getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }),
        som.ui.resourceIcons.image.Empty,
        this.resourceAtlas
      )
    )

    this.iconImages.push(
      this.parentUi.loadImageFromAtlas(
        getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }),
        som.ui.resourceIcons.image.Empty,
        this.resourceAtlas
      )
    )
    this.iconImages.push(
      this.parentUi.loadImageFromAtlas(
        getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }),
        som.ui.resourceIcons.image.Empty,
        this.resourceAtlas
      )
    )
    this.iconImages.push(
      this.parentUi.loadImageFromAtlas(
        getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }),
        som.ui.resourceIcons.image.Empty,
        this.resourceAtlas
      )
    )
    this.iconImages.push(
      this.parentUi.loadImageFromAtlas(
        getUvs(som.ui.resourceIcons.image.Empty, { x: 1024, y: 1024 }),
        som.ui.resourceIcons.image.Empty,
        this.resourceAtlas
      )
    )

    this.iconValues.push(this.parentUi.loadTextField(som.ui.bottomBarPanel.textField.invItemTxt, ''))
    this.iconValues.push(this.parentUi.loadTextField(som.ui.bottomBarPanel.textField.invItemTxt, ''))
    this.iconValues.push(this.parentUi.loadTextField(som.ui.bottomBarPanel.textField.invItemTxt, ''))
    this.iconValues.push(this.parentUi.loadTextField(som.ui.bottomBarPanel.textField.invItemTxt, ''))
  }

  setType(type: PopupWindowType, itemId: string | null = null): void {
    console.log('>>>>>>>>>> setType(' + type + ', ' + itemId + ')')
    switch (type) {
      case PopupWindowType.LevelUp:
        this.splashImage_visible = false
        this.arrowUpImage_visible = true
        this.wearablesImage_visible = false

        this.headerTextImage = this.parentUi.loadImageFromAtlas(
          getUvs(som.ui.popupPanel.image.levelUp, { x: 1024, y: 1024 }),
          som.ui.popupPanel.image.levelUp,
          this.atlas
        )
        this.subheadTextImage = this.parentUi.loadImageFromAtlas(
          getUvs(som.ui.popupPanel.image.youGotLoot, { x: 1024, y: 1024 }),
          som.ui.popupPanel.image.youGotLoot,
          this.atlas
        )

        if (this.entity != null) {
          SoundManager.playOnce(this.entity, 0.9)
        }

        break

      case PopupWindowType.SharedBonus:
        this.splashImage_visible = true
        this.arrowUpImage_visible = false
        this.wearablesImage_visible = false

        this.headerTextImage = this.parentUi.loadImageFromAtlas(
          getUvs(som.ui.popupPanel.image.meteorMined, { x: 1024, y: 1024 }),
          som.ui.popupPanel.image.meteorMined,
          this.atlas
        )
        this.subheadTextImage = this.parentUi.loadImageFromAtlas(
          getUvs(som.ui.popupPanel.image.yourShare, { x: 1024, y: 1024 }),
          som.ui.popupPanel.image.yourShare,
          this.atlas
        )
        if (this.entity != null) {
          SoundManager.playOnce(this.entity, 0.8)
        }
        break

      case PopupWindowType.Mined:
      case PopupWindowType.MinedShared:
        this.splashImage_visible = true
        this.arrowUpImage_visible = false
        this.wearablesImage_visible = false

        this.headerTextImage = this.parentUi.loadImageFromAtlas(
          getUvs(som.ui.popupPanel.image.meteorMined, { x: 1024, y: 1024 }),
          som.ui.popupPanel.image.meteorMined,
          this.atlas
        )
        this.subheadTextImage = this.parentUi.loadImageFromAtlas(
          getUvs(som.ui.popupPanel.image.youGotLoot, { x: 1024, y: 1024 }),
          som.ui.popupPanel.image.youGotLoot,
          this.atlas
        )
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

        this.headerTextImage = this.parentUi.loadImageFromAtlas(
          getUvs(som.ui.popupPanel.image.crafted, { x: 1024, y: 1024 }),
          som.ui.popupPanel.image.crafted,
          this.atlas
        )
        this.subheadTextImage = this.parentUi.loadImageFromAtlas(
          getUvs(som.ui.popupPanel.image.readyToMint, { x: 1024, y: 1024 }),
          som.ui.popupPanel.image.readyToMint,
          this.atlas
        )
        break

      case PopupWindowType.CraftError:
        this.splashImage_visible = false
        this.arrowUpImage_visible = false
        this.wearablesImage_visible = true

        this.headerTextImage = this.parentUi.loadImageFromAtlas(
          getUvs(som.ui.popupPanel.image.crafted, { x: 1024, y: 1024 }),
          som.ui.popupPanel.image.crafted,
          this.atlas
        )
        this.subheadTextImage = this.parentUi.loadImageFromAtlas(
          getUvs(som.ui.popupPanel.image.problem, { x: 1024, y: 1024 }),
          som.ui.popupPanel.image.problem,
          this.atlas
        )
        break
    }
    this.currentType = type
  }

  showText(_text: string): void {
    this.messageTxt.value = _text
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  showRewards(itemArray: Item[] | null): void {
    // log("showRewards(" + itemArray.length + ")");
    console.log('check item array', itemArray)
    console.log(itemArray, 'item array 1')
    if (itemArray != null) {
      // this.clearRewards();
      let itemId: string
      let itemClass: string
      let displayName: string
      let isBonus: boolean = false

      let rewardIndex: number = -1
      let uiImageObj: any
      let prevBundleType: string
      let showIt = true

      const parentBundleIds: string[] = []
      for (var i: number = 0; i < itemArray.length; i++) {
        // item = this.loader.populate(new ItemInfo(), items[i]);
        itemId = itemArray[i].ItemId
        itemClass = itemArray[i].ItemClass
        displayName = itemArray[i].DisplayName
        isBonus = itemArray[i].IsBonus
        showIt = true
        console.log(itemArray, 'item array 2')
        if (itemClass !== 'meteor' && itemClass !== 'levelup' && rewardIndex < this.iconImages.length) {
          ++rewardIndex
          // log("ITEM " + i + ": " + itemArray[i]["DisplayName"] + " rewardIndex: " + rewardIndex);

          if (itemClass === 'bundle') {
            if (itemId.substring(0, 2) === 'WC') {
              itemId = 'WC'
            } else if (itemId.substring(0, 2) === 'WG') {
              itemId = 'WG'
            } else if (itemId.indexOf('Double') === 0) {
              // assumes Double bundles are all named like DoubleGemDiamond
              itemId = itemId.substring(6)
            }
            parentBundleIds.push(itemId)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            prevBundleType = itemId
          } else if (itemClass === 'currency') {
            if (displayName.indexOf('Coin') > 0) {
              itemId = 'WC'
            } else if (displayName.includes('WonderGem')) {
              itemId = 'WG'
            }
          } else if (itemClass === 'gem' || itemClass === 'metal' || itemClass === 'fabric') {
            // if we just handled the bundle for this, don't include this in the list
            // NOTE: this will cause a problem if we ever include a bundle and a single item of the same itemId
            //  if (prevBundleType == itemId)
            // log("itemId=" + itemId + ", itemClass=" + itemClass + ", indexOf=" + parentBundleIds.indexOf(itemId));
            if (parentBundleIds.includes(itemId)) {
              // should we clear out prevBundleType? That assumes only one kind of item per bundle
              showIt = false
              --rewardIndex
            }
          }

          if (rewardIndex < this.iconImages.length && showIt) {
            // log("rewardIndex=" + rewardIndex + ", itemId=" + itemId + ", itemClass=" + itemClass);
            uiImageObj = som.ui.resourceIcons.image[itemId]
            // remove adjustments, if any
            if (itemId === 'WC' || itemId === 'WG') {
              uiImageObj.positionX = 5
              uiImageObj.positionY = 0
            }
            // log("itemId: " + itemId)
            // log(uiImageObj);
            this.parentUi.updateImageFromAtlas(this.iconImages[rewardIndex], uiImageObj)
            this.iconImages[rewardIndex] = this.parentUi.loadImageFromAtlas(
              getUvs(uiImageObj, { x: 1024, y: 1024 }),
              uiImageObj,
              this.resourceAtlas
            )
            this.iconValues[rewardIndex].value = itemArray[i].DisplayName
            console.log('check here', this.iconValues[rewardIndex].value)
            if (DclUser.activeUser.heldItem != null) {
              if (isBonus && DclUser.activeUser.heldItem.ItemId.length > 0) {
                // log("showing bonus icon", som.ui.resourceIcons.image[DclUser.activeUser.heldItem.ItemId]);
                const toolBadge: UiImageData = {
                  ...som.ui.resourceIcons.image[DclUser.activeUser.heldItem.ItemId], // Ensure all properties are included
                  width: '32px',
                  height: '32px'
                }
                this.parentUi.updateImageFromAtlas(this.iconBadges[rewardIndex], toolBadge)
              } else {
                this.parentUi.updateImageFromAtlas(this.iconBadges[rewardIndex], som.ui.resourceIcons.image.Empty)
              }
            }
          }
        }
      }
      // clear out unused items
      for (let i: number = rewardIndex + 1; i < this.iconImages.length; i++) {
        // log("unused " + i);
        this.parentUi.updateImageFromAtlas(this.iconImages[i], som.ui.resourceIcons.image.Empty)
        this.iconValues[i].value = ''
        this.parentUi.updateImageFromAtlas(this.iconBadges[i], som.ui.resourceIcons.image.Empty)
      }
    }
  }

  clearRewards(): void {
    for (var i: number = 0; i < this.iconImages.length; i++) {
      this.parentUi.updateImageFromAtlas(this.iconImages[i], som.ui.resourceIcons.image.Empty)
      this.iconValues[i].value = ''
      this.parentUi.updateImageFromAtlas(this.iconBadges[i], som.ui.resourceIcons.image.Empty)
    }
  }

  reset(): void {
    this.clearRewards()
    this.messageTxt.value = ''
  }

  hide(): void {
    // log("PopupUI hide()");
    this.mainPanel_visible = false
    this.mainPanel_positionY = this.hiddenY
    // log("blocker mainPanel=" + this.mainPanel.isPointerBlocker + ", canvas=" + this.canvas.isPointerBlocker);
  }

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

  toggle(): void {
    // log("PopupUI toggle()");
    if (this.mainPanel_visible) {
      this.hide()
    } else {
      this.show()
    }
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
            width: getSizeAsNumber(this.windowBg.som.width) * uiScaleFactor,
            height: getSizeAsNumber(this.windowBg.som.height) * uiScaleFactor
          }}
          uiBackground={{
            textureMode: 'stretch',
            uvs: this.windowBg.uvs,
            texture: { src: this.windowBg.atlas }
          }}
        >
          {/* Splash Image */}
          <UiEntity
            uiTransform={{
              position: { top: '16%', left: '15%' },
              positionType: 'absolute',
              width: getSizeAsNumber(this.splashImage.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.splashImage.som.height) * uiScaleFactor,
              display: this.splashImage_visible ? 'flex' : 'none'
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.splashImage.uvs,
              texture: { src: this.splashImage.atlas }
            }}
          />
          {/* Wearables Image */}
          <UiEntity
            uiTransform={{
              position: { top: '34%', left: '30%' },
              positionType: 'absolute',
              width: getSizeAsNumber(this.wearablesImage.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.wearablesImage.som.height) * uiScaleFactor,
              display: this.wearablesImage_visible ? 'flex' : 'none'
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.wearablesImage.uvs,
              texture: { src: this.wearablesImage.atlas }
            }}
          />
          {/* Arrow Up Image */}
          <UiEntity
            uiTransform={{
              position: { top: '34%', left: '30%' },
              positionType: 'absolute',
              width: getSizeAsNumber(this.arrowUpImage.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.arrowUpImage.som.height) * uiScaleFactor,
              display: this.arrowUpImage_visible ? 'flex' : 'none'
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.arrowUpImage.uvs,
              texture: { src: this.arrowUpImage.atlas }
            }}
          />
          {/* Header Text Image */}
          <UiEntity
            uiTransform={{
              position: { top: '11%', left: '18%' },
              positionType: 'absolute',
              width: getSizeAsNumber(this.headerTextImage.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.headerTextImage.som.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.headerTextImage.uvs,
              texture: { src: this.headerTextImage.atlas }
            }}
          />
          {/* Sub Head Text Image */}
          <UiEntity
            uiTransform={{
              position: { top: '24%', left: '21%' },
              positionType: 'absolute',
              width: getSizeAsNumber(this.subheadTextImage.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.subheadTextImage.som.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.subheadTextImage.uvs,
              texture: { src: this.subheadTextImage.atlas }
            }}
          />
          {/* Close Button */}
          <UiEntity
            uiTransform={{
              position: { top: '5%', right: '5%' },
              positionType: 'absolute',
              width: getSizeAsNumber(this.closeBtnImage.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.closeBtnImage.som.height) * uiScaleFactor
            }}
            uiBackground={{
              textureMode: 'stretch',
              uvs: this.closeBtnImage.uvs,
              texture: { src: this.closeBtnImage.atlas }
            }}
            onMouseDown={() => {
              this.parentUi.closePopup()
            }}
          />
          {/* message */}
          <UiEntity
            uiTransform={{
              width: getSizeAsNumber(this.messageTxt.som.width) * uiScaleFactor,
              height: getSizeAsNumber(this.messageTxt.som.height) * uiScaleFactor,
              position: { bottom: '25px', right: '0px' },
              positionType: 'absolute',
              justifyContent: 'center'
            }}
          >
            <Label
              value={`<b>${trimLeadingSpaces(this.messageTxt.value)}</b>`}
              fontSize={getSizeAsNumber(this.messageTxt.som.fontSize) * uiScaleFactor}
              color={Color4.fromHexString(this.messageTxt.som.hexColor)}
              font="sans-serif"
              textWrap="nowrap"
            />
          </UiEntity>

          {/* Inv Stack */}
          <UiEntity
            uiTransform={{
              position: { bottom: '0%', left: '0%' },
              positionType: 'absolute',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              padding: '6px'
            }}
          >
            {this.iconImages.slice(0, 4).map((ImageData, index) => (
              <UiEntity
                key={index} // Using index as the key
                uiTransform={{
                  flexDirection: 'row',
                  padding: '6px',
                  width: '50%',
                  position: { left: '80px', top: '0px' }
                }}
              >
                <UiEntity
                  uiTransform={{
                    width: getSizeAsNumber(ImageData.som.width) * uiScaleFactor, // Using the width from the ImageData
                    height: getSizeAsNumber(ImageData.som.height) * uiScaleFactor, // Using the height from the ImageData
                    margin: { bottom: '0px' }
                  }}
                  uiBackground={{
                    textureMode: 'stretch',
                    uvs: ImageData.uvs, // Using the uvs from the ImageData ImageData.uvs
                    texture: { src: ImageData.atlas } // Using the atlas from the ImageData ImageData.atlas
                  }}
                />
                {/* Label */}
                <UiEntity
                  uiTransform={{
                    width: getSizeAsText(this.iconValues[index].value) * uiScaleFactor,
                    height: getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.height) * uiScaleFactor,
                    margin: { left: '10px' }
                  }}
                >
                  <Label
                    value={`<b>${this.iconValues[index].value}</b>`}
                    fontSize={getSizeAsNumber(som.ui.bottomBarPanel.textField.invItemTxt.fontSize) * uiScaleFactor}
                    color={Color4.fromHexString(som.ui.bottomBarPanel.textField.invItemTxt.hexColor)}
                    font="sans-serif"
                    textWrap="nowrap"
                  />
                </UiEntity>
              </UiEntity>
            ))}
          </UiEntity>
        </UiEntity>
      </UiEntity>
    )
  }
}
