import type { WeddingSettings } from '~/types/model/wedding/weddingSettings'
import { createEndpoint, parseSearchParams } from '~/utils/api'

export type FetchWeddigSettingsResponse = WeddingSettings

export default defineEventHandler<Promise<FetchWeddigSettingsResponse>>(async event => {
  const config = useRuntimeConfig()
  const url = createEndpoint(config.functionsBaseURL, 'fetchWeddingSettings')

  const query = await getQuery(event)
  const tenantId = parseSearchParams(query.tenantId)

  const queryParams = new URLSearchParams({ tenantId })
  const response = await fetch(`${url}?${queryParams.toString()}`, {
    method: 'GET',
  })

  const data = (await response.json()).data as WeddingSettings

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'tenantId does not exist',
    })
  }

  return data
})
