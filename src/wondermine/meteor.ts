import {
  engine,
  type Entity,
  type PBGltfContainer,
  type PBAnimationState,
  type TransformType,
  Transform,
  Animator,
  pointerEventsSystem,
  // InputAction,
  GltfContainer,
  InputAction
} from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { DclUser } from 'shared-dcl/src/playfab/dcluser'
// import { SoundManager } from 'shared-dcl/src/sound/soundmanager'
import { Eventful, HitMeteorEvent } from 'src/events'
import { FiniteStateMachine } from 'shared-dcl/src/fsm/typestate'
import { MeteorInstance } from 'src/projectdata'
import { ProjectLoader } from 'src/projectloader'
import { addEphemeralComponentToEntity } from 'shared-dcl/src/timer/ephemeral'
import { ProgressBox } from 'src/ui/progressbox'
import { MeteorTypeList } from './meteortypelist'
import { MeteorState } from 'src/states'
import { MeteorTypeId } from 'src/enums'
import * as utils from '@dcl-sdk/utils'
import { GameUi } from 'src/ui/gameui'
import { SoundManager } from 'shared-dcl/src/sound/soundmanager'

export class Meteor {
  static activeMeteors: Meteor[] = []
  public static listMeteors = (): void => {
    console.log('ACTIVE METEORS ==========')
    for (const m of Meteor.activeMeteors) {
      if (m.instanceData != null) {
        console.log('Meteor ' + m.instanceData.id + ' with ' + m.hits + ' hits')
      }
    }
  }

  public removeMeteor(meteor: Meteor, removeEntity: boolean = true): void {
    const index: number = Meteor.activeMeteors.indexOf(meteor)
    if (index >= 0) {
      Meteor.activeMeteors.splice(index, 1)
    }

    if (removeEntity) {
      if (meteor.entity != null) {
        engine.removeEntity(meteor.entity)
      }
    }
  }

  public removeMeteorById(id: string, removeEntity: boolean = true): void {
    for (const m of Meteor.activeMeteors) {
      if (m.instanceData != null) {
        if (m.instanceData.id === id) {
          this.removeMeteor(m, removeEntity)
          break
        }
      }
    }
  }

  public getMeteorById(id: string): Meteor | null {
    for (const m of Meteor.activeMeteors) {
      if (m.instanceData != null) {
        if (m.instanceData.id === id) {
          return m
        }
      }
    }
    return null
  }

  public yAdjust: number = 85 // 50;

  public instanceData: MeteorInstance | null = null

  public entity: Entity = engine.addEntity()

  public modelEntity: Entity = engine.addEntity()
  public modelFile: string = ''
  public shape: PBGltfContainer | null = null
  // public rigidBody:RigidBody;
  public finalModelScale: Vector3 = Vector3.create(1, 1, 1)
  // public displayTxt: TextShape;

  public idleAnim: PBAnimationState = { clip: '' }
  public dropAnim: PBAnimationState = { clip: '' }
  public hitAnim: PBAnimationState = { clip: '' }
  public depleteAnim: PBAnimationState = { clip: '' }

  public enabled: boolean = true

  public fsm: FiniteStateMachine<MeteorState> | null = null

  public pb: ProgressBox | null = null

  /**
   * Number of seconds until this meteorite disappears
   */
  public duration: number = 150
  /**
   * The total number of hits this meteorite can take before it disappears
   */
  public maxHits: number = 10
  /**
   * How many hits are left until it disappears
   */
  public hits: number = 0
  /**
   * IDs of all the players that have already hit this meteorite
   */
  public hitters: string[] = []

  public isShared: boolean = false

  // hit flags
  public hasLootDropped: boolean = false
  public isMiningDone: boolean = false
  public alreadyMined: boolean = false

  public static onHitCallback: (hitPoint: Vector3, m: Meteor) => boolean

  constructor(_data: MeteorInstance) {
    if (_data !== null && _data !== undefined) {
      if (this.loadInstance(_data)) {
        // log("loaded Meteor at " + _data["pos"]);
        console.log('ENTITY ADDED TO ENGINE!')
      }
    }
  }

  /**
   * Creates an entity for the meteor, then loads the 3d model as a child entity to that.
   * Position, scale, and angle are all set on the parent entity.
   * The model itself is set to position (0, 0, 0), scale(1, 1, 1), and angles (0, 0, 0).
   * @param _data
   */

