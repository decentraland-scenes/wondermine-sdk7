import { UserInfo } from './userinfo'

// import { getRealm } from '~system/Runtime'
export type Realm = {
  domain: string
  /** @deprecated use room instead */
  layer: string
  room: string
  serverName: string
  displayName: string
}
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DclUser {
  public static instance: DclUser | null = null

  public static userId: string
  public static displayName: string
  public static publicKey: string
  public static playfabId: string
  public static realm: Realm

  public static activeUser: UserInfo
  // eslint-disable-next-line @typescript-eslint/ban-types
  public static visitors: Record<string, UserInfo> = {}

  public static weLive: boolean = true // WEARABLES ARE LIVE!

  // public static levelsArray:Array<Object>;
  public static thresholds: number[] = new Array<number>()

  static idNum: number = 0
  static cooldownTime: number = 60 * 60 * 24 * 1000

  /**
   * Trying to get the user data directly -- but this still fails...
   */
  // public static async getUser()
  // {
  //     return new Promise((resolve, reject) => {
  //         executeTask(async () => {
  //             let id:UserData;
  //             if (DclUser.idNum == 0)
  //             {
  //                 DclUser.idNum = 100 + Math.floor(Math.random() * 900);
  //             }

  //             try {
  //                 id = await getUserData();

  //                 /// ADDED
  //                 DclUser.setUserInfo(id.userId, id.displayName, id.publicKey);
  //                 log("got player id=" + id.userId);

  //                 return resolve(id);
  //             } catch {
  //                 log("failed to get user ID");
  //                 id = {
  //                     userId: DclUser.idNum.toString(),
  //                     displayName: "test" + DclUser.idNum.toString(),
  //                     publicKey: DclUser.idNum.toString(),
  //                     hasConnectedWeb3: false,
  //                 };

  //                 DclUser.setUserInfo(id.userId, id.displayName, id.publicKey);
  //                 //   uiSystem.setMessage(
  //                 //     "Are you logged on to your Ethereum wallet? Something isn't working. If so, please reload",
  //                 //     3
  //                 //   )
  //                 return resolve(id);
  //             }
  //         });
  //     });
  // }

  public static setUserInfo(_id: string, _name: string, _key: string, _isTemp: boolean = false): void {
    // log("SetUserInfo(" + _id + ")");
    DclUser.userId = _id
    if (_name == null || _name === '') {
      DclUser.displayName = 'guest- ' + DclUser.userId.substr(2, 6)
    } else {
      DclUser.displayName = _name
    }
    DclUser.publicKey = _key

    let existingUser: UserInfo = DclUser.visitors[_id.toString()]
    if (DclUser.visitors[_id.toString()] != null) {
      // log("found userId=" + _id);
      existingUser.displayName = _name
      existingUser.publicKey = _key
    } else {
      // log("creating userId=" + _id);
      existingUser = new UserInfo(_id, _name, _key, _isTemp)
    }
    existingUser.totalVisits++
    DclUser.visitors[_id.toString()] = existingUser
    DclUser.activeUser = existingUser

    // log("visitors count=" + Object.keys(DclUser.visitors).length);
  }

  public static createInstance(): void {
    if (DclUser.instance == null) {
      DclUser.instance = new DclUser()
    }
  }

  public static setLevels(thresholds: []): void {
    // levelObjects:Array<Object>
    console.log(thresholds)
    // DclUser.levelsArray = levelObjects;
    DclUser.thresholds = thresholds
    // for (var i:number = 0; i < levelObjects.length; i++)
    // {
    //     DclUser.thresholds.push(levelObjects[i]["xp"]);
    // }
    // log(DclUser.thresholds);
  }

  public static setUserXpAndLevel(xp: number, newLevel: number = 0): void {
    // log("xp=" + xp + ", newLevel=" + newLevel);
    this.activeUser.xp = xp
    if (newLevel > 0) {
      this.activeUser.level = newLevel
      this.activeUser.levelBonus = 2 * Math.floor(newLevel / 10)
    }
  }

  public static setRealm(r: Realm | undefined): void {
    if (r != null) {
      this.realm = r
    }
  }

  public static getRealmName(): string {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.realm) {
      return this.realm.displayName
    } else {
      return 'none'
    }
  }

  public static setCraftCooldown(seconds: number): void {
    console.log('setCraftCooldown(' + seconds + ')')
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (this.activeUser) {
      if (seconds > 0) {
        this.activeUser.lastCraftingTime = seconds * 1.0
      }
    }
  }

  public static cooldownSeconds(): number {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.activeUser) return -1

    // log("lastCraftingTime=" + this.activeUser.lastCraftingTime);
    // log("cooldownTime=" + DclUser.cooldownTime);
    const endTime: number = this.activeUser.lastCraftingTime + DclUser.cooldownTime

    // const now = Date.now()
    // log("now=" + now);
    // log("endTime=" + endTime);

    const timeUntilActive = endTime - Date.now()
    // log("timeUntilActive=" + timeUntilActive);

    if (timeUntilActive <= 0) {
      // active
      return 0
    } else {
      // still cooling down
      return timeUntilActive
    }
  }

  public static setLimitOneItems(items: string[]): void {
    // log("xp=" + xp + ", newLevel=" + newLevel);
    this.activeUser.limitOneItems = items
  }

  public static setHeldItem(id: string): void {
    console.log('DclUser.setHeldItem(' + id + ')')
    if (id.length > 0 && this.activeUser !== null) {
      this.activeUser.setHeldItem(id)
    }
  }

  constructor() {
    DclUser.visitors = {}
  }
}
