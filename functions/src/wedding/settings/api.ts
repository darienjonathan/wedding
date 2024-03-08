import { onRequest } from 'firebase-functions/v2/https'
import {
  WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID,
  weddingSettings,
} from '~/lib/firebase/firestore/collections'
import { defaultSettings } from '~/lib/firebase/functions'

export const fetchWeddingSettings = onRequest(
  { region: defaultSettings.region },
  async (req, res) => {
    const tenantId = req.query.tenantId

    if (!tenantId) {
      res.json({ data: null })
      res.end()
      return
    }

    const data = await weddingSettings(tenantId as string).loadDocument(
      WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID
    )
    res.json({ data })
    res.end()
    return
  }
)
