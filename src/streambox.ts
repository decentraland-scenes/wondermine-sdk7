import { type Entity, Transform, engine, AudioStream } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { streams } from './streams'
// import { GameUi } from "./ui/gameui";

/**
 * A boom box that streams audio from a list of stream urls
 */
// @Component("StreamBox")
export class StreamBox {
  private streamSource: Entity | null = null
  private streamIndex: number = -1

  constructor(sourceEntity: Entity | null = null) {
    if (sourceEntity == null) this.createEntity()
    else this.streamSource = sourceEntity
  }

  createEntity(): void {
    this.streamSource = engine.addEntity()
    Transform.create(this.streamSource, {
      position: Vector3.create(8, 1, 8)
    })
  }

  nextStation(): void {
    if (this.streamSource == null) this.createEntity()

    this.streamIndex++
    if (this.streamIndex === streams.length) {
      this.streamIndex = -1
      this.stop()
      return
    }

    // log(this.streamIndex + ": " + streams[this.streamIndex].name + ": " + streams[this.streamIndex].url);
    const url = streams[this.streamIndex].url
    if (this.streamSource !== null) {
      AudioStream.createOrReplace(this.streamSource, {
        url: url,
        playing: true,
        volume: streams[this.streamIndex].volume
      })
    }
  }

  stop(): void {
    if (this.streamSource !== null) {
      if (AudioStream.get(this.streamSource) != null) {
        AudioStream.getMutable(this.streamSource).playing = false
      }
    }
  }

  setVolume(newVol: number): void {
    if (this.streamSource != null) {
      if (AudioStream.get(this.streamSource) === null) return
      if (newVol < 0) newVol = 0
      if (newVol > 1) newVol = 1

      AudioStream.getMutable(this.streamSource).volume = newVol
    }
  }

  getStationName(): string {
    if (this.streamIndex >= 0 && this.streamIndex < streams.length)
      return 'Playing station: ' + streams[this.streamIndex].name
    return 'Radio off'
  }
}
