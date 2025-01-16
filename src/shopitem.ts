import { ProjectLoader } from './projectloader'
import { ShopItemInstance } from './projectdata'
import {
  engine,
  type Entity,
  Transform,
  Animator,
  GltfContainer,
  PointerEvents,
  PointerEventType,
  InputAction,
  inputSystem,
  MeshCollider
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

/**
 * An item that can be sold in a store.
 */
export class ShopItem {
  public entity = engine.addEntity()
  public instanceData: ShopItemInstance = new ShopItemInstance()

  public modelEntity: Entity
  public modelFile: string
  public shape: string = ''

  // public anim: Animator
  public idleAnim: string = ''

  public enabled: boolean = false

  public onClickCallback: ((itemData: ShopItemInstance, hitPoint?: Vector3) => boolean) | undefined

  /**
   * Create a ShopItem given a ShopItemInstance data object.
   * Creates an entity then loads the 3d model as a child entity to that.
   * Position, scale, and angle are all set on the parent entity.
   * The model itself is set to position (0, 0, 0), scale(1, 1, 1), and angles (0, 0, 0).
   * @param _data
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(_data: Object) {
    let loader = ProjectLoader.instance
    if (loader === undefined) {
      loader = new ProjectLoader()
    }

    // --- load the instance data and Meteor type
    const si: ShopItemInstance = loader.loadShopItemInstance(_data)

    this.instanceData = si
    this.modelFile = si.filename

    // --- create and position the parent entity (holder)
    Transform.create(this.entity, {
      position: Vector3.create(...si.pos),
      scale: Vector3.create(1, 1, 1),
      rotation: Quaternion.create(...si.angles)
    })

    // log("ADDED TRANS");

    // --- load the GLTF model
    si.pos = [0, 0, 0]
    si.angles = [0, 90, 0]
    this.modelEntity = loader.spawnSceneObject(si)
    Transform.getMutable(this.modelEntity).parent = this.entity
    this.shape = GltfContainer.get(this.modelEntity).src

    // --- set the animations
    if (si.idleClip != null) {
      this.idleAnim = si.idleClip
    }

    Animator.createOrReplace(this.modelEntity, {
      states: [{ clip: this.idleAnim, loop: false }]
    })

    MeshCollider.setBox(this.modelEntity)

    PointerEvents.createOrReplace(this.modelEntity, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'Pay ' + this.instanceData.manaPrice + ' MANA\nfor ' + this.instanceData.itemQty + ' Coins',
            maxDistance: 8
          }
        }
      ]
    })
    engine.addSystem(() => {
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.modelEntity)) {
        if (InputAction.IA_POINTER != null) {
          this.onClicked()
        }
      }
    })
    // stop any auto-started animations
    this.stopAnimations()
  }

  idle(): void {
    // log("ShopItem.onIdle()");
    this.stopAnimations()
    if (Animator.getMutableOrNull(this.entity) != null) {
      if (this.idleAnim != null) {
        Animator.playSingleAnimation(this.entity, this.idleAnim)
      }
    }
  }

  playAnimation(): void {
    // log("ShopItem.onIdle()");
    this.stopAnimations()
    if (Animator.getMutableOrNull(this.entity) != null) {
      if (this.idleAnim != null) {
        Animator.playSingleAnimation(this.entity, this.idleAnim)
      }
    }
  }

  /**
   * Called when the player clicks on this meteor
   */
  onClicked(): void {
    console.log('onClicked()')
    if (this.enabled) {
      if (this.onClickCallback != null) {
        this.onClickCallback(this.instanceData)
      }
    }
  }

  stopAnimations(): void {
    if (Animator.getMutableOrNull(this.entity) != null) {
      if (this.idleAnim != null) {
        Animator.getClip(this.entity, this.idleAnim).playing = false
      }
    }
  }

  getShape(): string {
    return GltfContainer.get(this.modelEntity).src
  }

  reset(): void {
    this.stopAnimations()
  }
}
