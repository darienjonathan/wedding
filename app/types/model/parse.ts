/* eslint-disable @typescript-eslint/no-explicit-any */

const defaultValues = {
  string: '',
  number: 0,
  boolean: false,
  array: [],
}

export function parseString(data: any) {
  return String(data || defaultValues.string).replace(/\\n/g, "\n")
}

export function parseNumber(data: any) {
  return Number(data || defaultValues.number)
}

export function parseBoolean(data: any) {
  return Boolean(data || defaultValues.boolean)
}

export function parseArray<T>(arr: any, parseFn: (item: any) => T): T[] {
  return Array.isArray(arr) ? arr.map((item: any) => parseFn(item)) : defaultValues.array
}
