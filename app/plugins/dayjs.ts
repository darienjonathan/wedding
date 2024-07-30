import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { getTimestampByFormat } from '~/utils/time'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dayjs: (timestamp: number | null = null) =>
        dayjs(getTimestampByFormat(timestamp || Date.now(), 'js')),
    },
  }
})
