import { engine, Transform, type Entity, type TransformType } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

export class ProgressBox {
  public filename: string = ''
  public trans: TransformType = {
    position: Vector3.create(0, 0, 0),
    scale: Vector3.create(0, 0, 0),
    rotation: Quaternion.create(0, 0, 0)
  }

  public bgBox: Entity = engine.addEntity()
  public progBox: Entity = engine.addEntity()
  public outlineBox: Entity = engine.addEntity()

  public progScaleX: number = 4

  public progValue: number = 0

  public filePrefix: string = 'models/textures/'
  public entity = engine.addEntity()
  constructor(
    _pos: Vector3 = Vector3.Zero(),
    _scale: Vector3 = Vector3.One(),
    _angles: Vector3 = Vector3.Zero(),
    _isBillboard: boolean = true) {
    console.log()
  }

  public setProgress(_value: number):void
  {
    if (_value < 0) _value = 0;
    if (_value > 1) _value = 1;

    this.progValue = _value;
    const progScale:number = this.progScaleX * _value;
    const t:TransformType = Transform.get(this.progBox)
    t.scale.x = progScale;
    t.position.x = (this.progScaleX - progScale) / 2;
    // t.position.z = 0.2;
  }
}
