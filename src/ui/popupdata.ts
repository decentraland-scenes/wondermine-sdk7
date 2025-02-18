/* eslint-disable @typescript-eslint/ban-types */
import { type PopupWindowType } from '../enums'

export class PopupData {
  public type: PopupWindowType
  public msg: string
  public rewards: Object[] | null
  public itemId: string | null
  public millis: number

  constructor(
    _type: PopupWindowType,
    _msg: string = '',
    _rewards: Object[] | null = null,
    _itemId: string | null = null,
    _millis: number = 8000
  ) {
    this.type = _type
    this.msg = _msg
    this.rewards = _rewards
    this.itemId = _itemId
    this.millis = _millis
  }
}
