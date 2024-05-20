import type { Auth, AuthError, Unsubscribe, User, UserCredential } from 'firebase/auth'
import type { SignInStatus } from '~/types/firebase'

import {
  createUserWithEmailAndPassword,
  deleteUser as deleteUserFn,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail as sendPasswordResetEmailFn,
  signInWithEmailAndPassword,
  signOut as signOutFn,
  updateEmail as updateEmailFn,
  updatePassword as updatePasswordFn,
  updateProfile as updateProfileFn,
} from 'firebase/auth'

const useAuth = () => {
  const unsubscribe = ref<Unsubscribe>()
  const user = ref<User | null | undefined>()
  const auth = ref<Auth>()

  onBeforeMount(() => {
    auth.value = getAuth(useNuxtApp().$firebase.app)
    unsubscribe.value = onAuthStateChanged(auth.value, authUser => {
      user.value = authUser
    })
  })
  onUnmounted(() => {
    if (!unsubscribe.value) return
    unsubscribe.value()
  })

  const signInStatus = computed<{ [key in SignInStatus]: boolean }>(() => ({
    signedIn: user.value !== undefined && user.value !== null,
    signedOut: user.value === null,
    notYet: user.value === undefined,
  }))

  const userUid = computed(() => user.value?.uid)

  const signUp = (email: string, password: string): Promise<UserCredential> => {
    try {
      if (!auth.value) throw new Error('auth does not exist')
      return createUserWithEmailAndPassword(auth.value, email, password)
    } catch (error) {
      return Promise.reject(error as AuthError)
    }
  }

  const signIn = (email: string, password: string): Promise<UserCredential> => {
    try {
      if (!auth.value) throw new Error('auth does not exist')
      return signInWithEmailAndPassword(auth.value, email, password)
    } catch (error) {
      return Promise.reject(error as AuthError)
    }
  }

  const signOut = () => {
    if (!auth.value) return
    try {
      return signOutFn(auth.value)
    } catch (error) {
      return error as AuthError
    }
  }

  const updateProfile = (profile: Parameters<typeof updateProfileFn>[1]) => {
    if (!user.value) return
    return updateProfileFn(user.value, profile)
  }

  const updateEmail = (newEmail: string) => {
    if (!user.value) return
    return updateEmailFn(user.value, newEmail)
  }

  const updatePassword = (newPassword: string) => {
    if (!user.value) return
    return updatePasswordFn(user.value, newPassword)
  }

  const sendPasswordResetEmail = (email: string) => {
    if (!user.value || !auth.value) return
    return sendPasswordResetEmailFn(auth.value, email)
  }

  const deleteUser = () => {
    if (!user.value) return
    return deleteUserFn(user.value)
  }

  return {
    userUid,
    signInStatus,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateEmail,
    updatePassword,
    sendPasswordResetEmail,
    deleteUser,
  }
}

export default useAuth
