import { GameData } from '../../../src/gamedata'
import { HttpCaller } from '../../../src/httpcaller'
import { DclUser } from './dcluser'
import { ItemInfo } from './iteminfo'
// import { GameData } from "../../../src/gamedata"
import { PlayFabApi, AuthType, type ResponseData } from './playfabapi'
// import { HttpCaller } from "src/httpcaller";
type TitleData = {
  levelArray?: string // Si es opcional
  recipesTest?: string // Si también existe
  [key: string]: any // Permite propiedades adicionales no especificadas
}

export class WondermineApi extends PlayFabApi {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(titleId: string) {
    super(titleId)
  }

  /// --- PLAYER LOGIN ---
  // --- ASYNC VERSIONS ---

  /**
   * Playfab Login sequence.
   * 1. LoginWithCustomId() - to login or create a new Player
   * 2. UpdateUserTitleDisplayName() - to save the player's avatar name as their PlayFab DisplayName
   * 3. UpdateUserPublisherData() - to save the player's eth address at the publisher data level
   *
   * @param avatarName The DCL player's display name
   * @param address The DCL player's eth address (to be used as the PlayFab customId)
   */
  async DoLoginAsync(avatarName: string, address: string): Promise<void> {
    // log("DoLoginAsync(" + avatarName + ", " + address + ")");
    const req = {
      TitleId: this.settings.titleId,
      CustomId: address,
      CreateAccount: true
    }

    const formattedReq = {
      Body: req
    }
    console.log(formattedReq, 'HERE')
    const responseJson = await this.SendAsyncRequest('/Client/LoginWithCustomID', req, null)
    console.log(responseJson, 'DOS')
    // log(req);

    // SUCCESS
    const data = responseJson.data

    if (data != null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const ticket = data.SessionTicket
      // save auth ticket info
      PlayFabApi.sessionTicket = data.SessionTicket
      PlayFabApi.entityToken = data.EntityToken
      // log("token: " + JSON.stringify(PlayFabApi.entityToken));

      DclUser.playfabId = data.PlayFabId

      // NOTE: Initially tested the "isNewUser" flag and only updated DisplayName if it was true.
      // But a DCL user's display name can change over time -- if they buy a new name for example --
      // so it seems best to update this every time they log in.
      // log("NewlyCreated: " + data["NewlyCreated"]);

      const req2 = {
        DisplayName: avatarName /* this.savedUserName */
      }
      const formattedReq2 = {
        Body: req2
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const responseJson2 = await super.SendAsyncRequest(
        '/Client/UpdateUserTitleDisplayName',
        formattedReq2,
        null,
        AuthType.Session
      )

      // 2DO: SWITCH TO USING PLAYER DATA INSTEAD OF ENTITY OBJECTS
      // At the moment, I can't get PlayFab Entity authentication working, so this will have to wait

      // var req3 = {
      //     "Data": { "ethAddress": address }
      // };

      // let responseJson3 = await super.SendAsyncRequest("/Client/UpdateUserPublisherData", req3, null, AuthType.Session);
      // log(responseJson3);
    }
  }

  async UpdateLevelAsync(xp: number, level: number): Promise<void> {
    console.log('UpdateLevelAsync(' + xp + ',' + level + ')')

    if (xp > 0) {
      const req1 = {
        Entity: {
          Id: PlayFabApi.entityToken.Entity.Id,
          Type: 'title_player_account'
        }
      }
      const formattedReq1 = {
        Body: req1
      }

      // Obtener los objetos
      const responseJson = await super.SendAsyncRequest('/Object/GetObjects', formattedReq1, null, AuthType.Entity)

      // Verificar que 'data' y 'Objects' existen
      const resp = responseJson.data?.Objects

      if (resp != null) {
        let oldLevel = 1
        let oldXp = 0

        if (Object.prototype.hasOwnProperty.call(resp, 'xp')) {
          const xpObj = resp.xp
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/strict-boolean-expressions
          oldLevel = xpObj.lev || oldLevel
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          oldXp = xpObj.xp || oldXp
        }

        // Establecer los nuevos valores
        const obj = {
          DataObject: {
            xp: oldXp + xp,
            lev: level
          }
        }
        const req2 = {
          Entity: {
            Id: PlayFabApi.entityToken.Entity.Id,
            Type: 'title_player_account'
          },
          Objects: [obj]
        }
        const formattedReq2 = {
          Body: req2
        }

        await super.SendAsyncRequest('/Object/SetObjects', formattedReq2, null, AuthType.Entity)
      } else {
        console.log('No Objects found in response')
      }
    }
  }

  async UpdateXpAsync(xp: number, level: number): Promise<void> {
    console.log('UpdateXpAsync(' + xp + ',' + level + ')')

    if (xp > 0) {
      const req1 = {
        Entity: {
          Id: PlayFabApi.entityToken.Entity.Id,
          Type: 'title_player_account'
        }
      }
      const formattedReq1 = {
        Body: req1
      }

      // Obtener los objetos
      const responseJson = await super.SendAsyncRequest('/Object/GetObjects', formattedReq1, null, AuthType.Entity)

      // Verificar que 'data' y 'Objects' existen
      const resp = responseJson.data?.Objects

      if (resp != null) {
        let oldLevel = 1
        let oldXp = 0

        // Verificar que el objeto 'xp' existe
        if (Object.prototype.hasOwnProperty.call(resp, 'xp')) {
          const xpObj = resp.xp
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/strict-boolean-expressions
          oldLevel = xpObj.lev || oldLevel
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          oldXp = xpObj.xp || oldXp
        }

        // Establecer los nuevos valores
        const obj = {
          DataObject: {
            xp: oldXp + xp,
            lev: level
          }
        }

        const req2 = {
          Entity: {
            Id: PlayFabApi.entityToken.Entity.Id,
            Type: 'title_player_account'
          },
          Objects: [obj]
        }
        const formattedReq2 = {
          Body: req2
        }

        await super.SendAsyncRequest('/Object/SetObjects', formattedReq2, null, AuthType.Entity)
      } else {
        console.log('No Objects found in response')
      }
    }
  }

  /**
   * Retrieve the player's statistics for this game, including their current HighScore
   * @param statisticNames StatisticNames to request.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async GetPlayerStatsAsync(statisticNames: string[]) {
    const req = {
      StatisticNames: statisticNames
    }
    const formattedReq = {
      Body: req
    }

    const responseJson = await super.SendAsyncRequest(
      '/Client/GetPlayerStatistics',
      formattedReq,
      null,
      AuthType.Session
    )
    // log(responseJson);
    return responseJson
  }

  /**
   * Record player statistics for this game -- basically their HighScore
   * @param playfabId The user's PlayFab ID
   * @param score The current score for the player. If this is lower than their current HighScore, it won't be saved.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async UpdatePlayerStatsAsync(playfabId: string, score: number) {
    const highScoreStat = {
      StatisticName: 'HighScore',
      Value: score
    }
    const req = {
      Statistics: [highScoreStat]
    }
    // log(req);
    const formattedReq = {
      Body: req
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const responseJson = await super.SendAsyncRequest(
      '/Client/UpdatePlayerStatistics',
      formattedReq,
      null,
      AuthType.Session
    )
    // log(responseJson);
  }

  /**
   * Gets the top 10 scores for the current week.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async GetLeaderboardAsync(leaderboardName: string = 'HighScore', startPosition: number = 0, count: number = 10) {
    const req = {
      StatisticName: leaderboardName,
      StartPosition: startPosition,
      MaxResultsCount: count
    }
    const formattedReq = {
      Body: req
    }
    const responseJson = await super.SendAsyncRequest('/Client/GetLeaderboard', formattedReq, null, AuthType.Session)
    // log(responseJson);
    return responseJson
  }

  /**
   * Get the full list of items in the player's inventory for this game (NOT across all publisher games).
   * @param playfabId The user's PlayFab ID
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async GetUserInventoryAsync(playFabId: string) {
    const req = {
      PlayFabId: playFabId
    }

    const formattedReq = {
      Body: req
    }

    const responseJson = await super.SendAsyncRequest('/Client/GetUserInventory', formattedReq, null, AuthType.Session)
    console.log('getPlayerInventory: ', responseJson)

    // Verificar si 'data' está presente en la respuesta
    const resp = responseJson.data

    if (DclUser.activeUser != null) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      let invSrc: Object[] = []

      if (resp != null && Object.prototype.hasOwnProperty.call(resp, 'Inventory')) {
        invSrc = resp.Inventory
      }

      this.saveInventory(invSrc)

      if (resp != null && Object.prototype.hasOwnProperty.call(resp, 'VirtualCurrency')) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const balances: Object = resp.VirtualCurrency
        this.saveCurrency(balances)
      }
    }
  }

  /**
   * Get lots of different data for this player.
   *
   * NOTE: This works, but we don't have much use for anything other than inventory at the moment.
   * @param playfabId The user's PlayFab ID
   */
  async GetPlayerCombinedInfoAsync(playFabId: string): Promise<void> {
    // "GetUserVirtualCurrency": true,
    // "GetPlayerProfile": true,
    // "GetTitleData": true,
    // "GetUserData": true
    // "GetPlayerStatistics": true
    const params = {
      GetTitleData: true,
      GetUserData: true,
      GetUserInventory: true,
      GetUserVirtualCurrency: true
    }
    const req = {
      InfoRequestParameters: params,
      PlayFabId: playFabId
    }
    const formattedReq = {
      Body: req
    }

    const responseJson = await super.SendAsyncRequest(
      '/Client/GetPlayerCombinedInfo',
      formattedReq,
      null,
      AuthType.Session
    )
    // log(responseJson);

    // Verificar si 'data' está presente en la respuesta
    const data = responseJson.data
    if (data != null && Object.prototype.hasOwnProperty.call(data, 'InfoResultPayload') && DclUser.activeUser != null) {
      const resp = data.InfoResultPayload

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, no-prototype-builtins
      if (resp?.hasOwnProperty('UserData')) {
        const userData = resp.UserData
        // log("userData: ", userData);
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!userData) {
          DclUser.setUserXpAndLevel(0, 1)
        } else {
          if (Object.prototype.hasOwnProperty.call(userData, 'xp')) {
            let level = 1
            if (Object.prototype.hasOwnProperty.call(userData, 'level')) {
              level = userData.level.Value
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            DclUser.setUserXpAndLevel(userData.xp.Value, level)
          } else {
            // default to level=1 xp=0
            DclUser.setUserXpAndLevel(0, 1)
          }

          if (Object.prototype.hasOwnProperty.call(userData, 'craftCooltime')) {
            // log("setting craft cooldown");
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            DclUser.setCraftCooldown(userData.craftCooltime.Value)
          }

          if (Object.prototype.hasOwnProperty.call(userData, 'limitOneItems')) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            DclUser.setLimitOneItems(JSON.parse(userData.limitOneItems.Value))
          }

          if (Object.prototype.hasOwnProperty.call(userData, 'heldItem')) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const heldItem: ItemInfo = JSON.parse(userData.heldItem.Value)
            // only send the id; we will look up the latest data from Inventory for this pickaxe item
            DclUser.setHeldItem(heldItem.ItemInstanceId)
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/ban-types
      let invSrc: Object[] = []

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, no-prototype-builtins
      if (resp?.hasOwnProperty('UserInventory')) {
        invSrc = resp.UserInventory
        // log(invSrc);
      }
      this.saveInventory(invSrc)

      // log("currencies: ", resp["UserVirtualCurrency"]);
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, no-prototype-builtins
      if (resp?.hasOwnProperty('UserVirtualCurrency')) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const balances: Object = resp.UserVirtualCurrency
        this.saveCurrency(balances)
      }

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, no-prototype-builtins
      if (resp?.hasOwnProperty('TitleData')) {
        const titleData: TitleData = resp.TitleData
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (titleData && Object.prototype.hasOwnProperty.call(titleData, 'levelArray')) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-non-null-assertion
          GameData.setLevels(JSON.parse(titleData.levelArray!))
        }
        // 2DO: RESET THIS
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (titleData && Object.prototype.hasOwnProperty.call(titleData, 'recipesTest')) {
          // log("got recipes");
          // log(titleData['recipesTest']);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-non-null-assertion
          GameData.setRecipes(JSON.parse(titleData.recipesTest!))
        }
        // log("title data set");
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/ban-types
  saveInventory(invSrc: Object[]) {
    // log("saveInventory()", invSrc);
    const invArray: ItemInfo[] = []
    let item: ItemInfo

    for (let i: number = 0; i < invSrc.length; i++) {
      try {
        item = this.populate(new ItemInfo(), invSrc[i]) // TODO: error checking
        invArray.push(item)
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        console.log('Error converting inventory item: ' + e)
      }
    }

    if (invArray.length > 0) {
      // NOTE: This overrides the existing inventory, since server-side is authoritative
      DclUser.activeUser.setInventory(invArray)
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  saveCurrency(balances: Record<string, any>) {
    // log("saveCurrency()", balances);
    // 2DO: currency recharge time
    if (Object.prototype.hasOwnProperty.call(balances, 'WC')) {
      DclUser.activeUser.coins = balances.WC
    }
    if (Object.prototype.hasOwnProperty.call(balances, 'WG')) {
      DclUser.activeUser.gems = balances.WG
    }
  }

  /**
   * Get a list of all item types.
   * @param catalogVersion The version string to use for the catalog
   */
  // async GetCatalogItems(catalogVersion: string = null)
  // {
  //     var req = {
  //     };

  //     if (catalogVersion != null)
  //     {
  //         req["CatalogVersion"] = catalogVersion;
  //     }

  //     let responseJson = await super.SendAsyncRequest("/Client/GetCatalogItems", req, null, AuthType.Session);
  //     //log(responseJson);
  // }

  /**
   * Get a list of all items that can be sold in a store.
   * @param storeId The id of the stoe. NOTE: this fails if the id is not all lower-case
   * @param catalogVersion The version string to use for the catalog
   */
  async GetStoreItems(
    storeId: string,
    catalogVersion: string | null = null,
    callback: ((errorObj: any, response: any) => void) | null = null
  ): Promise<ResponseData> {
    const req: { StoreId: string; CatalogVersion?: string } = {
      StoreId: storeId
    }

    if (catalogVersion != null) {
      req.CatalogVersion = catalogVersion
    }

    console.log(req)
    const formattedReq = {
      Body: req
    }
    const responseJson = await super.SendAsyncRequest('/Client/GetStoreItems', formattedReq, callback, AuthType.Session)

    console.log(responseJson)

    return responseJson
  }

  // async TestGetVoucher()
  // {
  //     let req = { "coll": "mc", "wi": 1 };
  //     this.CallCloudScript("getVoucher", req, this.OnGotVoucher, false);
  // }

  OnGotVoucher(error: null, json: any): void {
    //   log("OnGetCraftingRecipesComplete()");
    if (error != null) {
      console.log('cv call error!')
      console.log(error)
    } else {
      // CloudScript returns arbitrary results, so you have to evaluate them one step and one parameter at a time
      console.log('cv succeeded!')
      console.log(json)
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async CountClaimableItems() {
    // log("calling ClaimVoucher()");
    // super.CallAzureFunction("CountItems", {}, this.OnItemsCounted, false);

    const url = 'https://apim-dev-west-wondermine-api.azure-api.net/claims/count'
    // let url = "https://wondermine-test1.azurewebsites.net/api/CountItems?code=htmLdRjgXVEn5DevC5TkAXWAp5CPiMIlSjxq0ixKWsq/CwonU0NWmQ==";
    // eslint-disable-next-line @typescript-eslint/unbound-method
    void HttpCaller.callUrl(url, this.OnItemsCount)
  }

  OnItemsCount(json: { counts: any }): void {
    // log("CountItems succeeded!");
    console.log(json)
    const counts = json.counts
    // log(data);
    if (counts != null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      GameData.setWearableCounts(counts)
    }
  }

  OnItemsCounted(error: null, json: { data: any }): void {
    if (error != null) {
      console.log('CountItems error!')
      console.log(error)
    } else {
      // log("CountItems succeeded!");
      console.log(json)
      const data = json.data
      // log(data);
      if (data != null) {
        const result = data.FunctionResult
        // log(result);
        if (result?.counts != null) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          GameData.setWearableCounts(result.counts)
        }
      }
    }
  }

  async ActivateVoucher(voucher: string, sig: string): Promise<void> {
    console.log('ActivateVoucher()')
    if (voucher == null || sig == null) return

    const body: object = {
      voucher,
      sig
    }
    void super.WritePlayerEvent('craft_voucher', body)

    // This azure function fails, but no time to debug
    // this.CallAzureFunction("UpdateVoucherSig", body, this.OnSigUpdated, false);
  }

  OnSigUpdated(error: null, json: any): void {
    if (error != null) {
      console.log('UpdateVoucherSig error!')
      console.log(error)
    } else {
      console.log('UpdateVoucherSig succeeded')
    }
  }

  /**
   * Get a list of all recipes.
   * @param catalogVersion The version string to use for the catalog
   */
  async GetActiveMeteors(): Promise<void> {
    // log("calling GetActiveMeteors()");

    // this.CallAzureFunction("GetRecipe", { "id": "r0001" }, this.OnGetCraftingRecipesComplete, false);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    super.CallAzureFunction('GetActiveMeteors', { none: 0 }, this.OnGetActiveMeteorsComplete, false)
  }

  OnGetActiveMeteorsComplete(error: null, json: { data: any }): void {
    //   log("OnGetCraftingRecipesComplete()");
    if (error != null) {
      console.log('geActiveMeteors() call error!')
      console.log(error)
    } else {
      console.log(json)
      const data = json.data
      // log(data);
      if (data != null) {
        const result = data.FunctionResult
        //   log(result);
        if (result != null) {
          // let items:Object[] = result["ItemGrantResults"];
          // // log(items);
          // if (items != null && items.length > 0)
          // {
          //   // log(items.length + " items")
          // }
        }
      }
    }
  }

  /**
   * Get a list of all recipes.
   * @param catalogVersion The version string to use for the catalog
   */
  async GetCraftingRecipes(): Promise<void> {
    // log("calling GetCraftingRecipes()");

    // this.CallAzureFunction("GetRecipe", { "id": "r0001" }, this.OnGetCraftingRecipesComplete, false);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    super.CallAzureFunction('GetActiveRecipes', {}, this.OnGetCraftingRecipesComplete, false)
  }

  OnGetCraftingRecipesComplete(error: null, json: { data: any }): void {
    //   log("OnGetCraftingRecipesComplete()");
    if (error != null) {
      console.log('getRecipes() call error!')
      console.log(error)
    } else {
      // CloudScript returns arbitrary results, so you have to evaluate them one step and one parameter at a time
      // log(json);
      const data = json.data
      // log(data);
      if (data != null) {
        const result = data.FunctionResult
        //   log(result);
        if (result != null) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          const items: Object[] = result.ItemGrantResults

          // log(items);
          if (items != null && items.length > 0) {
            // log(items.length + " items")
          }
        }
      }
    }
  }

  // async GetClaimedVoucher(wi:number, pi:string, callback:(error, response) => void = null)
  // {
  //     log("calling GetClaimedVoucher()");
  //     let body:object = {
  //         "wi": wi,
  //         "pi": pi
  //     }

  //     if (callback == null)
  //     {
  //         callback = this.OnGetClaimedVoucherComplete;
  //     }
  //     //this.CallAzureFunction("GetRecipe", { "id": "r0001" }, this.OnGetCraftingRecipesComplete, false);
  //     super.CallAzureFunction("GetClaimedVoucher", body, callback, false);
  // }

  async GetLatestClaim(
    wi: number,
    pi: string,
    addr: string,
    callback: ((error: any, response: any) => void) | null = null
  ): Promise<void> {
    console.log('calling GetLatestClaim()')

    const body = {
      wi,
      pi,
      addr
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const finalCallback = callback ?? this.OnGetLatestClaimComplete
    super.CallAzureFunction('GetLatestClaim', body, finalCallback, false)
  }

  OnGetLatestClaimComplete(error: null, json: { data: any }): void {
    console.log('OnGetLatestClaimComplete()')
    if (error != null) {
      console.log('OnGetLatestClaimComplete() call error!')
      console.log(error)
    } else {
      console.log(json)
      const data = json.data
      // log(data);
      if (data != null) {
        const result = data.FunctionResult
        //   log(result);
        if (result != null) {
          /* empty */
        }
      }
    }
  }

  // --- UTILITY FUNCTIONS ---
  populate(target: any, ...args: any): any {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!target) {
      throw TypeError('Cannot convert undefined or null to object')
    }
    for (const source of args) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (source) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Object.keys(source).forEach((key) => (target[key] = source[key]))
      }
    }
    return target
  }
}
