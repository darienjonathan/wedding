/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseArray, parseBoolean, parseNumber, parseString } from '~/types/model/parse'

/*type of Invitation */
export const InvitationTypes = {
  /* this event is shown to everyone */
  public: 'public',
  /* this event is only shown to invitees; RSVP not required */
  limitedNonRSVP: 'limitedNonRSVP',
  /* this event is only shown to invitees; RSVP is required */
  limitedRSVP: 'limitedRSVP',
} as const

export type InvitationType = (typeof InvitationTypes)[keyof typeof InvitationTypes]

export const parseInvitationType = (data: any = {}): InvitationType => {
  switch (data) {
    case 'public':
      return InvitationTypes.public
    case 'limitedNonRSVP':
      return InvitationTypes.limitedNonRSVP
    case 'limitedRSVP':
      return InvitationTypes.limitedRSVP
    default:
      return InvitationTypes.public
  }
}

export type WeddingEvent = {
  id: string
  eventName: string
  venue: string
  address: string
  centerCoordinate: { lat: number; lng: number }
  gmapsLink: string
  timestamp: number
  timezone: string
  streamingLink: string
  invitation: {
    type: InvitationType
    deadlineTimestamp: number
  }
}

export const parseWeddingEvent = (data: any = {}): WeddingEvent => ({
  id: parseString(data.id),
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
  invitation: {
    type: parseInvitationType(data.invitation?.type),
    deadlineTimestamp: parseNumber(data.invitation?.deadlineTimestamp),
  },
})

/*types of RSVP */
export const RSVPTypes = {
  /* externalLink: show external link (e.g. Google Form) */
  markdown: 'markdown',
  /* markdown: shows a markdown text on the RSVP section */
  externalLink: 'externalLink',
  /* sheet: show a form that integrates with Google Sheet */
  sheet: 'sheet',
} as const

export type RSVPType = (typeof RSVPTypes)[keyof typeof RSVPTypes]

export const parseRSVPType = (data: any = {}): RSVPType => {
  switch (data) {
    case 'markdown':
      return RSVPTypes.markdown
    case 'externalLink':
      return RSVPTypes.externalLink
    case 'sheet':
      return RSVPTypes.sheet
    default:
      return RSVPTypes.markdown
  }
}

export type RSVP = {
  isEnabled: boolean
  type: RSVPType
  content: string
}

export const parseRSVP = (data: any = {}): RSVP => ({
  isEnabled: parseBoolean(data.isEnabled),
  type: parseRSVPType(data.type),
  content: parseString(data.content),
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
  invitationText: string
  tagline: {
    jp: string
    en: string
  }
  title: string
}

export const parseHero = (data: any = {}): Hero => ({
  imageSrc: parseString(data.imageSrc),
  invitationText: parseString(data.invitationText),
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
  weddingEvents: WeddingEvent[]
  couple: [Person, Person]
  rsvp: RSVP
  stories: Story[]
  gallery: Gallery
  registries: Registry[]
  hero: Hero
  footer: Footer
  sectionSettings: {
    weddingEvents: SectionSettings
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
  weddingEvents: parseArray(data.weddingEvents, parseWeddingEvent),
  couple: [parsePerson(data.couple?.[0]), parsePerson(data.couple?.[1])],
  rsvp: parseRSVP(data.rsvp),
  stories: parseArray(data.stories, parseStory),
  registries: parseArray(data.registries, data => data as Registry),
  gallery: parseGallery(data.gallery),
  hero: parseHero(data.hero),
  footer: parseFooter(data.footer),
  sectionSettings: {
    weddingEvents: parseSectionSettings(data.sectionSettings?.weddingEvents),
    couple: parseSectionSettings(data.sectionSettings?.couple),
    story: parseSectionSettings(data.sectionSettings?.story),
    gallery: parseSectionSettings(data.sectionSettings?.gallery),
    wishes: parseSectionSettings(data.sectionSettings?.wishes),
    registry: parseSectionSettings(data.sectionSettings?.registry),
    closing: parseSectionSettings(data.sectionSettings?.closing),
  },
})
