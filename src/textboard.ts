import { ProjectLoader } from './projectloader'
import { TextBoardObject } from './projectdata'
import {
  engine,
  type Entity,
  GltfContainer,
  type PBGltfContainer,
  type PBTextShape,
  TextAlignMode,
  TextShape,
  Transform,
  type TransformType
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

/**
 * Shows text over a 3D model of a sign or other backing board.
 */
export type TextBoardData = {
  pos: [number, number, number]
  scale: [number, number, number]
  rotation?: [number, number, number, number] // Quaternion (optional)
  angles?: [number, number, number] // Ensure this is a tuple
}

export class TextBoard {
  public entity: Entity = engine.addEntity()
  public isConnected: boolean = false
  public configData: TextBoardObject | null = null

  public boardEntity: Entity | null = null
  public boardTrans: TransformType | null = null
  public boardModel: PBGltfContainer | null = null

  public textHolder: Entity | null = null
  public textEntity: Entity | null = null
  public textShape: PBTextShape | null = null

  // Allow each room to specify a unique look and feel
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(_data: TextBoardData, _parent: Entity | null = null) {
    if (_data != null && _data !== undefined) {
      console.log('data not null')
      if (this.entity != null) {
        if (this.loadInstance(_data, this.entity)) {
          if (_parent != null) {
            Transform.createOrReplace(this.entity, { parent: _parent })
          }
        }
      }
    }
  }

  loadInstance(_data: TextBoardData, _parent: Entity): boolean {
    // get the loader
    let loader = ProjectLoader.instance
    if (loader === undefined) {
      loader = new ProjectLoader()
    }

    const obj: TextBoardObject = loader.populate(new TextBoardObject(), _data)
    this.configData = obj

    // apply main transform at the top level
    const trans: TransformType = {
      position: Vector3.create(...obj.pos),
      scale: Vector3.create(...obj.scale),
      rotation: Quaternion.create(0, 0, 0)
    }

    // Rotation can be specified either as a Quaternion or as Euler angles
    if (_data.rotation != null) {
      trans.rotation = Quaternion.create(...obj.rotation)
    } else if (_data.angles != null) {
      trans.rotation = Quaternion.fromEulerDegrees(obj.angles[0], obj.angles[1], obj.angles[2])
      console.log('angles', obj.angles[0], obj.angles[1], obj.angles[2])
    }
    Transform.create(_parent, { position: trans.position, scale: trans.scale, rotation: trans.rotation })

    // load board model
    _data.pos = [0, 0, 0]
    _data.angles = [0, 0, 0]
    console.log('board scale=', _data.scale)
    // 2DO: upgrade to latest version of ModelLoader? where this is called spawn() and accepts a _parent param
    this.boardEntity = loader.spawnSceneObject(_data)
    if (_parent != null) {
      Transform.getMutable(this.boardEntity).parent = _parent
    }

    this.boardModel = GltfContainer.get(this.boardEntity)
    this.boardTrans = Transform.get(this.boardEntity)
    console.log('board trans scale=', this.boardTrans.scale)
    console.log('loaded model', this.boardModel)

    this.textHolder = engine.addEntity()
    const textTrans: TransformType = {
      position: Vector3.create(...obj.textPos),
      scale: Vector3.One(),
      rotation: Quaternion.create(0, 0, 0)
    }
    if (obj.textAngles != null) {
      textTrans.rotation = Quaternion.fromEulerDegrees(obj.textAngles[0], obj.textAngles[1], obj.textAngles[2])
    }
    Transform.create(this.textHolder, textTrans)
    Transform.getMutable(this.textHolder).parent = _parent

    this.textEntity = this.addTextField(obj, this.textHolder, obj.textWidth, 80, Vector3.Zero())
    this.textShape = TextShape.get(this.textEntity)

    // create text shape
    // this.textEntity = new Entity();
    // this.textShape = new TextShape("test");
    // log("created textShape");

    // if (_data['fontSize'] != null && _data['fontSize'] > 1)
    // {
    //     this.textShape.fontSize = obj.fontSize;
    // }
    // if (_data['hexColor'] != null && _data['hexColor'] != "")
    // {
    //     this.textShape.color = Color3.FromHexString(obj.hexColor);
    // }
    // if (_data['textWidth'] != null && _data['textWidth'] > 1)
    // {
    //     this.textShape.width = obj.textWidth;
    // }
    // if (_data['textHeight'] != null && _data['textHeight'] > 1)
    // {
    //     this.textShape.height = obj.textHeight;
    // }

    // this.textShape.hTextAlign = "center";
    // this.textShape.vTextAlign = "top";

    // this.textEntity.addComponent(this.textShape);

    // log("added textShape");
    // if (_data['textPos'] != null && _data['textAngles'] != null)
    // {
    //     let textTrans:Transform = new Transform({ position: new Vector3(...obj.textPos), scale: Vector3.One() });
    //     textTrans.rotation.eulerAngles = new Vector3(...obj.textAngles);
    //     this.textEntity.addComponent(textTrans);
    // }

    // log("added transform");
    // this.textEntity.setParent(_parent);

    return true
  }

  addTextField(
    _data: TextBoardObject,
    _parent: Entity,
    _w: number,
    _h: number,
    _textPos: Vector3,
    _hTextAlign: string = 'center'
  ): Entity {
    // create text shape
    const ent: Entity = engine.addEntity()
    const ts: PBTextShape = { text: '' }

    console.log('created textShape')

    if (_data.fontSize !== 0 && _data.fontSize > 1) {
      ts.fontSize = _data.fontSize
    }
    if (_data.hexColor != null && _data.hexColor !== '') {
      ts.textColor = Color4.fromHexString(_data.hexColor)
    }

    ts.width = Math.max(_w, 10)
    ts.height = Math.max(_h, 10)

    ts.textAlign = TextAlignMode.TAM_TOP_CENTER
    if (_hTextAlign === 'right') {
      ts.textAlign = TextAlignMode.TAM_TOP_RIGHT
    }
    if (_hTextAlign === 'left') {
      ts.textAlign = TextAlignMode.TAM_TOP_LEFT
    }

    // ts.outlineColor = Color3.Yellow();
    // ts.outlineWidth = 1;

    ts.shadowColor = Color4.Black()
    ts.shadowOffsetX = -1
    ts.shadowOffsetY = -1
    ts.textWrapping = false
    TextShape.create(ent, ts)

    console.log('added textShape')
    // log("_textPos=" + _textPos);

    if (_textPos != null) {
      const textTrans: TransformType = {
        position: _textPos,
        scale: Vector3.One(),
        rotation: Quaternion.create(0, 0, 0)
      }
      console.log('pos=', textTrans.position)

      // if (_data.textAngles != null)
      // {
      //     textTrans.rotation.eulerAngles = new Vector3(..._data.textAngles);
      // }
      Transform.create(ent, textTrans)
    }

    console.log('added transform')
    Transform.getMutable(ent).parent = _parent
    return ent
  }

  showMessage(textStr: string): void {
    if (this.textEntity != null) {
      TextShape.getMutable(this.textEntity).text = textStr
    }
  }
}
