// som modules
import { Entity, GltfContainer, Transform, engine } from "@dcl/sdk/ecs";
import { ModelLoader } from "../shared-dcl/src/som/modelloader";
import { UiImageData, UiTextData, PickaxeType, PickaxeInstance, MeteorType, MeteorInstance, MeteorSpawnerInstance, LootItemInstance, ShopItemInstance } from "./projectdata";
//import { SceneObject } from "../../shared-dcl/src/som/sceneobject";


export class ProjectLoader extends ModelLoader
{
    public static instance:ProjectLoader;
    
    public cache : object = {}; // simple object-based dictionary
    public filePrefix : string = "assets/models/";

    constructor() 
    {
        super();
        // save a singleton
        ProjectLoader.instance = this;
    }

    loadUiImageData(data: Object): UiImageData
    {
        const so = this.populate(new UiImageData(), data); // TODO: error checking
        return so;        
    }

    loadPickaxeType(data: object): PickaxeType 
    {
        const so = this.populate(new PickaxeType(), data); // TODO: error checking
        return so;
    }

    loadPickaxeInstance(data: object): PickaxeInstance
    {
        const so = this.populate(new PickaxeInstance(), data); // TODO: error checking
        return so;
    }
    
    loadMeteorType(data: object): MeteorType
    {
        const so = this.populate(new MeteorType(), data); // TODO: error checking
        return so;
    }

    loadMeteorInstance(data: object): MeteorInstance
    {
        const so = this.populate(new MeteorInstance(), data); // TODO: error checking
        return so;
    }

    loadMeteorSpawner(data: object): MeteorSpawnerInstance
    {
        const so = this.populate(new MeteorSpawnerInstance(), data); // TODO: error checking
        return so;
    }

    loadLootItemInstance(data: object, itemId:string = ""): LootItemInstance
    {
        const so:LootItemInstance = this.populate(new LootItemInstance(), data); // TODO: error checking
        so.itemId = itemId;
        return so;
    }

    loadShopItemInstance(data: object): ShopItemInstance
    {
        const so:ShopItemInstance = this.populate(new ShopItemInstance(), data); // TODO: error checking
        return so;
    }

    /**
     * Load a Target model and associated properties from the som.json file.
     * 
     * @param data The JSON object describing this Beastie, from the file
     * @param _pos The initial position in the scene
     * @param _angles The initial orientation of the model
     */
}