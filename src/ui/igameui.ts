import { type PopupWindowType } from 'src/enums'

export type UIImage = {
  uvs: number[],
  som: any,
  atlas: string
}

export type UIText = {
  som: any,
  value?: string
}

export type IGameUi = {
  init: () => void
  changeAxeIcon: (ItemInfo: any) => void
  closeAlert: () => void
  closePopup: () => void
  getInstance: () => IGameUi
  setLevel: (level: number, xp: number) => void
  showAlert: (_type: PopupWindowType) => void
  showBalances: (coins: number, gems: number) => void
  showInventoryPopup: () => void
  loadImageFromAtlas: (uvs: number[], som: any, atlas: string) => UIImage
  showBonus: () => void
  showTimedMessage: (_text: string, _millis?: number) => void
  updateInventory: () => void
  getResourceAtlas: () => string
  getUiAtlas: () => string
  updateImageFromAtlas: (img: string, data: number[][]) => void
  loadTextField: (som: any, value?: string) => UIText;
}
