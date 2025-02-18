import { type PopupWindowType } from 'src/enums'
import { type IGameUi } from './igameui'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import { UiBottomBarPanel } from './uibottombarpanel'
import Canvas from './canvas/Canvas'
import { som } from 'src/som'
import { type ItemInfo } from 'shared-dcl/src/playfab/iteminfo'
import { UiPopupPanel } from './uipopuppanel'
import { ProjectLoader } from 'src/projectloader'
import * as utils from '@dcl-sdk/utils'

export class GameUi implements IGameUi {
  static instance: GameUi | null = null
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public bottomBarPanel: UiBottomBarPanel = new UiBottomBarPanel(this)
  public uiAtlas: string | null = null
  public resourceAtlas: string | null = null
  public popupPanel: UiPopupPanel = new UiPopupPanel(this)
  public loader: ProjectLoader
  public onPopupClosedCallback: (() => void) | undefined
  public showingTimedPopup: boolean = false
  public showingTimedAlert: boolean = false
  constructor() {
    if (ProjectLoader.instance == null) {
      this.loader = new ProjectLoader()
    } else {
      this.loader = ProjectLoader.instance
    }
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
        <Canvas>{this.popupPanel.renderUI()}</Canvas>
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

  updateImageFromAtlas(img: string, data: number[][]): void {
    // this.loader.populate(img, data)
  }

  updateInventory(): void {
    this.bottomBarPanel.updateInventory()
  }

  closeInventoryPopup(): void {
    this.bottomBarPanel.closeInventory()
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  showTimedPopup(
    _type: PopupWindowType,
    _msg: string = '',
    // eslint-disable-next-line @typescript-eslint/ban-types
    _rewards: Object[] | null = null,
    _itemId: string | null = null,
    _millis: number = 8000,
    _callback: () => void
  ): void {
    // log("showTimedPopup");
    this.popupPanel.showText(_msg)
    this.popupPanel.setType(_type, _itemId)

    if (_rewards != null) {
      this.popupPanel.showRewards(_rewards)
    } else {
      this.popupPanel.clearRewards()
    }

    this.popupPanel.show()

    // 1DO: fix this -- if popups stack up too fast it could be chaos
    this.onPopupClosedCallback = _callback

    this.showingTimedPopup = true

    // if (this.popupPanel.entity.hasComponent(Delay)) {
    //   this.popupPanel.entity.removeComponent(Delay)
    // }
    // HACK: removed the delay to moveIntoView because it broke during the recent refactoring
    if (GameUi.instance?.popupPanel != null) {
      GameUi.instance.popupPanel.moveIntoView(_millis, () => {
        // log("close popupPanel");
        // GameUi.instance.closePopup();
      })
    }

    // default 3-second delay for the popup to be built, then moved into view
    utils.timers.setTimeout(() => {
      if (GameUi.instance != null) {
        GameUi.instance.closePopup()
      }
    }, _millis)
    // this.popupPanel.entity.addComponentOrReplace(new Delay(_millis, () => {
    //     GameUi.instance.closePopup();

    //     // GameUi.instance.popupPanel.moveIntoView(_millis, () => {
    //     //     log("close popupPanel");
    //     //     GameUi.instance.closePopup();
    //     // });
    // }));
  }
}
