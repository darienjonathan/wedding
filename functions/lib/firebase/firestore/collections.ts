import FirestoreWrapper from '~/lib/firebase/firestore/Firestore'
import { parseWeddingSettings, type WeddingSettings } from '~/types/model/wedding/weddingSettings'
import { parseWeddingEvent, type WeddingEvent } from '~/types/model/wedding/weddingEvent'
import { Invitee, InviteeRSVP, parseInvitee, parseInviteeRSVP } from '~/types/model/wedding/invitee'

export const WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID = 'WEDDING_SETTINGS_VALUE'

const wedding = () => new FirestoreWrapper('wedding', 'wedding/{tenantId}', parseWeddingSettings)

const weddingSettings = (tenantId: string) =>
  new FirestoreWrapper<WeddingSettings>(
    `wedding/${tenantId}/weddingSettings`,
    `wedding/{tenantUid}/weddingSettings/{weddingSettingsUid}`,
    parseWeddingSettings,
  )

const weddingEvents = (tenantId: string) =>
  new FirestoreWrapper<WeddingEvent>(
    `wedding/${tenantId}/weddingEvents`,
    `wedding/{tenantUid}/weddingEvents/{weddingEventUid}`,
    parseWeddingEvent,
  )

const invitees = (tenantId: string) =>
  new FirestoreWrapper<Invitee>(
    `wedding/${tenantId}/invitees`,
    `wedding/{tenantUid}/invitees/{inviteeUid}`,
    parseInvitee,
  )

const inviteeRSVP = (tenantId: string) =>
  new FirestoreWrapper<InviteeRSVP>(
    `wedding/${tenantId}/inviteeRSVP`,
    `wedding/{tenantUid}/inviteeRSVP/{inviteeRSVPUid}`,
    parseInviteeRSVP,
  )

export { wedding, weddingSettings, weddingEvents, invitees, inviteeRSVP }
