import { type PopupWindowType } from 'src/enums'
import { type IGameUi } from './igameui'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { UiBottomBarPanel } from './uibottombarpanel'
import Canvas from './canvas/Canvas'

export class GameUi implements IGameUi {
  static instance: GameUi | null = null
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public bottomBarPanel: UiBottomBarPanel = new UiBottomBarPanel(this)

  constructor() {
    this.init = () => {}
    this.changeAxeIcon = (_ItemInfo: any) => {}
    this.closeAlert = () => {}
    this.closePopup = () => {}
    this.getInstance = () => this
    this.showAlert = (_type: PopupWindowType) => {}
    this.showBalances = (_coins: number, _gems: number) => {}
    this.showBonus = () => {}
    this.showTimedMessage = (_text: string, _millis?: number) => {}
    this.updateInventory = () => {}
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

  setLevel(level:number, xp:number):void
  {
      this.bottomBarPanel.setLevel(level, xp);
  }

  showLevel(level:number, pct:number):void
  {
      this.bottomBarPanel.showLevel(level, pct);
  }

  init: () => void
  changeAxeIcon: (ItemInfo: any) => void
  closeAlert: () => void
  closePopup: () => void
  getInstance: () => IGameUi
  showAlert: (_type: PopupWindowType) => void
  showBalances: (coins: number, gems: number) => void
  showBonus: () => void
  showTimedMessage: (_text: string, _millis?: number) => void
  updateInventory: () => void
}
