import { Billboard, BillboardMode, engine, Material, MeshCollider, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import {  Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

/**
 * A simple PlaneShape with a solid color texture.
 */
export class ColorPlane {
  // public shape: PlaneShape;
  // public material: Material;
  public entity = engine.addEntity()

  /**
   * Creates a new PlaneShape, sets its color material, and adds it to the engine.
   *
   * Example:
   * let bgPlane = new ColorPlane("#282828", new Vector3(2, 1, 2), new Vector3(0.6, 0.6, 0.1), Vector3.Zero());
   *
   * @param _hexColor A hex string describing a Color3
   * @param _pos The x,y,z position in the scene
   * @param _scale The x,y,z scale. Since this is a plane only x and y really matter.
   * @param _angles The rotation of the plane in terms or Euler angles.
   * @param _isBillboard Whether to make this a billboard that always faces the user.
   */
  constructor(
    _hexColor: string = '#555555',
    _pos: Vector3 = Vector3.Zero(),
    _scale: Vector3 = Vector3.One(),
    _angles: Vector3 = Vector3.Zero(),
    _isBillboard: boolean = false
  ) {
    MeshRenderer.setPlane(this.entity)
    MeshCollider.setPlane(this.entity)

    Transform.createOrReplace(this.entity,{position: _pos,scale: _scale, rotation: Quaternion.fromEulerDegrees(_angles.x,_angles.y,_angles.z)})

    this.changeHexColor(_hexColor)

    if (_isBillboard) {
      Billboard.create(this.entity, { billboardMode: BillboardMode.BM_Y })
    }
  }

  changeColor(_color: Color4): void {
    if (Material.getMutableOrNull(this.entity)!= null){
      Material.deleteFrom(this.entity)
    }
    Material.setPbrMaterial(this.entity, {
      albedoColor: _color,
      roughness: 0.9,
      specularIntensity: 0,
    })
  }

  changeHexColor(_hexColor: string): void {
    this.changeColor(Color4.fromHexString(_hexColor))
  }

  hide(): void {
    if (Material.getMutableOrNull(this.entity)!= null){
      // add hide logics
    }
  }

  show(): void {
    if (Material.getMutableOrNull(this.entity)!= null){
     // add show logics
    }
  }
}
