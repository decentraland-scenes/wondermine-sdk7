export class ScoreData {
  public dragonId: number = 0
  public displayName: string = ''
  public publicKey: string = ''

  public endTime: number = 0
  public elapsed: number = 0

  public sessionState: string = ''

  public gateScoreTotal: number = 0
  public multiplier: number = 0
  public finalScore: number = 0

  // eslint-disable-next-line @typescript-eslint/ban-types
  public gateScores: Object = {}

  public leaderboardPlace: number = 0
  public leaderboardDate: Date | null = null
  public leaderBoardType: number = 0 // 1=daily, 2=weekly, 3=alltime
}
