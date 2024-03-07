import { WeddingSettings, parseWeddingSettings } from '~/types/model/wedding/weddingSettings'
import { Wish, parseWish } from '~/types/model/wedding/wish'
import useFirestore from '~/composables/firebase/firestore/useFirestore'
import {
  Invitee,
  parseInvitee,
  InviteeRSVP,
  parseInviteeRSVP,
} from '~~/types/model/wedding/invitee'

export const WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID = 'WEDDING_SETTINGS_VALUE'

const useFirestoreCollections = () => {
  const useWeddingSettings = (tenantId: string) =>
    useFirestore<WeddingSettings>(`wedding/${tenantId}/weddingSettings`, parseWeddingSettings)
  const useInvitees = (tenantId: string) =>
    useFirestore<Invitee>(`wedding/${tenantId}/invitees`, parseInvitee)
  const useInviteeRSVP = (tenantId: string) =>
    useFirestore<InviteeRSVP>(`wedding/${tenantId}/inviteeRSVP`, parseInviteeRSVP)
  const useWishes = (tenantId: string) =>
    useFirestore<Wish>(`wedding/${tenantId}/wishes`, parseWish)

  return {
    useWeddingSettings,
    useInvitees,
    useInviteeRSVP,
    useWishes,
  }
}

export default useFirestoreCollections
