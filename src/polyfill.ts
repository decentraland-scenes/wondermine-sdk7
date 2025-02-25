/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'xmlhttprequest-polyfill'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore
import { URL } from 'whatwg-url-without-unicode'

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore
globalThis.URL = URL
