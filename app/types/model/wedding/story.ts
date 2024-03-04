/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseString, parseArray } from '~/types/model/parse'

export type Story = {
  title: string
  thumbnail: string
  summary: string
  contents: string[]
}

export const parseStory = (data: any): Story => ({
  title: parseString(data.title),
  thumbnail: parseString(data.thumbnail),
  summary: parseString(data.summary),
  contents: parseArray(data.contents, parseString),
})
