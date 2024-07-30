// https://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript
export const getNumDigits = (x: number): number =>
  Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1

export const getOrdinal = (x: number) => {
  const arr = [
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    'ninth',
    'tenth',
  ]
  return arr[x - 1] || ''
}