  loadInstance(_data: MeteorInstance): boolean {
    console.log('Load Instance running')
    let loader = ProjectLoader.instance
    if (loader === undefined) {
      loader = new ProjectLoader()
    }

    // --- load the instance data and Meteor type
    const mi: MeteorInstance = loader.loadMeteorInstance(_data)
    console.log('meteor id=' + mi.id)

    mi.type = MeteorTypeList.getType(mi.typeName)

    if (mi.type === undefined) return false

    this.instanceData = mi

    if (mi.typeName !== MeteorTypeId[MeteorTypeId.Local]) {
      console.log('Meteor is SHARED, duration=' + mi.duration)
      this.isShared = true
      if (mi.duration > 0) this.duration = mi.duration
    }

    this.finalModelScale = Vector3.create(...mi.scale)
    this.modelFile = mi.type.filename

    const entityPos: Vector3.MutableVector3 = Vector3.create(...mi.pos)
    // need height for the initial fall
    // if (entityPos.y > -this.yAdjust)
    // {
    entityPos.y = entityPos.y - this.yAdjust // underground
    // log("entityPos=" + entityPos);
    // }
    // log("entityPos=" + entityPos);
    const entityAngles: Vector3.MutableVector3 = Vector3.create(...mi.angles)

    // --- create and position the parent entity (holder)
    // start it small so it's very hard to see until it starts dropping from the skies
    // NOTE: scaling was causing a problem -- when the default animation started while scaled at 0.01, it disappeared
    // It's a known SDK problem, according to Nico. Removing all scaling tricks for now.
    const trans: TransformType = {
      position: entityPos,
      scale: Vector3.create(...mi.scale),
      rotation: Quaternion.fromEulerDegrees(entityAngles.x, entityAngles.y, entityAngles.z)
    } // new Vector3(0.01, 0.01, 0.01)
    Transform.createOrReplace(this.entity, trans)
    // --- load the GLTF model
    const m: MeteorInstance = new MeteorInstance()
    m.pos = [0, 0, 0]
    m.angles = [0, 0, 0]
    m.scale = [1, 1, 1]
    m.type = mi.type

    const mod: Entity = loader.spawnMeteorModel(m)

    Transform.getMutable(mod).parent = this.entity
    // --- set the animations

    if (mi.type.idleClip !== 'none') {
      this.idleAnim = { clip: mi.type.idleClip, loop: true }
    }

    if (mi.type.dropClip !== 'none') {
      this.dropAnim = { clip: mi.type.dropClip, loop: false }
    }
    if (mi.type.hitClip !== 'none') {
      this.hitAnim = { clip: mi.type.hitClip, loop: false }
    }
    if (mi.type.depleteClip !== 'none') {
      this.depleteAnim = { clip: mi.type.depleteClip, loop: false }
    }

    if (mi.type.dropClip !== 'none' || mi.type.hitClip !== 'none' || mi.type.depleteClip !== 'none') {
      Animator.create(mod, {
        states: [this.idleAnim, this.dropAnim, this.hitAnim, this.depleteAnim]
      })
    }
    this.modelEntity = mod

    this.setupStateMachine()

    // add sounds
    SoundManager.attachSoundFile(this.modelEntity, 'meteorFall', mi.type.dropSound)

    // --- make this a physics object
    // this.rigidBody = new RigidBody( this.entity, new Vector3(1,0,1), 0.6, 0.2, true);
    // this.entity.addComponent(this.rigidBody);

    // 2DO: Replace with callLater scheme. Then if hit within 15 seconds of the end, extend time and remove after mining is done
    addEphemeralComponentToEntity(this.entity, this.duration * 1000, () => {
      this.onMeteorExpired()
    })

    pointerEventsSystem.onPointerDown(
      {
        entity: this.modelEntity,
        opts: { button: InputAction.IA_POINTER, hoverText: 'Mine', maxDistance: 8 }
      },
      (event) => {
        if (event.hit != null) {
          const hp: Vector3 | undefined = event.hit.position // Obtiene las coordenadas del hit
          this.onHitByPlayer(hp)
        }
      }
    )

    return true
  }

  onMeteorExpired(): void {
    if (this.instanceData !== null) console.log('removing meteor ' + this.instanceData.id)

    this.removeMeteor(this, false)
  }

