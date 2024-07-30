import type { QueryValue } from 'ufo'

export const createEndpoint = (baseUrl: string, endpoint: string) =>
  process.env.NODE_ENV === 'production'
    ? `https://${endpoint}-${baseUrl}`
    : `${baseUrl}/${endpoint}`

export const parseSearchParams = (searchParam: QueryValue): string => {
  if (!searchParam) return ''
  if (Array.isArray(searchParam)) return searchParam[0]
  if (typeof searchParam === 'object') return ''
  return String(searchParam)
}
