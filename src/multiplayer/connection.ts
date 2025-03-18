/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable spaced-comment */
//
// IMPORTANT :
// - include `noLib: false` to your tsconfig.json file, under "compilerOptions"
//
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference lib="es2015.symbol" />
///<reference lib="es2015.symbol.wellknown" />
///<reference lib="es2015.collection" />
///<reference lib="es2015.iterable" />

import { type Room } from 'colyseus.js'
import { Color4 } from '@dcl/sdk/math'
import { getPlayer } from '@dcl/sdk/src/players'
import * as Colyseus from 'colyseus.js'
import { GameUi } from 'src/ui/gameui'
// import { type EndpointSettings } from 'colyseus.js/lib/Client'
// import { isPreviewMode, getCurrentRealm } from '@decentraland/EnvironmentAPI'

export async function connect(roomName: string, options: any = {}): Promise<Room<any>> {
  console.log('connect(' + roomName + ')')

  const playerData = getPlayer()
  const isPreview = playerData?.isGuest
  console.log('Testing data', playerData)
  // const realm = await getCurrentRealm();

  // // make sure users are matched together by the same "realm".
  // options.realm = realm?.displayName ?? "unknown";
  // options.userData = await getUserData();

  console.log('userData:', options)

  // hardcode object to match SDK6 format.

  const ENDPOINT = 'wss://app-dev-west-wondermine-web.azurewebsites.net:443'
  // const ENDPOINT = (isPreview)
  //     ? "ws://127.0.0.1:10300" // local environment was 2567
  //     : "wss://app-dev-west-wondermine-web.azurewebsites.net:443"; // production environment

  if (isPreview !== null) {
    addConnectionDebugger(ENDPOINT)
  }
  // const endpointSettings: EndpointSettings = {
  //   hostname: ENDPOINT,
  //   secure: true
  // }

  const client = new Colyseus.Client(ENDPOINT)

  try {
    //
    // Docs: https://docs.colyseus.io/client/client/#joinorcreate-roomname-string-options-any
    //
    console.log('Connection details', roomName, options)
    const room = await client.joinOrCreate<any>(roomName, options)
    if (isPreview !== null) {
      updateConnectionDebugger(room)
    }

    return room
  } catch (e) {
    console.log('ERROR', e)
    updateConnectionMessage(`Not connected`, Color4.Red())
    // reconnect(roomName, 60000);

    throw e
  }
}

// let message: UIText

function addConnectionDebugger(endpoint: string): void {
  //   const canvas = new UICanvas()
  //   message = new UIText(canvas)
  //   message.fontSize = 15
  //   message.width = 120
  //   message.height = 30
  //   message.hTextAlign = 'center'
  //   message.vAlign = 'bottom'
  //   message.positionX = -80
  //   updateConnectionMessage(`Connecting to ${endpoint}`, Color4.White())
}

export function updateConnectionMessage(value: string, color: Color4 = Color4.White()): void {
  if (GameUi.instance !== null) {
    GameUi.instance.showTimedMessage(value, 6000, color)
  }
  //   // message.value = value;
  //   // message.color = color;
  //   console.log(value)
}

function updateConnectionDebugger(room: Room): void {
  updateConnectionMessage('Connected.', Color4.Green())
  room.onLeave(() => {
    updateConnectionMessage('Connection lost', Color4.Red())
  })
}
