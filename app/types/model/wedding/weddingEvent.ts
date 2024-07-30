/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseNumber, parseString } from '~/types/model/parse'

/*type of Invitation */
export const RSVPTypes = {
  /* simple RSVP (only attend/decline) */
  simple: 'simple',
  /* detailed RSVP (attend/decline + attendance number) */
  detailed: 'detailed',
} as const

export type RSVPType = (typeof RSVPTypes)[keyof typeof RSVPTypes]

export const parseInvitationType = (data: any = {}): RSVPType => {
  switch (data) {
    case 'simple':
      return RSVPTypes.simple
    case 'detailed':
      return RSVPTypes.detailed
    default:
      return RSVPTypes.simple
  }
}

// Setting the type name to "Event" will make it conflict with the DOM Event
export type WeddingEvent = {
  eventName: string
  venue: string
  address: string
  centerCoordinate: { lat: number; lng: number }
  gmapsLink: string
  order: number
  timestamp: number
  timezone: string
  streamingLink: string
  /* invitation type and deadline. undefined means RSVP is not required. */
  rsvp?: {
    type: RSVPType
    deadlineTimestamp: number
  }
}

export const parseWeddingEvent = (data: any = {}): WeddingEvent => ({
  eventName: parseString(data.eventName),
  venue: parseString(data.venue),
  address: parseString(data.address),
  centerCoordinate: {
    lat: parseNumber(data.centerCoordinate?.lat),
    lng: parseNumber(data.centerCoordinate?.lng),
  },
  gmapsLink: parseString(data.gmapsLink),
  order: parseNumber(data.order),
  timestamp: parseNumber(data.timestamp),
  timezone: parseString(data.timezone),
  streamingLink: parseString(data.streamingLink),
  ...(data.rsvp && {
    type: parseInvitationType(data.rsvp?.type),
    deadlineTimestamp: parseNumber(data.rsvp?.deadlineTimestamp),
  }),
})
