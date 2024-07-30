import * as functions from 'firebase-functions'

export const defaultSettings = {
  region: 'asia-southeast2',
}

/**
 * regionを指定したfunctionsを返す
 * envを使いたいので、基本的には引数のregionは指定しない。
 * 上書きが必要な場合に引数を指定。
 *
 * @export
 * @param {string} [region]
 * @returns {functions.FunctionBuilder}
 */
export const getFunctions = (region?: string): functions.FunctionBuilder => {
  // region が指定された場合はそれを使う
  if (region) {
    return functions.region(region)
  }

  // regionもenvもない場合はfallbackとしてregionのデフォルト
  return functions.region(defaultSettings.region)
}
