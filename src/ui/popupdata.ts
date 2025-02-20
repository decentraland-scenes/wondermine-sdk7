/* eslint-disable @typescript-eslint/ban-types */
import { type PopupWindowType } from '../enums'
import { type Item } from './uipopuppanel'

export class PopupData {
  public type: PopupWindowType
  public msg: string
  public rewards: Item[] | null
  public itemId: string | null
  public millis: number

  constructor(
    _type: PopupWindowType,
    _msg: string = '',
    _rewards: Item[] | null = null,
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
