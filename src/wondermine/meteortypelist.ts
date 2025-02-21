import { type MeteorType } from '../projectdata'
import { ProjectLoader } from '../projectloader'

export class MeteorTypeList {
  static types: Record<string, unknown> = {}
  static totalChance: number = 0
  public name: string = ''

  static loadTypes(dataArray: object[]): boolean {
    let totalChance = 0
    for (let i = 0; i < dataArray.length; i++) {
      const type: MeteorType = ProjectLoader.instance.loadMeteorType(dataArray[i])
      this.types[type.name] = type

      totalChance += type.chance
    }
    this.totalChance = totalChance

    console.log('loaded ' + dataArray.length + ' meteor types')
    return true
  }

  static getType(typeName: string): MeteorType {
    return MeteorTypeList.types[typeName] as MeteorType
  }

  static getRandomType(): MeteorType {
    const rand: number = Math.floor(Math.random() * this.totalChance)
    const typeNames: string[] = Object.keys(this.types)

    let runningTotal: number = 0
    let mt: MeteorType | null = null

    for (let i = 0; i < typeNames.length; i++) {
      mt = this.types[typeNames[i]] as MeteorType // Asegurar el tipo correcto
      runningTotal += mt.chance
      if (runningTotal >= rand) {
        console.log('rand=' + rand + ', running=' + runningTotal + ', type=' + mt.name)
        return mt
      }
    }
    return mt ?? (this.types[typeNames[typeNames.length - 1]] as MeteorType)
  }
}
