// import { DclUser } from "./dcluser";
// import { ItemInfo } from "./iteminfo";
// ;import { GameData } from "../../../src/gamedata";

import { executeTask } from '@dcl/sdk/ecs'

export enum AuthType {
  None,
  Session,
  Entity,
  DevSecret
}
export type ResponseData = {
  data?: {
    SessionTicket: string
    EntityToken: any
    Objects?: Record<string, any>
    PlayFabId: string
    [key: string]: any
  }
  [key: string]: any
}
type ReqHeaders = {
  'Content-Type': string
  'X-Authorization'?: string
  'X-EntityToken'?: string
  'X-SecretKey'?: string | null | undefined
}
type PlayFabSettings = {
  productionUrl: string
  verticalName: string | null
  titleId: string | null
  developerSecretKey: string | null
  port: number
  advertisingIdType: string | null
  advertisingIdValue: string | null
  disableAdvertising: boolean
  AD_TYPE_IDFA: string
  AD_TYPE_ANDROID_ID: string
}
export class PlayFabApi {
  // implements PlayFabModule.IPlayFab
  public static sessionTicket: string
  public static entityToken: any

  public isTesting: boolean = true

  public sdk_version: string = '2.40.191218'
  public buildIdentifier: string = 'jbuild_nodesdk__sdk-genericslave-3_1'

  //   public settings: object /* PlayFabModule.IPlayFabSettings */ = {
  //     productionUrl: '.playfabapi.com',
  //     verticalName: null, // The name of a customer vertical. This is only for customers running a private cluster. Generally you shouldn't touch this
  //     titleId: null, // You must set this value for PlayFabSdk to work properly (Found in the Game Manager for your title, at the PlayFab Website)
  //     // globalErrorHandler: null,
  //     developerSecretKey: null, // You must set this value for PlayFabSdk to work properly (Found in the Game Manager for your title, at the PlayFab Website)
  //     port: 443,
  //     advertisingIdType: null, // Set this to the appropriate AD_TYPE_X constant below
  //     advertisingIdValue: null, // Set this to corresponding device value

  //     // disableAdvertising is provided for completeness, but changing it is not suggested
  //     // Disabling this may prevent your advertising-related PlayFab marketplace partners from working correctly
  //     disableAdvertising: false,
  //     AD_TYPE_IDFA: 'Idfa',
  //     AD_TYPE_ANDROID_ID: 'Adid'
  //   }
  public settings: PlayFabSettings = {
    productionUrl: '.playfabapi.com',
    verticalName: null,
    titleId: null,
    developerSecretKey: null,
    port: 443,
    advertisingIdType: null,
    advertisingIdValue: null,
    disableAdvertising: false,
    AD_TYPE_IDFA: 'Idfa',
    AD_TYPE_ANDROID_ID: 'Adid'
  }

  protected _internalSettings = {
    entityToken: null,
    sessionTicket: null,
    requestGetParams: {
      sdk: 'JavaScriptSDK-2.40.191218'
    }
  }

  constructor(titleId: string) {
    this.settings.titleId = titleId
  }

  GetServerUrl(): string {
    const baseUrl = this.settings.productionUrl
    if (!(baseUrl.substring(0, 4) === 'http')) {
      if (this.settings.verticalName != null) {
        return 'https://' + this.settings.verticalName + baseUrl
      } else {
        return 'https://' + this.settings.titleId + baseUrl
      }
    } else {
      return baseUrl
    }
  }