  setupStateMachine(): void {
    // Construct the FSM with the inital state
    this.fsm = new FiniteStateMachine<MeteorState>(MeteorState.Idle)

    // Valid states
    // Meteor starts by falling from the sky.
    // Idle is a temporary state while it waits invisible in the sky
    this.fsm.from(MeteorState.Idle).to(MeteorState.Falling)
    // After a meteor has landed, it gets activated (ready for mining)
    this.fsm.from(MeteorState.Falling).to(MeteorState.Active)
    // accommodating quick clickers, and a current problem with Delay
    this.fsm.from(MeteorState.Falling).to(MeteorState.Mining)

    // For meteors already on the ground when you get there
    this.fsm.from(MeteorState.Idle).to(MeteorState.Active)

    // The normal transition to mining when someone clicks
    this.fsm.from(MeteorState.Active).to(MeteorState.Mining)

    // When a meteor reaches its maxHits, it becomes Depleted
    this.fsm.from(MeteorState.Mining).to(MeteorState.Depleted)
    this.fsm.from(MeteorState.Active).to(MeteorState.Depleted)

    // In case we want to reset a mined-out meteor
    this.fsm.from(MeteorState.Depleted).to(MeteorState.Idle)

    // Trigger the right methods for each state
    this.fsm.on(MeteorState.Idle, (from: MeteorState | undefined) => {
      this.onIdle()
    })
    this.fsm.on(MeteorState.Falling, (from: MeteorState | undefined) => {
      this.onDrop()
    })
    // this.fsm.on(MeteorState.Idle, (from: MeteorState) => {
    //     this.onIdle();
    // });
    this.fsm.on(MeteorState.Active, (from: MeteorState | undefined) => {
      this.onActivate()
    })
    this.fsm.on(MeteorState.Mining, (from: MeteorState | undefined) => {
      this.onHit()
    })
    this.fsm.on(MeteorState.Depleted, (from: MeteorState | undefined) => {
      this.onDeplete()
    })

    // // Listen for transitions to interrupt if needed; if the callback returns false the transition is canceled.
    // this.fsm.onEnter(RaceGateState.Walking, ()=>{
    //     // set inTransit, so if choosing a destination fails, nextFrame() will handle switching back to idle
    //     this.inTransit = true;
    //     if (this.waypoints == null || this.waypoints.length == 0)
    //     {
    //         return false;
    //     }
    //     return true;
    // });
  }

  init(): void {
    this.onIdle()
  }

  idle(): void {
    if (this.fsm != null) {
      this.fsm.go(MeteorState.Idle)
    }
  }

  onIdle(): void {
    utils.timers.setTimeout(() => {
      this.drop()
    }, 3000)
  }

  drop(): void {
    if (this.fsm != null) {
      this.fsm.go(MeteorState.Falling)
    }
  }

  onDrop(): void {
    // log("Meteor.onDrop()");

    // scale down
    this.stopAnimations()

    // this.setScale(this.finalModelScale);
    this.enabled = true // should be false!

    // this.idleAnim.stop();

    // this.idleAnim.weight = 0;
    // this.dropAnim.weight = 1;
    Animator.getClip(this.modelEntity, this.dropAnim.clip).playing = true
    Animator.getClip(this.modelEntity, this.dropAnim.clip).shouldReset = true
    // this.dropAnim.playing = true

    // log("meteor audio clip = " + as.audioClip.url);

    SoundManager.playOnce(this.modelEntity, 1.0)

    // put it up at the drop point
    this.moveY(this.yAdjust)

    // let trans = this.entity.getComponent(Transform);
    // log("active meteor at " + trans.position + "; scale=" + trans.scale);
    // let shape = this.modelEntity.getComponent(GLTFShape);
    // log("visible shape: " + shape.visible);

    // 2DO: why doesn't this delayed function ever happen?
    utils.timers.setTimeout(() => {
      console.log('activating meteor')
      this.activate()
      // let trans = this.entity.getComponent(Transform);
      // log("active meteor at " + trans.position + "; scale=" + trans.scale);
      // let shape = this.modelEntity.getComponent(GLTFShape);
      // log("visible shape: " + shape.visible);
      // shape.visible = true;
    }, 3000)
  }

  setScale(_scale: Vector3): void {
    const trans: TransformType = Transform.get(this.entity)
    trans.scale = _scale
    Transform.getMutable(this.entity).scale = trans.scale
  }

  moveY(deltaY: number): void {
    const trans: TransformType = Transform.get(this.entity)
    Transform.getMutable(this.entity).position = Vector3.create(
      trans.position.x,
      trans.position.y + deltaY,
      trans.position.z
    )
  }

  activate(): void {
    console.log('Meteor.activate()')
    if (this.fsm != null) {
      this.fsm.go(MeteorState.Active)
    }
  }

