import { Meteor } from './meteor'
import { MeteorTypeList } from './meteortypelist'

import { type MeteorType, type MeteorInstance } from '../projectdata'
import { MeteorTypeId } from '../enums'
import { Vector3 } from '@dcl/sdk/math'
import { AABB } from 'shared-dcl/src/physics/aabb'
// import { GameManager } from '../gamemanager';

export class MeteorSpawner {
  static instance: MeteorSpawner | null = null
  static localIdNum: number = 0

  public area: AABB
  public intervalSeconds: number = 60
  public elapsedSeconds: number = 0
  public nextInterval = 60

  public xMin: number = 0
  public xWidth: number = 16
  public zMin: number = 0
  public zWidth: number = 16

  public tempY: number = 0

  constructor(
    minutesBetweenMeteors: number,
    left: number,
    bottom: number,
    right: number,
    top: number,
    floorHeight: number,
    boxHeight: number
  ) {
    this.intervalSeconds = Math.max(minutesBetweenMeteors, 1) * 60

    this.xMin = left
    this.xWidth = right - left
    this.zMin = bottom
    this.zWidth = top - bottom

    // create box to define spawning boundaries
    let fullsize: Vector3 = Vector3.create(2, 15, 2)
    let center: Vector3 = Vector3.create(1, 7.5, 1)

    // log("left=" + left + ", right=" + right + ", bottom=" + bottom + ", top=" + top + ", boxHeight=" + boxHeight);
    if (left < right && bottom < top && boxHeight > 0) {
      center = Vector3.create(left + (right - left) / 2, floorHeight + boxHeight / 2, bottom + (top - bottom) / 2)
      fullsize = Vector3.create(right - left, boxHeight, top - bottom)
    }
    // log("##### center=" + center);
    // log("### fullsize=" + fullsize);
    this.area = new AABB(center, fullsize)

    Meteor.activeMeteors = []

    if (MeteorSpawner.instance == null) {
      MeteorSpawner.instance = this
    }
  }

  spawn(typeName: string): Meteor {
    // get meteor type data
    const type: MeteorType = typeName.length > 0 ? MeteorTypeList.getType(typeName) : MeteorTypeList.getRandomType()
    console.log('meteor spawn', type)
    const dropX = this.xMin + Math.ceil(Math.random() * this.xWidth * 1)
    const dropZ = this.zMin + Math.ceil(Math.random() * this.zWidth * 1)

    MeteorSpawner.localIdNum++

    const m: Meteor = this.drop(dropX, dropZ, type, 'local-' + MeteorSpawner.localIdNum)
    Meteor.activeMeteors.push(m)

    return m
  }

  spawnAt(
    x: number,
    z: number,
    typeName: string | null = null,
    id: string | null = null,
    dur: number = 0,
    hits: number = 0,
    maxHits: number = 1,
    alreadyMined: boolean = false
  ): Meteor {
    let type: MeteorType

    if (typeName != null && typeName.length > 0) {
      type = MeteorTypeList.getType(typeName) // Obtener tipo específico
    } else {
      console.log('typeName is null or empty, using random type')

      type = MeteorTypeList.getRandomType() ?? MeteorTypeList.getType(Object.keys(MeteorTypeList.types)[0])
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const dropX = Math.min(Math.max(this.xMin, x), this.area.max.x)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const dropZ = Math.min(Math.max(this.zMin, z), this.area.max.z)

    if (id == null) {
      MeteorSpawner.localIdNum++
      id = 'local-' + MeteorSpawner.localIdNum
    }

    const m: Meteor = this.drop(dropX, dropZ, type, id, dur, hits, maxHits, alreadyMined)
    Meteor.activeMeteors.push(m)

    return m
  }

  drop(
    x: number,
    z: number,
    type: MeteorType,
    id: string = '',
    dur: number = 0,
    hits: number = 0,
    maxHits: number = 1,
    alreadyMined: boolean = false
  ): Meteor {
    // place the meteor at the right point, with disabled status
    // start it tiny, in case it appears on the ground first

    if (dur === 0) {
      dur = type.name !== MeteorTypeId[MeteorTypeId.Local] ? (dur = 600) : (dur = 150)
    }

    // "typeName": type.name,
    // "angles": [ 0, 15 - Math.floor(Math.random() * 30), 0]
    const mData: MeteorInstance = {
      type,
      typeName: type.name,
      id,
      pos: [x, this.area.center.y - this.area.halfSize.y, z],
      scale: [1, 1, 1],
      angles: [0, 0, 0],
      duration: dur
    }

    const meteor: Meteor = new Meteor(mData)
    meteor.hits = type.name !== MeteorTypeId[MeteorTypeId.Local] ? hits : 0
    meteor.maxHits = type.name !== MeteorTypeId[MeteorTypeId.Local] ? maxHits : 1
    console.log('meteor.alreadyMined=' + alreadyMined)
    meteor.alreadyMined = alreadyMined

    // start the falling animation
    // not calling idle() since the meteor is already in idle state
    meteor.onIdle()

    // meteor.entity.addComponentOrReplace(new Delay(4000, () => {
    //     log("dropping Meteor");
    //     meteor.drop();
    //   }))

    // meteor.drop();

    return meteor
  }

  update(dt: number): void {
    this.elapsedSeconds += dt
    if (this.elapsedSeconds >= this.intervalSeconds) {
      console.log('SPAWN METEOR')
      this.spawn(MeteorTypeId[MeteorTypeId.Local])
      // GameManager.instance.spawnMeteor();
      this.elapsedSeconds = 0
      this.nextInterval = this.intervalSeconds + Math.random() * 30
    } 

    // let millis:number = Math.floor(this.elapsedSeconds * 1000);
  }
}
