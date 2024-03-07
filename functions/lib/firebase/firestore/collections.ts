import FirestoreWrapper from '~/lib/firebase/firestore/Firestore'
import { Invitee, parseInvitee, InviteeRSVP, parseInviteeRSVP } from '~/types/model/wedding/invitee'
import { WeddingSettings, parseWeddingSettings } from '~/types/model/wedding/weddingSettings'

export const WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID = 'WEDDING_SETTINGS_VALUE'

// Wedding
const weddingSettings = (tenantId: string) =>
  new FirestoreWrapper<WeddingSettings>(
    `wedding/${tenantId}/weddingSettings`,
    `wedding/${tenantId}/weddingSettings/{weddingSettingsUid}`,
    parseWeddingSettings
  )
const invitees = () =>
  new FirestoreWrapper<Invitee>('invitees', 'invitees/{inviteesUid}', parseInvitee)
const inviteeRSVP = () =>
  new FirestoreWrapper<InviteeRSVP>('inviteeRSVP', 'inviteeRSVP/{inviteeRSVPUid}', parseInviteeRSVP)

export { weddingSettings, invitees, inviteeRSVP }
