import { Transform, engine, type Entity } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

const ephemeralEntities = new Map<Entity, Ephemeral>()

export class Ephemeral {
  elapsedTime: number
  targetTime: number
  onTimeReachedCallback?: () => void

  constructor(millisecs: number, onTimeReachedCallback?: () => void) {
    this.elapsedTime = 0
    this.targetTime = millisecs / 1000 // Convertir a segundos
    this.onTimeReachedCallback = onTimeReachedCallback
  }

  setCallback(onTimeReachedCallback: () => void): void {
    this.onTimeReachedCallback = onTimeReachedCallback
  }
}

export function ephemeralSystem(dt: number): void {
  for (const [entity, ephemeral] of ephemeralEntities) {
    ephemeral.elapsedTime += dt

    if (ephemeral.elapsedTime >= ephemeral.targetTime) {
      if (ephemeral.onTimeReachedCallback != null) {
        ephemeral.onTimeReachedCallback()
      }
      Transform.getMutable(entity).scale = Vector3.create(0, 0, 0)
      ephemeralEntities.delete(entity)
    }
  }
}

engine.addSystem(ephemeralSystem)

export function addEphemeralComponentToEntity(
  entity: Entity,
  millisecs: number,
  onTimeReachedCallback?: () => void
): void {
  const ephemeral = new Ephemeral(millisecs, onTimeReachedCallback)
  ephemeralEntities.set(entity, ephemeral)
}
