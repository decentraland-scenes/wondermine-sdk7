import { engine, type Entity } from '@dcl/sdk/ecs'
import { type Vector3 } from '@dcl/sdk/math'
import { type MeteorInstance } from 'src/projectdata'
import { EphemeralComponent } from 'src/timer/ephemeral'

export class Meteor {
  public meteor: number
  static activeMeteors: Meteor[] = []
  public instanceData: MeteorInstance | null = null
  public hits: number = 0
  public maxHits: number = 10
  public hitters: string[] = []
  public entity: Entity | null = null

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
        EphemeralComponent.deleteFrom(meteor.entity)
      }
    }
  }

  constructor() {
    this.meteor = 1
    // EphemeralComponent.create(this.entity, {
    //   targetTime: this.duration, // En segundos
    //   elapsedTime: 0
    // });
  }
}
