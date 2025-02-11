import { type UiImageData, type UiTextData } from '../projectdata'
import { type PopupWindowType } from '../enums'
import { type AvatarTexture, type Font, type Texture } from '@dcl/sdk/ecs'
import { type Color4 } from '~system/EngineApi'
import { type UIContainerStack } from './uitypes/uicontainerstack'

export type IGameUi = {
  init: () => void
  addRow: (
    _parent: UIShape,
    _color?: Color4,
    _width?: string,
    _height?: string,
    _hAlign?: string,
    _vAlign?: string
  ) => UIContainerStack
  addRowOverlay: (
    _parent: UIShape,
    _color?: Color4,
    _width?: string,
    _height?: string,
    posX?: number,
    posY?: number
  ) => UIContainerStack
  addStack: (
    _parent: UIShape,
    _color?: Color4,
    _width?: string,
    _height?: string,
    _hAlign?: string,
    _vAlign?: string
  ) => UIContainerStack
  addStackOverlay: (
    _parent: UIShape,
    _color?: Color4,
    _width?: string,
    _height?: string,
    posX?: number,
    posY?: number
  ) => UIContainerStack
  addTextField: (
    _parent: UIShape,
    _fontSize?: number,
    _color?: Color4,
    _width?: string,
    _height?: string,
    _hAlign?: string,
    _vAlign?: string,
    _bold?: boolean
  ) => UIText
  changeAxeIcon: (ItemInfo: string) => void
  closeAlert: () => void
  closePopup: () => void
  getInstance: () => IGameUi
  getResourceAtlas: () => Texture
  getUiAtlas: () => Texture
  loadImageFromAtlas: (panel: UIContainerStack, atlas: Texture, data: UiImageData) => UIImage
  loadTextField: (panel: UIContainerStack, data: UiTextData) => UIText
  setLevel: (level: number, xp: number) => void
  showAlert: (_type: PopupWindowType) => void
  showBalances: (coins: number, gems: number) => void
  showInventoryPopup: () => void
  showBonus: () => void
  showTimedMessage: (_text: string, _millis?: number) => void
  updateImageFromAtlas: (img: UIImage, data: UiImageData) => void
  updateInventory: () => void
}

export declare abstract class UIShape {
  /**
   * Defines if the entity and its children should be rendered
   */
  name: string | null
  visible: boolean
  opacity: number
  hAlign: string
  vAlign: string
  width: string | number
  height: string | number
  positionX: string | number
  positionY: string | number
  isPointerBlocker: boolean
  private readonly _parent?
  constructor(parent: UIShape | null)
  get parent(): UIShape | undefined
}
declare class UIImage extends UIShape {
  sourceLeft: number
  sourceTop: number
  sourceWidth: number
  sourceHeight: number
  source?: Texture | AvatarTexture
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
  sizeInPixels: boolean
  constructor(parent: UIShape, source: Texture | AvatarTexture)
}

declare class UIText extends UIShape {
  outlineWidth: number
  outlineColor: Color4
  color: Color4
  fontSize: number
  fontAutoSize: boolean
  font?: Font
  value: string
  lineSpacing: number
  lineCount: number
  adaptWidth: boolean
  adaptHeight: boolean
  textWrapping: boolean
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number
  shadowColor: Color4
  hTextAlign: string
  vTextAlign: string
  paddingTop: number
  paddingRight: number
  paddingBottom: number
  paddingLeft: number
}
