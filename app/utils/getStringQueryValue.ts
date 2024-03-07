export type LocationQueryValue = string | null

export const getStringQueryValue = (value: LocationQueryValue | LocationQueryValue[]): string => {
  if (!Array.isArray(value)) return value || ''

  const filteredValues = value.filter((val): val is string => typeof val === 'string')
  return filteredValues.length ? filteredValues[0] : ''
}
