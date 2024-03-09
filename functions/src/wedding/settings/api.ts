/* eslint-disable @typescript-eslint/no-explicit-any */
import { onRequest } from 'firebase-functions/v2/https'
import {
  WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID,
  weddingSettings,
} from '~/lib/firebase/firestore/collections'
import { defaultSettings } from '~/lib/firebase/functions'
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
const processRecord = async (record: Record<string, any>): Promise<Record<string, any>> => {
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
    })
  )

  return Object.fromEntries(entries)
}

export const fetchWeddingSettings = onRequest(
  { region: defaultSettings.region },
  async (req, res) => {
    const tenantId = req.query.tenantId

    if (!tenantId) {
      res.json({ data: null })
    }

    const data = await weddingSettings(tenantId as string).loadDocument(
      WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID
    )

    res.json({ data: data ? await processRecord(data) : null })
  }
)
