import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator } from 'firebase/firestore'
import { connectStorageEmulator } from 'firebase/storage'

const useEmulator = () => {
  const $firebase = useNuxtApp().$firebase
  const firebaseEmulator = useRuntimeConfig().public.firebaseEmulator as {
    [key: string]: string
  }

  onBeforeMount(() => {
    const auth = getAuth($firebase.app)
    connectAuthEmulator(auth, `http://${firebaseEmulator.host}:${firebaseEmulator.authPort}`)

    const firestore = $firebase.firestore.instance
    connectFirestoreEmulator(
      firestore,
      firebaseEmulator.host,
      Number(firebaseEmulator.firestorePort)
    )

    const storage = $firebase.storage.instance
    connectStorageEmulator(storage, firebaseEmulator.host, Number(firebaseEmulator.storagePort))
  })
}

export default useEmulator
