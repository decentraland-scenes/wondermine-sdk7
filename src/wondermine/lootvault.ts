import { type LootItem } from './lootitem'

export class LootVault {
  public static instance: LootVault | null

  public vault: object | any

  constructor() {
    this.vault = {}
  }

  static create(): LootVault {
    if (LootVault.instance == null) {
      LootVault.instance = new LootVault()
    }
    return LootVault.instance
  }

  add(name: string, model: LootItem): void {
    if (name != null && name !== '' && model != null) {
      this.vault[name] = model
    }
  }

  get(name: string): LootItem {
    return this.vault[name]
  }
}
