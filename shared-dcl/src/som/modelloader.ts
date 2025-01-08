import { engine, type Entity, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { SceneObject } from './sceneobject'
import { Vector3, Quaternion } from '@dcl/sdk/math'
/**
 * Loads a GLTF model, given a SceneObject data structure.
 * Optionally adds components to make the entity Portable/throwable or a RigidBody.
 * If a GLTFShape has already been loaded, it will be reused.
 */
export class ModelLoader {
  public cache: Record<string, any> = {}
  public filePrefix: string = 'assets/models/'

  spawnSceneObject(data: object, addToEngine: boolean = true): Entity {
    const so = this.populate(new SceneObject(), data) // TODO: error checking

    const mod = engine.addEntity()

    // check cache to see if shape is already there
    let shape: string
    shape = this.cache[so.filename]
    // log("loading " + so.filename);

    if (shape === undefined) {
      shape = this.filePrefix + so.filename
      this.cache[so.filename] = shape
    }
    GltfContainer.create(mod, { src: shape })

    Transform.create(mod, { position: Vector3.create(...so.pos), scale: Vector3.create(...so.scale) })
    Transform.getMutable(mod).rotation = Quaternion.fromEulerDegrees(so.angles[0], so.angles[1], so.angles[2])
    console.log('gltf ', GltfContainer.get(mod).src, 'quaternion ', Transform.get(mod).rotation)
    return mod
  }

  populate<T>(target: T, ...sources: Array<Partial<T>>): T {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!target) {
      throw new TypeError('Cannot convert undefined or null to object')
    }
    for (const source of sources) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (source) {
        Object.assign(target, source)
        console.log('file converted')
      }
    }
    return target
  }
}
