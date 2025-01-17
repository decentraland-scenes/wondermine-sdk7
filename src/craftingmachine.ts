import {
  Animator,
  engine,
  type Entity,
  InputAction,
  inputSystem,
  PointerEvents,
  PointerEventType,
  Transform
} from '@dcl/sdk/ecs'
import { ItemIcons, WearablesState } from './enums'
import { type Recipe } from './projectdata'
import { type ItemAmountPanel } from './ui/itemamountpanel'
import { type SpritePlane } from './ui/spriteplane'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { ProjectLoader } from './projectloader'
import { som } from './som'
import { SoundManager } from '../shared-dcl/src/sound/soundmanager'
import { openExternalUrl } from '~system/RestrictedActions'
import { GameData } from './gamedata'

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
  public craftingClip: string = 'machine'

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
  constructor(_selectorData: SelectorData, _machineData: MachineData, _arrowButtonData: Data, _leverData: Data) {
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
    Animator.create(this.machineModelEntity, {
      states: [
        {
          clip: this.craftingClip,
          loop: false
        }
      ]
    })
    // add sounds
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    SoundManager.attachSoundFile(this.machineModelEntity, 'CraftingMachine', som.scene.crafter.soundFile)
    // the platform rotates all by itself, to stay flat
    this.selectorModelEntity = this.loadModel(_selectorData, [0, 0, 0], [0, 0, 0])
    Transform.getOrCreateMutable(this.selectorModelEntity).parent = this.entity

    this.backButton = this.loadModel(_arrowButtonData, [-0.25, 0.93, 0.1], [0, 180, -48])
    Transform.getOrCreateMutable(this.backButton).parent = this.entity
    PointerEvents.createOrReplace(this.backButton, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: '< BACK',
            maxDistance: 8
          }
        }
      ]
    })

    this.nextButton = this.loadModel(_arrowButtonData, [-0.25, 0.93, -0.1], [0, 0, 48])
    Transform.getOrCreateMutable(this.nextButton).parent = this.entity
    PointerEvents.createOrReplace(this.nextButton, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'NEXT >',
            maxDistance: 8
          }
        }
      ]
    })

    this.greenLever = this.loadModel(_leverData, [-0.1, 0.01, -2.7], [0, 18, 0])
    Transform.getOrCreateMutable(this.greenLever).parent = this.entity
    PointerEvents.createOrReplace(this.greenLever, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'CRAFT THIS ITEM',
            maxDistance: 8
          }
        }
      ]
    })

    this.linkButton = this.loadModel(_arrowButtonData, [-1.6, 1.81, -3.4], [0, 48, 90])
    Transform.getOrCreateMutable(this.linkButton).parent = this.entity
    PointerEvents.createOrReplace(this.linkButton, {
      pointerEvents: [
        {
          eventType: PointerEventType.PET_DOWN,
          eventInfo: {
            button: InputAction.IA_POINTER,
            showFeedback: true,
            hoverText: 'To minting website >',
            maxDistance: 8
          }
        }
      ]
    })

    engine.addSystem(() => {
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.backButton)) {
        this.prevRecipe()
      }
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.nextButton)) {
        this.nextRecipe()
      }
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.greenLever)) {
        this.startCrafting(this.recipeIndex)
        this.enableCrafting(false)
      }
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.linkButton)) {
        void openExternalUrl({ url: 'https://wondermine.wonderzone.io/claimItem' })
      }
    })
    // engine.removeEntity(this.greenLever);

    // 2DO: store filePrefix centrally
    this.textureFile = this.filePrefix + som.ui.resourceIcons.atlasFile
    this.loadScreen()

    // this.setupStateMachine();
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

  loadScreen(): void {}

  prevRecipe(): void {
    if (this.isBusy) return
    if (--this.recipeIndex < -1) {
      this.recipeIndex = GameData.recipes.length - 1
    }
    if (this.recipeIndex === -1) {
      this.showInstructions()
    } else {
      this.showRecipe(this.recipeIndex)
    }
  }

  refreshRecipe(): void {
    if (this.recipeIndex < 0) {
      this.showInstructions()
    } else {
      this.showRecipe(this.recipeIndex)
    }
  }

  nextRecipe(): void {
    if (this.isBusy) return
    const numRecipes = GameData.recipes.length
    if (++this.recipeIndex > numRecipes) {
      this.recipeIndex = 0
    }
    if (this.recipeIndex === numRecipes) {
      this.showInstructions()
    } else {
      this.showRecipe(this.recipeIndex)
    }
  }

  startCrafting(recipeNum: number): void {}

  enableCrafting(onOrOff: boolean = true): void {}

  showInstructions(): void {
    this.pageIndex = 0
    this.recipeIndex = -1

    this.showName('Craft-O-Matic')
    this.showDesc(
      'Use the red arrows below to see the crafting recipes.\nWhen you have all the ingredients, the lever to the right\nwill glow. Click the lever to craft your item!'
    )
    this.showId('')

    // clear the ingredients
    this.clearRecipe()

    // this.readyTxt.color = Color3.FromHexString('#DDDDDD') // "#22BB44"
    this.setCooldownStatus()
  }

  showRecipe(recipeNum: number): void {}

  showName(msg: string): void {
    if (this.nameTxt != null) {
      this.nameTxt = msg
    }
  }

  showDesc(msg: string): void {
    if (this.descTxt != null) {
      this.descTxt = msg
    }
  }

  showId(msg: string): void {
    if (this.idTxt != null) {
      this.idTxt = msg
    }
  }

  clearRecipe(): void {
    if (this.iconSprite != null) {
      this.iconSprite.changeFrame(ItemIcons.Empty)
    }

    this.enableCrafting(false)

    let tile
    for (var i: number = 0; i < this.ingredientPanels.length; i++) {
      tile = this.ingredientPanels[i]
      tile.clear(ItemIcons.Empty)
      tile.showText('')
    }

    this.levelMinTxt = ''
  }

  setCooldownStatus(): void {}
}
