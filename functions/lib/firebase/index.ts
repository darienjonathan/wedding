import * as admin from 'firebase-admin'

const adminInstance = admin.initializeApp({
  storageBucket: 'darienjonathan-site.appspot.com',
})

export default adminInstance
