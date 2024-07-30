/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseArray, parseBoolean, parseNumber, parseString } from '~/types/model/parse'

export type InviteeEvent = {
  eventId: string
  adult?: number
  children?: number
}

const parseInviteeEvent = (data: any = {}): InviteeEvent => ({
  eventId: parseString(data.eventId),
  ...((data.adult !== undefined || data.children !== undefined) && {
    adult: parseNumber(data.adult),
    children: parseNumber(data.children),
  }),
})

export type Invitee = {
  name: string
  contact: string
  events: InviteeEvent[]
}

export const parseInvitee = (data: any = {}): Invitee => ({
  name: parseString(data.name),
  contact: parseString(data.contact),
  events: parseArray(data.events, parseInviteeEvent),
})

export type InviteeRSVPEvent = InviteeEvent & {
  isAttending: boolean
}

const parseInviteeRSVPEvent = (data: any = {}): InviteeRSVPEvent => ({
  ...parseInviteeEvent(data),
  isAttending: parseBoolean(data.isAttending),
})

export type InviteeRSVP = {
  events: InviteeRSVPEvent[]
}

export const parseInviteeRSVP = (data: any = {}): InviteeRSVP => ({
  events: parseArray(data.events, parseInviteeRSVPEvent),
})
