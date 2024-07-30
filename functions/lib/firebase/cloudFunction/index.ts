import { Request } from 'firebase-functions/v1/https'

export const parseSearchParams = (searchParam: Request['query'][string]): string => {
  if (!searchParam) return ''
  if (Array.isArray(searchParam)) {
    const param = searchParam[0]
    if (typeof param === 'string') return param
    return parseSearchParams(param)
  }
  if (typeof searchParam === 'object') return ''
  return String(searchParam)
}
