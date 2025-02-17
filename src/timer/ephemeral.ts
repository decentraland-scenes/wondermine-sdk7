import { engine, Schemas } from '@dcl/sdk/ecs'

export const EphemeralComponent = engine.defineComponent('EphemeralComponent', {
  targetTime: Schemas.Float,
  elapsedTime: Schemas.Float
})
export function ephemeralSystem(dt: number): void {
  for (const [entity] of engine.getEntitiesWith(EphemeralComponent)) {
    const ephemeral = EphemeralComponent.getMutable(entity)
    ephemeral.elapsedTime += dt

    if (ephemeral.elapsedTime >= ephemeral.targetTime) {
      console.log('Ephemeral component reached its target time, removing entity.')

      engine.removeEntity(entity)
    }
  }
}

// Agregar el sistema al motor de ejecución
engine.addSystem(ephemeralSystem)
