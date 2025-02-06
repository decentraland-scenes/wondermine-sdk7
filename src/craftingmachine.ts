/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Animator,
  engine,
  type Entity,
  InputAction,
  inputSystem,
  MeshCollider,
  type PBTextShape,
  PointerEvents,
  PointerEventType,
  TextAlignMode,
  TextShape,
  Transform
} from '@dcl/sdk/ecs'
import { ItemIcons, WearablesState } from './enums'
import { type CraftMaterial, UiTextData, type Recipe } from './projectdata'
import { ItemAmountPanel } from './ui/itemamountpanel'
import { SpritePlane } from './ui/spriteplane'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { ProjectLoader } from './projectloader'
import { som } from './som'
import { SoundManager } from '../shared-dcl/src/sound/soundmanager'
import { openExternalUrl } from '~system/RestrictedActions'
import { GameData } from './gamedata'
import { ColorPlane } from './ui/colorplane'
import { DclUser } from 'shared-dcl/src/playfab/dcluser'
import { type ItemInfo } from 'shared-dcl/src/playfab/iteminfo'
import * as utils from '@dcl-sdk/utils'
import { CraftItemEvent, Eventful } from './events'
import { type LootItem } from './wondermine/lootitem'

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
  public greenLever_collider: Entity = engine.addEntity()

  public idleClip: string = ''
  public craftingClip: string = 'machine'

  public screenEntity: Entity = engine.addEntity()

  public nameTxt: PBTextShape | null = null
  public descTxt: PBTextShape | null = null
  public idTxt: PBTextShape | null = null
  public levelMinTxt: PBTextShape | null = null
  public readyTxt: PBTextShape | null = null

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

  public onCraftingCompleteCallback: ((lootEnt: LootItem) => void) | undefined

  public nameTxt_entity = engine.addEntity()
  public descTxt_entity = engine.addEntity()
  public idTxt_entity = engine.addEntity()
  public levelMinTxt_entity = engine.addEntity()
  public readyTxt_entity = engine.addEntity()
  public youNeed_entity = engine.addEntity()
  public toMake_entity = engine.addEntity()

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
    Transform.getMutable(this.greenLever).parent = this.entity
    Transform.create(this.greenLever_collider, Transform.get(this.greenLever))
    Transform.getMutable(this.greenLever_collider).position = Vector3.create(-0.6, 0.8, -1.3)
    Transform.getMutable(this.greenLever_collider).scale = Vector3.create(0.3, 0.2, 0.4)
    MeshCollider.setBox(this.greenLever_collider)
    PointerEvents.createOrReplace(this.greenLever_collider, {
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
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.greenLever_collider)) {
        this.startCrafting(this.recipeIndex)
        this.enableCrafting(false)
      }
      if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, this.linkButton)) {
        void openExternalUrl({ url: 'https://wondermine.wonderzone.io/claimItem' })
      }
    })
    Transform.getMutable(this.greenLever).scale = Vector3.create(0, 0, 0)
    Transform.getMutable(this.greenLever_collider).scale = Vector3.create(0, 0, 0)
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

  loadScreen(): void {
    // hack to reduce texture usage
    // check if GameUi has already loaded the resorce atlas, and if so just grab it instead of loading our own
    // let tex:Texture = GameUi.instance.getResourceAtlas();

    Transform.create(this.screenEntity, {
      position: Vector3.create(0, 2, 0),
      scale: Vector3.One(),
      rotation: Quaternion.fromEulerDegrees(0, 90, 0),
      parent: this.selectorModelEntity
    })

    // add background shapes
    const colorPlane1 = new ColorPlane(
      '#282828',
      Vector3.create(0.42, -0.3, 0),
      Vector3.create(0.6, 0.6, 0.1),
      Vector3.create(0, 0, 0)
    )
    Transform.getMutable(colorPlane1.entity).parent = this.screenEntity

    // recipe name

    let obj: UiTextData = ProjectLoader.instance.populate(new UiTextData(), som.ui.crafterScreen.textField.name)

    this.nameTxt = this.addTextField(obj, this.screenEntity, this.nameTxt_entity)

    // recipe description

    obj = ProjectLoader.instance.populate(new UiTextData(), som.ui.crafterScreen.textField.desc)
    this.descTxt = this.addTextField(obj, this.screenEntity, this.descTxt_entity, false)

    // recipe id

    obj = ProjectLoader.instance.populate(new UiTextData(), som.ui.crafterScreen.textField.id)
    this.idTxt = this.addTextField(obj, this.screenEntity, this.idTxt_entity)

    // level minimum

    obj = ProjectLoader.instance.populate(new UiTextData(), som.ui.crafterScreen.textField.levelMin)
    this.levelMinTxt = this.addTextField(obj, this.screenEntity, this.levelMinTxt_entity)

    // instructions

    obj = ProjectLoader.instance.populate(new UiTextData(), som.ui.crafterScreen.textField.youNeed)
    const youNeed = this.addTextField(obj, this.screenEntity, this.youNeed_entity)
    youNeed.text = 'YOU NEED'

    obj = ProjectLoader.instance.populate(new UiTextData(), som.ui.crafterScreen.textField.toMake)
    const toMake = this.addTextField(obj, this.screenEntity, this.toMake_entity)
    toMake.text = 'TO MAKE'

    obj = ProjectLoader.instance.populate(new UiTextData(), som.ui.crafterScreen.textField.ready)
    this.readyTxt = this.addTextField(obj, this.screenEntity, this.readyTxt_entity)

    // item to create
    this.iconSprite = new SpritePlane(
      this.textureFile,
      8,
      8,
      ItemIcons.Empty,
      Vector3.create(0.4, -0.3, -0.05),
      Vector3.create(0.5, 0.5, 0.5),
      Vector3.create(0, 0, 0)
    )
    Transform.getMutable(this.iconSprite.entity).parent = this.screenEntity

    // arrow icon
    this.arrowSprite = new SpritePlane(
      this.textureFile,
      8,
      8,
      ItemIcons.ArrowGray,
      Vector3.create(0.035, -0.29, -0.05),
      Vector3.create(0.18, 0.15, 0.15),
      Vector3.create(0, 0, 0)
    )
    Transform.getMutable(this.arrowSprite.entity).parent = this.screenEntity

    // log("*** LOADING ITEM TILES ***")
    const itemTile1 = new ItemAmountPanel(
      this.screenEntity,
      Vector3.create(-0.59, -0.08, 0),
      '#333333',
      '#229944',
      this.textureFile,
      8,
      8,
      ItemIcons.Empty,
      1.5,
      true
    )
    // itemTile1.showText("20");

    const itemTile2 = new ItemAmountPanel(
      this.screenEntity,
      Vector3.create(-0.59, -0.24, 0),
      '#333333',
      '#229944',
      this.textureFile,
      8,
      8,
      ItemIcons.Empty,
      1.5,
      true
    )
    // itemTile2.showText("30");

    const itemTile3 = new ItemAmountPanel(
      this.screenEntity,
      Vector3.create(-0.59, -0.4, 0),
      '#333333',
      '#229944',
      this.textureFile,
      8,
      8,
      ItemIcons.Empty,
      1.5,
      true
    )
    // itemTile3.showText("10");

    const itemTile4 = new ItemAmountPanel(
      this.screenEntity,
      Vector3.create(-0.22, -0.08, 0),
      '#333333',
      '#229944',
      this.textureFile,
      8,
      8,
      ItemIcons.Empty,
      1.5,
      true
    )
    // itemTile4.showText("15");

    const itemTile5 = new ItemAmountPanel(
      this.screenEntity,
      Vector3.create(-0.22, -0.24, 0),
      '#333333',
      '#229944',
      this.textureFile,
      8,
      8,
      ItemIcons.Empty,
      1.5,
      true
    )
    // itemTile5.showText("7");
    // itemTile5.enable();

    const itemTile6 = new ItemAmountPanel(
      this.screenEntity,
      Vector3.create(-0.22, -0.4, 0),
      '#333333',
      '#229944',
      this.textureFile,
      8,
      8,
      ItemIcons.Empty,
      1.5,
      true
    )
    // itemTile6.showText("1");

    const itemTile0 = new ItemAmountPanel(
      this.screenEntity,
      Vector3.create(-0.4, -0.54, 0),
      '#333333',
      '#229944',
      this.textureFile,
      8,
      8,
      ItemIcons.Empty,
      1.0,
      true,
      true
    )
    // itemTile0.showText("10");

    this.ingredientPanels = [itemTile0, itemTile1, itemTile2, itemTile3, itemTile4, itemTile5, itemTile6]

    this.showInstructions()
  }

  addTextField(_data: UiTextData, _parent: Entity, entity: Entity, _wrap: boolean = false): PBTextShape {
    TextShape.create(entity).text = ''
    const ts: PBTextShape = TextShape.getMutable(entity)
    if (_data.fontSize != null && _data.fontSize >= 1) {
      ts.fontSize = _data.fontSize
    }
    if (_data.hexColor != null && _data.hexColor !== '') {
      ts.textColor = Color4.fromHexString(_data.hexColor) // "#22BB44"
    }
    ts.width = Math.max(parseInt(_data.width), 10)
    ts.height = Math.max(parseInt(_data.height), 10)

    ts.textAlign = TextAlignMode.TAM_TOP_CENTER
    ts.textWrapping = _wrap
    if (_data.pos != null) {
      Transform.create(entity, {
        position: Vector3.create(..._data.pos),
        scale: Vector3.create(0.25, 0.25, 0.25),
        parent: _parent
      })
    }
    return ts
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

  showRecipe(recipeNum: number): void {
    this.pageIndex = recipeNum + 1
    const recipe: Recipe | null = GameData.getRecipeNum(recipeNum)

    if (recipe != null) {
      // show the details: title, description
      this.showName(recipe.name)
      this.showDesc(recipe.desc)

      // show ingredient icons and values
      let hasAll: boolean = this.showIngredients(recipe.consumes)
      const wearCount: number = GameData.getWearableCount(recipe.wi)

      if (recipe.limitOne) {
        // log("LIMIT ONE RECIPE. itemId:", recipe.itemId);
        console.log('Player items:', DclUser.activeUser.limitOneItems)
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (DclUser.activeUser.hasAlreadyCrafted(recipe.itemId)) {
          // TODO add an indicator when someone has already crafted it
          hasAll = false
          console.log('PLAYER ALREADY CRAFTED ', recipe.itemId)
        }
      }
      console.log('itemId: ' + recipe.itemId + ', isActive: ' + recipe.isActive)
      // 2DO: Clean this up - for wearables only
      if (recipe.itemClass === 'wearable') {
        if (recipe.isActive) {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (DclUser.weLive || DclUser.activeUser.isT) {
            // testers can try to craft experimental stuff
            this.showId(wearCount + ' AVAILABLE')
            if (wearCount <= 0 || this.wearablesState !== WearablesState.Active) {
              hasAll = false
            }
          } else {
            hasAll = false
            this.showId('INACTIVE')
          }
        } else {
          // log("isActive", recipe.isActive);
          hasAll = false
          this.showId('0 AVAILABLE')
        }
      } else if (recipe.itemClass === 'pickaxe') {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (recipe.isActive || DclUser.activeUser.isT) {
          if (recipe.limitOne) {
            this.showId('LIMITED')
          } else {
            this.showId('UNLIMITED')
          }
        } else {
          hasAll = false
          this.showId('INACTIVE')
        }
      } else {
        this.showId('UNLIMITED')
      }

      // check player level
      if (recipe.levelMin != null && recipe.levelMin > 1) {
        // show level requirement
        if (DclUser.activeUser.level >= recipe.levelMin) {
          // show green
          if (this.levelMinTxt !== null) {
            this.levelMinTxt.textColor = Color4.fromHexString('#33FF33')
          }
        } else {
          // show red
          if (this.levelMinTxt !== null) {
            this.levelMinTxt.textColor = Color4.fromHexString('#FF6600')
          }
          hasAll = false
        }
        if (this.levelMinTxt !== null) {
          this.levelMinTxt.text = 'MIN LEVEL: ' + recipe.levelMin
        }
      } else {
        if (this.levelMinTxt !== null) {
          this.levelMinTxt.text = ''
        }
      }

      // show the item to be crafted
      const iconNum: number = ItemIcons[recipe.itemId as keyof typeof ItemIcons]
      // log("iconNum=" + iconNum);
      if (this.iconSprite !== null) {
        this.iconSprite.changeFrame(iconNum)
      }

      console.log('hasAll', hasAll)
      this.enableCrafting(hasAll)
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
    if (this.levelMinTxt != null) {
      this.levelMinTxt.text = ''
    }
  }

  // --- DISPLAY ---

  reset(reloadRecipe: boolean = true): void {
    this.isBusy = false
    this.setCooldownStatus()
    if (reloadRecipe) {
      this.showRecipe(this.recipeIndex)
    } else {
      this.showInstructions()
    }
    this.craftedVoucher = ''
  }

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
    if (this.readyTxt != null) {
      TextShape.getMutable(this.readyTxt_entity).textColor = Color4.fromHexString('#DDDDDD') // "#22BB44"
      this.readyTxt.textColor = Color4.fromHexString('#DDDDDD') // "#22BB44"
    }
    this.setCooldownStatus()
  }

  showName(msg: string): void {
    if (this.nameTxt != null) {
      TextShape.getMutable(this.nameTxt_entity).text = msg
      this.nameTxt.text = msg
    }
  }

  showDesc(msg: string): void {
    if (this.descTxt != null) {
      TextShape.getMutable(this.descTxt_entity).text = msg
      this.descTxt.text = msg
    }
  }

  showId(msg: string): void {
    if (this.idTxt != null) {
      TextShape.getMutable(this.idTxt_entity).text = msg
      this.idTxt.text = msg
      console.log('check', TextShape.get(this.idTxt_entity).text, this.idTxt.text)
    }
  }

  showIngredients(consumes: CraftMaterial[]): boolean {
    // console.log(DclUser.activeUser.inventoryArray);
    let hasAll: boolean = true
    let tile: ItemAmountPanel
    let item: CraftMaterial
    let invItem: ItemInfo | null
    for (var i: number = 0; i < this.ingredientPanels.length; i++) {
      tile = this.ingredientPanels[i]
      try {
        if (i < consumes.length) {
          // there is a recipe item for this
          item = consumes[i]
          invItem = DclUser.activeUser.getItem(item.itemId)

          let qtyOwned: number = 0
          if (item.itemId === 'WC') {
            qtyOwned = DclUser.activeUser.coins
          } else if (item.itemId === 'WG') {
            qtyOwned = DclUser.activeUser.gems
          } else if (invItem != null) {
            qtyOwned = invItem.RemainingUses
          }
          // console.log("got itemId: " + item.itemId + ", code: " + ItemIcons[item.itemId] + ", uses: " + qtyOwned); //
          // console.log(invItem);
          tile.show(ItemIcons[item.itemId as keyof typeof ItemIcons] ?? ItemIcons.Empty, item.qty, qtyOwned)
          if (qtyOwned < item.qty) {
            hasAll = false
          }
        } else {
          // this panel will be blank
          tile.clear(ItemIcons.Empty)
        }
      } catch {
        tile.clear(ItemIcons.Empty)
        tile.showText('?')
      }
    }
    return hasAll
  }

  // --- COOLDOWN ---

  setCooldownStatus(): void {
    // console.log("temp=", (DclUser.activeUser && DclUser.activeUser.isT));
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-optional-chain
    if (DclUser.weLive || (DclUser.activeUser && DclUser.activeUser.isT)) {
      const cooldownRemaining: number = DclUser.cooldownSeconds()
      console.log('cooldown=', cooldownRemaining)
      if (cooldownRemaining === 0) {
        this.wearablesState = WearablesState.Active
        this.showWearStatus('Active')
        console.log('cooldown=active')
      } else if (cooldownRemaining < 0) {
        // -1 error condition
        this.wearablesState = WearablesState.Inactive
        this.showWearStatus('Inactive')
      } else {
        this.wearablesState = WearablesState.Cooldown
        this.showCooldownTime(cooldownRemaining)
        if (this.timer == null) {
          this.startCooldownTimer()
        }
      }
    } else {
      this.showWearStatus('Inactive')
    }
  }

  showCooldownTime(millis: number): void {
    // log("millis=" + millis);
    if (this.recipeIndex === -1) {
      // only show the time if the instructions page is showing

      const remaining = millis // DclUser.cooldownTime - millis;

      // Time calculations for days, hours, minutes and seconds
      var hours = Math.floor(remaining / (1000 * 60 * 60))
      var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      var seconds = Math.floor((remaining % (1000 * 60)) / 1000)

      this.showWearStatus('Ready in ' + hours + 'h ' + minutes + 'm ' + seconds + 's')
    }
  }

  showWearStatus(status: string): void {
    if (this.readyTxt != null) {
      TextShape.getMutable(this.readyTxt_entity).text = 'Wearables: ' + status
      // this.readyTxt.text = 'Wearables: ' + status
    }
  }

  startCooldownTimer(): void {
    this.timer = utils.timers.setInterval(() => {
      const millis: number = DclUser.cooldownSeconds()
      if (millis > 0) {
        // in cooldown period
        this.showCooldownTime(millis)
      } else {
        this.stopCooldownTimer()
      }
    }, 1000)
  }

  stopCooldownTimer(): void {
    utils.timers.clearInterval(this.timer)
    this.timer = 0
    this.setCooldownStatus()
  }

  enableCrafting(onOrOff: boolean = true): void {
    if (onOrOff) {
      if (this.arrowSprite !== null) {
        this.arrowSprite.changeFrame(ItemIcons.ArrowGreen)
      }
      if (this.readyTxt !== null) {
        TextShape.getMutable(this.readyTxt_entity).textColor = Color4.fromHexString('#22BB44')
        TextShape.getMutable(this.readyTxt_entity).text = 'READY! Push the lever to craft your item >>>'
        this.readyTxt.textColor = Color4.fromHexString('#22BB44')
        this.readyTxt.text = 'READY! Push the lever to craft your item >>>'
      }
      Transform.getMutable(this.greenLever).scale = Vector3.create(1, 1, 1)
      Transform.getMutable(this.greenLever_collider).scale = Vector3.create(0.3, 0.2, 0.4)
      // this.greenLever = engine.addEntity()
      // make the lever green
    } else {
      if (this.arrowSprite !== null) {
        this.arrowSprite.changeFrame(ItemIcons.ArrowGray)
      }
      if (this.readyTxt !== null) {
        this.readyTxt.text = ''
        TextShape.getMutable(this.readyTxt_entity).text = ''
      }
      // remove lever highlight
      Transform.getMutable(this.greenLever).scale = Vector3.create(0, 0, 0)
      Transform.getMutable(this.greenLever_collider).scale = Vector3.create(0, 0, 0)
    }
  }

  startCrafting(recipeNum: number): void {
    this.craftedRecipe = GameData.getRecipeNum(recipeNum)
    this.isBusy = true
    this.enableCrafting(false)
    // make the server call
    if (this.craftedRecipe != null) {
      Eventful.instance.fireEvent(
        new CraftItemEvent(this.craftedRecipe.id, this.craftedRecipe.wi, this.craftedRecipe.itemClass)
      )
    }
    // GameManager.instance.craftItem(this.craftedRecipe.id, this.craftedRecipe.wi);
  }

  animateMachine(itemEnt: LootItem, isRepair: boolean = false): void {
    console.log('animateMachine()')
    Animator.getClip(this.machineModelEntity, this.craftingClip).playing = false
    Animator.playSingleAnimation(this.machineModelEntity, this.craftingClip)

    SoundManager.playOnce(this.machineModelEntity, 0.8)

    // after a delay, show the item
    utils.timers.setTimeout(() => {
      this.showCraftedItem(itemEnt)
      if (isRepair) {
        // GameUi.instance.showTimedMessage("Your pickaxe is fixed!", 7000);
      }
    }, 7200)
  }

  showCraftedItem(itemEnt: LootItem): void {
    console.log('CRAFTED ' + itemEnt.instanceData?.itemId + '!')

    if (itemEnt?.instanceData != null) {
      // Obtener la posición actual del objeto
      const pos = Transform.get(this.entity).position

      // Sumar los valores (-2.5, 0.2, -2.5) y reasignar a pos
      const newPos = Vector3.add(pos, Vector3.create(-2.5, 0.2, -2.5))

      // Mostrar el objeto en la nueva posición
      itemEnt.showAt(newPos)
    }

    this.reset()

    if (this.onCraftingCompleteCallback != null) {
      this.onCraftingCompleteCallback(itemEnt)
    }
  }
}
