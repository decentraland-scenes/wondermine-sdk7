import ReactEcs, { type AlignType, type PositionUnit, UiEntity } from '@dcl/sdk/react-ecs'
import { type Color4 } from '@dcl/sdk/math'
import { engine, UiCanvasInformation } from '@dcl/sdk/ecs'
import Canvas from '../canvas/Canvas'
import { type UIController } from '../uicontroller'

export class UIContainerStack {
  _color: Color4
  _width: PositionUnit
  _height: PositionUnit
  _hAlign: string
  _vAlign: AlignType
  uicontroller: UIController
  constructor(
    _color: Color4,
    _width: PositionUnit,
    _height: PositionUnit,
    _hAlign: string,
    _vAlign: AlignType,
    uicontroller: UIController
  ) {
    this._color = _color
    this._width = _width
    this._height = _height
    this._hAlign = _hAlign
    this._vAlign = _vAlign
    this.uicontroller = uicontroller
  }

  render(): ReactEcs.JSX.Element | null {
    const canvasInfo = UiCanvasInformation.get(engine.RootEntity)
    return (
      <Canvas>
        <UiEntity
          uiTransform={{
            flexDirection: 'row',
            width: canvasInfo.width,
            height: canvasInfo.height,
            justifyContent: 'center',
            positionType: 'absolute'
          }}
        >
          <UiEntity
            uiTransform={{
              positionType: 'relative',
              width: this._width,
              height: this._height,
              alignItems: this._vAlign  
            }}
            uiBackground={{
                textureMode: 'stretch',
                color: this._color
              }}
          ></UiEntity>
        </UiEntity>
      </Canvas>
    )
  }
}
