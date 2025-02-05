/* eslint-disable @typescript-eslint/prefer-readonly */
// import { ProjectLoader } from './projectloader';
// import { TextBoardObject } from './projectdata';
// import { GameManager } from './gamemanager';
import {
  type Entity,
  InputAction,
  type PBTextShape,
  PointerEventType,
  PointerEvents,
  TextShape,
  engine,
  executeTask,
  inputSystem
} from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { type WondermineApi } from 'shared-dcl/src/playfab/wondermineapi'
import { TextBoard, type TextBoardData } from './textboard'
import { type ResponseData } from 'shared-dcl/src/playfab/playfabapi'

type LeaderboardEntry = {
  PlayFabId: string
  DisplayName: string
  StatValue: number
  Position: number
}

/**
 * Shows text over a 3D model of a sign or other backing board.
 */
export class Leaderboard extends TextBoard {
  public playerListEntity: Entity = engine.addEntity()
  public playerListShape: PBTextShape | null = null

  public scoreListEntity: Entity = engine.addEntity()
  public scoreListShape: PBTextShape | null = null

  private boards: string[] = ['Level', 'MeteorsMinedWeekly']
  private currentBoardIndex: number = 0
  private defaultBoardIndex: number = 0

  private currentPage: number = 1
  private maxPage: number = 5

  private api: WondermineApi

  // Allow each room to specify a unique look and feel
  constructor(_data: TextBoardData, _api: WondermineApi, _parent: Entity | null = null) {
    super(_data, _parent)

    this.api = _api

    if (
      this.configData != null &&
      Object.prototype.hasOwnProperty.call(this.configData, 'isLeaderboard') &&
      this.configData.isLeaderboard
    ) {
      // adjust parameters for the two list fields
      // positions are relative to the top title text field (textPos)
      const listWidth: number = this.configData.textWidth - this.configData.scoreListWidth
      if (this.textHolder != null) {
        this.playerListEntity = this.addTextField(
          this.configData,
          this.textHolder,
          listWidth,
          this.configData.textHeight,
          Vector3.create(...this.configData.playerListPos),
          'left'
        ) //
      }
      this.playerListShape = TextShape.get(this.playerListEntity)
      if (this.configData.scoreListPos == null) {
        const slPos = this.configData.playerListPos
        slPos[0] = slPos[0] + listWidth + 10
        this.configData.scoreListPos = slPos
      }
      if (this.textHolder != null) {
        this.scoreListEntity = this.addTextField(
          this.configData,
          this.textHolder,
          this.configData.scoreListWidth,
          this.configData.textHeight,
          Vector3.create(...this.configData.scoreListPos),
          'right'
        ) // this.configData.scoreListPos
      }
      this.scoreListShape = TextShape.get(this.scoreListEntity)
      if (this.boardEntity != null) {
        PointerEvents.createOrReplace(this.boardEntity, {
          pointerEvents: [
            {
              eventType: PointerEventType.PET_DOWN,
              eventInfo: {
                button: InputAction.IA_PRIMARY,
                showFeedback: true,
                hoverText: 'Next leaderboard',
                maxDistance: 8
              }
            },
            {
              eventType: PointerEventType.PET_DOWN,
              eventInfo: {
                button: InputAction.IA_SECONDARY,
                showFeedback: true,
                hoverText: 'Next leaderboard',
                maxDistance: 8
              }
            },
            {
              eventType: PointerEventType.PET_DOWN,
              eventInfo: {
                button: InputAction.IA_ANY,
                showFeedback: true,
                hoverText: 'Next leaderboard',
                maxDistance: 8
              }
            }
          ]
        })
        engine.addSystem(() => {
          if (this.boardEntity != null) {
            if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN, this.boardEntity)) {
              this.showNextBoard()
            }
            if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN, this.boardEntity)) {
              this.showPrevTen()
            }
            if (inputSystem.isTriggered(InputAction.IA_ANY, PointerEventType.PET_DOWN, this.boardEntity)) {
              this.showNextTen()
            }
          }
        })
      }
    }
  }

  public loadDefaultBoard(): void {
    this.currentBoardIndex = this.defaultBoardIndex
    this.currentPage = 1
    if (this.playerListShape != null) {
      for (let i = 0; i <= 25; i++) TextShape.getMutable(this.playerListEntity).text += i < 25 ? ' ' : 'Loading...'
      console.log('En el ciclo, texto actualizado: ', this.playerListShape.text)
    }

    this.showMessage(this.getLeaderboardTitle())
    this.getLeaderboardData()
  }

  private getLeaderboardTitle(): string {
    let result: string = ''
    this.boards[this.currentBoardIndex].split(/(?=[A-Z])/).forEach((s) => (result += s + ' '))
    return result
  }

  public showNextBoard(): void {
    this.currentBoardIndex++
    if (this.currentBoardIndex >= this.boards.length) this.currentBoardIndex = 0

    this.showMessage(this.getLeaderboardTitle())
    if (this.playerListShape != null) {
      this.playerListShape.text = ''
      for (let i = 0; i <= 25; i++) this.playerListShape.text += i < 25 ? ' ' : 'Loading...'
    }

    if (this.scoreListShape != null) {
      this.scoreListShape.text = ''
    }

    this.currentPage = 1
    this.getLeaderboardData()
  }

  private showNextTen(): void {
    this.currentPage++
    if (this.currentPage > this.maxPage) this.currentPage = this.maxPage

    this.getLeaderboardData()
  }

  private showPrevTen(): void {
    this.currentPage--
    if (this.currentPage < 1) this.currentPage = 1

    this.getLeaderboardData()
  }

  private getLeaderboardData(): void {
    const board = this.boards[this.currentBoardIndex]
    const startPos: number = 10 * (this.currentPage - 1)
    executeTask(async () => {
      const leadersJson = await this.api.GetLeaderboardAsync(board, startPos)
      // log("got leaderboard");
      this.updateLeaderboard(leadersJson)
    })

    // if(DclUser.playfabId === "")
    //     return;

    // executeTask(async () =>
    // {
    //     let userStats = await GameManager.instance.api.GetPlayerStatsAsync(board);
    //     this.appendToCurrentBoard(userStats);
    // });
  }

  private updateLeaderboard(leadersJson: ResponseData): void {
    const data = leadersJson.data
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const leaders = (data?.Leaderboard as LeaderboardEntry[]) || []

    let scoreText = ''
    let playersText = ''

    if (leaders.length === 0) {
      // No hay registros en el leaderboard
      playersText = '\n' + ' '.repeat(20) + 'No highscores'
    } else {
      for (const entry of leaders) {
        const position = (entry.Position ?? 0) + 1
        const displayName = entry.DisplayName ?? 'Unknown'
        const statValue = entry.StatValue ?? 0

        playersText += `${position < 10 ? '  ' : ''}${position}. ${displayName}\n`
        scoreText += `${statValue}\n`
      }
    }

    if (this.playerListShape != null) {
      this.playerListShape.text = playersText
    }
    if (this.scoreListShape != null) {
      this.scoreListShape.text = scoreText
    }
  }
}
