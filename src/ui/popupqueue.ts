import { type PopupWindowType } from '../enums'
import { GameUi } from './gameui'
import { PopupData } from './popupdata'
import { type Item } from './uipopuppanel'

export class PopupQueue {
  public queue: PopupData[] | null = []
  public active: PopupData | null = null
  public lastActiveTime: number = 0

  public isActive(): boolean {
    // assume that if there's acive data, then it's being shown
   console.log("$$$$$$$$$$ isActive() = " + (this.active != null));
    return this.active != null
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public addPopup(type: PopupWindowType, msg: string, rewards: Item[] | null, itemId: string | null, millis: number): void {
    this.add(new PopupData(type, msg, rewards, itemId, millis))
  }

  public add(data: PopupData): void {
    if (this.queue != null) {
      this.queue.push(data)
    }

    console.log("$$$$$$$$$$ added popup: active=" + (this.active != null));
    console.log(data);
    if (this.active == null || Date.now() > this.lastActiveTime) {
      this.showNext()
    }
  }

  public showNext(): void {
    if (this.queue != null) {
      if (this.queue.length > 0) {
        this.active = this.queue.shift() ?? null // Ensure it is null instead of undefined
        this.show()
      } else {
        this.active = null
      }
    }
  }

  public show(): void {
   console.log("$$$$$$$$$$ show(), active=" + (this.active != null));
    if (this.active != null) {
     console.log("$$$$$$$$$$ showing popup window: " + this.active.msg);
      this.lastActiveTime = Date.now() + this.active.millis
      if (GameUi.instance != null) {
        GameUi.instance.showTimedPopup(
          this.active.type,
          this.active.msg,
          this.active.rewards,
          this.active.itemId,
          this.active.millis,
          () => {
            this.active = null
           console.log("$$$$$$$$$$ popup window closed");
            this.showNext()
          }
        )
      }
    }
  }
}
