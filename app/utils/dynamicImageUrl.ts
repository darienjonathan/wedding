export const getDynamicAssetUrl = (url: string): string => {
  const basePath = '../assets/' // urlは/_nuxt/${このファイルの相対パス}になっているため、戻る必要がある
  return new URL(basePath + url, import.meta.url).href
}
