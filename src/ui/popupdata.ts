import { type PopupWindowType } from '../enums'

export class PopupData {
  public type: PopupWindowType
  public msg: string
  // eslint-disable-next-line @typescript-eslint/ban-types
  public rewards: Object[] | null = null
  public itemId: string | null = null
  public millis: number

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(
    _type: PopupWindowType,
    _msg: string = '',
    // eslint-disable-next-line @typescript-eslint/ban-types
    _rewards: Object[] | null = null,
    _itemId: string | null = null,
    _millis: number = 8000
  ) {
    this.type = _type
    this.msg = _msg
    if (_rewards != null) {
      this.rewards = _rewards
    }
    if (_itemId != null) {
      this.itemId = _itemId
    }
    this.millis = _millis
  }
}
