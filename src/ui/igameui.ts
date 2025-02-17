import { type PopupWindowType } from 'src/enums'

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
  showBonus: () => void
  showTimedMessage: (_text: string, _millis?: number) => void
  updateInventory: () => void
  getResourceAtlas: () => string
  getUiAtlas: () => string
}
