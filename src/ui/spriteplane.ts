import { Billboard, BillboardMode, engine, Material, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

// @Component("SpritePlane")
export class SpritePlane {
  /**
   * A simple PlaneShape that uses a texture extracted from an atlas image.
   */
  public static cache: object = {} // simple object-based texture dictionary

  public entity = engine.addEntity()
  // public material: Material;
  public fileName: string = ''
  public framesX: number = 0
  public framesY: number = 0
  public totalFrames: number = 0
  // The current frame being shown
  public currentFrame: number = 0
  // Defines the frame to be shown when not animating
  public frameNum: number = 0

  public uvs: number[] = []

  constructor(
    _textureFile: string,
    _framesX: number = 1,
    _framesY: number = 1,
    _frameNum: number = 0,
    _pos: Vector3 = Vector3.Zero(),
    _scale: Vector3 = Vector3.One(),
    _angles: Vector3 = Vector3.Zero(),
    _isBillboard: boolean = false
  ) {
    Transform.createOrReplace(this.entity, {
      position: _pos,
      scale: _scale,
      rotation: Quaternion.fromEulerDegrees(_angles.x, _angles.y, _angles.z)
    })

    this.changeTexture(_textureFile, _framesX, _framesY, _frameNum)
    if (_isBillboard) {
      Billboard.create(this.entity, { billboardMode: BillboardMode.BM_Y })
    }
  }

  getUVs(_frameNum: number, _framesX: number, _framesY: number): number[] {
    if (_framesX <= 0) _framesX = 1
    if (_framesY <= 0) _framesY = 1

    var xUnit = 1 / _framesX
    var yUnit = 1 / _framesY

    const y: number = _framesY - Math.floor(_frameNum / _framesX) - 1
    const x: number = _frameNum % _framesX
    // log("frameNum=" + _frameNum + ", x=" + x + ", y=" + y);

    const uvs = [
      // bottom left
      x * xUnit,
      y * yUnit,
      // top left
      x * xUnit,
      yUnit + y * yUnit,
      // top right
      xUnit + x * xUnit,
      yUnit + y * yUnit,
      // bottom right
      xUnit + x * xUnit,
      y * yUnit,
      // bottom left
      x * xUnit,
      y * yUnit,
      // top left
      x * xUnit,
      yUnit + y * yUnit,
      // top right
      xUnit + x * xUnit,
      yUnit + y * yUnit,
      // bottom right
      xUnit + x * xUnit,
      y * yUnit
    ]
    // log("uvs=" + JSON.stringify(uvs));
    return uvs
  }

  changeTexture(_textureFile: string, _framesX: number = 1, _framesY: number = 1, _frameNum: number = 0): void {
    this.fileName = _textureFile

    // check cache to see if shape is already there
    // log("loading " + _textureFile);

    SpritePlane.cache = [_textureFile]

    if (Material.getMutableOrNull(this.entity) === null) {
      // this.material.emissiveTexture = _textureFile;
      // this.material.emissiveIntensity = 0.5;
      // this.material.reflectionColor = Color3.White();
      // this.material.emissiveColor = _emissiveColor;
      SpritePlane.cache = [_textureFile]
    }

    // change UVs
    this.framesX = _framesX
    if (this.framesX <= 0) this.framesX = 1

    this.framesY = _framesY
    if (this.framesY <= 0) this.framesY = 1

    this.totalFrames = _framesX * _framesY
    this.changeFrame(_frameNum)

    Material.setPbrMaterial(this.entity, {
      texture: Material.Texture.Common({
        src: _textureFile
      }),
      transparencyMode: 2,
      roughness: 0.9
    })
    MeshRenderer.setPlane(this.entity, this.uvs)
  }

  changeFrame(_frameNum: number): void {
    this.frameNum = _frameNum
    this.uvs = this.getUVs(_frameNum, this.framesX, this.framesY)
    MeshRenderer.setPlane(this.entity, this.uvs)
  }
}
