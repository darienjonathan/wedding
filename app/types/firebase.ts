export const signInStatus = <const>{
  notYet: 'notYet',
  signedIn: 'signedIn',
  signedOut: 'signedOut',
}

export type SignInStatus = (typeof signInStatus)[keyof typeof signInStatus]
