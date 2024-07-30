import * as admin from 'firebase-admin'
import { getApp } from 'firebase-admin/app'

const initializeApp = () =>
  admin.initializeApp({
    storageBucket: 'wedding-5c92d.appspot.com',
  })

export const appSingleton = () => {
  try {
    return getApp()
  } catch (err) {
    return initializeApp()
  }
}
