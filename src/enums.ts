export enum PopupWindowType
{
    Message,
    LevelUp,
    Mined,
    Crafted,
    CraftError,
    Reconnect,
    MinedShared,
    SharedBonus
}

export enum ItemIcons
{
    WC,
    WG,
    MetalCopper,
    MetalIron,
    MetalTitanium,
    MetalGold,
    MetalPlatinum,
    Empty,
    GemSapphire,
    GemEmerald,
    GemRuby,
    GemDiamond,
    BlueFabric,
    Glowmetal,
    WearablesToken,
    MeteorChaser,
    AxeStone,
    AxeCopper,
    AxeIron,
    AxeTitanium,
    AxeGolden,
    AxeDiamond,
    ArrowGray,
    ArrowGreen,
    AxeRepair,
    wear_yasei_ronin_hat,
    wear_yasei_ronin_torso,
    wear_yasei_ronin_legs,
    wear_cosmic_sneakers,
    AxeSausage,
    wear_terrified_emote,
    AxeSteam,
    wear_wireframe,
    wear_bulging_eyes,
    wear_buck_teeth,
    wear_monkey_head,
    wear_horse_head,
    GiftBox,
    Mana,
    AxeWondergem,
    wear_venetian_red_cap,
    wear_headless,
    wear_venetian_green_cap,
    wear_nebula_sneakers,
    wear_galaxy_sneakers,
    wear_discord_mod_head,
    wear_discord_mod_torso,
    wear_discord_mod_legs,
    wear_marcel_mask,
    wear_wz_logo_shirt,
    wear_wz_logo_cap,
    AxeVroomway,
    wear_cowboy_hat,
    AxeLava,
    wear_mole_dive_emote,
    wear_wonderchad,
    AxeGhost,
    AxeIce,
    wear_mandarin_gown,
    wear_alchemist_torso,
    wear_arctic_miner_hat,
    wear_arctic_miner_torso,
    wear_arctic_miner_legs,
    AxeExtra
}

export enum ToolIds
{
    None = 0,
    AxeStone = 1,
    AxeCopper = 2,
    AxeIron = 3,
    AxeTitanium = 4,
    AxeGolden = 5,
    AxeDiamond = 6,
    AxeWondergem = 7,
    AxeExtra = 8,
    AxeIce = 9,
    AxeLava = 10,
    AxeVroomway = 11,
    AxeSteam = 12,
    AxeGhost = 13,
    AxeSausage = 14
}

export enum WearablesState
{
    Inactive,
    Active,
    Cooldown
}

export enum ChainId {
    ETHEREUM_MAINNET = 1,
    ETHEREUM_ROPSTEN = 3,
    ETHEREUM_RINKEBY = 4,
    ETHEREUM_GOERLI = 5,
    ETHEREUM_KOVAN = 42,
    MATIC_MAINNET = 137,
    MATIC_MUMBAI = 80001
}

export enum ProviderType {
    INJECTED = "injected",
    FORTMATIC = "formatic",
    NETWORK = "network",
    WALLET_CONNECT = "wallet_connect",
    WALLET_LINK = "wallet_link"
}

export enum MeteorTypeId {
    Local = 0,
    Medium = 1,
    Large = 2
}

export enum MeteorState {
    None, 
    Falling, // in the air, not ready to be mined yet
    Ready, // on the ground, ready to be mined
    Mined, // at least one player has hit it
    Depleted, // fully mined, no longer hittable
    LootGranted, // shared loot has been granted to players
    Gone // removed from the scene
}