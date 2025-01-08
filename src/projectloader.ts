// som modules
import { engine, type Entity, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { ModelLoader } from '../shared-dcl/src/som/modelloader'
import {
  UiImageData,
  PickaxeType,
  PickaxeInstance,
  MeteorType,
  MeteorInstance,
  MeteorSpawnerInstance,
  LootItemInstance,
  ShopItemInstance
} from './projectdata'
import { Vector3, Quaternion } from '@dcl/sdk/math'
// import { SceneObject } from "../../shared-dcl/src/som/sceneobject";

export class ProjectLoader extends ModelLoader {
  public static instance: ProjectLoader

  public cache: Record<string, any> = {} // simple object-based dictionary
  public filePrefix: string = 'assets/models/'

  constructor() {
    super()
    // save a singleton
    ProjectLoader.instance = this
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  loadUiImageData(data: Object): UiImageData {
    const so = this.populate(new UiImageData(), data) // TODO: error checking
    return so
  }

  loadPickaxeType(data: object): PickaxeType {
    const so = this.populate(new PickaxeType(), data) // TODO: error checking
    return so
  }

  loadPickaxeInstance(data: object): PickaxeInstance {
    const so = this.populate(new PickaxeInstance(), data) // TODO: error checking
    return so
  }

  loadMeteorType(data: object): MeteorType {
    const so = this.populate(new MeteorType(), data) // TODO: error checking
    return so
  }

  loadMeteorInstance(data: object): MeteorInstance {
    const so = this.populate(new MeteorInstance(), data) // TODO: error checking
    return so
  }

  loadMeteorSpawner(data: object): MeteorSpawnerInstance {
    const so = this.populate(new MeteorSpawnerInstance(), data) // TODO: error checking
    return so
  }

  loadLootItemInstance(data: object, itemId: string = ''): LootItemInstance {
    const so: LootItemInstance = this.populate(new LootItemInstance(), data) // TODO: error checking
    so.itemId = itemId
    return so
  }

  loadShopItemInstance(data: object): ShopItemInstance {
    const so: ShopItemInstance = this.populate(new ShopItemInstance(), data) // TODO: error checking
    return so
  }

  /**
   * Load a Target model and associated properties from the som.json file.
   *
   * @param data The JSON object describing this Beastie, from the file
   * @param _pos The initial position in the scene
   * @param _angles The initial orientation of the model
   */

  spawnMeteorModel(data: MeteorInstance): Entity {
    // const so = this.populate(new TargetInstance(), data); // TODO: error checking

    const mod = engine.addEntity()

    // check cache to see if shape is already there
    let shape: string
    // HACK: disable caching to debug a meteor issue
    // shape = this.cache[data.type.filename];
    shape = this.filePrefix + data.type.filename
    // log("loading " + data.type.filename);

    if (shape === undefined) {
      // log("shape does not exist yet");
      shape = this.filePrefix + data.type.filename
      this.cache[data.type.filename] = shape
    }
    GltfContainer.create(mod, { src: shape })

    Transform.create(mod, { position: Vector3.create(...data.pos), scale: Vector3.create(...data.scale) })
    Transform.getMutable(mod).rotation = Quaternion.fromEulerDegrees(data.angles[0], data.angles[1], data.angles[2])
    return mod
  }

  spawnPickaxeModel(data: PickaxeInstance): Entity {
    // const so = this.populate(new TargetInstance(), data); // TODO: error checking

    const mod = engine.addEntity()

    // check cache to see if shape is already there
    let shape: string
    shape = this.cache[data.type.filename]
    // log("loading " + data.type.filename);

    if (shape === undefined) {
      shape = this.filePrefix + data.type.filename
      this.cache[data.type.filename] = shape
    }

    GltfContainer.create(mod, { src: shape })

    Transform.create(mod, { position: Vector3.create(...data.pos), scale: Vector3.create(...data.scale) })
    Transform.getMutable(mod).rotation = Quaternion.fromEulerDegrees(data.angles[0], data.angles[1], data.angles[2])
    return mod
  }
}
