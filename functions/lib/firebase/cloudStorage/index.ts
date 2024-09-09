/* eslint-disable @typescript-eslint/no-explicit-any */

import { getStorage, getDownloadURL } from 'firebase-admin/storage'
import { appSingleton } from '~/lib/firebase'

appSingleton()
const bucket = getStorage().bucket()

/**
 * function to replace cloud storage URI with download URL
 * @param str string to check if it is a cloud storage URI
 * @returns the download URL if the string is a cloud storage URI, otherwise the original string
 */
const tryReplaceWithDownloadURL = async (str: string): Promise<string> => {
  const { href } = bucket.cloudStorageURI
  return str.includes(href) ? await getDownloadURL(bucket.file(str.replace(`${href}/`, ''))) : str
}

/**
 * loop through all the values in the object and try to replace the string values with the download URL
 * @param record record to process
 * @returns the processed record
 */
export const processRecord = async <T extends Record<string, any>>(record: T): Promise<T> => {
  const processValue = async (value: any): Promise<any> => {
    if (typeof value === 'string') {
      return await tryReplaceWithDownloadURL(value)
    }
    if (Array.isArray(value)) {
      return await Promise.all(value.map(processValue))
    }
    if (typeof value === 'object' && value !== null) {
      return await processRecord(value)
    }
    return value
  }

  const entries = await Promise.all(
    Object.entries(record).map(async ([key, value]) => {
      return [key, await processValue(value)]
    }),
  )

  return Object.fromEntries(entries)
}
