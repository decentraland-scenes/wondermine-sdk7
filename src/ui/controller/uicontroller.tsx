import { UiCanvasInformation, engine } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import Canvas from '../canvas/Canvas'
import { UiBottomBarPanel } from '../uibottombarpanel'

export class UIController {
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public barpanel: UiBottomBarPanel = new UiBottomBarPanel()
  constructor() {
    ReactEcsRenderer.setUiRenderer(this.render.bind(this))
  }

  init(): void {}

  render(): ReactEcs.JSX.Element | null { 
    if (this.canvasInfo === null) return null
    return (
      <UiEntity>
        <Canvas>{this.barpanel.renderUI()}</Canvas>
      </UiEntity>
    )
  }
}
