import { type Coords } from '@dcl/sdk/ecs'

export function getUvs(sprite: PanelSprite | undefined, atlasSize: { x: number; y: number }): number[] {
  if (sprite !== undefined) {
    const A: Coords = {
      x: sprite.sourceLeft / atlasSize.x,
      y: 1 - (sprite.sourceTop + sprite.sourceHeight) / atlasSize.y
    }
    const B: Coords = {
      x: sprite.sourceLeft / atlasSize.x,
      y: 1 - sprite.sourceTop / atlasSize.y
    }
    const C: Coords = {
      x: (sprite.sourceLeft + sprite.sourceWidth) / atlasSize.x,
      y: 1 - sprite.sourceTop / atlasSize.y
    }
    const D: Coords = {
      x: (sprite.sourceLeft + sprite.sourceWidth) / atlasSize.x,
      y: 1 - (sprite.sourceTop + sprite.sourceHeight) / atlasSize.y
    }

    return [A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y]
  }
  return []
}

export type PanelSprite = {
  width: string
  height: string
  positionX: number
  positionY: number
  sourceLeft: number
  sourceTop: number
  sourceWidth: number
  sourceHeight: number
}
