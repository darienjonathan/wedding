import type { QueryValue } from 'ufo'
import { createEndpoint } from '~/utils/api'

const parseSearchParams = (searchParam: QueryValue): string => {
  if (!searchParam) return ''
  if (Array.isArray(searchParam)) return searchParam[0]
  if (typeof searchParam === 'object') return ''
  return String(searchParam)
}

export default defineEventHandler(async event => {
  const config = useRuntimeConfig()
  const url = createEndpoint(config.functionsBaseURL, 'fetchWeddingSettings')

  const query = await getQuery(event)
  const tenantId = parseSearchParams(query.tenantId)

  const queryParams = new URLSearchParams({ tenantId })
  const response = await fetch(`${url}?${queryParams.toString()}`, {
    method: 'GET',
  })

  const { data } = await response.json()

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'tenantId does not exist',
    })
    return
  }

  return data
})
