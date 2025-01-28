// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class HttpCaller {
  // 2DO: implement time out
  static async callUrl(url: string, callback: ((json: any) => void) | null = null): Promise<void> {
    try {
      const response = await fetch(url)
      console.log('fetched ' + url)

      const json = await response.json()
      console.log(json)

      if (callback != null) {
        callback(json)
      }
    } catch (error) {
      console.error('Error calling: ' + url, error)
    }
  }
}
