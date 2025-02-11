import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import ReactEcs, { ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import Canvas from './canvas/Canvas'
import { UIContainerStack } from './uitypes/uicontainerstack'
import { Color4 } from '@dcl/sdk/math'
export class UIController {
  public canvasInfo = UiCanvasInformation.getOrNull(engine.RootEntity)
  public testingcontainer: UIContainerStack = new UIContainerStack(
    Color4.Clear(),
    '800',
    '500',
    'center',
    'center',
    this
  )

  constructor() {
    ReactEcsRenderer.setUiRenderer(this.ui.bind(this))
  } 

  init():void{}

  ui(): ReactEcs.JSX.Element | null {
    if (this.canvasInfo === null) return null
    return (
      <UiEntity>
        <Canvas>{this.testingcontainer.render()}</Canvas>
      </UiEntity>
    )
  }
}
