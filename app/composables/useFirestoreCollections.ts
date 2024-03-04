import { WeddingSettings, parseWeddingSettings } from 'types/model/wedding/weddingSettings'
import { Wish, parseWish } from '~/types/model/wedding/wish'
import useFirestore from '~/composables/firebase/firestore/useFirestore'
import {
  Invitee,
  parseInvitee,
  InviteeRSVP,
  parseInviteeRSVP,
} from '~~/types/model/wedding/invitee'

const useFirestoreCollections = () => {
  const useWeddingSettings = (tenantId: string) =>
    useFirestore<WeddingSettings>(`${tenantId}/weddingSettings`, parseWeddingSettings)
  const useInvitees = (tenantId: string) =>
    useFirestore<Invitee>(`${tenantId}/invitees`, parseInvitee)
  const useInviteeRSVP = (tenantId: string) =>
    useFirestore<InviteeRSVP>(`${tenantId}/inviteeRSVP`, parseInviteeRSVP)
  const useWishes = (tenantId: string) => useFirestore<Wish>(`${tenantId}/wishes`, parseWish)

  return {
    useWeddingSettings,
    useInvitees,
    useInviteeRSVP,
    useWishes,
  }
}

export default useFirestoreCollections
