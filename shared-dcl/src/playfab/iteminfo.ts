/**
 * A data structure that matches PlayFab's inventory item fields.
 */
export class ItemInfo {
  // --- Item Profile ---
  public ItemId: string = ''

  public Annotation: string = ''
  public CatalogVersion: string = ''
  public DisplayName: string = ''
  public ItemClass: string = ''

  // --- Instance-specific values ---
  public ItemInstanceId: string = ''

  /**
   * For consumables, the number of uses until this item disappears.
   * For durables, the quantity of these items that the player owns.
   */
  public RemainingUses: number = 0

  /**
   * Only available when the item was purchased from a store.
   */
  public UnitPrice: number = 0

  // --- Bundle data ---
  public BundleContents: string[] = ['']
  public BundleParent: string = ''

  // --- Custom Data ---
  public CustomData: ItemCustomData
  // public Efficiency: number;
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  | undefined
  // public Efficiency: number;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {}
}

export class ItemCustomData {
  // --- Item Profile ---
  public tokenId: string = ''
  public serial: string = ''
  public xp: number = 0
  public level: number = 0

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {}
}
