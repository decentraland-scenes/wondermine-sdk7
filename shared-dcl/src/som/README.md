# SOM
A Scene Object Model (SOM) file lists all of the GLTF or GLB models to load into a Decentraland scene. This module contains a SceneObject data structure used to define the models and their positioning in the world, and a ModelLoader class that handles the loading and positioning at runtime.

## SOM JSON data
The SOM data structure is defined in a file named som.json.

Here's an example of a som.json file for a scene with two hills and a rock: 
```javascript
{
  "scene": {
    "title": "My Great Scene",
    "hill01": {
      "filename": "terrain/hill.glb",
      "pos": [ 2, 14, 8 ],
      "angles": [ 0, 270, 0 ],
      "scale": [ 1.5, 1.5, 1.5 ]
    },
    "hill02": {
      "filename": "terrain/hill.glb",
      "pos": [ 12, 14, 8 ],
      "angles": [ 0, 270, 0 ],
      "scale": [ 1.5, 1.5, 1.5 ]
    },
    "rock01": {
      "filename": "rock.gltf",
      "pos": [ 7.3, 14.4, 2.2 ],
      "angles": [ 0, 150, 0 ],
      "scale": [ 0.25, 0.25, 0.25],
      "throwable": true,
      "rigidbody": true,
      "physics": {
        "mass": 1,
        "bounciness": 0.4,
        "velocity": [0, 0, 0]
      }
    }
  }
}
```
Note that if the same model file is referenced more than once, the ModelLoader will only load that model file once, and re-use the GLTFShape component for each instance of the model.

## ModelLoader Class

The ModelLoader class will instantiate the required Entities and Components, given an object from the som.json file, and place them in the scene with the given position and rotation.
```javascript
// instantiate the ModelLoader
const loader:ModelLoader = new ModelLoader();

// load the models and place them in the scene
const hill01:Entity = loader.spawnSceneObject(som.scene.hill02);
const hill02:Entity = loader.spawnSceneObject(som.scene.hill02);
const rock1:Entity = loader.spawnSceneObject(som.scene.rock1);
```
The ModelLoader.spawnSceneObject() method creates an Entity, loads the model file to create a GLTFShape, attaches any optional Components (such as RigidBody or Portable), and then adds the Entity to the engine.

## Game Zones

Game Zones can be added to the som.json file as well. A Zone is a bounding box in 3D space. You can receive events whenever the player (camera) enters or leaves a specific zone. 

Here is an example of the format for Game Zones in the som.json file:
```javascript
{
  "scene": { 
  },
  "zones": [
    { 
      "name": "Bridge",
      "zoneNum": 6,
      "text": "The gap seems too wide to jump.",
      "repeat": false,
      "pos": [ 42, 13.5, -5 ],
      "scale": [11, 4, 3 ]
    },
    { 
      "name": "Courtyard",
      "zoneNum": 7,
      "text": "This area seems deserted, though you see\nlittle indentations in the dirt.\nPaw prints?",
      "repeat": false,
      "pos": [ 45, 13.5, 18 ],
      "scale": [17, 4, 9 ]
    }
  ]
}
```