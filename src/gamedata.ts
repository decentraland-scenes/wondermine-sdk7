import { Recipe } from './projectdata'

/**
 * Local store of game-wide data (not user specific)
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class GameData {
  public static instance: GameData | null = null

  public static thresholds: number[] = new Array<number>()
  public static recipes: Recipe[] = new Array<Recipe>()
  public static wearableCounts: Record<number, number> = {}
  public static recipeIndex: number = -1

  public static createInstance(): void {
    if (GameData.instance == null) {
      GameData.instance = new GameData()
    }
  }

  public static setLevels(thresholds: []): void {
    // levelObjects:Array<Object>
    // log(thresholds);
    GameData.thresholds = thresholds
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public static setRecipes(recipeList: Object[]): void {
    // log("setRecipes()");
    const recipeArray: Recipe[] = []
    let item: Recipe

    for (var i: number = 0; i < recipeList.length; i++) {
      try {
        item = this.populate(new Recipe(), recipeList[i]) // TODO: error checking
        recipeArray.push(item)
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        console.log('Error converting recipe item: ' + e)
      }
    }

    if (recipeArray.length > 0) {
      // NOTE: This overrides the existing recipes, since server-side is authoritative
      GameData.recipes = recipeArray
      // log(recipeArray);
    }
  }

  public static setWearableCounts(itemCounts: Record<number, number>): void {
    GameData.wearableCounts = itemCounts
  }

  public static getWearableCount(wi: number): number {
    if (wi === 0) return 0
    let count: number = GameData.wearableCounts[wi]
    if (count == null) count = 0
    return count
  }

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    // GameData.thresholds = [];
    // GameData.recipes = [];
  }

  // --- UTILITY FUNCTIONS ---
  // eslint-disable-next-line @typescript-eslint/ban-types
  static populate(target: Recipe, ...args: Array<Record<string, any>>): Recipe {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!target) {
      throw TypeError('Cannot convert undefined or null to object')
    }
    for (const source of args) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (source) {
        // eslint-disable-next-line no-return-assign
        Object.keys(source).forEach((key) => ((target as any)[key] = source[key]))
      }
    }
    return target
  }

  public static getRecipeNum(index: number): Recipe | null {
    if (index < GameData.recipes.length) {
      return GameData.recipes[index]
    }
    return null
  }

  public static getRecipeById(recipeId: string): Recipe | null {
    let item: Recipe
    for (var i: number = 0; i < GameData.recipes.length; i++) {
      item = GameData.recipes[i]
      if (item.id === recipeId) {
        return item
      }
    }
    return null
  }

  public static nextRecipe(): Recipe | null {
    if (GameData.recipes.length === 0) return null

    if (++GameData.recipeIndex >= GameData.recipes.length) {
      GameData.recipeIndex = 0
    }
    return GameData.recipes[GameData.recipeIndex]
  }
}
