import FirestoreWrapper from '~/lib/firebase/firestore/Firestore'
import type { WeddingSettings } from '~/types/model/wedding/weddingSettings'
import { parseWeddingSettings } from '~/types/model/wedding/weddingSettings'

export const WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID = 'WEDDING_SETTINGS_VALUE'

const wedding = () => new FirestoreWrapper('wedding', 'wedding/{tenantId}', parseWeddingSettings)

const weddingSettings = (tenantId: string) =>
  new FirestoreWrapper<WeddingSettings>(
    `wedding/${tenantId}/weddingSettings`,
    `wedding/${tenantId}/weddingSettings/{weddingSettingsUid}`,
    parseWeddingSettings,
  )

export { wedding, weddingSettings }
