import { type PopupWindowType } from 'src/enums'
import { type IGameUi } from './igameui'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { UiBottomBarPanel } from './uibottombarpanel'
import Canvas from './canvas/Canvas'
import { som } from 'src/som'
import { type ItemInfo } from 'shared-dcl/src/playfab/iteminfo'

export class GameUi implements IGameUi {
  static instance: GameUi | null = null
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public bottomBarPanel: UiBottomBarPanel = new UiBottomBarPanel(this)
  public uiAtlas: string | null = null
  public resourceAtlas: string | null = null
  constructor() {
    this.init = () => {}
    this.closeAlert = () => {}
    this.closePopup = () => {}
    this.getInstance = () => this
    this.showAlert = (_type: PopupWindowType) => {}
    this.showBalances = (_coins: number, _gems: number) => {}
    this.showBonus = () => {}
    this.showTimedMessage = (_text: string, _millis?: number) => {}
    ReactEcsRenderer.setUiRenderer(this.render.bind(this))
  }

  static create(): GameUi {
    if (GameUi.instance == null) {
      GameUi.instance = new GameUi()
    }
    return GameUi.instance
  }

  render(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    return (
      <UiEntity>
        <Canvas>{this.bottomBarPanel.renderUI()}</Canvas>
      </UiEntity>
    )
  }

  showInventoryPopup(): void {
    this.bottomBarPanel.toggleInventory()
  }

  setLevel(level: number, xp: number): void {
    this.bottomBarPanel.setLevel(level, xp)
  }

  showLevel(level: number, pct: number): void {
    this.bottomBarPanel.showLevel(level, pct)
  }

  // --- BOTTOM BAR ---
  showBalances(coins: number, gems: number): void {
    this.bottomBarPanel.showBalances(coins, gems)
  }

  getUiAtlas(): string {
    if (this.uiAtlas == null) {
      const atlasFile = 'assets/models/textures/' + som.ui.popupPanel.atlasFile
      // log("loading atlas file: " + atlasFile);
      this.uiAtlas = atlasFile
    }
    return this.uiAtlas
  }

  getResourceAtlas(): string {
    if (this.resourceAtlas == null) {
      const atlasFile = 'assets/models/textures/' + som.ui.resourceIcons.atlasFile
      // log("loading resource atlas file: " + atlasFile);
      this.resourceAtlas = atlasFile
    }
    return this.resourceAtlas
  }

  init: () => void
  changeAxeIcon(itemData: ItemInfo): void {
    if (this.bottomBarPanel != null) {
      this.bottomBarPanel.changeAxeIcon(itemData)
    }
  }

  closeAlert: () => void
  closePopup: () => void
  getInstance: () => IGameUi
  showAlert: (_type: PopupWindowType) => void
  showBonus: () => void
  showTimedMessage: (_text: string, _millis?: number) => void

  updateInventory(): void {
    this.bottomBarPanel.updateInventory()
  }

  closeInventoryPopup():void
  {
      this.bottomBarPanel.closeInventory();
  }
}
