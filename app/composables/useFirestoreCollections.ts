import { parseWish, type Wish } from '~/types/model/wedding/wish'
import useFirestore from '~/composables/firebase/firestore/useFirestore'
import { parseWeddingEvent, type WeddingEvent } from '~/types/model/wedding/weddingEvent'
import {
  parseInvitee,
  parseInviteeRSVP,
  type Invitee,
  type InviteeRSVP,
} from '~/types/model/wedding/invitee'

export const WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID = 'WEDDING_SETTINGS_VALUE'

const useFirestoreCollections = () => {
  const useWeddingEvents = (tenantId: string) =>
    useFirestore<WeddingEvent>(`wedding/${tenantId}/weddingEvents/`, parseWeddingEvent)
  const useInvitees = (tenantId: string) =>
    useFirestore<Invitee>(`wedding/${tenantId}/invitees`, parseInvitee)
  const useInviteeRSVP = (tenantId: string) =>
    useFirestore<InviteeRSVP>(`wedding/${tenantId}/inviteeRSVP`, parseInviteeRSVP)
  const useWishes = (tenantId: string) =>
    useFirestore<Wish>(`wedding/${tenantId}/wishes`, parseWish)

  return {
    useWeddingEvents,
    useInvitees,
    useInviteeRSVP,
    useWishes,
  }
}

export default useFirestoreCollections
