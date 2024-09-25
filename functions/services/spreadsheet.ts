import { sheets_v4 } from 'googleapis'
import {
  weddingSettings as weddingSettingsFirestoreFn,
  weddingEvents as weddingEventsFirestoreFn,
  WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID,
} from '~/lib/firebase/firestore/collections'
import { getR1C1Notation, getSheetRows, parseCellValue } from '~/lib/google-sheets'
import { RSVPType, RSVPTypes, WeddingEvent } from '~/types/model/wedding/weddingEvent'
import { RSVPFormTypes } from '~/types/model/wedding/weddingSettings'

export const START_ROW = 3 // Start from invitee UID
export const HAS_RESPONDED_ROW_INDEX = 4

export const START_COLUMN = 2 // Start from wedding event UID

export const INVITEE_INFO_COLUMN_NUM = 5
export const WEDDING_EVENT_COLUMN_NUM: Record<RSVPType, number> = {
  [RSVPTypes.simple]: 2,
  [RSVPTypes.detailed]: 6,
}

const EVENTS_START_COLUMN = START_COLUMN + INVITEE_INFO_COLUMN_NUM

const END_ROW = START_ROW + 50

export const getSheetId = async (tenantId: string) => {
  // firestore
  const weddingSettingsFirestore = weddingSettingsFirestoreFn(tenantId)

  // get sheet id
  const weddingSettings = await weddingSettingsFirestore.loadDocument(
    WEDDING_SETTINGS_SINGLETON_DOCUMENT_ID,
  )
  return (
    weddingSettings?.rsvpForm.formType === RSVPFormTypes.sheet && weddingSettings.rsvpForm.content
  )
}

export const getWeddingEventEntries = async (
  tenantId: string,
): Promise<[string, WeddingEvent][]> => {
  // firestore
  const weddingEventsFirestore = weddingEventsFirestoreFn(tenantId)

  const weddingEventMap = await weddingEventsFirestore.loadCollection()
  return [...Array.from(weddingEventMap.entries())].sort((a, b) => a[1].order - b[1].order)
}

export const getSpreadsheet = async ({
  sheets,
  sheetId,
  weddingEventEntries,
}: {
  sheets: sheets_v4.Sheets
  sheetId: string
  weddingEventEntries: [string, WeddingEvent][]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any[][] | undefined> => {
  // get wedding events
  const weddingEventsColumnLength = weddingEventEntries.reduce(
    (count, [, weddingEvent]: [string, WeddingEvent]) =>
      count + (weddingEvent.rsvp ? WEDDING_EVENT_COLUMN_NUM[weddingEvent.rsvp.type] : 0),
    -1, // initial value is -1 because the first event column is not counted
  )

  // get spreadsheet data
  const range = getR1C1Notation(
    [START_ROW, START_COLUMN],
    [END_ROW, EVENTS_START_COLUMN + weddingEventsColumnLength],
  )
  const rows = ((await getSheetRows(sheets, sheetId, range)) || []).map(row =>
    row.map(parseCellValue),
  )

  return rows
}
