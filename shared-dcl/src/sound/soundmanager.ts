import { engine, type Entity, AudioSource, type PBAudioSource } from '@dcl/sdk/ecs'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SoundManager {
  private static readonly filePrefix: string = 'audio/'
  private static clips: Record<string, Entity> = {}

  /**
   * Add a sound clip to the cache for future use.
   * @param name A unique name for the sound
   * @param file The filename located in the folder specified by filePrefix
   */
  static addClip(name: string, file: string): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.clips[name]) {
      const soundEntity = engine.addEntity()
      AudioSource.create(soundEntity, {
        audioClipUrl: this.filePrefix + file,
        playing: false,
        loop: false,
        volume: 1.0
      })
      this.clips[name] = soundEntity
    }
  }

  /**
   * Attach a sound file to a specific entity.
   * @param entity The entity to attach the sound to
   * @param name A unique name for the sound
   * @param file The filename located in the folder specified by filePrefix
   */
  static attachSoundFile(entity: Entity, name: string, file: string): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!entity) return

    let soundEntity = this.clips[name]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!soundEntity) {
      soundEntity = engine.addEntity()
      AudioSource.create(entity, {
        audioClipUrl: this.filePrefix + file,
        playing: false,
        loop: false,
        volume: 1.0
      })
      this.clips[name] = soundEntity
      console.log('sound attached', this.filePrefix + file)
    }

    const audioSource = AudioSource.getMutable(entity)
    audioSource.playing = false
  }

  // /**
  //  * Play a named sound once.
  //  * @param name The unique name of the sound
  //  * @param volume Playback volume (default 1.0)
  //  */
  // static playOnce(name: string, volume: number = 1.0): void {
  //   const soundEntity = this.clips[name]
  //   // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  //   if (soundEntity) {
  //     const audioSource = AudioSource.getMutable(soundEntity)
  //     audioSource.loop = false
  //     audioSource.volume = volume
  //     audioSource.playing = true
  //   }
  // }
  /**
   * Play the sound that's attached to an entity once.
   * @param _ent The entity the AudioSource is attached to
   * @param _vol Playback volume
   */
  static playOnce(_ent: Entity, _vol: number = 1.0): void {
    const as: PBAudioSource | null = AudioSource.getOrNull(_ent)
    if (as != null) {
      AudioSource.getMutable(_ent).loop = false
      if (AudioSource.get(_ent).playing === true) {
        AudioSource.getMutable(_ent).playing = false
      }
      AudioSource.getMutable(_ent).volume = Math.max(_vol, 1.0)
      AudioSource.playSound(_ent, as?.audioClipUrl)
    }
  }

  /**
   * Play a named sound in loop.
   * @param name The unique name of the sound
   * @param volume Playback volume (default 1.0)
   */
  static playLooped(name: string, volume: number = 1.0): void {
    const soundEntity = this.clips[name]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (soundEntity) {
      const audioSource = AudioSource.getMutable(soundEntity)
      audioSource.loop = true
      audioSource.volume = volume
      audioSource.playing = true
    }
  }

  /**
   * Stop playing a named sound.
   * @param name The unique name of the sound
   */
  static stopSound(name: string): void {
    const soundEntity = this.clips[name]
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (soundEntity) {
      const audioSource = AudioSource.getMutable(soundEntity)
      audioSource.playing = false
    }
  }
}
