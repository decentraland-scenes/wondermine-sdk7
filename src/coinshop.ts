import { type Entity, Transform, engine, type TransformType } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { ProjectLoader } from './projectloader'
import { type ShopItem } from './shopitem'

export type BuildingData = {
  filename: string
  pos: [number, number, number] // assuming pos is an array of 3 numbers
  angles: [number, number, number] // assuming angles is an array of 3 numbers
}

export class CoinShop {
  private readonly entity = engine.addEntity()
  public trans: TransformType = { position: Vector3.create(), scale: Vector3.create(), rotation: Quaternion.create() }
  // the main cart or building model
  public modelEntity: Entity = engine.addEntity()
  public modelFile: string = ''
  // public modelShape:GLTFShape;

  public signEntity: Entity = engine.addEntity()

  // the model to use for various coin packages?
  public productModelFile: string = ''

  public products: ShopItem[] = []
  public storeData: object[] = []
  public textureFile: string = 'models/textures/resources_atlas_1024.png'

  public txInProgress: boolean = false

  constructor(_buildingData: BuildingData, _signData: object) {
    // console.log("creating shop...");
    this.loadBuilding(_buildingData, _signData)
  }

  loadBuilding(_buildingData: BuildingData, _signData: object): void {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    this.modelFile = _buildingData.filename

    // use building object as parent transform
    const pos: Vector3 = Vector3.create(..._buildingData.pos)

    // create and position the parent entity (holder)
    Transform.create(this.entity, {
      position: pos,
      rotation: Quaternion.fromEulerDegrees(_buildingData.angles[0], _buildingData.angles[1], _buildingData.angles[2])
    })

    // the position and angles for the building model should be zero, since the parent handles positioning
    _buildingData.pos = [0, 0, 0]
    _buildingData.angles = [0, 0, 0]
    this.modelEntity = ProjectLoader.instance.spawnSceneObject(_buildingData, true)
    Transform.getOrCreateMutable(this.modelEntity).parent = this.entity

    // make sure sign object has relative pos and angles
    this.signEntity = ProjectLoader.instance.spawnSceneObject(_signData, true)
    Transform.getOrCreateMutable(this.signEntity).parent = this.entity
  }
}
