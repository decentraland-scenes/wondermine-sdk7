import { ProjectLoader } from './projectloader'
import { PickaxeInstance } from './projectdata'
import { SoundManager } from '../shared-dcl/src/sound/soundmanager'
import { PickaxeTypeList } from './pickaxetypelist'
import { type Meteor } from './wondermine/meteor'
import { DclUser } from '../shared-dcl/src/playfab/dcluser'
import { Eventful, MovePlayerEvent } from './events'
import {
  Animator,
  engine,
  type Entity,
  GltfContainer,
  type PBAnimationState,
  type PBAnimator,
  type PBGltfContainer,
  Transform,
  type TransformType
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { multiplyInPlace, rotationAxisToRef } from './sdk7utils'
import * as utils from '@dcl-sdk/utils'

/**
 * A Pickaxe tool that can be used to mine Meteors
 */

export class Pickaxe {
  public static test: string = 'Pickaxe test'

  public instanceData: PickaxeInstance | null = null

  public entity: Entity = engine.addEntity()

  public modelEntity: Entity = engine.addEntity()
  public modelFile: string = ''
  public shape: PBGltfContainer | null = null

  public finalScale: Vector3.MutableVector3 = Vector3.create(1, 1, 1)

  public anim: PBAnimator | null = null
  public miningAnim: PBAnimationState = { clip: '' }
  public extraAnim1: PBAnimationState = { clip: '' }
  public extraAnim2: PBAnimationState = { clip: '' }

  /**
   * The total number of hits this meteorite can take before it disappears
   */
  public maxHits: number = 10
  /**
   * How many hits are left until it disappears
   */
  public hits: number = 0
  public dataTest: PickaxeInstance
  public isBusy: boolean = false
  public currentTarget: Meteor | null = null
  public onMiningAnimCompleteCallback: ((m: Meteor | null) => void) | null = null

  // Create a Pickaxe given pickaxe data
  constructor(_data: PickaxeInstance) {
    console.log('Pickaxe constructor')
    this.dataTest = _data
    if (_data != null && _data !== undefined) {
      if (this.loadInstance(_data)) {
        console.log('loaded Pickaxe at ', _data.pos)
      }
    }
  }

  loadInstance(_data: PickaxeInstance): boolean {
    console.log('Pickaxe.loadInstance()')
    console.log(_data)

    // get the loader
    let loader = ProjectLoader.instance
    if (loader === undefined) {
      loader = new ProjectLoader()
    }

    // --- load the instance data and Pickaxe type
    const pi: PickaxeInstance = loader.loadPickaxeInstance(_data)
    // log("typeName="+ pi.typeName);
    pi.type = PickaxeTypeList.getType(pi.typeName)

    if (pi.type === undefined) return false

    this.instanceData = pi
    this.modelFile = pi.type.filename

    const entityPos: Vector3.MutableVector3 = Vector3.create(...pi.pos)

    // --- create and position the parent entity (holder)
    // overrides the scale with the type's scale
    const trans: TransformType = {
      position: entityPos,
      scale: Vector3.create(...pi.type.scale),
      rotation: Quaternion.create(0, 0, 0)
    }
    Transform.create(this.entity, trans)

    // log("ADDED TRANS");

    // --- load the GLTF model
    const modelInstance: PickaxeInstance = new PickaxeInstance()
    modelInstance.pos = [0, 0, 0]
    modelInstance.angles = [0, 0, 0]
    modelInstance.scale = [1, 1, 1]
    modelInstance.type = pi.type

    const mod: Entity = loader.spawnPickaxeModel(modelInstance)
    Transform.getMutable(mod).parent = this.entity
    // log("ADDED MODEL");

    // --- set the animations
    if (pi.type.miningClip !== 'none') {
      this.miningAnim = { clip: pi.type.miningClip, loop: pi.ItemId === 'AxeVroomway' }
      Animator.create(mod, {
        states: [this.miningAnim]
      })
      if (pi.ItemId === 'AxeSteam') {
        this.extraAnim1 = { clip: pi.type.extraClip1, loop: false }
        this.extraAnim2 = { clip: pi.type.extraClip2, loop: false }
        Animator.createOrReplace(mod, {
          states: [this.miningAnim, this.extraAnim1, this.extraAnim2]
        })
      }
    }
    this.modelEntity = mod

    // add sounds
    SoundManager.attachSoundFile(this.modelEntity, pi.typeName, pi.type.miningSound)

    this.shape = this.getShape()

    return true
  }

  showAt(pos: Vector3.MutableVector3, _angles: Vector3.MutableVector3, m: Meteor): void {
    // log("Pickaxe.showAt()");

    // Verificar si la entidad tiene un Transform
    if (!Transform.has(this.entity)) {
      console.error(`❌ Pickaxe entity ${this.entity} does not have a Transform`)
      return
    }
    const t: TransformType = Transform.getMutable(this.entity)

    let rotDelta = -90

    if (this.instanceData?.ItemId === 'AxeVroomway' || this.instanceData?.ItemId === 'AxeSteam') {
      rotDelta = 0

      // for vroomway, hitPoint doesn't nmatter -- just your direction from the meteor's center
      const mPos: Vector3.MutableVector3 = Vector3.clone(Transform.get(m.entity).position)

      // if too close to the x,z center of the meteor you are probably on top, so we need to move the car farther away
      const dir: Vector3.MutableVector3 = Vector3.normalize(
        Vector3.subtract(mPos, Transform.get(engine.CameraEntity).position)
      )
      dir.y = 0

      // wondervroom model's origin is in the center, not at the point, so pull it back a little
      let carRot: Quaternion.MutableQuaternion = Quaternion.lookRotation(dir, Vector3.Up())

      const backVec: Vector3.MutableVector3 = Vector3.multiplyByFloats(
        Vector3.rotate(Vector3.Backward(), carRot),
        4.0,
        1,
        4.0
      )
      const placement: Vector3.MutableVector3 = Vector3.add(dir, backVec)
      pos = Vector3.add(placement, mPos)
      pos.y = 0.1
      // log("placing " + this.instanceData.ItemId, pos, m.entity.getComponent(Transform).position);

      t.position = pos

      // rotate the steampunk axe 90 degrees more
      if (this.instanceData.ItemId === 'AxeSteam') {
        const angles = carRot
        carRot = Quaternion.fromEulerDegrees(angles.x, angles.y - 90, angles.z)
      }
      t.rotation = carRot

      // move the avatar up out of the way of the drill [ 0.05, 1.8, 0.05 ]
      const shift = this.instanceData.ItemId === 'AxeSteam' ? [0.5, 0.0, 0.5] : [0.25, 1, 0.25]
      const playerPos: Vector3.MutableVector3 = Vector3.add(
        Vector3.clone(pos),
        Vector3.multiplyByFloats(backVec, shift[0], shift[1], shift[2])
      )
      playerPos.y = 3
      // HACK: had to stop the player from being moved because of new changes to the DCL SDK
      // movePlayerTo(playerPos);
      Eventful.instance.fireEvent(new MovePlayerEvent(playerPos))
    } else {
      let rotMinus90: Quaternion.MutableQuaternion = Quaternion.create()
      rotMinus90 = rotationAxisToRef(Vector3.Up(), rotDelta, rotMinus90)
      const cameraEntity = Transform.get(engine.CameraEntity).rotation
      const camRot: Quaternion.MutableQuaternion = Quaternion.create(
        cameraEntity.x,
        cameraEntity.y,
        cameraEntity.z,
        cameraEntity.w
      )

      rotMinus90 = multiplyInPlace(camRot, rotMinus90)
      t.rotation = rotMinus90

      t.position = pos
    }

    if (this.shape != null) {
      this.show()
      // this.shape.visible = true
    }
    this.mine(m)
  }

  mine(m: Meteor): void {
    // log("Pickaxe.mine()");
    this.stopAnimations()
    this.isBusy = true
    DclUser.activeUser.isAxeBusy = true
    Animator.getClip(this.modelEntity, this.miningAnim.clip).playing = true
    if (this.instanceData?.ItemId === 'AxeSteam') {
      console.log('playing extra animations')
      Animator.getClip(this.modelEntity, this.extraAnim1.clip).playing = true
      Animator.getClip(this.modelEntity, this.extraAnim2.clip).playing = true
    }

    SoundManager.playOnce(this.modelEntity, 1.0)
    this.currentTarget = m

    utils.timers.setTimeout(() => {
      this.onMiningComplete()
    }, 13000)
  }

  onMiningComplete(): void {
    // log("Pickaxe.onMiningComplete()");
    this.isBusy = false
    DclUser.activeUser.isAxeBusy = false
    if (this.onMiningAnimCompleteCallback != null) {
      this.onMiningAnimCompleteCallback(this.currentTarget)
    }
  }

  stopAnimations(): void {
    Animator.getClip(this.modelEntity, this.miningAnim.clip).playing = false
  }

  show(): void {
    // Hack to make it visible on SDK7
    Transform.getMutable(this.modelEntity).scale = Vector3.create(1, 1, 1)
  }

  hide(): void {
    if (this.shape != null) {
      // Hack to make it invisible on SDK7
      Transform.getMutable(this.modelEntity).scale = Vector3.create(0, 0, 0)
      // this.shape.visible = false
    }
  }

  removeEntity(): void {
    if (engine.getEntityState(this.entity) === 1) Transform.getMutable(this.modelEntity).scale = Vector3.create(0, 0, 0)
  }

  getShape(): PBGltfContainer {
    return GltfContainer.get(this.modelEntity)
  }
}
