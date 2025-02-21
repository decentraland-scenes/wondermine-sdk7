import { engine, type Entity, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { MeteorTypeId } from 'src/enums'
import { MeteorInstance } from 'src/projectdata'
import { ProjectLoader } from 'src/projectloader'
import { MeteorTypeList } from './meteortypelist'
import { addEphemeralComponentToEntity } from 'src/timer/ephemeral'
import * as utils from '@dcl-sdk/utils'
import { Eventful, HitMeteorEvent } from 'src/events'
import { DclUser } from 'shared-dcl/src/playfab/dcluser'

export class Meteor {
  public meteor: number
  static activeMeteors: Meteor[] = []
  public instanceData: MeteorInstance | null = null
  public hits: number = 0
  public maxHits: number = 10
  public hitters: string[] = []
  public entity: Entity = engine.addEntity()

  public isShared: boolean = false

  // hit flags
  public hasLootDropped: boolean = false
  public isMiningDone: boolean = false
  public alreadyMined: boolean = false

  public static onHitCallback: (hitPoint: Vector3, m: Meteor) => boolean

  public static listMeteors = (): void => {
    console.log('ACTIVE METEORS ==========')
    for (const m of Meteor.activeMeteors) {
      if (m.instanceData != null) console.log('Meteor ' + m.instanceData.id + ' with ' + m.hits + ' hits')
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
  public modelEntity: Entity | null = null
  public modelFile: string | null = null
  public shape: string | null = null

  public finalModelScale: Vector3 = Vector3.create(1, 1, 1)
  public duration: number = 150
  // public anim: Animator
  // public idleAnim: AnimationState
  // public dropAnim: AnimationState
  // public hitAnim: AnimationState
  // public depleteAnim: AnimationState

  public enabled: boolean = true

  constructor(_data: MeteorInstance) {
    this.meteor = 1
    if (_data !== null && _data !== undefined) {
      console.log(this.loadInstance(_data), ' -->>>>> THIS NEEDS TO BE TRUE ')
      if (this.loadInstance(_data)) {
        // log("loaded Meteor at " + _data["pos"]);
        this.entity = engine.addEntity()
        console.log('ENTITY ADDED TO ENGINE!')
      }
    }
  }

  loadInstance(_data: MeteorInstance): boolean {
    console.log('Load Instance running')
    let loader = ProjectLoader.instance
    if (loader === undefined) {
      loader = new ProjectLoader()
    }

    // --- load the instance data and Meteor type
    const mi: MeteorInstance = loader.loadMeteorInstance(_data)
    console.log('meteor id=' + mi.id)
    // TODO hardcoded meteor List
    MeteorTypeList.types.SmallMeteor = {
      name: 'SmallMeteor',
      filename: 'assets/models/meteors/meteor_gold_old.glb',
      scale: [1, 1, 1],
      metalType: 1,
      chance: 100,
      idleClip: 'idle',
      dropClip: 'drop',
      hitClip: 'hit',
      depleteClip: 'deplete',
      dropSound: 'sounds/meteorFall.mp3'
    }
    mi.type = MeteorTypeList.getType(mi.typeName)
    console.log(mi.type, 'Might be the problem')

    if (mi.type === undefined) return false

    this.instanceData = mi

    if (mi.typeName !== MeteorTypeId[MeteorTypeId.Local]) {
      console.log('Meteor is SHARED, duration=' + mi.duration)
      this.isShared = true
      if (mi.duration > 0) this.duration = mi.duration
    }

    this.finalModelScale = Vector3.create(...mi.scale)
    this.modelFile = mi.type.filename

    let entityPos: Vector3 = Vector3.create(...mi.pos)
    // need height for the initial fall
    // if (entityPos.y > -this.yAdjust)
    // {
    // TODO -> potential error, must test.
    const newPos = entityPos.y - this.yAdjust // underground
    entityPos = Vector3.create(newPos)
    // log("entityPos=" + entityPos);
    // }
    // log("entityPos=" + entityPos);
    // const entityAngles: Vector3 = Vector3.create(...mi.angles)

    // --- create and position the parent entity (holder)
    // start it small so it's very hard to see until it starts dropping from the skies
    // NOTE: scaling was causing a problem -- when the default animation started while scaled at 0.01, it disappeared
    // It's a known SDK problem, according to Nico. Removing all scaling tricks for now.
    if (this.entity !== null) {
      Transform.createOrReplace(this.entity, { position: entityPos, scale: Vector3.create(...mi.scale) }) // new Vector3(0.01, 0.01, 0.01)
      Transform.getMutable(this.entity).rotation = Quaternion.fromEulerDegrees(mi.angles[0], mi.angles[1], mi.angles[2])
      console.log('ACA')
      addEphemeralComponentToEntity(this.entity, 5000, () => {
        console.log('¡El tiempo ha pasado y la entidad ha sido eliminada!')
      })
      // log("ADDED TRANS");
    }
    // --- load the GLTF model
    const m: MeteorInstance = new MeteorInstance()
    m.pos = [0, 0, 0]
    m.angles = [0, 0, 0]
    m.scale = [1, 1, 1]
    m.type = mi.type

    const mod: Entity = loader.spawnMeteorModel(m)
    if (this.entity != null) {
      Transform.getMutable(mod).parent = this.entity
    }

    // --- set the animations
    // this.anim = new Animator()
    // if (mi.type.dropClip != 'none' || mi.type.hitClip != 'none' || mi.type.depleteClip != 'none') {
    //   mod.addComponent(this.anim)
    // }
    // this.modelEntity = mod

    // if (mi.type.idleClip != 'none') {
    //   this.idleAnim = new AnimationState(mi.type.idleClip, { looping: true, layer: 0 })
    //   this.anim.addClip(this.idleAnim)
    // }
    // if (mi.type.dropClip != 'none') {
    //   this.dropAnim = new AnimationState(mi.type.dropClip, { looping: false, layer: 0 })
    //   this.anim.addClip(this.dropAnim)
    // }
    // if (mi.type.hitClip != 'none') {
    //   this.hitAnim = new AnimationState(mi.type.hitClip, { looping: false, layer: 0 })
    //   this.anim.addClip(this.hitAnim)
    // }
    // if (mi.type.depleteClip != 'none') {
    //   this.depleteAnim = new AnimationState(mi.type.depleteClip, { looping: false, layer: 0 })
    //   this.anim.addClip(this.depleteAnim)
    // }

    // this.setupStateMachine()
    // log("ADDED STATE MACHINE");

    // add sounds
    // SoundManager.attachSoundFile(this.modelEntity, 'meteorFall', mi.type.dropSound)

    // --- make this a physics object
    // this.rigidBody = new RigidBody( this.entity, new Vector3(1,0,1), 0.6, 0.2, true);
    // this.entity.addComponent(this.rigidBody);

    // 2DO: Replace with callLater scheme. Then if hit within 15 seconds of the end, extend time and remove after mining is done
    if (this.entity !== null) {
      console.log('Adding Ephemeral Component')
    }

    // this.modelEntity.addComponentOrReplace(
    //   new OnPointerDown(
    //     (e) => {
    //       // log("OnPointerUp on: ", e)
    //       // DONE Trigger pickaxe placement and animation; use callback or event?
    //       // 1DO Place pickaxe in front of meteor
    //       // DONE play mining animation

    //       // DONE call server to get loot drop
    //       // DONE take coins for hit

    //       // DONE after delay for anim+server call, popup loot result window

    //       const hp: Vector3 = new Vector3(e.hit.hitPoint.x, e.hit.hitPoint.y, e.hit.hitPoint.z)
    //       // need dot product to get the destination point?
    //       // log("hitPoint: " + hp);
    //       this.onHitByPlayer(hp)
    //     },
    //     {
    //       button: ActionButton.POINTER,
    //       showFeedback: true,
    //       hoverText: 'Mine',
    //       distance: 8
    //     }
    //   )
    // )

    // let pos = this.entity.getComponent(Transform).position;
    // log("SPAWNED METEOR AT" + pos);

    return true
  }

  onMeteorExpired(): void {
    if (this.instanceData !== null) console.log('removing meteor ' + this.instanceData.id)

    this.removeMeteor(this, false)
  }

  // setupStateMachine(): void {
  //   // Construct the FSM with the inital state
  //   this.fsm = new FiniteStateMachine<MeteorState>(MeteorState.Idle)

  //   // Valid states
  //   // Meteor starts by falling from the sky.
  //   // Idle is a temporary state while it waits invisible in the sky
  //   this.fsm.from(MeteorState.Idle).to(MeteorState.Falling)
  //   // After a meteor has landed, it gets activated (ready for mining)
  //   this.fsm.from(MeteorState.Falling).to(MeteorState.Active)
  //   // accommodating quick clickers, and a current problem with Delay
  //   this.fsm.from(MeteorState.Falling).to(MeteorState.Mining)

  //   // For meteors already on the ground when you get there
  //   this.fsm.from(MeteorState.Idle).to(MeteorState.Active)

  //   // The normal transition to mining when someone clicks
  //   this.fsm.from(MeteorState.Active).to(MeteorState.Mining)

  //   // When a meteor reaches its maxHits, it becomes Depleted
  //   this.fsm.from(MeteorState.Mining).to(MeteorState.Depleted)
  //   this.fsm.from(MeteorState.Active).to(MeteorState.Depleted)

  //   // In case we want to reset a mined-out meteor
  //   this.fsm.from(MeteorState.Depleted).to(MeteorState.Idle)

  //   // Trigger the right methods for each state
  //   this.fsm.on(MeteorState.Idle, (from: MeteorState) => {
  //     this.onIdle()
  //   })
  //   this.fsm.on(MeteorState.Falling, (from: MeteorState) => {
  //     this.onDrop()
  //   })
  //   // this.fsm.on(MeteorState.Idle, (from: MeteorState) => {
  //   //     this.onIdle();
  //   // });
  //   this.fsm.on(MeteorState.Active, (from: MeteorState) => {
  //     this.onActivate()
  //   })
  //   this.fsm.on(MeteorState.Mining, (from: MeteorState) => {
  //     this.onHit()
  //   })
  //   this.fsm.on(MeteorState.Depleted, (from: MeteorState) => {
  //     this.onDeplete()
  //   })
  // }

  init(): void {
    this.onIdle()
  }

  idle(): void {
    // this.fsm.go(MeteorState.Idle);
  }

  onIdle(): void {
    utils.timers.setTimeout(() => {
      this.drop()
    }, 3000)
  }

  drop(): void {
    // this.fsm.go(MeteorState.Falling)
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
    // this.dropAnim.play(true)

    // const as: AudioSource = this.modelEntity.getComponent(AudioSource)
    // log("meteor audio clip = " + as.audioClip.url);

    // SoundManager.playOnce(this.modelEntity, 1.0)

    // put it up at the drop point
    this.moveY(this.yAdjust)

    // let trans = this.entity.getComponent(Transform);
    // log("active meteor at " + trans.position + "; scale=" + trans.scale);
    // let shape = this.modelEntity.getComponent(GLTFShape);
    // log("visible shape: " + shape.visible);

    // 2DO: why doesn't this delayed function ever happen?
    // if (this.entity.hasComponent(Delay)) {
    //   this.entity.removeComponent(Delay)
    // }

    // TODO
  }

  setScale(_scale: Vector3): void {
    if (this.entity !== null) Transform.getMutable(this.entity).scale = _scale
  }

  moveY(deltaY: number): void {
    if (this.entity !== null) {
      Transform.getMutable(this.entity).position.y = Transform.get(this.entity).position.y + deltaY
    }
  }

  activate(): void {
    console.log('Meteor.activate()')
    // this.fsm.go(MeteorState.Active)
  }

  hit(): void {
    console.log('Meteor.hit()')
    // if (this.fsm.currentState != MeteorState.Mining) {
    //   // this.fsm.go(MeteorState.Mining)
    // }
  }

  onHit(): void {
    console.log('Meteor.onHit()')
    this.enabled = false
    // this.dropAnim.stop();
    // this.dropAnim.weight = 0;
    // this.stopAnimations();
    // 2DO: Add delay here?
    // this.hitAnim.weight = 1;
    // this.hitAnim.play(true)
  }

  /**
   * Called when the player clicks on this meteor
   */
  onHitByPlayer(hitPoint: Vector3): void {
    // log("onHitByPlayer() enabled=" + this.enabled);
    if (this.alreadyMined) {
      // log("Player has already hit this meteor!");
      //  GameUi.instance.showTimedMessage('You already mined this meteor.', 5000)
      this.disable()
      return
    } else {
      for (let i = 0; i < this.hitters.length; i++) {
        // if (this.hitters[i] == DclUser.activeUser.userId) {
        //   // log("Player has already hit this meteor!");
        //   GameUi.instance.showTimedMessage('You already mined this meteor.', 5000)
        //   return
        // }
      }
    }

    // if ((this.isShared && this.hits >= this.maxHits) || this.fsm.currentState == MeteorState.Depleted) {
    //   // log("Meteor is already depleted!");
    //   // GameUi.instance.showTimedMessage('This meteor is depleted.', 5000)
    //   return
    // }

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
    // this.hitters.push(DclUser.activeUser.userId)
    // // can't hit this meteor any more
    // this.modelEntity.removeComponent(OnPointerDown)
  }

  deplete(): void {
    // this.fsm.go(MeteorState.Depleted)
  }

  onDeplete(): void {
    console.log('Meteor.onDeplete()')
    this.enabled = false

    this.stopAnimations()
    // this.depleteAnim.weight = 1;
    // this.depleteAnim.play()

    utils.timers.setTimeout(() => {
      this.removeMeteor(this)

      // if (this.pb != null) {
      //   engine.removeEntity(this.pb)
      // }
    }, 15000)

    // sound plays
  }

  stopAnimations(): void {
    // if (this.dropAnim != null)
    // {
    //   //this.dropAnim.stop();
    //   this.dropAnim.weight = 0;
    // }
    // if (this.hitAnim != null) {
    //   this.hitAnim.stop()
    //   // this.hitAnim.weight = 0;
    // }
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
    // if (this.isShared && this.pb != null) {
    //   this.pb.setProgress(this.hits / this.maxHits)
    // }
  }

  // getShape(): GLTFShape {
  //   return this.modelEntity.getComponent(GLTFShape)
  // }

  reset(): void {
    this.stopAnimations()
  }
}
