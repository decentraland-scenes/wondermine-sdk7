import * as utils from '@dcl-sdk/utils'
import { connect, updateConnectionMessage } from './connection'
import { Meteor } from '../wondermine/meteor'
import { MeteorSpawner } from '../wondermine/meteorspawner'
import { MeteorTypeId } from '../enums'
import { type Room } from 'colyseus.js'
import { Eventful, MeteorLootEvent, MeteorServerEvent } from '../events'
import { GameData } from '../gamedata'
import { SharedMeteor } from '../projectdata'
// import { GameUi } from '../ui/gameui'
import { DclUser } from 'shared-dcl/src/playfab/dcluser'
import { Color4, type Vector3 } from '@dcl/sdk/math'

// import { ambienceSound, clickSound, fallSound, finishSound1, finishSound2, newLeaderSound, countdownRestartSound, playLoop, playOnce, playOnceRandom } from './sound';

// 2DO: send xyz coordinates to server when mining a meteor
// 2DO: handle general broadcast messages from server

// Connect to Colyseus server
// Set up the scene after connection has been established.

// type Meteor = {
//     x: number
//     y: number
//     z: number
//     id: string
//     expiresAt: number
//     hits: number
//     maxHits: number
//     hitters: string[] // Asumiendo que es un array de IDs de jugadores
//   }

export class MeteorServer {
  public static instance: MeteorServer | null = null

  public room: Room<any> | null = null

  public reconnectDelay: number = 10000

  public userOptions: Record<string, unknown> | null = null

  public reconnectTimer: any

