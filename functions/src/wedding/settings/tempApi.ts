/* eslint-disable @typescript-eslint/no-explicit-any */
import { onRequest } from 'firebase-functions/v2/https'
import {
  WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID,
  weddingSettings,
  wedding,
} from '~/lib/firebase/firestore/collections'
import { defaultSettings } from '~/lib/firebase/functions'
import {
  WeddingSettings,
  parseWeddingSettings,
  parsePerson,
  parseRSVP,
  parseGallery,
  parseHero,
  parseFooter,
  parseSectionSettings,
  parseWeddingEvent,
  parseStory,
  Registry,
} from '~/types/model/wedding/weddingSettings'
import { parseArray, parseString } from '~/types/model/parse'

/**
 * Change keys from "events" to "weddingEvents"
 */

import FirestoreWrapper from '~/lib/firebase/firestore/Firestore'

type OldSectionSettings = Omit<WeddingSettings['sectionSettings'], 'weddingEvents'> & {
  events: WeddingSettings['sectionSettings']['weddingEvents']
}

type OldWeddingSettings = Omit<WeddingSettings, 'weddingEvents' | 'sectionSettings'> & {
  events: WeddingSettings['weddingEvents']
  sectionSettings: OldSectionSettings
}

const parseOldWeddingSettings = (data: any): OldWeddingSettings => ({
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
    events: parseSectionSettings(data.sectionSettings?.events),
    couple: parseSectionSettings(data.sectionSettings?.couple),
    story: parseSectionSettings(data.sectionSettings?.story),
    gallery: parseSectionSettings(data.sectionSettings?.gallery),
    wishes: parseSectionSettings(data.sectionSettings?.wishes),
    registry: parseSectionSettings(data.sectionSettings?.registry),
    closing: parseSectionSettings(data.sectionSettings?.closing),
  },
})

const oldWeddingSettings = (tenantId: string) =>
  new FirestoreWrapper<OldWeddingSettings>(
    `wedding/${tenantId}/weddingSettings`,
    `wedding/${tenantId}/weddingSettings/{weddingSettingsUid}`,
    parseOldWeddingSettings
  )

export const changeEventsToWeddingEvents = onRequest(
  { region: defaultSettings.region },
  async (_, res) => {
    const weddings = await wedding().loadCollection()
    const tenantIds = weddings.keys()

    for (const tenantId of tenantIds) {
      const oldWeddingSetting = await oldWeddingSettings(tenantId).loadDocument(
        WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID
      )

      if (oldWeddingSetting) {
        const existingEvents = structuredClone(oldWeddingSetting.events)
        const existingEventsSectionSettings = structuredClone(
          oldWeddingSetting.sectionSettings.events
        )
        if (existingEvents && existingEventsSectionSettings) {
          const updatedWeddingSetting: WeddingSettings = {
            ...oldWeddingSetting,
            weddingEvents: existingEvents,
            sectionSettings: {
              ...oldWeddingSetting.sectionSettings,
              weddingEvents: existingEventsSectionSettings,
            },
          }

          await weddingSettings(tenantId).set(
            WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID,
            parseWeddingSettings(updatedWeddingSetting)
          )
        }
      }
    }

    res.end()
  }
)
