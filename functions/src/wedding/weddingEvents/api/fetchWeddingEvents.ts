import { onRequest } from 'firebase-functions/v2/https'
import { processRecord } from '~/lib/firebase/cloudStorage'
import { weddingEvents } from '~/lib/firebase/firestore/collections'
import { defaultSettings } from '~/lib/firebase/functions'
import { WeddingEvent } from '~/types/model/wedding/weddingEvent'

export const fetchWeddingEvents = onRequest(
  { region: defaultSettings.region },
  async (req, res) => {
    const tenantId = req.query.tenantId

    if (!tenantId) {
      res.json({ data: null })
      return
    }

    const data = await weddingEvents(tenantId as string).loadCollection()
    const dataRecord = [...Array.from(data)].reduce<Record<string, WeddingEvent>>(
      (obj, [uid, weddingEvent]) => ({
        ...obj,
        [uid]: weddingEvent,
      }),
      {},
    )

    res.json({ data: data ? await processRecord(dataRecord) : null })
    return
  },
)