  constructor() {
    if (MeteorServer.instance == null) {
      MeteorServer.instance = this
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/ban-types
  connectToServer(options: {} | null = null) {
    console.log('connectToServer()')

    if (options == null) {
      console.log("No user data -- can't connect to meteor server")
      Eventful.instance.fireEvent(new MeteorServerEvent('connectError'))
      return
    }
    this.userOptions = options

    connect('my_room', options)
      .then((room) => {
        console.log('Connected!')
        if (this.reconnectTimer != null) this.reconnectTimer = null

        /// --- Spawner function ---
        function spawnMeteor(
          x: number,
          y: number,
          z: number,
          id: string,
          dur: number = 0,
          hits: number = 0,
          maxHits: number = 2,
          alreadyMined: boolean = false
        ): void {
          const spawner: MeteorSpawner | null = MeteorSpawner.instance
          if (spawner !== null)
            spawner.spawnAt(x, z, MeteorTypeId[MeteorTypeId.Medium], id, dur, hits, maxHits, alreadyMined)
        }

        room.state.meteors.onAdd = (meteor: any, id: string) => {
          const now = Date.now()
          const dur = Math.floor((meteor.expiresAt - now) / 1000)
          console.log('now: ' + now + ' dur: ' + dur)
          let alreadyMined: boolean = false
          console.log(meteor.hitters)
          console.log(DclUser.playfabId)
          // log(Array.isArray(meteor.hitters));
          // log(meteor.hitters.length);
          // HACK: can't get hitters array to work, so just check the string
          const hitters = JSON.stringify(meteor.hitters)
          if (hitters.includes(DclUser.playfabId)) {
            console.log('player has mined this meteor')
            alreadyMined = true
          }

          // let dur:number = meteor.duration;
          // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/no-unsafe-argument
          const m = spawnMeteor(meteor.x, meteor.y, meteor.z, meteor.id, dur, meteor.hits, meteor.maxHits, alreadyMined)
          console.log('NEW METEOR:', m, meteor)
          updateConnectionMessage('Large meteor incoming!', Color4.Yellow()) //  (" + meteor.id + ")" + " at " + meteor.x + "," + meteor.z

          // log("new meteor: " + meteor.id + " at " + meteor.x + "," + meteor.z + " with " + meteor.numHits + " hits");

          meteor.listen('hits', (numHits: number) => {
            console.log('Meteor ' + meteor.id + ' hits: ' + numHits + ' / ' + meteor.maxHits)

            for (const m of Meteor.activeMeteors) {
              if (m.instanceData !== null)
                if (m.instanceData.id === meteor.id) {
                  console.log('Meteor ' + meteor.id + ' found')
                  m.setHits(numHits)

                  if (numHits >= meteor.maxHits) {
                    console.log('Meteor ' + meteor.id + ' DEPLETED')
                    utils.timers.setTimeout(() => {
                      m.deplete()
                    }, 15000)
                  }
                }
            }
          })
        }

        room.state.players.onAdd = (player: any, sessionId: string) => {
          console.log('player joined: ' + player.displayName)
        }

        // when a player leaves, remove it from the leaderboard.
        room.state.players.onRemove = (player: any, sessionId: string) => {
          // refreshLeaderboard();
          console.log('player left: ' + player.displayName)
        }

        // room.state.listen("countdown", (num: number) => {
        //     countdown.set(num);
        // })

        room.onMessage('start', () => {
          // remove all previous boxes
          // allBoxes.forEach((box) => engine.removeEntity(box));
          // allBoxes = [];
          // lastBlockTouched = 0;
          // highestRanking = 0;
          // highestPlayer = undefined;
          // countdown.show();
        })

        room.onMessage('mined', (response) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const j = JSON.parse(response)
          console.log(j)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          Eventful.instance.fireEvent(new MeteorLootEvent('meteorLoot', j))
        })

        room.onMessage('sharedLoot', (response) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const j = JSON.parse(response)
          console.log(j)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          Eventful.instance.fireEvent(new MeteorLootEvent('sharedLoot', j))
        })

        room.onMessage('miningError', (err) => {
          console.log(err)
        })

        room.onMessage('message', (msg) => {
          console.log('message received: ', msg)
        })

        // announcements for all players
        room.onMessage('announce', (announcement: any) => {
          console.log('announcement: ', announcement.msg)
          if (announcement?.msg !== null) {
            // GameUi.instance.showTimedMessage(announcement.msg, 9000)
          }
        })

        room.onMessage('meteor', (meteor: any) => {
          console.log('meteor incoming') // , meteor
        })

        room.onLeave((code) => {
          console.log('onLeave, code =>', code)
          Eventful.instance.fireEvent(new MeteorServerEvent('leftRoom ' + code))
        })
        if (MeteorServer.instance !== null) MeteorServer.instance.room = room
        Eventful.instance.fireEvent(new MeteorServerEvent('connected', room))
      })
      .catch((err) => {
        Eventful.instance.fireEvent(new MeteorServerEvent('connectError'))
        console.error(err)
      })
  }

  reconnect(): void {
    if (this.reconnectTimer != null) return
    // get latest user data
    const options = {
      userData: {
        userId: DclUser.userId,
        displayName: DclUser.displayName,
        publicKey: DclUser.publicKey
      },
      realm: DclUser.getRealmName()
    }
    this.reconnectTimer = utils.timers.setTimeout(() => {
      this.connectToServer(options)
    }, this.reconnectDelay)
    // extend next reconnect delay up to 10 minutes max
    if (this.reconnectDelay < 600000) this.reconnectDelay *= 2
  }

  getMeteor(id: string): SharedMeteor | undefined | null {
    if (MeteorServer.instance !== null) {
      if (MeteorServer.instance?.room !== null) {
        const data = MeteorServer.instance.room.state.meteors[id]
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return data != null ? GameData.populate(new SharedMeteor(), data) : null
      }
    }
  }

  onHitMeteor(id: string, hitPoint: Vector3): void {
    // send meteor id to Colyseus server
    if (MeteorServer.instance !== null) {
      if (MeteorServer.instance?.room !== null) {
        MeteorServer.instance.room.send('hitMeteor', { id, hitPoint })
      }
    }
  }
}
