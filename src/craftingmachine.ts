import { engine, type Entity, Transform } from '@dcl/sdk/ecs'
import { WearablesState } from './enums'
import { type Recipe } from './projectdata'
import { type ItemAmountPanel } from './ui/itemamountpanel'
import { type SpritePlane } from './ui/spriteplane'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { ProjectLoader } from './projectloader'

export type MachineData = {
  filename: string
  pos: number[]
  angles: number[]
}

export type SelectorData = {
  pos: [number, number, number]
  angles: [number, number, number]
}

export type Data = {
  pos: number[]
  angles: number[]
}

export class CraftingMachine {
  public entity: Entity

  public machineModelEntity: Entity = engine.addEntity()
  public machineModelFile: string = ''
  public machineShape: string = ''
  // public machineAnim:Animator;

  public selectorModelEntity: Entity = engine.addEntity()
  public selectorModelFile: string = ''
  public selectorShape: string = ''

  public backButton: Entity = engine.addEntity()
  public nextButton: Entity = engine.addEntity()
  public linkButton: Entity = engine.addEntity()
  public greenLever: Entity = engine.addEntity()

  public idleClip: string = ''
  public craftingClip: string = ''

  public screenEntity: Entity = engine.addEntity()

  public nameTextEntity: Entity = engine.addEntity()
  public nameTxt: string = ''
  public descTxt: string = ''
  public idTxt: string = ''
  public levelMinTxt: string = ''
  public readyTxt: string = ''

  public iconSprite: SpritePlane | null = null
  public arrowSprite: SpritePlane | null = null
  public ingredientPanels: ItemAmountPanel[] = []
  public filePrefix: string = 'assets/models/textures/'
  public textureFile: string = 'assets/models/textures/resources_atlas_1024.png'

  /**
   * The current oage number. Page 0 is the instructions page.
   */
  public pageIndex: number = 0
  public recipeIndex: number = -1

  public isBusy: boolean = false
  public craftedRecipe: Recipe | null = null
  public craftedVoucher: string = ''
  public wearablesState: WearablesState = WearablesState.Inactive
  public timer: number = 0

  // public onCraftingCompleteCallback: (lootEnt:LootItem) => void;
  constructor(_selectorData: SelectorData, _machineData: MachineData, _arrowButtonData: object, _leverData: object) {
    this.entity = engine.addEntity()
    this.machineModelFile = _machineData.filename
    // use selector object as parent transform
    const pos: Vector3 = Vector3.create(..._selectorData.pos)
    const angles: Vector3 = Vector3.create(..._selectorData.angles)
    Transform.create(this.entity, {
      position: pos,
      rotation: Quaternion.fromEulerDegrees(angles.x, angles.y, angles.z)
    })
    // the position and angles for the loaded model should be zero, since the parent handles positioning
    this.machineModelEntity = this.loadModel(_machineData, [-0.1, 0, -2.7], [0, 18, 0])
    Transform.getOrCreateMutable(this.machineModelEntity).parent = this.entity
  }

  loadModel(_data: Data | MachineData, _position: number[] | null = null, _angles: number[] | null = null): Entity {
    let loader = ProjectLoader.instance
    if (loader === undefined) {
      loader = new ProjectLoader()
    }

    if (_position != null) {
      _data.pos = _position
    }
    if (_angles != null) {
      _data.angles = _angles
    }

    return loader.spawnSceneObject(_data, false)
  }
}
