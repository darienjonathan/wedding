import { parseWish } from '~/types/model/wedding/wish'
import type { Wish } from '~/types/model/wedding/wish'
import useFirestore from '~/composables/firebase/firestore/useFirestore'

export const WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID = 'WEDDING_SETTINGS_VALUE'

const useFirestoreCollections = () => {
  const useWishes = (tenantId: string) =>
    useFirestore<Wish>(`wedding/${tenantId}/wishes`, parseWish)

  return {
    useWishes,
  }
}

export default useFirestoreCollections
