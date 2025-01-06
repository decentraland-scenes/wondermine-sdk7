/**
 * The state of the Crafting Machine.
 */
export enum CraftMachineState
{
    Loading,
    Ready,
    Crafting,
    Disabled
}

/**
 * The state of the overall game scene
 */
export enum GameState
{
    Loading,
    Animating,
    Ready,
    Playing,
    Closed
}

/**
 * The state of a gate that you must clear during a race
 */
export enum MeteorState
{
    Idle,
    Falling,
    Active,
    Mining,
    Depleted
}

/**
 * The state of a player in WonderMine. State only changes while actions are running. 
 * For example, "Crafting" only happens during the short time that a crafting machine animation takes place.
 */
export enum SessionState
{
    Waiting,
    Mining,
    Crafting,
    Shopping
}