/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseArray, parseBoolean, parseNumber, parseString } from '~/types/model/parse'

// Invitees that is invited to reception is considered to be invited to matrimony as well
export type InvitationType = 'reception' | 'matrimony' | null

export const parseInvitationType = (invitationType: any): InvitationType => {
  const stringifiedType = parseString(invitationType)
  if (stringifiedType === 'reception') return 'reception'
  if (stringifiedType === 'matrimony') return 'matrimony'
  return null
}

export type WeddingEvent = {
  type: InvitationType
  eventName: string
  venue: string
  address: string
  centerCoordinate: { lat: number; lng: number }
  gmapsLink: string
  timestamp: number
  timezone: string
  streamingLink: string
}

export const parseWeddingEvent = (data: any = {}): WeddingEvent => ({
  type: parseInvitationType(data.type),
  eventName: parseString(data.eventName),
  venue: parseString(data.venue),
  address: parseString(data.address),
  centerCoordinate: {
    lat: parseNumber(data.centerCoordinate?.lat),
    lng: parseNumber(data.centerCoordinate?.lng),
  },
  gmapsLink: parseString(data.gmapsLink),
  timestamp: parseNumber(data.timestamp),
  timezone: parseString(data.timezone),
  streamingLink: parseString(data.streamingLink),
})

export type Parent = {
  name: string
  hasPassedAway: boolean
}

export const parseParent = (data: any = {}): Parent => ({
  name: parseString(data.name),
  hasPassedAway: parseBoolean(data.hasPassedAway),
})

export type Person = {
  name: {
    prefix: string
    first: string
    last: string
    suffix: string
  }
  gender: 'male' | 'female'
  childOrder: number
  parents: [Parent, Parent]
  imageSrc: string
}

export const parsePerson = (data: any = {}): Person => ({
  name: {
    prefix: parseString(data.name?.prefix),
    first: parseString(data.name?.first),
    last: parseString(data.name?.last),
    suffix: parseString(data.name?.suffix),
  },
  gender: data.gender === 'male' ? 'male' : 'female',
  childOrder: parseNumber(data.childOrder),
  parents: [parseParent(data.parents?.[0]), parseParent(data.parents?.[1])],
  imageSrc: parseString(data.imageSrc),
})

export type RSVP = {
  isEnabled: boolean
  masterSheet: string
  deadlineTimestamp: number
}

export const parseRSVP = (data: any = {}): RSVP => ({
  isEnabled: parseBoolean(data.isEnabled),
  masterSheet: parseString(data.masterSheet),
  deadlineTimestamp: parseNumber(data.deadlineTimestamp),
})

export type Story = {
  picture: string
  title: string
  summary: string
  contents: string[]
}

export const parseStory = (data: any = {}): Story => ({
  picture: parseString(data.picture),
  title: parseString(data.title),
  summary: parseString(data.summary),
  contents: parseArray(data.contents, parseString),
})

export type Gallery = {
  layoutType: 'default' | 'masonry'
  imageSrcs: string[]
}

export const parseGallery = (data: any = {}): Gallery => ({
  layoutType: data.layoutType === 'default' ? 'default' : 'masonry',
  imageSrcs: parseArray(data.imageSrcs, parseString),
})

export type Registry = Record<string, string>

export type Footer = {
  type: 'default' | 'self'
}

export const parseFooter = (data: any = {}): Footer => ({
  type: data.type === 'default' ? 'default' : 'self',
})

export type Hero = {
  imageSrc: string
  tagline: {
    jp: string
    en: string
  }
  title: string
}

export const parseHero = (data: any = {}): Hero => ({
  imageSrc: parseString(data.imageSrc),
  tagline: {
    jp: parseString(data.tagline?.jp),
    en: parseString(data.tagline?.en),
  },
  title: parseString(data.title),
})

export type SectionSettings = {
  isEnabled: boolean
  title: string
  isExclusiveToInvitees: boolean
  description: {
    main: string
    sub: string
  }
}

export const parseSectionSettings = (data: any = {}): SectionSettings => ({
  isEnabled: parseBoolean(data.isEnabled),
  title: parseString(data.title),
  isExclusiveToInvitees: parseBoolean(data.isExclusiveToInvitees),
  description: {
    main: parseString(data.description?.main),
    sub: parseString(data.description?.sub),
  },
})

export type WeddingSettings = {
  ogpImageSrc: string
  events: WeddingEvent[]
  couple: [Person, Person]
  rsvp: RSVP
  stories: Story[]
  gallery: Gallery
  registries: Registry[]
  hero: Hero
  footer: Footer
  sectionSettings: {
    event: SectionSettings
    couple: SectionSettings
    story: SectionSettings
    gallery: SectionSettings
    wishes: SectionSettings
    registry: SectionSettings
    closing: SectionSettings
  }
}

export const parseWeddingSettings = (data: any = {}): WeddingSettings => ({
  ogpImageSrc: parseString(data.ogpImageSrc),
  events: parseArray(data.events, parseWeddingEvent),
  couple: [parsePerson(data.couple?.[0]), parsePerson(data.couple?.[1])],
  rsvp: parseRSVP(data.rsvp),
  stories: parseArray(data.stories, parseStory),
  registries: parseArray(data.registries, data => data as Registry),
  gallery: parseGallery(data.gallery),
  hero: parseHero(data.hero),
  footer: parseFooter(data.footer),
  sectionSettings: {
    event: parseSectionSettings(data.sectionSettings?.event),
    couple: parseSectionSettings(data.sectionSettings?.couple),
    story: parseSectionSettings(data.sectionSettings?.story),
    gallery: parseSectionSettings(data.sectionSettings?.gallery),
    wishes: parseSectionSettings(data.sectionSettings?.wishes),
    registry: parseSectionSettings(data.sectionSettings?.registry),
    closing: parseSectionSettings(data.sectionSettings?.closing),
  },
})
