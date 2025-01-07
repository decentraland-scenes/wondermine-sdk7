import { engine, Entity, GltfContainer, Transform } from "@dcl/sdk/ecs";
import {SceneObject, ZoneData} from "./sceneobject";
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'
/**
 * Loads a GLTF model, given a SceneObject data structure.
 * Optionally adds components to make the entity Portable/throwable or a RigidBody.
 * If a GLTFShape has already been loaded, it will be reused.
 */
export class ModelLoader
{
    public cache: { [key: string]: any } = {} 
    public filePrefix : string = "assets/models/";

    spawnSceneObject(data: object, addToEngine:boolean = true): Entity
    {
        const so = this.populate(new SceneObject(), data); // TODO: error checking

        const mod = engine.addEntity()

        // check cache to see if shape is already there
        let shape:string
        shape = this.cache[so.filename];
        // log("loading " + so.filename);

        if (shape == undefined)
        {   
            shape = (this.filePrefix + so.filename);
            this.cache[so.filename] = shape;
        }
        GltfContainer.create(mod,{src: shape})

        Transform.create(mod,{position: Vector3.create(...so.pos),scale: Vector3.create(...so.scale)})
        Transform.getMutable(mod).rotation = Quaternion.create(...so.angles);
        console.log('gltf ',GltfContainer.get(mod).src)
        // Rotation can be specified as a Quaternion or as Euler angles
        // if (data['rotation'] != null)
        // {
        //     Transform.getMutable(mod).rotation = Quaternion.create(...so.rotation)
        // }
        // else if (data['angles'] != null)
        // {
        //     Transform.getMutable(mod).rotation = Quaternion.create(...so.angles);
        // }

        return mod;
    }
    populate<T>(target: T, ...sources: Partial<T>[]): T {
        if (!target) {
          throw new TypeError('Cannot convert undefined or null to object')
        }
        for (const source of sources) {
          if (source) {
            Object.assign(target, source)
            console.log('file converted')
          }
        }
        return target
    }
}