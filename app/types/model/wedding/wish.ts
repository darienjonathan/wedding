/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseString, parseNumber } from '~/types/model/parse'

export type Wish = {
  name: string
  timestamp: number
  content: string
}

export const parseWish = (data: any = {}): Wish => ({
  name: parseString(data.name),
  timestamp: parseNumber(data.timestamp),
  content: parseString(data.content),
})