  onActivate(): void {
    // console.log("Meteor.onActivate(), added=" + this.entity.isAddedToEngine() + ", model added=" + this.modelEntity.isAddedToEngine());
    this.enabled = true
    // this.stopAnimations();

    if (this.isShared) {
      // create a new ProgressBox instance and place it directly above the meteor
      this.pb = new ProgressBox(Vector3.create(0, 6.6, 0), Vector3.create(0.5, 0.5, 0.5), Vector3.create(0, 0, 0), true)
      Transform.getMutable(this.pb.entity).parent = this.entity
      const prog: number = this.hits > 0 ? this.hits / this.maxHits : 0
      this.pb.setProgress(prog)

      // if the player has already hit this, disable it
      // if (this.alreadyMined) this.disable();
    }
  }

  hit(): void {
    console.log('Meteor.hit()')
    if (this.fsm != null) {
      if (this.fsm.currentState !== MeteorState.Mining) {
        this.fsm.go(MeteorState.Mining)
      }
    }
  }

  onHit(): void {
    console.log('Meteor.onHit()')
    this.enabled = false
    // this.dropAnim.stop();
    // this.dropAnim.weight = 0;
    // this.stopAnimations();
    // 2DO: Add delay here?
    // this.hitAnim.weight = 1;
    Animator.getClip(this.modelEntity, this.hitAnim.clip).shouldReset = true
    Animator.playSingleAnimation(this.modelEntity,this.hitAnim.clip)
  }

  /**
   * Called when the player clicks on this meteor
   */
  onHitByPlayer(hitPoint: Vector3 | undefined): void {
    // log("onHitByPlayer() enabled=" + this.enabled);
    if (this.alreadyMined) {
      // log("Player has already hit this meteor!");
      if (GameUi.instance != null) {
        GameUi.instance.showTimedMessage('You already mined this meteor.', 5000)
      }
      this.disable()
      return
    } else {
      for (let i = 0; i < this.hitters.length; i++) {
        if (this.hitters[i] === DclUser.activeUser.userId) {
          // log("Player has already hit this meteor!");
          if (GameUi.instance != null) {
            GameUi.instance.showTimedMessage('You already mined this meteor.', 5000)
          }
          return
        }
      }
    }

    if ((this.isShared && this.hits >= this.maxHits) || this.fsm?.currentState === MeteorState.Depleted) {
      // log("Meteor is already depleted!");
      if (GameUi.instance != null) {
        GameUi.instance.showTimedMessage('This meteor is depleted.', 5000)
      }
      return
    }

    if (!this.enabled) return

    if (this.onHitByPlayer != null) {
      console.log('METEOR HIT')
      Eventful.instance.fireEvent(new HitMeteorEvent(this, hitPoint))
      // if (Meteor.onHitCallback(hitPoint, this))
      // {
      //   // record the hit
      //   this.hitters.push(DclUser.activeUser.userId);
      //   // can't hit this meteor any more
      //   this.modelEntity.removeComponent(OnPointerDown);
      // }
    } else {
      // record the hit
      this.hitters.push(DclUser.activeUser.userId)
    }

    // remove the OnClick
  }

  disable(): void {
    // record the hit
    this.hitters.push(DclUser.activeUser.userId)
    // can't hit this meteor any more
    pointerEventsSystem.removeOnPointerDown(this.modelEntity)
  }

  deplete(): void {
    if (this.fsm != null) {
      this.fsm.go(MeteorState.Depleted)
    }
  }

  onDeplete(): void {
    console.log('Meteor.onDeplete()')
    this.enabled = false

    this.stopAnimations()
    Animator.playSingleAnimation(this.modelEntity, this.depleteAnim.clip)

    utils.timers.setTimeout(() => {
      this.removeMeteor(this)

      if (this.pb != null) {
        engine.removeEntity(this.pb.entity)
      }
    }, 15000)

    // sound plays
  }

  stopAnimations(): void {
    // if (this.dropAnim != null)
    // {
    //   //this.dropAnim.stop();
    //   this.dropAnim.weight = 0;
    // }
    Animator.stopAllAnimations(this.modelEntity, false)
    // this.hitAnim.playing = false
    // this.hitAnim.weight = 0;
    // if (this.idleAnim != null)
    // {
    //   //this.idleAnim.stop();
    //   this.idleAnim.weight = 0;
    // }
    // if (this.depleteAnim != null)
    // {
    //   //this.depleteAnim.stop();
    //   this.depleteAnim.weight = 0;
    // }
  }

  setHits(hits: number): void {
    if (hits < 0) hits = 0
    this.hits = Math.min(hits, this.maxHits)
    if (this.isShared && this.pb != null) {
      this.pb.setProgress(this.hits / this.maxHits)
    }
  }

  getShape(): PBGltfContainer {
    return GltfContainer.get(this.modelEntity)
  }

  reset(): void {
    this.stopAnimations()
  }
}
