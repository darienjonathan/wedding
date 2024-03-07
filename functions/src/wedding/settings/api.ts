import { onRequest } from 'firebase-functions/v2/https'
import {
  WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID,
  weddingSettings,
} from '~/lib/firebase/firestore/collections'

export const fetchWeddingSettings = onRequest(async (req, res) => {
  const tenantId = req.query.tenantId

  console.log(tenantId)

  if (!tenantId) {
    res.json({ data: null })
    return
  }

  const writeResult = await weddingSettings(tenantId as string).loadDocument(
    WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID
  )
  // Send back a message that we've successfully written the message
  res.json({ data: writeResult })
})
