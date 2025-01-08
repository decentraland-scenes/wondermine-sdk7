import { type PickaxeType } from './projectdata'
import { ProjectLoader } from './projectloader'

export class PickaxeTypeList {
  static types: Record<string, PickaxeType> = {}
  static totalChance: number = 0
  public name: string = ''

  static loadTypes(dataArray: object[]): boolean {
    for (let i = 0; i < dataArray.length; i++) {
      const type: PickaxeType = ProjectLoader.instance.loadPickaxeType(dataArray[i])
      this.types[type.ItemId] = type
    }

    console.log('loaded ' + dataArray.length + ' pickaxe types')
    return true
  }

  static getType(typeName: string): PickaxeType {
    return PickaxeTypeList.types[typeName]
  }
}
