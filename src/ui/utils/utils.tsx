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

export function getSizeAsNumber(size: string | undefined): number {
  return size != null ? parseInt(size, 10) : 0
}

export function getSizeAsText(text: string): number {
  const baseWidth = 12; // Asumimos que cada carácter ocupa un ancho base de 12px.
  let calculatedWidth = text.length * baseWidth;
  
  // Aseguramos que el width esté entre 10 y 200
  if (calculatedWidth < 10) {
      calculatedWidth = 10;
  } else if (calculatedWidth > 200) {
      calculatedWidth = 200;
  }

  return calculatedWidth;
}

export function trimLeadingSpaces(str: string): string {
  return str.replace(/^\s+/, '');
}
