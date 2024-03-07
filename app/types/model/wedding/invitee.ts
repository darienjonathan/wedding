/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseString, parseNumber, parseBoolean } from '~/types/model/parse'
import { InvitationType, parseInvitationType } from '~/types/model/wedding/weddingSettings'

export type InviteePrefix =
  | 'Mr.'
  | 'Mrs.'
  | 'Mr. & Mrs.'
  | 'Ms.'
  | 'Pdt.'
  | 'Pdt. Em.'
  | 'GI.'
  | 'Pnt.K.'
  | 'Ls.'
  | 'dr.'
  | 'drg.'
  | 'Kel.'
  | 'Ai'
  | null

export const parseInviteePrefix = (inviteePrefix: any): InviteePrefix => {
  const stringifiedPrefix = parseString(inviteePrefix)
  if (stringifiedPrefix === 'Mr.') return 'Mr.'
  if (stringifiedPrefix === 'Mrs.') return 'Mrs.'
  if (stringifiedPrefix === 'Mr. & Mrs.') return 'Mr. & Mrs.'
  if (stringifiedPrefix === 'Ms.') return 'Ms.'
  if (stringifiedPrefix === 'Pdt.') return 'Pdt.'
  if (stringifiedPrefix === 'Pdt. Em.') return 'Pdt. Em.'
  if (stringifiedPrefix === 'GI.') return 'GI.'
  if (stringifiedPrefix === 'Pnt.K.') return 'Pnt.K.'
  if (stringifiedPrefix === 'Ls.') return 'Ls.'
  if (stringifiedPrefix === 'dr.') return 'dr.'
  if (stringifiedPrefix === 'drg.') return 'drg.'
  if (stringifiedPrefix === 'Kel.') return 'Kel.'
  if (stringifiedPrefix === 'Ai') return 'Ai'
  return null
}

export type InviteeSuffix = 'partner' | 'family' | null
export const parseInviteeSuffix = (inviteeSuffix: any): InviteeSuffix => {
  const stringifiedSuffix = parseString(inviteeSuffix)
  if (stringifiedSuffix === 'partner') return 'partner'
  if (stringifiedSuffix === 'family') return 'family'
  return null
}

export interface Invitee {
  databaseName: string
  invitationType: InvitationType
  inviteePrefix: InviteePrefix
  inviteeSuffix: InviteeSuffix
  databasePhoneNumber: string
  adultGuestNumber: number
  childrenGuestNumber: number
}

export const parseInvitee = (data: any): Invitee => ({
  databaseName: parseString(data.databaseName),
  invitationType: parseInvitationType(data.invitationType),
  inviteePrefix: parseInviteePrefix(data.inviteePrefix),
  inviteeSuffix: parseInviteeSuffix(data.inviteeSuffix),
  databasePhoneNumber: parseString(data.databasePhoneNumber),
  adultGuestNumber: parseNumber(data.adultGuestNumber),
  childrenGuestNumber: parseNumber(data.childrenGuestNumber),
})

export interface InviteeRSVP {
  name: string
  isAttendingReception: boolean
  phoneNumber: string
  adultGuestNumber: number
  childrenGuestNumber: number
}

export const parseInviteeRSVP = (data: any): InviteeRSVP => ({
  name: parseString(data.name),
  isAttendingReception: parseBoolean(data.isAttendingReception),
  phoneNumber: parseString(data.phoneNumber),
  adultGuestNumber: parseNumber(data.adultGuestNumber),
  childrenGuestNumber: parseNumber(data.childrenGuestNumber),
})
