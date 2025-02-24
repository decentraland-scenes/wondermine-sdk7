/* eslint-disable @typescript-eslint/dot-notation */
import 'xmlhttprequest-polyfill'

// @ts-expect-error
import { URL } from 'whatwg-url-without-unicode'

// @ts-expect-error
globalThis['URL'] = URL
