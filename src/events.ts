import { type Room } from 'colyseus.js'
import { type ItemInfo } from '../shared-dcl/src/playfab/iteminfo'
import { type Meteor } from '../src/wondermine/meteor'
import { type Vector3 } from '@dcl/sdk/math'
import { EventManager } from './eventManager'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Eventful {
  public static instance: EventManager

  public static createEventManager(): void {
    Eventful.instance = new EventManager()
    Eventful.instance.registerEvent(BenchmarkEvent)
    Eventful.instance.registerEvent(CraftItemEvent)
    Eventful.instance.registerEvent(HitMeteorEvent)
    Eventful.instance.registerEvent(MeteorServerEvent)
    Eventful.instance.registerEvent(MeteorLootEvent)
    Eventful.instance.registerEvent(ChangeToolEvent)
    Eventful.instance.registerEvent(ShowErrorEvent)
    Eventful.instance.registerEvent(MovePlayerEvent)
  }
}

// @EventConstructor()
export class BenchmarkEvent {
  public value: number
  constructor(_value: number) {
    this.value = _value
  }
}

// @EventConstructor()
export class CraftItemEvent {
  public recipeId: string
  public wearableId: number
  public itemClass: string

  constructor(_recipeId: string, _wi: number, _itemClass: string) {
    this.recipeId = _recipeId
    this.wearableId = _wi
    this.itemClass = _itemClass
  }
}

// @EventConstructor()
export class HitMeteorEvent {
  public meteor: Meteor
  public hitPoint: Vector3

  constructor(_meteor: Meteor, _hitPoint: Vector3) {
    this.meteor = _meteor
    this.hitPoint = _hitPoint
  }
}

// @EventConstructor()
export class MeteorServerEvent {
  public msg: string
  public room: Room<any>

  constructor(_msg: string, _room: Room<any>) {
    // _room inside the constructor should allow this '  = null ' in case you dont pass any parameter as a room.
    this.msg = _msg
    this.room = _room
  }
}

// @EventConstructor()
export class MeteorLootEvent {
  public msg: string
  public result: object

  constructor(_msg: string, _result: object) {
    this.msg = _msg
    this.result = _result
  }
}

// @EventConstructor()
export class ChangeToolEvent {
  public newTool: ItemInfo | undefined
  public updateServer: boolean | undefined

  constructor(_newTool: ItemInfo | undefined, _updateSvr: boolean) {
    if (_newTool !== undefined) {
      this.newTool = _newTool
      this.updateServer = _updateSvr
    }
  }
}

// @EventConstructor()
export class ShowErrorEvent {
  public msg: string

  constructor(_msg: string) {
    this.msg = _msg
  }
}

// @EventConstructor()
export class MovePlayerEvent {
  public newPos: Vector3

  constructor(newPos: Vector3) {
    this.newPos = newPos
  }
}
