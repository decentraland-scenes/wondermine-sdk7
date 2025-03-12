/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { engine, UiCanvasInformation, type Entity } from '@dcl/sdk/ecs'
import { PopupWindowType } from 'src/enums'
import { type IGameUi, type UIImage, type UIText } from './igameui'
import { Color4 } from '@dcl/sdk/math'
import { som } from 'src/som'
import { getUvs } from './utils/utils'
import { ReactEcs } from '@dcl/react-ecs/dist/react-ecs'
import { UiEntity } from '@dcl/sdk/react-ecs'

export class UiAlertPanel {
  public parentUi: IGameUi
  public entity: Entity = engine.addEntity()

  mainPanel_visible: boolean = false

  public atlas: string = ''

  // atlas images
  public windowBg: UIImage = { uvs: [], som: null, atlas: '' }
  public sideImage: UIImage = { uvs: [], som: null, atlas: '' }

  public okBtnImage: UIImage = { uvs: [], som: null, atlas: '' }
  public closeBtnImage: UIImage = { uvs: [], som: null, atlas: '' }

  public titleTxt: UIText = { som: '', value: '' }
  public messageTxt: UIText = { som: '', value: '' }
  public okBtnTxt: UIText = { som: '', value: '' }

  public bgColor: Color4 = Color4.Clear()
  public textColor: Color4 = Color4.Clear()

  public filePrefix: string = '<assets />models/textures/'
  public currentType: PopupWindowType = PopupWindowType.Reconnect

  constructor(ui: IGameUi) {
    this.parentUi = ui
    this.init()

    // the entity only exists so we can attach Delay and sound components to it
    // 2DO: replace this with a non-component timing system
  }

  init(): void {
    this.bgColor = Color4.fromHexString('#88888801')
    this.textColor = Color4.fromHexString('#FFBB00FF')
    this.atlas = this.parentUi.getUiAtlas()
    this.addWindowBg()

    this.titleTxt = this.parentUi.loadTextField(som.ui.alertPanel.textField.title, '')
    this.messageTxt = this.parentUi.loadTextField(som.ui.alertPanel.textField.message, '')

    this.addButtons()
  }

  addButtonRow(): void {
    this.addButtons()
  }

  addWindowBg(): void {
    this.windowBg = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.popupPanel.image.windowBg, { x: 1024, y: 1024 }),
      this.atlas,
      som.ui.popupPanel.image.windowBg
    )
    this.sideImage = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.alertPanel.image.disconnect, { x: 1024, y: 1024 }),
      this.atlas,
      som.ui.alertPanel.image.disconnect
    )
  }

  addButtons(): void {
    this.okBtnImage = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.alertPanel.image.longBtn, { x: 1024, y: 1024 }),
      this.atlas,
      som.ui.alertPanel.image.longBtn
    )
    this.okBtnImage.onClick = () => {
      console.log('clicked on OK button')
      // GameUi.instance.closePopup();
    }

    this.okBtnTxt = this.parentUi.loadTextField(som.ui.alertPanel.textField.okBtn, '')
    this.okBtnTxt.value = 'OK'

    this.closeBtnImage = this.parentUi.loadImageFromAtlas(
      getUvs(som.ui.popupPanel.image.closeBtn, { x: 1024, y: 1024 }),
      this.atlas,
      som.ui.popupPanel.image.closeBtn
    )

    this.closeBtnImage.onClick = () => {
      // eslint-disable-next-line spaced-comment
      //log("clicked on Close button");
      this.parentUi.closeAlert()
    }
  }

  setType(type: PopupWindowType): void {
    console.log('setType(' + type + ')')
    switch (type) {
      case PopupWindowType.Reconnect: {
        this.titleTxt.value = 'Not Connected!'
        this.messageTxt.value =
          "We couldn't connect\nto your wallet.\nYou're playing with a\ntemporary account.\n\nTry again?"
        this.okBtnTxt.value = 'Reconnect'

        this.closeBtnImage.onClick = () => {
          console.log('clicked on Close button')
          this.parentUi.closeAlert()
        }
        this.okBtnImage.onClick = () => {
          console.log('clicked on Reconnect button')
          // GameManager.instance.getCurrentUser();
          this.parentUi.closeAlert()
        }

        // SoundManager.playOnce(this.entity, 0.5);
        break
      }
    }
    this.currentType = type
  }

  showText(_text: string): void {
    this.messageTxt.value = _text
  }

  reset(): void {
    this.messageTxt.value = ''
    this.okBtnTxt.value = ''
    this.titleTxt.value = ''
  }

  hide(): void {
    // log("PopupUI hide()");
    this.mainPanel_visible = false
  }

  show(): void {
    this.mainPanel_visible = true
    // log("blocker mainPanel=" + this.mainPanel.isPointerBlocker + ", canvas=" + this.canvas.isPointerBlocker);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      ></UiEntity>
    )
  }
}
