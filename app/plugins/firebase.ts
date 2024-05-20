import type { FirebaseApp, FirebaseOptions } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDownloadURL as storageGetDownloadURL, getStorage, ref } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  const app = initializeApp(config.firebaseConfig as FirebaseOptions)
  return {
    provide: {
      firebase: {
        app,
        storage: storagePlugins(app),
        firestore: firestorePlugins(app),
      },
    },
  }
})

const storagePlugins = (app: FirebaseApp) => {
  const storage = getStorage(app)
  const getDownloadURL = (filePath: string) => storageGetDownloadURL(ref(storage, filePath))
  return {
    instance: storage,
    getDownloadURL,
  }
}

const firestorePlugins = (app: FirebaseApp) => {
  const firestore = getFirestore(app)
  return {
    instance: firestore,
  }
}
