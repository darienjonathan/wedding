/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { parseArray, parseBoolean, parseNumber, parseString } from '~/types/model/parse'

export type WeddingEvent = {
  eventName: string
  address: string
  gmapsLink: string
  timestamp: number
}

export const parseWeddingEvent = (data: any): WeddingEvent => ({
  eventName: parseString(data.eventName),
  address: parseString(data.address),
  gmapsLink: parseString(data.gmapsLink),
  timestamp: parseNumber(data.timestamp),
})

export type Parent = {
  name: string
  hasPassedAway: string
}

export const parseParent = (data: any): Parent => ({
  name: parseString(data.name),
  hasPassedAway: parseString(data.hasPassedAway),
})

export type Person = {
  name: {
    first: string
    last: string
    gender: 'male' | 'female'
    childOrder: number
  }
  parents: [Parent, Parent]
  imageSrc: string
  registry: Record<string, string>
}

export const parsePerson = (data: any): Person => ({
  name: {
    first: parseString(data.name?.first),
    last: parseString(data.name?.last),
    gender: data.name.gender === 'male' ? 'male' : 'female',
    childOrder: parseNumber(data.name?.childOrder),
  },
  parents: [parseParent(data.parents?.[0]), parseParent(data.parents?.[1])],
  imageSrc: parseString(data.imageSrc),
  registry: (data.registry || {}) as Person['registry'],
})

export type Story = {
  picture: string
  title: string
  summary: string
  content: string
}

export const parseStory = (data: any): Story => ({
  picture: parseString(data.picture),
  title: parseString(data.title),
  summary: parseString(data.summary),
  content: parseString(data.content),
})

export type Gallery = {
  layoutType: 'default' | 'custom'
  imageSrcs: string[]
}

export const parseGallery = (data: any): Gallery => ({
  layoutType: data.layoutType === 'default' ? 'default' : 'custom',
  imageSrcs: parseArray(data.imageSrcs, parseString),
})

export type Footer = {
  type: 'default' | 'self'
}

export const parseFooter = (data: any): Footer => ({
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

export const parseHero = (data: any): Hero => ({
  imageSrc: parseString(data.imageSrc),
  tagline: {
    jp: parseString(data.tagline?.jp),
    en: parseString(data.tagline?.en),
  },
  title: parseString(data.title),
})

export type SectionSettings = {
  isUsing: boolean
  title: string
  description: {
    main: string
    sub: string
  }
}

export const parseSectionSettings = (data: any): SectionSettings => ({
  isUsing: parseBoolean(data.isUsing),
  title: parseString(data.title),
  description: {
    main: parseString(data.description?.main),
    sub: parseString(data.description?.sub),
  },
})

export type WeddingSettings = {
  ogpImageSrc: string
  events: WeddingEvent[]
  couple: [Person, Person]
  rsvp: {
    isUsing: boolean
    masterSheet: string
  }
  online: {
    isUsing: boolean
    link: string
  }
  stories: Story[]
  gallery: Gallery
  hero: Hero
  footer: Footer
  sectionSettings: {
    event: SectionSettings
    couple: SectionSettings
    gallery: SectionSettings
    wishes: SectionSettings
    registry: SectionSettings
    closing: SectionSettings
  }
}

export const parseWeddingSettings = (data: any): WeddingSettings => ({
  ogpImageSrc: parseString(data.ogpImageSrc),
  events: parseArray(data.events, parseWeddingEvent),
  couple: [parsePerson(data.couple?.[0]), parsePerson(data.couple?.[1])],
  rsvp: {
    isUsing: parseBoolean(data.rsvp?.isUsing),
    masterSheet: parseString(data.rsvp?.masterSheet),
  },
  online: {
    isUsing: parseBoolean(data.online?.isUsing),
    link: parseString(data.online?.link),
  },
  stories: parseArray(data.stories, parseStory),
  gallery: parseGallery(data.gallery),
  hero: parseHero(data.hero),
  footer: parseFooter(data.footer),
  sectionSettings: {
    event: parseSectionSettings(data.sectionSettings?.event),
    couple: parseSectionSettings(data.sectionSettings?.couple),
    gallery: parseSectionSettings(data.sectionSettings?.gallery),
    wishes: parseSectionSettings(data.sectionSettings?.wishes),
    registry: parseSectionSettings(data.sectionSettings?.registry),
    closing: parseSectionSettings(data.sectionSettings?.closing),
  },
})