  async WritePlayerEvent(eventName: string, eventBody: object): Promise<void> {
    const req = {
      EventName: eventName,
      Body: eventBody
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const responseJson = this.SendAsyncRequest(
      '/Client/WritePlayerEvent',
      req,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.OnWriteEventComplete,
      AuthType.Session
    )
  }

  OnWriteEventComplete(error: null, json: any): void {
    if (error != null) {
      console.log('script call error!')
      console.log(error)
    } else {
      // CloudScript returns arbitrary results, so you have to evaluate them one step and one parameter at a time
      // log("CloudScript call successful!");
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async CallCloudScriptAsync(functionName: string, params: {}, generateEvent: boolean = true): Promise<void> {
    const csRequest = {
      // Currently, you need to look up the correct format for this object in the API reference for LoginWithCustomID.
      FunctionName: functionName,
      FunctionParameter: params,
      GeneratePlayStreamEvent: generateEvent
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const responseJson = this.SendAsyncRequest(
      '/Client/ExecuteCloudScript',
      csRequest,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.OnCloudScriptComplete,
      AuthType.Session
    )
  }

  async SendAsyncRequest(
    methodName: string,
    request: any, // Cambiado para aceptar cualquier tipo
    callback?: ((errorJson: any, response: any) => void) | null,
    authType: AuthType = AuthType.None
  ): Promise<ResponseData> {
    // log("SendAsyncRequest: " + methodName + ", authType=" + authType);

    const callUrl: string = this.GetServerUrl() + methodName

    const errorJson = { error: true, url: callUrl }
    try {
      const reqHeaders: ReqHeaders = { 'Content-Type': 'application/json' }
      if (authType === AuthType.Session) {
        reqHeaders['X-Authorization'] = PlayFabApi.sessionTicket
      } else if (authType === AuthType.Entity) {
        reqHeaders['X-EntityToken'] = PlayFabApi.entityToken.EntityToken
      } else if (authType === AuthType.DevSecret) {
        reqHeaders['X-SecretKey'] = this.settings.developerSecretKey
      }

      // Filtra valores null y undefined en los headers
      const filteredHeaders = Object.fromEntries(
        Object.entries(reqHeaders).filter(([_, value]) => value != null)
      ) as Record<string, string>

      // Realiza la solicitud
      const response: Response = await fetch(callUrl, {
        headers: filteredHeaders,
        method: 'POST',
        body: JSON.stringify(request) // Envía el cuerpo directamente
      })

      const json = await response.json()

      if (response.ok) {
        if (callback != null) {
          callback(null, json)
        }
        return json as ResponseData
      } else {
        if (callback != null) {
          callback(errorJson, { status: 'error' })
        }
        return errorJson
      }
    } catch {
      console.log('Failed to reach URL: ' + callUrl)
      return errorJson
    }
  }

  // --- CLOUDSCRIPT ---
  TestHelloWorld(): void {
    const req = { name: 'TEST NAME' }
    this.CallCloudScript('helloWorld', req, () => {}, true)
  }

  CallCloudScript(
    functionName: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    params: {},
    callback: (error: any, json: any) => void,
    generateEvent: boolean = true
  ): void {
    const csRequest = {
      // Currently, you need to look up the correct format for this object in the API reference for LoginWithCustomID.
      FunctionName: functionName,
      FunctionParameter: params,
      GeneratePlayStreamEvent: generateEvent,
      // Temporary for testing only
      RevisionSelection: 'Latest'
      // "SpecificRevision": 283
    }

    if (callback == null) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      callback = this.OnCloudScriptComplete
    }
    this.SendRequest('/Client/ExecuteCloudScript', csRequest, callback, AuthType.Session)
  }

  OnCloudScriptComplete(error: null, json: any): void {
    if (error != null) {
      console.log('script call error!')
      console.log(error)
    } else {
      // CloudScript returns arbitrary results, so you have to evaluate them one step and one parameter at a time
      // log("CloudScript call successful!");
      // log(json);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  CallAzureFunction(
    functionName: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    params: {},
    callback: (error: any, json: any) => void,
    generateEvent: boolean = true
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    if (PlayFabApi.entityToken == null) throw 'Must be logged in to call this function'
    // log("entityToken");
    // log(PlayFabApi.entityToken);

    const csRequest = {
      FunctionName: functionName,
      FunctionParameter: params,
      GeneratePlayStreamEvent: generateEvent,
      Entity: {
        Id: PlayFabApi.entityToken.Entity.Id,
        Type: 'title_player_account',
        TypeString: 'title_player_account'
      }
    }
    // log(csRequest);

    if (callback == null) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      callback = this.OnAzureFunctionComplete
    }
    this.SendRequest('/CloudScript/ExecuteFunction', csRequest, callback, AuthType.Entity)
  }

  OnAzureFunctionComplete(error: null, json: any): void {
    if (error != null) {
      console.log('Function call error!')
      console.log(error)
    } else {
      // log(json);
      // CloudScript returns arbitrary results, so you have to evaluate them one step and one parameter at a time
      // log("CloudScript call successful!");
    }
  }

  // --- SHARED METHODS ---

  // eslint-disable-next-line @typescript-eslint/ban-types
  SendRequest(
    methodName: string,
    request: {
      FunctionName: string
      // eslint-disable-next-line @typescript-eslint/ban-types
      FunctionParameter: {}
      GeneratePlayStreamEvent: boolean
      RevisionSelection?: string
      Entity?: { Id: any; Type: string; TypeString: string }
    },
    callback: (error: any, response: any) => void,
    authType: AuthType = AuthType.None
  ): void {
    // log("SendRequest: " + methodName + ", authType=" + authType);

    const callUrl: string = this.GetServerUrl() + methodName

    executeTask(async () => {
      try {
        const reqHeaders: ReqHeaders = { 'Content-Type': 'application/json' }
        if (authType === AuthType.Session) {
          reqHeaders['X-Authorization'] = PlayFabApi.sessionTicket
        } else if (authType === AuthType.Entity) {
          reqHeaders['X-EntityToken'] = PlayFabApi.entityToken.EntityToken
        } else if (authType === AuthType.DevSecret) {
          reqHeaders['X-SecretKey'] = this.settings.developerSecretKey
        }
        const filteredHeaders = Object.fromEntries(
          Object.entries(reqHeaders).filter(([_, value]) => value != null) // Filtra valores null y undefined
        ) as Record<string, string>
        const response: Response = await fetch(callUrl, {
          headers: filteredHeaders,
          method: 'POST',
          body: JSON.stringify(request)
        })

        const json = await response.json()
        // log(json);

        if (response.ok) {
          // log("OK!");
          if (callback != null) {
            callback(null, json)
          }
        } else {
          if (callback != null) {
            callback(json, { ok: false })
          }
        }
      } catch {
        console.log('failed to reach URL: ' + callUrl)
      }
    })
  }

  // --- OLDER STUFF ---

  SetObjects(
    request: {
      FunctionName: string
      // eslint-disable-next-line @typescript-eslint/ban-types
      FunctionParameter: {}
      GeneratePlayStreamEvent: boolean
      RevisionSelection?: string | undefined
      Entity?: { Id: any; Type: string; TypeString: string } | undefined
    },
    callback: (error: any, response: any) => void
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    if (PlayFabApi.entityToken == null) throw 'Must be logged in to call this method'

    this.SendRequest('/Object/SetObjects', request, callback, AuthType.Entity)
  }

  SetObjectsCallback(
    error: { errorMessage: any; errorDetails: Record<string, Record<string, string>> },
    result: null
  ): void {
    if (result !== null) {
      console.log('SetObjects successful: ')
      console.log(result)
    } else if (error !== null) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
      console.log('Something went wrong with SetObjects()\n' + error)
      console.log(PlayFabApi.CompileErrorReport(error))
    }
  }

  // This is a utility function we haven't put into the core SDK yet. Feel free to use it.
  static CompileErrorReport(
    error: { errorMessage: any; errorDetails: Record<string, Record<string, string>> } | null
  ): string {
    if (error == null) return ''

    let fullErrors = error.errorMessage
    for (const paramName in error.errorDetails) {
      for (const msgIdx in error.errorDetails[paramName]) {
        fullErrors += '\n' + paramName + ': ' + error.errorDetails[paramName][msgIdx]
      }
    }
    return fullErrors
  }
}
