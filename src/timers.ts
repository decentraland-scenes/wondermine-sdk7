import * as utils from '@dcl-sdk/utils'

const thisGlobal: any = globalThis

// eslint-disable-next-line @typescript-eslint/unbound-method
export const clearTimeout = thisGlobal.clearTimeout !== undefined ? thisGlobal.clearTimeout : utils.timers.clearTimeout
export const clearInterval =
  // eslint-disable-next-line @typescript-eslint/unbound-method
  thisGlobal.clearInterval !== undefined ? thisGlobal.clearInterval : utils.timers.clearInterval
// eslint-disable-next-line @typescript-eslint/unbound-method
export const setTimeout = thisGlobal.setTimeout !== undefined ? thisGlobal.setTimeout : utils.timers.setTimeout
// eslint-disable-next-line @typescript-eslint/unbound-method
export const setInterval = thisGlobal.setInterval !== undefined ? thisGlobal.setInterval : utils.timers.setInterval
