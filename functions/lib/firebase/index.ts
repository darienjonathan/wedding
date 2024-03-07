import * as admin from 'firebase-admin'

const adminInstance = admin.initializeApp({
  storageBucket: 'wedding-5c92d',
})

export default adminInstance
