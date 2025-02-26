import {
  Billboard,
  BillboardMode,
  engine,
  Material,
  MeshRenderer,
  Transform,
  type Entity,
  type TransformType
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

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

  public filePrefix: string = 'assets/models/textures/'
  public entity = engine.addEntity()
  constructor(
    _pos: Vector3 = Vector3.Zero(),
    _scale: Vector3 = Vector3.One(),
    _angles: Vector3 = Vector3.Zero(),
    _isBillboard: boolean = true
  ) {
    const trans: TransformType = {
      position: _pos,
      scale: _scale,
      rotation: Quaternion.fromEulerDegrees(_angles.x, _angles.y, _angles.z)
    }
    Transform.createOrReplace(this.entity, trans)

    // progress bar texture map should be 4 bar layers, one above the other
    // 1. default bg
    // 2. progress bar
    // 3. outline
    // 4. highlight texture

    this.outlineBox = this.addBox(Color4.Black(), Vector3.Zero(), Vector3.create(4.2, 1.0, 0.1), Vector3.Zero())
    this.bgBox = this.addBox(Color4.Gray(), Vector3.Zero(), Vector3.create(4.1, 0.82, 0.2), Vector3.Zero())
    this.progBox = this.addBox(Color4.Yellow(), Vector3.create(0, 0, 0), Vector3.create(4, 0.8, 0.22), Vector3.Zero())

    if (_isBillboard) {
      Billboard.create(this.entity, { billboardMode: BillboardMode.BM_Y })
    }
  }

  public addBox(
    _color: Color4,
    _pos: Vector3 = Vector3.Zero(),
    _scale: Vector3 = Vector3.One(),
    _angles: Vector3 = Vector3.Zero()
  ): Entity {
    // create the entity
    const cube = engine.addEntity()

    // add a transform to the entity
    Transform.create(cube, {
      position: _pos,
      scale: _scale,
      rotation: Quaternion.fromEulerDegrees(_angles.x, _angles.y, _angles.z)
    })

    // add a shape to the entity
    MeshRenderer.setBox(cube)

    // set random color/material for the cube
    Material.setPbrMaterial(cube, {
      albedoColor: _color
    })
    // cubeMaterial.metallic = Math.random();
    // cubeMaterial.roughness = Math.random();
    Transform.getMutable(cube).parent = this.entity
    return cube
  }

  public setProgress(_value: number): void {
    if (_value < 0) _value = 0
    if (_value > 1) _value = 1

    this.progValue = _value
    const progScale: number = this.progScaleX * _value
    const t: TransformType = Transform.get(this.progBox)
    t.scale.x = progScale
    t.position.x = (this.progScaleX - progScale) / 2
    // t.position.z = 0.2;
  }
}
