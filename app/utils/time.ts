import dayjs from 'dayjs'
import { getNumDigits } from '~/utils/number'

export const digitNum = {
  unix: 10,
  js: 13,
} as const

export const getTimestampByFormat = (timestamp: number, format: keyof typeof digitNum = 'js') => {
  const digits = getNumDigits(timestamp)
  return timestamp * Math.pow(10, digitNum[format] - digits)
}

export const getTimezoneText = (timezone: string, dayjs?: dayjs.Dayjs) => {
  switch (timezone) {
    case 'Asia/Jakarta':
      return 'WIB'
    case 'Asia/Makassar':
      return 'WITA'
    case 'Asia/Jayapura':
      return 'WIT'
    default:
      return dayjs ? `UTC ${dayjs.format('Z')}` : ''
  }
}
