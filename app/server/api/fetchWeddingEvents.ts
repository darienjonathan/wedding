import type { WeddingEvent } from '~/types/model/wedding/weddingEvent'
import { createEndpoint, parseSearchParams } from '~/utils/api'

export type FetchWeddingEventsResponse = Record<string, WeddingEvent>

export default defineEventHandler(async event => {
  const config = useRuntimeConfig()
  const url = createEndpoint(config.functionsBaseURL, 'fetchWeddingEvents')

  const query = await getQuery(event)
  const tenantId = parseSearchParams(query.tenantId)

  const queryParams = new URLSearchParams({ tenantId })
  const response = await fetch(`${url}?${queryParams.toString()}`, {
    method: 'GET',
  })

  const data = (await response.json()).data as Record<string, WeddingEvent>

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'tenantId does not exist',
    })
  }

  return data
})
