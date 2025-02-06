import { engine, type Entity, type PBTextShape, TextAlignMode, TextShape, Transform } from '@dcl/sdk/ecs'
import { Vector3, Color3, Color4, Quaternion } from '@dcl/sdk/math'
import { ColorPlane } from './colorplane'
import { SpritePlane } from './spriteplane'

export class ItemAmountPanel {
  /* extends Entity */
  /**
   * Combines background ColorPlanes wwith a SpritePlane and TextField.
   */
  public parentEntity: Entity
  public bgPlane: ColorPlane
  public icon: SpritePlane
  public textEntity: Entity
  public textField: PBTextShape = { text: '' }
  public ent: Entity = engine.addEntity()
  public enabledColor: Color3
  public enabledHexColor: string = '#449955'
  public disabledColor: Color3
  public disabledHexColor: string = '#333333'

  constructor(
    _parent: Entity,
    _pos: Vector3 = Vector3.Zero(),
    _disabledColor: string = '#333333',
    _enabledColor: string = '#449955',
    _textureFile: string = '',
    _framesX: number = 1,
    _framesY: number = 1,
    _frameNum: number = 0,
    _fontSize: number = 4,
    _isBlocker: boolean = false,
    _isSmall: boolean = false,
    _isBillboard: boolean = false
  ) {
    // super();
    this.parentEntity = _parent

    // Note: It doesn't seem like Transform apply hierarchically -- only the parent transform seems to matter for scale anyway
    // let trans:Transform = new Transform({ position: _pos, scale: Vector3.One() });
    // trans.rotation.eulerAngles = Vector3.create(0, 0, -90);
    // this.addComponent(trans);
    let bgSize: Vector3 = Vector3.create(0, 0, 0)
    let iconScale: number = 0.14
    if (_isSmall) {
      bgSize = Vector3.create(0.32, 0.12, 0.1)
      iconScale = 0.1
    }
    this.bgPlane = new ColorPlane(_disabledColor, Vector3.create(_pos.x, _pos.y, _pos.z), bgSize)
    Transform.getMutable(this.bgPlane.entity).parent = _parent

    // let t = this.bgPlane.getComponent(Transform);
    // t.scale = Vector3.create(0.5, 0.2, 1);

    this.disabledHexColor = _disabledColor
    this.disabledColor = Color3.fromHexString(_disabledColor)
    this.enabledHexColor = _enabledColor
    this.enabledColor = Color3.fromHexString(_enabledColor)

    // 2DO: change SpritePlane to subclass Entity
    this.icon = new SpritePlane(
      _textureFile,
      _framesX,
      _framesY,
      _frameNum,
      Vector3.create(_pos.x - 0.09, _pos.y, _pos.z - 0.02),
      Vector3.create(iconScale, iconScale, 0.1),
      Vector3.create(0, 0, 0)
    )
    Transform.getMutable(this.icon.entity).parent = _parent

    // add amount field
    this.textEntity = this.addTextField(_fontSize, Vector3.create(_pos.x - 0.02, _pos.y + 0.06, _pos.z - 0.02), _parent)

    // if (_isBillboard)
    // {
    //   this.addComponent(new Billboard(false, true, false));
    // }

    // engine.addEntity(this);
  }

  addTextField(_fontSize: number, _pos: Vector3, _parent: Entity): Entity {
    // create text shape

    TextShape.create(this.ent, {
      text: this.textField.text,
      textColor: Color4.White(),
      fontSize: _fontSize - 0.4,
      width: 80,
      height: 40,
      textAlign: TextAlignMode.TAM_TOP_LEFT,
      textWrapping: false
    })

    // log("created textShape");
    // ts.fontWeight = "bold";
    Transform.create(this.ent, {
      position: _pos,
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.fromEulerDegrees(0, 0, 0),
      parent: _parent
    })
    return this.ent
  }

  show(_frameNum: number, _value: number, _numOwned: number = 0): void {
    // log("show(" + _frameNum + ", " + _value + ", " + _numOwned) + ")";
    if (_numOwned >= _value) {
      this.enable()
    } else {
      this.disable()
    }

    // this.showIcon();
    this.icon.changeFrame(_frameNum)
    this.showText(_value.toString())
  }

  showText(_text: string): void {
    TextShape.getMutable(this.textEntity).text = _text
  }

  enable(): void {
    // log("enable()");
    // this.bgPlane.changeColor(this.enabledColor);
    this.bgPlane.changeHexColor(this.enabledHexColor)
  }

  disable(): void {
    // this.bgPlane.changeColor(this.disabledColor);
    this.bgPlane.changeHexColor(this.disabledHexColor)
  }

  clear(_clearFrameNum: number = 0): void {
    this.disable()
    TextShape.getMutable(this.ent).text = ''
    this.textField.text = ''
    this.hideIcon(_clearFrameNum)
  }

  hideIcon(_clearFrameNum: number = 0): void {
    this.icon.changeFrame(_clearFrameNum)
  }

  showIcon(): void {
    // this.icon.alive = true;
  }
}
