# WonderMine Crafting Game in Decentraland (SDK6) #

### Design Documents

We've updated a couple of our earlier design documents and made them accessible on Google Docs:

* [Game Design Summary](https://docs.google.com/document/d/1MnOCxSLI_2QiLkXe7jdLbPkskgkmDRUg4_2jBURa0lw/edit?usp=sharing)

* [Server Overview](https://docs.google.com/document/d/1IAa0mEn37N2geQUMgGcAOMa-RiChNmsMehou44UF6EU/edit?usp=sharing)

### Files and Folders

Some descriptions of the contents of this repo:

* /shared-dcl/src - folder containing utilities used across multiple scenes
  + /fsm - Finite State Machine utility 
  + /physics - very primitive physics engine hand-coded for earlier scenes (not used in WonderMine)
  + /som - Scene Object Model utility used to define scene objects and data in a JSON format. A public repo for this utility is here: https://github.com/rdixon22/som-dcl (used heavily in WonderMine)
  + /sound - simple SoundManager class
  + /sprites - simple SpriteSheet 2D animation class (not used in WonderMine)
  + /testor - very basic testing framework (not used in WonderMine)
  + /timer - Delay and Ephemeral classes (no longer used in favor of newer TimerSystem classes from DCL)
  + /zone - simple zone detection system (not used in WonderMine)

* /src - folder containing WonderMine-specific source files
  + /abis - ABI data for various smart contracts
  + /contracts - wrapper classes for smart contracts
  + /multiplayer - interact with the Colyseus server for shared meteors
  + /ui - UI classes and controls
  + /wondermine - newer WonderMine classes (older ones are just in /src)

#### Selected Source Files

* game.ts - fetches user data, sets up Systems, creates the GameManager
* gamemanager.ts - wires up all the game components, loads scene objects, and handles the main game loop
* som.ts - JSON structure that defines all the objects in the scene
* projectloader.ts - extends ModelLoader; reads som.ts objects and loads 3d models and creates entities 
* coinshop.ts - manages the Coin Cart product list and calls
* shopitem.ts - defines items offered in the Coin Cart
* pickaxe.ts - manages the player's current Pickaxe model and animations
* wondermine/meteor.ts - manages a Meteor model and its animations
* wondermine/meteorspawner.ts - periodically triggers new local meteors to fall
* craftingmachine.ts - manages the crafting machine model and animations, and its in-game screens and UI
* bonusmanager.ts - calculates and keeps track of the player's current mining bonus percentage
* leaderboard.ts - gets leaderboard data and manages the leaderboard model and display

### Changes for a Rewrite

If or when this project is updated to SDK7, we suggest making the following design changes (at least):

* Have the Coin Cart work with Polygon/MANA instead of Ethereum/MANA
* Streamline the crafting process so crafted wearable items are minted during the process, instead of forcing a player to go to an external website to mint them later

### Wearables Crafting -- new process ###

* CRAFT IN GAME
1. From client, call cloudscript to craftItem
2. Cloudscript takes their materials and calls Azure function to record their claim
3. Azure function signs message with admin address, stores in database (can't return fast enough for cloudscript time limit)
4. From client, call another Azure function to get the claim number and signature
5. Show them a popup with link to claim web page

* Actually we wanted the process to include the following steps and avoid the separate web page, but never got this implemented:
5. Call WearableClaimer smart contract to claim wearable
6. If player confirms, mint the wearable
7. If player rejects, show them the popup with link to claim web page

* CLAIM LATER ON WEB PAGE
1. Go to https://wondermine.wonderzone.io/claimitem
2. Show list of unclaimed items for their Metamask address
3. Click button to claim an item
4. Call WearableClaimer smart contract using the claim number and signature from the database
5. If player confirms, mint the wearable
6. If player rejects, show them an alert and let them try again later
