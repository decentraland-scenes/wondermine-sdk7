export var som: any = {
  scene: {
    title: 'WonderMine v1.1.1',
    changeLog:
      '* Shared meteors have arrived!\n1. When a large meteor falls, be one of the first 10 mine it\n(and get normal loot).\n2. All 10 players get a bonus loot drop st the end!',
    signInstructions: {
      filename: 'instructions_sign.glb',
      pos: [1, 0, 14],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    leaderboard: {
      filename: 'WM_Leaderboard_w_Instructions.glb',
      pos: [1, 0, 45],
      angles: [0, 180, 0],
      scale: [0.75, 0.75, 0.75],
      fontSize: 4,
      hexColor: '#000000',
      fontWeight: 'bold',
      textWidth: 400,
      textHeight: 250,
      textAngles: [0, 90, 0],
      textPos: [-0.4, 8.3, 0],
      isLeaderboard: true,
      playerListPos: [-3.5, -0.6, 0],
      scoreListPos: [3.5, -0.75, 0],
      scoreListWidth: 150
    },
    wall01: {
      filename: 'wallSection_2x1_glb.glb',
      pos: [76.8, 0, 127.1],
      angles: [0, 90, 0],
      scale: [1.0, 1.0, 1.0]
    },
    wall02: {
      filename: 'wallSection_2x1_glb.glb',
      pos: [44.8, 0, 127.1],
      angles: [0, 90, 0],
      scale: [1.0, 1.0, 1.0]
    },
    wall03: {
      filename: 'wallSection_2x1_glb.glb',
      pos: [12.8, 0, 127.1],
      angles: [0, 90, 0],
      scale: [1.0, 1.0, 1.0]
    },
    wallCorner01: {
      filename: 'wallSection_turn_2x1_glb.glb',
      pos: [80, 0, 127.7],
      angles: [0, 270, 0],
      scale: [1.0, 1.0, 1.0]
    },
    wallCorner02: {
      filename: 'wallSection_turn_2x1_glb.glb',
      pos: [32.5, 0, 128],
      angles: [0, 180, 0],
      scale: [0.84, 1.0, 1.0]
    },
    wallCorner03: {
      filename: 'wallSection_turn_2x1_glb.glb',
      pos: [0.5, 0, 128],
      angles: [0, 180, 0],
      scale: [0.84, 1.0, 1.0]
    },
    tree01: {
      filename: 'wm_tree01_glb.glb',
      pos: [78, 0.0, 13],
      angles: [0, 180, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree02: {
      filename: 'wm_tree01_glb.glb',
      pos: [78, 0.0, 51],
      angles: [0, 0, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree03: {
      filename: 'wm_tree01_glb.glb',
      pos: [9, 0, 1.5],
      angles: [0, 110, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree04: {
      filename: 'wm_tree01_glb.glb',
      pos: [1, 0, 27],
      angles: [0, 180, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree05: {
      filename: 'wm_tree01_glb.glb',
      pos: [1, 0, 37],
      angles: [0, 180, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree06: {
      filename: 'wm_tree01_glb.glb',
      pos: [48, 0, 1.5],
      angles: [0, 45, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree07: {
      filename: 'wm_tree01_glb.glb',
      pos: [16, 0, 120],
      angles: [0, 45, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree08: {
      filename: 'wm_tree01_glb.glb',
      pos: [18, 0, 120],
      angles: [0, 45, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree09: {
      filename: 'wm_tree01_glb.glb',
      pos: [20, 0, 120],
      angles: [0, 45, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree10: {
      filename: 'wm_tree01_glb.glb',
      pos: [22, 0, 120],
      angles: [0, 45, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree11: {
      filename: 'wm_tree01_glb.glb',
      pos: [24, 0, 120],
      angles: [0, 45, 0],
      scale: [1.0, 1.0, 1.0]
    },
    tree12: {
      filename: 'wm_tree01_glb.glb',
      pos: [78, 0, 89],
      angles: [0, 45, 0],
      scale: [1.0, 1.0, 1.0]
    },
    fence00: {
      filename: 'wm_fence02_glb.glb',
      pos: [3.2, 0.0, 1],
      angles: [0, 90, 0],
      scale: [1.0, 1.0, 1.0]
    },
    fence01: {
      filename: 'wm_fence02_glb.glb',
      pos: [1, 0.0, 3.1],
      angles: [0, 0, 0],
      scale: [1.0, 1.0, 1.0]
    },
    fence02: {
      filename: 'wm_fence02_glb.glb',
      pos: [1, 0.0, 30.5],
      angles: [0, 0, 0],
      scale: [1.0, 1.0, 1.0]
    },
    fence03: {
      filename: 'wm_fence02_glb.glb',
      pos: [1, 0.0, 33.5],
      angles: [0, 180, 0],
      scale: [1.0, 1.0, 1.0]
    },
    fence04: {
      filename: 'wm_fence02_glb.glb',
      pos: [1, 0.0, 108.8],
      angles: [0, 180, 0],
      scale: [1.0, 1.0, 1.0]
    },
    fence05: {
      filename: 'wm_fence02_glb.glb',
      pos: [3.1, 0.0, 111],
      angles: [0, 90, 0],
      scale: [1.0, 1.0, 1.0]
    },
    crate01: {
      filename: 'wm_crate01_glb.glb',
      pos: [2, 0.0, 56],
      angles: [0, 90, 0],
      scale: [1.0, 1.0, 1.0]
    },
    crate02: {
      filename: 'wm_crate02_glb.glb',
      pos: [2, 0.0, 54.7],
      angles: [0, 18, 0],
      scale: [1.0, 1.0, 1.0]
    },
    ground01: {
      filename: 'FloorBaseGrass_02/FloorBaseGrass_02.glb',
      pos: [16, 0, 16],
      angles: [0, 0, 0],
      scale: [2, 1, 2]
    },
    ground02: {
      filename: 'FloorBaseGrass_02/FloorBaseGrass_02.glb',
      pos: [56, 0, 16],
      angles: [0, 0, 0],
      scale: [3, 1, 2]
    },
    ground03: {
      filename: 'FloorBaseGrass_02/FloorBaseGrass_02.glb',
      pos: [16, 0, 48],
      angles: [0, 0, 0],
      scale: [2, 1, 2]
    },
    ground04: {
      filename: 'FloorBaseGrass_02/FloorBaseGrass_02.glb',
      pos: [56, 0, 48],
      angles: [0, 0, 0],
      scale: [3, 1, 2]
    },
    ground05: {
      filename: 'FloorBaseGrass_02/FloorBaseGrass_02.glb',
      pos: [16, 0, 80],
      angles: [0, 0, 0],
      scale: [2, 1, 2]
    },
    ground06: {
      filename: 'FloorBaseGrass_02/FloorBaseGrass_02.glb',
      pos: [56, 0, 80],
      angles: [0, 0, 0],
      scale: [3, 1, 2]
    },
    ground07: {
      filename: 'FloorBaseGrass_02/FloorBaseGrass_02.glb',
      pos: [16, 0, 112],
      angles: [0, 0, 0],
      scale: [2, 1, 2]
    },
    ground08: {
      filename: 'FloorBaseGrass_02/FloorBaseGrass_02.glb',
      pos: [56, 0, 112],
      angles: [0, 0, 0],
      scale: [3, 1, 2]
    },
    ground09: {
      filename: 'FloorBaseGrass_02/FloorBaseGrass_02.glb',
      pos: [-24, 0, 72],
      angles: [0, 0, 0],
      scale: [3, 1, 3]
    },
    ground10: {
      filename: 'FloorBaseGrass_02/FloorBaseGrass_02.glb',
      pos: [-24, 0, 112],
      angles: [0, 0, 0],
      scale: [3, 1, 2]
    },
    // "testMeteor": {
    //   "id": "1",
    //   "filename": "meteor_with_idle_alt_glb.glb",
    //   "typeName": "Local",
    //   "pos": [ 55, 0, 15 ],
    //   "angles": [ 0, 0, 0 ],
    //   "scale": [ 1, 1, 1 ]
    // },
    testAxe: {
      id: '1',
      filename: 'tools/StonePickaxeAnimated01.glb',
      pos: [30, 1.65, 15],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    recipeSelector: {
      filename: 'crafting_recipe_selector_bigger.glb',
      pos: [14, 0, 9],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    backArrow: {
      filename: 'crafting_triangle_button_glb.glb',
      pos: [0, 0, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    greenLever: {
      filename: 'crafting_lever_green_glb.glb',
      pos: [0, 0, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    crafter: {
      filename: 'crafting_machine_glb.glb',
      pos: [0, 0, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1],
      soundFile: 'CraftingMachineSFX02.mp3'
    },
    cart: {
      filename: 'wm_cart_glb.glb',
      pos: [2, 0, 20],
      angles: [0, 270, 0],
      scale: [1, 1, 1]
    },
    cartSign: {
      filename: 'coinCart_logo_glb.glb',
      pos: [0, 2.9, -1.1],
      angles: [0, 270, 0],
      scale: [0.5, 0.5, 0.5]
    },
    shop01: {
      filename: 'wm_shop_glb.glb',
      pos: [55, 0, 107],
      angles: [0, 270, 0],
      scale: [1, 1, 1]
    },
    statue: {
      filename: 'TheFirstMeteorChaserNFTStatue.glb',
      pos: [45, 0, 119.5],
      angles: [0, 180, 0],
      scale: [3.2, 3.2, 3.2]
    },
    tower: {
      filename: 'lookout_tower_final_glb.glb',
      pos: [0, 0, 52],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    hammer01: {
      filename: 'hammer_and_nails_glb.glb',
      pos: [8.8, 9.0, 55.6],
      angles: [0, 90, 0],
      scale: [1, 1, 1]
    },
    hammer02: {
      filename: 'hammer_and_nails_glb.glb',
      pos: [9.5, 8.8, 55.4],
      angles: [0, 90, 0],
      scale: [1, 1, 1]
    },
    meteorSpawner: {
      bottom: 10,
      left: 16,
      top: 110,
      right: 66,
      floorHeight: 0,
      dropHeight: 20
    }
  },
  shop: {
    BuySuccessSound: 'BuyingCoins.mp3',
    CoinPackA: {
      filename: 'wondercoins_model_edited_glb.glb',
      pos: [-0.8, 1.45, -0.35],
      angles: [0, 270, 0],
      scale: [0.3, 0.3, 0.3],
      idleClip: 'wondercoins_floating',
      itemQty: 50,
      manaPrice: 15
    },
    CoinPackB: {
      filename: 'wondercoins_model_edited_glb.glb',
      pos: [-0.8, 1.45, -0.35],
      angles: [0, 270, 0],
      scale: [0.3, 0.3, 0.3],
      idleClip: 'wondercoins_floating',
      itemQty: 100,
      manaPrice: 25
    },
    CoinPackC: {
      filename: 'wondercoins_model_edited_glb.glb',
      pos: [0, 1.45, -0.35],
      angles: [0, 270, 0],
      scale: [0.35, 0.35, 0.35],
      idleClip: 'wondercoins_floating',
      itemQty: 210,
      manaPrice: 50
    },
    CoinPackD: {
      filename: 'wondercoins_model_edited_glb.glb',
      pos: [0.8, 1.45, -0.35],
      angles: [0, 270, 0],
      scale: [0.4, 0.4, 0.4],
      idleClip: 'wondercoins_floating',
      itemQty: 440,
      manaPrice: 100
    },
    CoinPackE: {
      filename: 'wondercoins_model_edited_glb.glb',
      pos: [0.45, 1.8, 0.35],
      angles: [0, 270, 0],
      scale: [0.45, 0.45, 0.45],
      idleClip: 'wondercoins_floating',
      itemQty: 1120,
      manaPrice: 250
    },
    CoinPackF: {
      filename: 'wondercoins_model_edited_glb.glb',
      pos: [-0.45, 1.8, 0.35],
      angles: [0, 270, 0],
      scale: [0.45, 0.45, 0.45],
      idleClip: 'wondercoins_floating',
      itemQty: 2300,
      manaPrice: 500
    }
  },
  loot: {
    MeteorMedium: {
      filename: 'meteors/meteor_gold.glb',
      idleClip: 'idle',
      pos: [0, 0.01, 0],
      angles: [0, 0, 0],
      scale: [0.01, 0.01, 0.01]
    },
    MetalCopper: {
      filename: 'metals/copper_anim.glb',
      idleClip: 'idle',
      pos: [-0.4, 0.2, 0.4],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    MetalIron: {
      filename: 'metals/iron_anim.glb',
      idleClip: 'idle',
      pos: [0.4, 0.2, 0.4],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    MetalTitanium: {
      filename: 'metals/titanium_anim.glb',
      idleClip: 'idle',
      pos: [-0.4, 0.2, -0.4],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    MetalGold: {
      filename: 'metals/gold_anim.glb',
      idleClip: 'idle',
      pos: [0.4, 0.2, -0.4],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    MetalPlatinum: {
      filename: 'metals/platinum_anim.glb',
      idleClip: 'idle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    GemSapphire: {
      filename: 'gems/sapphire_anim.glb',
      idleClip: 'idle',
      pos: [-0.25, 0.6, 0.25],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    GemEmerald: {
      filename: 'gems/emerald_anim.glb',
      idleClip: 'idle',
      pos: [-0.25, 0.6, -0.25],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    GemRuby: {
      filename: 'gems/ruby_anim.glb',
      idleClip: 'idle',
      pos: [0.25, 0.6, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    GemDiamond: {
      filename: 'gems/diamond_anim.glb',
      idleClip: 'idle',
      pos: [0, 0.9, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    AxeStone: {
      filename: 'tools/StonePickaxeAnimated01.glb',
      idleClip: 'StonePickaxeIdle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    AxeCopper: {
      filename: 'tools/CopperPickaxeAnimated01.glb',
      idleClip: 'CopperPickaxeIdle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    AxeIron: {
      filename: 'tools/IronPickaxeAnimated01.glb',
      idleClip: 'IronPickaxeIdle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    AxeTitanium: {
      filename: 'tools/TitaniumPickaxeAnimated01.glb',
      idleClip: 'TitaniumPickaxeIdle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    AxeGolden: {
      filename: 'tools/GoldenPickaxeAnimated01.glb',
      idleClip: 'GoldenPickaxeIdle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    AxeDiamond: {
      filename: 'tools/DiamondPickaxeAnimated01.glb',
      idleClip: 'DiamondPickaxeIdle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    AxeWondergem: {
      filename: 'tools/WonderGemPickaxeAnimated.glb',
      idleClip: 'WonderGemPickaxeIdle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    AxeExtra: {
      filename: 'tools/ExtravagantPickaxe.glb',
      idleClip: 'WonderGemPickaxeIdle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    AxeIce: {
      filename: 'tools/IcePickaxeAnimated01.glb',
      idleClip: 'WonderGemPickaxeIdle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    AxeLava: {
      filename: 'tools/LavaPickaxe.glb',
      idleClip: 'WonderGemPickaxeIdle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [10, 10, 10]
    },
    AxeVroomway: {
      filename: 'tools/WonderVroomVehicle.glb',
      idleClip: 'idle',
      pos: [0, 0.2, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    AxeSteam: {
      filename: 'tools/SteampunkChopper.glb',
      idleClip: 'none',
      pos: [0.4, 0.2, 0.4],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    AxeGhost: {
      filename: 'tools/GhostPickaxe.glb',
      idleClip: 'none',
      pos: [0.4, 0.5, 0.4],
      angles: [0, 0, 0],
      scale: [8, 8, 8]
    },
    AxeSausage: {
      filename: 'tools/SausagePickaxe.glb',
      idleClip: 'none',
      pos: [0.4, 0.5, 0.4],
      angles: [0, 0, 0],
      scale: [8, 8, 8]
    },
    BlueFabric: {
      filename: 'wearables/blue_fabric_animated_glb.glb',
      idleClip: 'blue_fabric_spin',
      pos: [0, 0.5, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    Glowmetal: {
      filename: 'wearables/glowmetal_animated_glb.glb',
      idleClip: 'glowmetal_spin',
      pos: [0, 0.5, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    WearablesToken: {
      filename: 'wearables/wear_token_animated_glb.glb',
      idleClip: 'wearables_token_spin',
      pos: [0, 0.5, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    },
    StarGold: {
      filename: 'gems/star_glb.glb',
      idleClip: 'Armature|idle|BaseLayer',
      pos: [0, 0.5, 0],
      angles: [0, 0, 0],
      scale: [1, 1, 1]
    }
  },
  meteorTypes: [
    {
      name: 'Local',
      metal: 1,
      filename: 'meteors/meteor_pink.glb',
      scale: [1, 1, 1],
      chance: 10,
      duration: 300,
      maxHits: 2,
      idleClip: 'idle',
      dropClip: 'falling',
      hitClip: 'hit',
      depleteClip: 'crumble',
      dropSound: 'MeteorImpactSFX.mp3'
    },
    {
      name: 'Medium',
      metal: 3,
      filename: 'meteors/meteor_gold.glb',
      scale: [1, 1, 1],
      chance: 20,
      duration: 300,
      maxHits: 2,
      idleClip: 'meteorIdle',
      dropClip: 'meteorLanding',
      hitClip: 'meteorStruckIdle',
      depleteClip: 'meteorExplosion',
      dropSound: 'MeteorImpactSFX.mp3'
    }
  ],
  // "meteors": [
  //   {
  //     "id": "1",
  //     "typeName": "Local",
  //     "pos": [ 26, 16, 20 ],
  //     "angles": [ 0, 60, 0 ],
  //     "scale": [ 1, 1, 1 ]
  //   },
  //   {
  //     "id": "2",
  //     "typeName": "Medium",
  //     "pos": [ 11, 19, 43 ],
  //     "angles": [ 0, 90, 0 ],
  //     "scale": [ 1, 1, 1 ]
  //   }
  // ],
  toolTypes: [
    {
      ItemId: 'AxeStone',
      filename: 'tools/StonePickaxeAnimated01.glb',
      scale: [10, 10, 10],
      miningClip: 'StonePickaxeMiningLong',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 0.4,
      maxHits: 20
    },
    {
      ItemId: 'AxeIron',
      filename: 'tools/IronPickaxeAnimated01.glb',
      scale: [10, 10, 10],
      miningClip: 'IronPickaxeMiningLong',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 0.52,
      maxHits: 40
    },
    {
      ItemId: 'AxeCopper',
      filename: 'tools/CopperPickaxeAnimated01.glb',
      scale: [8, 8, 8],
      miningClip: 'CopperPickaxeMiningLong',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 0.64,
      maxHits: 60
    },
    {
      ItemId: 'AxeTitanium',
      filename: 'tools/TitaniumPickaxeAnimated01.glb',
      scale: [8, 8, 8],
      miningClip: 'TitaniumPickaxeMiningLong',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 0.76,
      maxHits: 80
    },
    {
      ItemId: 'AxeGolden',
      filename: 'tools/GoldenPickaxeAnimated01.glb',
      scale: [8, 8, 8],
      miningClip: 'GoldenPickaxeMiningLong',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 0.88,
      maxHits: 100
    },
    {
      ItemId: 'AxeDiamond',
      filename: 'tools/DiamondPickaxeAnimated01.glb',
      scale: [8, 8, 8],
      miningClip: 'DiamondMiningLong',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 1.0,
      maxHits: 500
    },
    {
      ItemId: 'AxeWondergem',
      filename: 'tools/WonderGemPickaxeAnimated.glb',
      scale: [8, 8, 8],
      miningClip: 'WonderGemPickaxeMiningLong',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 1.0,
      maxHits: 500
    },
    {
      ItemId: 'AxeExtra',
      filename: 'tools/ExtravagantPickaxe.glb',
      scale: [8, 8, 8],
      miningClip: 'WonderGemPickaxeMiningLong',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 1.0,
      maxHits: 700
    },
    {
      ItemId: 'AxeIce',
      filename: 'tools/IcePickaxeAnimated01.glb',
      scale: [8, 8, 8],
      miningClip: 'WonderGemPickaxeMiningLong',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 1.0,
      maxHits: 700
    },
    {
      ItemId: 'AxeLava',
      filename: 'tools/LavaPickaxe.glb',
      scale: [8, 8, 8],
      miningClip: 'WonderGemPickaxeMiningLong',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 1.0,
      maxHits: 500
    },
    {
      ItemId: 'AxeVroomway',
      filename: 'tools/WonderVroomVehicle.glb',
      scale: [1, 1, 1],
      miningClip: 'go',
      miningSound: 'WonderVroomSFX.mp3',
      efficiency: 1.0,
      maxHits: 600
    },
    {
      ItemId: 'AxeSteam',
      filename: 'tools/SteampunkChopper.glb',
      scale: [1, 1, 1],
      miningClip: 'strike_chopper',
      extraClip1: 'strike_arm',
      extraClip2: 'strike_steam',
      miningSound: 'SteampunkChopperSFX.mp3',
      efficiency: 1.0,
      maxHits: 600
    },
    {
      ItemId: 'AxeGhost',
      filename: 'tools/GhostPickaxe.glb',
      scale: [8, 8, 8],
      miningClip: 'mining',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 1.0,
      maxHits: 500
    },
    {
      ItemId: 'AxeSausage',
      filename: 'tools/SausagePickaxe.glb',
      scale: [8, 8, 8],
      miningClip: 'Armature|mining|BaseLayer',
      miningSound: 'MiningSoundEffectLong.mp3',
      efficiency: 1.0,
      maxHits: 500
    }
  ],
  ui: {
    popupPanel: {
      atlasFile: 'new_ui_1024.png',
      resourceAtlasFile: 'resources_atlas_1024.png',
      image: {
        windowBg: {
          width: '680px',
          height: '540px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 20,
          sourceTop: 10,
          sourceWidth: 680,
          sourceHeight: 180
        },
        meteorMined: {
          width: '444px',
          height: '68px',
          positionX: 118,
          positionY: 1390,
          sourceLeft: 3,
          sourceTop: 820,
          sourceWidth: 444,
          sourceHeight: 68
        },
        levelUp: {
          width: '280px',
          height: '68px',
          positionX: 200,
          positionY: 1390,
          sourceLeft: 3,
          sourceTop: 957,
          sourceWidth: 280,
          sourceHeight: 68
        },
        crafted: {
          width: '532px',
          height: '66px',
          positionX: 74,
          positionY: 1390,
          sourceLeft: 491,
          sourceTop: 624,
          sourceWidth: 532,
          sourceHeight: 66
        },
        youGotLoot: {
          width: '392px',
          height: '54px',
          positionX: 144,
          positionY: 1388,
          sourceLeft: 3,
          sourceTop: 893,
          sourceWidth: 392,
          sourceHeight: 54
        },
        yourShare: {
          width: '408px',
          height: '54px',
          positionX: 134,
          positionY: 1388,
          sourceLeft: 5,
          sourceTop: 773,
          sourceWidth: 408,
          sourceHeight: 54
        },
        readyToMint: {
          width: '392px',
          height: '56px',
          positionX: 144,
          positionY: 1388,
          sourceLeft: 567,
          sourceTop: 690,
          sourceWidth: 392,
          sourceHeight: 56
        },
        problem: {
          width: '408px',
          height: '56px',
          positionX: 136,
          positionY: 1388,
          sourceLeft: 559,
          sourceTop: 568,
          sourceWidth: 408,
          sourceHeight: 56
        },
        arrowUpImage: {
          width: '200px',
          height: '250px',
          positionX: 240,
          positionY: 760,
          sourceLeft: 479,
          sourceTop: 398,
          sourceWidth: 100,
          sourceHeight: 128
        },
        splashImage: {
          width: '460px',
          height: '400px',
          positionX: 110,
          positionY: 460,
          sourceLeft: 19,
          sourceTop: 368,
          sourceWidth: 460,
          sourceHeight: 400
        },
        wearablesImage: {
          width: '256px',
          height: '250px',
          positionX: 212,
          positionY: 1012,
          sourceLeft: 456,
          sourceTop: 768,
          sourceWidth: 256,
          sourceHeight: 256
        },
        closeBtn: {
          width: '32px',
          height: '32px',
          positionX: 600,
          positionY: 1540,
          sourceLeft: 837,
          sourceTop: 0,
          sourceWidth: 32,
          sourceHeight: 32
        }
      },
      textField: {
        message: {
          width: '680px',
          height: '50px',
          positionX: 0,
          positionY: 1280,
          fontSize: 24,
          fontStyle: 'bold',
          hTextAlign: 'center',
          vTextAlign: 'top',
          hexColor: '#FFFFDDFF'
        }
      }
    },
    bottomBarPanel: {
      atlasFile: 'new_ui_1024.fw.png',
      image: {
        barLeft: {
          width: '110px',
          height: '60px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 710,
          sourceTop: 250,
          sourceWidth: 110,
          sourceHeight: 60
        },
        barCenter: {
          width: '88px',
          height: '60px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 820,
          sourceTop: 250,
          sourceWidth: 10,
          sourceHeight: 60
        },
        barRight: {
          width: '192px',
          height: '60px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 830,
          sourceTop: 250,
          sourceWidth: 192,
          sourceHeight: 60
        },
        barTools: {
          width: '80px',
          height: '64px',
          positionX: -80,
          positionY: -65,
          sourceLeft: 917,
          sourceTop: 76,
          sourceWidth: 106,
          sourceHeight: 88
        },
        toolBtn: {
          width: '20px',
          height: '64px',
          positionX: -23,
          positionY: 48,
          sourceLeft: 990,
          sourceTop: 162,
          sourceWidth: 32,
          sourceHeight: 88
        },
        inventoryBtn: {
          width: '70px',
          height: '50px',
          positionX: -18,
          positionY: 0,
          sourceLeft: 736,
          sourceTop: 62,
          sourceWidth: 94,
          sourceHeight: 60
        },
        inventoryBg: {
          width: '312px',
          height: '300px',
          positionX: -4,
          positionY: 0,
          sourceLeft: 717,
          sourceTop: 747,
          sourceWidth: 304,
          sourceHeight: 265
        },
        levelCircle: {
          width: '42px',
          height: '42px',
          positionX: -112,
          positionY: -6,
          sourceLeft: 832,
          sourceTop: 78,
          sourceWidth: 84,
          sourceHeight: 84
        },
        progBarBg: {
          width: '68px',
          height: '26px',
          positionX: 8,
          positionY: -12,
          sourceLeft: 836,
          sourceTop: 163,
          sourceWidth: 136,
          sourceHeight: 52
        },
        progBar: {
          width: '38px',
          height: '14px',
          positionX: -36,
          positionY: -18,
          sourceLeft: 836,
          sourceTop: 215,
          sourceWidth: 100,
          sourceHeight: 28
        }
      },
      textField: {
        coinsTxt: {
          width: '70px',
          height: '30px',
          positionX: 18,
          positionY: -9,
          fontSize: 20,
          fontStyle: 'bold',
          hTextAlign: 'left',
          hexColor: '#FFFFFFFF'
        },
        gemsTxt: {
          width: '70px',
          height: '30px',
          positionX: 0,
          positionY: -9,
          fontSize: 20,
          fontStyle: 'bold',
          hTextAlign: 'left',
          hexColor: '#FFFFFFFF'
        },
        levelTxt: {
          width: '40px',
          height: '30px',
          positionX: -153,
          positionY: -6,
          fontSize: 18,
          fontStyle: 'bold',
          hTextAlign: 'center',
          hexColor: '#FFEE99FF'
        },
        bonusPctTxt: {
          width: '40px',
          height: '30px',
          positionX: -420,
          positionY: -245,
          fontSize: 12,
          fontStyle: 'bold',
          hTextAlign: 'center',
          hexColor: '#FFEE99FF'
        },
        invItemTxt: {
          width: '40px',
          height: '28px',
          positionX: 0,
          positionY: 0,
          fontSize: 18,
          hTextAlign: 'left',
          hexColor: '#FFFFDDFF'
        },
        toolTxt: {
          width: '260px',
          height: '40px',
          positionX: -345,
          positionY: 104,
          fontSize: 12,
          fontStyle: 'bold',
          hTextAlign: 'right',
          hexColor: '#FFEE99FF'
        }
      }
    },
    messagePanel: {
      atlasFile: 'new_ui_1024.fw.png',
      textField: {
        message: {
          width: '800px',
          height: '300px',
          positionX: 0,
          positionY: -20,
          fontSize: 20,
          fontStyle: 'bold',
          hTextAlign: 'center',
          hexColor: '#FFFFDDFF'
        }
      }
    },
    alertPanel: {
      atlasFile: 'new_ui_1024.fw.png',
      textField: {
        title: {
          width: '600px',
          height: '120px',
          positionX: -30,
          positionY: 580,
          fontSize: 24,
          fontStyle: 'bold',
          hTextAlign: 'center',
          hexColor: '#FFFFDDFF'
        },
        message: {
          width: '300px',
          height: '400px',
          positionX: 205,
          positionY: 810,
          fontSize: 18,
          fontStyle: 'bold',
          hTextAlign: 'center',
          hexColor: '#FFFFDDFF'
        },
        okBtn: {
          width: '140x',
          height: '50px',
          positionX: 200,
          positionY: 855,
          fontSize: 18,
          fontStyle: 'bold',
          hTextAlign: 'center',
          hexColor: '#FFFFDDFF'
        }
      },
      image: {
        longBtn: {
          width: '142px',
          height: '50px',
          positionX: 200,
          positionY: 790,
          sourceLeft: 875,
          sourceTop: 0,
          sourceWidth: 142,
          sourceHeight: 60
        },
        disconnect: {
          width: '120px',
          height: '200px',
          positionX: 55,
          positionY: 250,
          sourceLeft: 894,
          sourceTop: 312,
          sourceWidth: 120,
          sourceHeight: 200
        }
      }
    },
    crafterScreen: {
      textField: {
        name: {
          width: '200px',
          height: '80px',
          pos: [0, 0.35, 0],
          positionX: 0,
          positionY: 12,
          fontSize: 3,
          fontWeight: 'bold',
          hTextAlign: 'center',
          hexColor: '#FFFFDD'
        },
        desc: {
          width: '2000px',
          height: '500px',
          pos: [0, 0.24, 0],
          positionX: 0,
          positionY: 12,
          fontSize: 2,
          fontWeight: 'bold',
          hTextAlign: 'center',
          hexColor: '#FFFFDD'
        },
        id: {
          width: '200px',
          height: '50px',
          pos: [0.02, -0.5, 0],
          positionX: 0,
          positionY: 12,
          fontSize: 1.8,
          fontWeight: 'normal',
          hTextAlign: 'center',
          hexColor: '#FFFFDD'
        },
        levelMin: {
          width: '200px',
          height: '50px',
          pos: [0.02, -0.55, 0],
          positionX: 0,
          positionY: 12,
          fontSize: 1.8,
          fontWeight: 'normal',
          hTextAlign: 'center',
          hexColor: '#FF6600'
        },
        youNeed: {
          width: '200px',
          height: '50px',
          pos: [-0.41, 0.03, 0],
          positionX: 0,
          positionY: 12,
          fontSize: 1.8,
          fontWeight: 'bold',
          hTextAlign: 'center',
          hexColor: '#555555'
        },
        toMake: {
          width: '200px',
          height: '50px',
          pos: [0.41, 0.03, 0],
          positionX: 0,
          positionY: 12,
          fontSize: 1.8,
          fontWeight: 'bold',
          hTextAlign: 'center',
          hexColor: '#555555'
        },
        ready: {
          width: '200px',
          height: '50px',
          pos: [0, -0.63, 0],
          positionX: 0,
          positionY: 12,
          fontSize: 2,
          fontWeight: 'bold',
          hTextAlign: 'center',
          hexColor: '#22BB44'
        }
      }
    },
    resourceIcons: {
      atlasFile: 'resources_atlas_1024.png',
      image: {
        Empty: {
          width: '32px',
          height: '32px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 896,
          sourceTop: 0,
          sourceWidth: 128,
          sourceHeight: 128
        },
        WC: {
          width: '32px',
          height: '32px',
          positionX: 15,
          positionY: -8,
          sourceLeft: 0,
          sourceTop: 0,
          sourceWidth: 128,
          sourceHeight: 128
        },
        WG: {
          width: '32px',
          height: '32px',
          positionX: 0,
          positionY: -8,
          sourceLeft: 128,
          sourceTop: 0,
          sourceWidth: 128,
          sourceHeight: 128
        },
        MetalCopper: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 256,
          sourceTop: 0,
          sourceWidth: 128,
          sourceHeight: 128
        },
        MetalIron: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 384,
          sourceTop: 0,
          sourceWidth: 128,
          sourceHeight: 128
        },
        MetalTitanium: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 512,
          sourceTop: 0,
          sourceWidth: 128,
          sourceHeight: 128
        },
        MetalGold: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 640,
          sourceTop: 0,
          sourceWidth: 128,
          sourceHeight: 128
        },
        MetalPlatinum: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 768,
          sourceTop: 0,
          sourceWidth: 128,
          sourceHeight: 128
        },
        GemSapphire: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 0,
          sourceTop: 128,
          sourceWidth: 128,
          sourceHeight: 128
        },
        GemEmerald: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 128,
          sourceTop: 128,
          sourceWidth: 128,
          sourceHeight: 128
        },
        GemRuby: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 256,
          sourceTop: 128,
          sourceWidth: 128,
          sourceHeight: 128
        },
        GemDiamond: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 384,
          sourceTop: 128,
          sourceWidth: 128,
          sourceHeight: 128
        },
        BlueFabric: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 512,
          sourceTop: 128,
          sourceWidth: 128,
          sourceHeight: 128
        },
        Glowmetal: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 640,
          sourceTop: 128,
          sourceWidth: 128,
          sourceHeight: 128
        },
        WearablesToken: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 768,
          sourceTop: 128,
          sourceWidth: 128,
          sourceHeight: 128
        },
        MeteorChaserSet: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 896,
          sourceTop: 128,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeStone: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 0,
          sourceTop: 256,
          sourceWidth: 128,
          sourceHeight: 128
        },
        ToolIcon: {
          width: '48px',
          height: '48px',
          positionX: -120,
          positionY: -116,
          sourceLeft: 0,
          sourceTop: 256,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeCopper: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 128,
          sourceTop: 256,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeIron: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 256,
          sourceTop: 256,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeTitanium: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 384,
          sourceTop: 256,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeGolden: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 512,
          sourceTop: 256,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeDiamond: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 640,
          sourceTop: 256,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeWondergem: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 896,
          sourceTop: 512,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeExtra: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 896,
          sourceTop: 896,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeIce: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 128,
          sourceTop: 896,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeLava: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 640,
          sourceTop: 768,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeVroomway: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 384,
          sourceTop: 768,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeSteam: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 896,
          sourceTop: 384,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeGhost: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 0,
          sourceTop: 896,
          sourceWidth: 128,
          sourceHeight: 128
        },
        AxeSausage: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 640,
          sourceTop: 384,
          sourceWidth: 128,
          sourceHeight: 128
        },
        GiftBox: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 640,
          sourceTop: 512,
          sourceWidth: 128,
          sourceHeight: 128
        },
        meteorchaser_transmitter_earring: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 128,
          sourceTop: 384,
          sourceWidth: 128,
          sourceHeight: 128
        },
        meteorite_dustmask_mask: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 256,
          sourceTop: 384,
          sourceWidth: 128,
          sourceHeight: 128
        },
        meteorchaser_shoes_feet: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 384,
          sourceTop: 384,
          sourceWidth: 128,
          sourceHeight: 128
        },
        meteorchaser_trousers_lower_body: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 512,
          sourceTop: 384,
          sourceWidth: 128,
          sourceHeight: 128
        },
        meteorite_protective_hardhat_hat: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 640,
          sourceTop: 384,
          sourceWidth: 128,
          sourceHeight: 128
        },
        meteorchaser_vest_upper_body: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 768,
          sourceTop: 384,
          sourceWidth: 128,
          sourceHeight: 128
        },
        tiger_skirt: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 0,
          sourceTop: 384,
          sourceWidth: 128,
          sourceHeight: 128
        },
        tiger_torso: {
          width: '40px',
          height: '40px',
          positionX: 0,
          positionY: 0,
          sourceLeft: 768,
          sourceTop: 384,
          sourceWidth: 128,
          sourceHeight: 128
        }
      }
    }
  },
  wearables: {
    meteorchaser_transmitter_earring: {
      coll: 1,
      wi: 0
    },
    meteorite_dustmask_mask: {
      coll: 1,
      wi: 1
    },
    meteorchaser_shoes_feet: {
      coll: 1,
      wi: 2
    },
    meteorchaser_trousers_lower_body: {
      coll: 1,
      wi: 3
    },
    meteorite_protective_hardhat_hat: {
      coll: 1,
      wi: 4
    },
    meteorchaser_vest_upper_body: {
      coll: 1,
      wi: 5
    },
    steampunk_goggles: {
      coll: 2,
      wi: 0
    },
    steampunk_mask: {
      coll: 2,
      wi: 1
    },
    steampunk_boots: {
      coll: 2,
      wi: 2
    },
    steampunk_hat: {
      coll: 2,
      wi: 3
    },
    steampunk_trousers: {
      coll: 2,
      wi: 4
    },
    steampunk_jacket: {
      coll: 2,
      wi: 5
    }
  }
}
