import * as functions from 'firebase-functions'

/**
 * regionを指定したfunctionsを返す
 * envを使いたいので、基本的には引数のregionは指定しない。
 * 上書きが必要な場合に引数を指定。
 *
 * @export
 * @param {string} [region]
 * @returns {functions.FunctionBuilder}
 */
export default function getFunctions(region?: string): functions.FunctionBuilder {
  // region が指定された場合はそれを使う
  if (region) {
    return functions.region(region)
  }

  // region指定がないかつenv指定がある場合、envを使う
  if (process.env.FUNCTIONS_REGION) {
    return functions.region(process.env.FUNCTIONS_REGION)
  }

  // regionもenvもない場合はfallbackとしてregionのデフォルト
  return functions.region('us-central1')
}
