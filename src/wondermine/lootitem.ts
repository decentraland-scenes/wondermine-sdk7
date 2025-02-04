import { ProjectLoader } from '../projectloader'
import { type LootItemInstance } from '../projectdata'
import {
  Animator,
  engine,
  type Entity,
  GltfContainer,
  InputAction,
  type PBAnimator,
  type PBGltfContainer,
  PointerEvents,
  pointerEventsSystem,
  PointerEventType,
  Transform
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { type ECS6ComponentGltfShape } from '~system/EngineApi'
import * as utils from '@dcl-sdk/utils'

/**
 * An item that can be mined from a meteor, or crafted in the machine.
 */
export class LootItem {
  public entity: Entity | null = null
  public static homePos: Vector3 = Vector3.One()
  public adjustPos: Vector3 = Vector3.Zero()
  public instanceData: LootItemInstance | null = null
  public modelEntity: Entity = engine.addEntity()
  public modelFile: string = ''
  public shape: ECS6ComponentGltfShape | null = null
  public anim: PBAnimator | null = null
  public idleAnim: string = ''
  public enabled: boolean = false
  public timerId = utils.timers.setInterval(function () {}, 0)

  /**
   * Number of seconds until this loot item disappears
   */
  public duration: number = 25

  public onClickCallback: ((hitPoint: Vector3, m: LootItem) => boolean) | undefined

  // Create a Meteor given a MeteorInstance data object
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(_data: Object, _itemId: string) {
    if (_data != null && _data !== undefined) {
      if (this.loadInstance(_data, _itemId)) {
        // console.log("loaded Loot Item at " + _data["pos"]);
        this.entity = engine.addEntity()
      }
    }
  }

  /**
   * Creates an entity for the meteor, then loads the 3d model as a child entity to that.
   * Position, scale, and angle are all set on the parent entity.
   * The model itself is set to position (0, 0, 0), scale(1, 1, 1), and angles (0, 0, 0).
   * @param _data
   */
  loadInstance(_data: object, _itemId: string): boolean {
    // log("Meteor.loadInstance()");
    // log(_data);

    // get the loader
    let loader = ProjectLoader.instance
    if (loader === undefined) {
      loader = new ProjectLoader()
    }

    // --- load the instance data and Meteor type
    const li: LootItemInstance = loader.loadLootItemInstance(_data, _itemId)
    // log(li);

    this.instanceData = li
    this.modelFile = li.filename

    this.adjustPos = Vector3.create(...li.pos)

    if (this.entity != null) {
      // --- create and position the parent entity (holder)
      // start it small so it's very hard to see until it starts dropping from the skies
      Transform.create(this.entity, {
        position: LootItem.homePos,
        scale: Vector3.One(),
        rotation: Quaternion.create(...li.angles)
      })
      // log("ADDED TRANS");

      // --- load the GLTF model
      li.pos = [0, 0, 0]
      li.angles = [0, 0, 0]
      this.modelEntity = loader.spawnSceneObject(li)
      Transform.getMutable(this.modelEntity).parent = this.entity
      this.shape = GltfContainer.get(this.modelEntity)

      // --- set the animations
      this.anim = Animator.createOrReplace(this.modelEntity)
      if (li.idleClip != null) {
        this.idleAnim = li.idleClip
        this.anim.states = [
          {
            clip: this.idleAnim,
            loop: true
          }
        ]
      }

      PointerEvents.createOrReplace(this.modelEntity, {
        pointerEvents: [
          {
            eventType: PointerEventType.PET_DOWN,
            eventInfo: {
              hoverText: 'Collect',
              maxDistance: 8
            }
          }
        ]
      })

      // Evento dentro de la función de callback
      pointerEventsSystem.onPointerDown(
        {
          entity: this.modelEntity,
          opts: { button: InputAction.IA_POINTER, hoverText: 'Collect' }
        },
        (event) => {
          if (event.hit != null) {
            const hp: Vector3 | undefined = event.hit.position // Obtiene las coordenadas del hit
            this.onClicked(hp)
          }
        }
      )
      // stop any auto-started animations
      this.stopAnimations()
      // let pos = this.entity.getComponent(Transform).position;
      // log("SPAWNED METEOR AT" + pos);
    }

    return true
  }

  idle(): void {
    // log("LootItem.onIdle()");
    this.stopAnimations()

    if (this.idleAnim != null) {
      Animator.playSingleAnimation(this.modelEntity, this.idleAnim)
    }
  }

  showAt(newPos: Vector3): void {
    this.enabled = true
    this.moveTo(newPos)
    if (this.shape !== null) {
      this.shape.visible = true
    }
    this.idle()
    // if (this.instanceData.itemId.substring(0,3) != "Axe")
    // {
    //   this.idle();
    // }
    // else
    // {
    //   this.stopAnimations();
    // }

    // delay a while and automatically collect
    utils.timers.clearInterval(this.timerId)
    this.timerId = utils.timers.setInterval(() => {
      // log("dropping meteor");
      this.collect()
    }, this.duration * 1000)
  }

  /**
   * Moves it back to the home spot and hides the shape.
   */
  collect(): void {
    // back to the hiding place
    this.stopAnimations()
    this.moveTo(LootItem.homePos, false)
    if (this.shape !== null) {
      this.shape.visible = false
    }
    // 2DO: callback
  }

  moveTo(newPos: Vector3, adjust: boolean = true): void {
    if (adjust) {
      newPos = Vector3.add(newPos, this.adjustPos)
    }
    if (this.entity != null) {
      const trans = Transform.getMutable(this.entity)
      trans.position = newPos
      Transform.createOrReplace(this.entity, trans)
    }
  }

  /**
   * Called when the player clicks on this meteor
   */
  onClicked(hitPoint: Vector3 | undefined): void {
    // log("onClicked()");
    if (this.enabled) {
      this.collect()
    }
  }

  stopAnimations(): void {
    if (this.idleAnim != null) {
      Animator.stopAllAnimations(this.modelEntity)
    }
  }

  getShape(): PBGltfContainer {
    return GltfContainer.get(this.modelEntity)
  }

  reset(): void {
    this.stopAnimations()
  }
}
