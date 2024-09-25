/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseArray, parseBoolean, parseNumber, parseString } from '~/types/model/parse'

/*types of RSVP Forms */
export const RSVPFormTypes = {
  /* externalLink: show external link (e.g. Google Form) */
  markdown: 'markdown',
  /* markdown: shows a markdown text on the RSVP section */
  externalLink: 'externalLink',
  /* sheet: show a form that integrates with Google Sheet */
  sheet: 'sheet',
} as const

export type RSVPFormType = (typeof RSVPFormTypes)[keyof typeof RSVPFormTypes]

export const parseRSVPFormType = (data: any = {}): RSVPFormType => {
  switch (data) {
    case 'markdown':
      return RSVPFormTypes.markdown
    case 'externalLink':
      return RSVPFormTypes.externalLink
    case 'sheet':
      return RSVPFormTypes.sheet
    default:
      return RSVPFormTypes.markdown
  }
}

export type RSVPForm = {
  isEnabled: boolean
  formType: RSVPFormType
  content: string
}

export const parseRSVPForm = (data: any = {}): RSVPForm => ({
  isEnabled: parseBoolean(data.isEnabled),
  formType: parseRSVPFormType(data.formType),
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

// Event's viewability is controlled by WeddingEvent, hence "isExclusiveToInvitees" is not needed
export type EventsSectionSettings = Omit<SectionSettings, 'isExclusiveToInvitees'>

export const parseEventsSectionSettings = (data: any = {}): EventsSectionSettings => ({
  isEnabled: parseBoolean(data.isEnabled),
  title: parseString(data.title),
  description: {
    main: parseString(data.description?.main),
    sub: parseString(data.description?.sub),
  },
})

export type WeddingSettings = {
  ogpImageSrc: string
  couple: [Person, Person]
  rsvpForm: RSVPForm
  stories: Story[]
  gallery: Gallery
  registries: Registry[]
  hero: Hero
  footer: Footer
  sectionSettings: {
    weddingEvents: EventsSectionSettings
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
  couple: [parsePerson(data.couple?.[0]), parsePerson(data.couple?.[1])],
  rsvpForm: parseRSVPForm(data.rsvpForm),
  stories: parseArray(data.stories, parseStory),
  registries: parseArray(data.registries, data => data as Registry),
  gallery: parseGallery(data.gallery),
  hero: parseHero(data.hero),
  footer: parseFooter(data.footer),
  sectionSettings: {
    weddingEvents: parseEventsSectionSettings(data.sectionSettings?.weddingEvents),
    couple: parseSectionSettings(data.sectionSettings?.couple),
    story: parseSectionSettings(data.sectionSettings?.story),
    gallery: parseSectionSettings(data.sectionSettings?.gallery),
    wishes: parseSectionSettings(data.sectionSettings?.wishes),
    registry: parseSectionSettings(data.sectionSettings?.registry),
    closing: parseSectionSettings(data.sectionSettings?.closing),
  },
})
