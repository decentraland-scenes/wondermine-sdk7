import { engine, type Entity } from '@dcl/sdk/ecs'

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
        console.log('Tiempo alcanzado. Ejecutando callback.')
        ephemeral.onTimeReachedCallback()
      }

      engine.removeEntity(entity)

      ephemeralEntities.delete(entity)
      console.log('Entidad eliminada y sistema actualizado')
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
