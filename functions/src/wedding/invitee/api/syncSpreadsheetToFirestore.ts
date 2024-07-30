import type {
  Invitee,
  InviteeEvent,
  InviteeRSVP,
  InviteeRSVPEvent,
} from '~/types/model/wedding/invitee'
import { parseInvitee, parseInviteeRSVP } from '~/types/model/wedding/invitee'
import {
  invitees as inviteesFirestoreFn,
  inviteeRSVP as inviteeRSVPFirestoreFn,
} from '~/lib/firebase/firestore/collections'
import { batchUpdate, getR1C1Notation, getSheets } from '~/lib/google-sheets'
import { onRequest } from 'firebase-functions/v2/https'
import FirestoreCollection from '~/lib/firebase/firestore/Firestore'
import { parseSearchParams } from '~/lib/firebase/cloudFunction'
import { RSVPTypes, WeddingEvent } from '~/types/model/wedding/weddingEvent'
import { defaultSettings } from '~/lib/firebase/functions'
import { sheets_v4 } from 'googleapis'
import {
  INVITEE_INFO_COLUMN_NUM,
  START_COLUMN,
  START_ROW,
  WEDDING_EVENT_COLUMN_NUM,
  getSheetId,
  getSpreadsheet,
  getWeddingEventEntries,
} from '~/services/spreadsheet'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const syncToFirestore = async <T extends Record<string, any>>(
  spreadsheetMap: Map<string, T>,
  firestoreInstance: FirestoreCollection<T>,
) => {
  const firestoreCollectionMap = await firestoreInstance.loadCollection()

  // remove data that don't exist in spreadsheet from firestore
  const uidsToDeleteFromCollection: string[] = []
  for (const uid of firestoreCollectionMap.keys()) {
    if (!spreadsheetMap.has(uid)) {
      uidsToDeleteFromCollection.push(uid)
    }
  }

  if (uidsToDeleteFromCollection.length) {
    await firestoreInstance.bulkDelete(uidsToDeleteFromCollection)
  }

  // add data from spreadsheet to firestore
  await firestoreInstance.bulkInsertMap(spreadsheetMap)
}

const makeInvitees = async ({
  inviteesFirestore,
  rows,
  weddingEventEntries,
}: {
  inviteesFirestore: FirestoreCollection<Invitee>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[][]
  weddingEventEntries: [string, WeddingEvent][]
}): Promise<{
  newInviteeUids: sheets_v4.Schema$ValueRange[]
  inviteeMap: Map<string, Invitee>
  inviteeRSVPMap: Map<string, InviteeRSVP>
}> => {
  // new uids to write to spreadsheet
  const newInviteeUids: sheets_v4.Schema$ValueRange[] = []

  // invitee, inviteeRSVP map
  const inviteeMap = new Map<string, Invitee>()
  const inviteeRSVPMap = new Map<string, InviteeRSVP>()

  rows.forEach((row, rowIndex) => {
    if (!row.some(cell => !!cell)) return

    // check if invitee data exists
    const existingInviteeUid = row[0]
    const name = row[1]
    if (!existingInviteeUid && !name) return

    const inviteeUid = existingInviteeUid || inviteesFirestore.newId

    // save new uids to write to spreadsheet
    if (!existingInviteeUid) {
      newInviteeUids.push({
        range: getR1C1Notation([START_ROW + rowIndex, START_COLUMN]),
        values: [[inviteeUid]],
      })
    }

    // events for invitee
    const inviteeEvents: Invitee['events'] = []
    const inviteeRSVPEvents: InviteeRSVP['events'] = []

    let eventColumn = INVITEE_INFO_COLUMN_NUM
    weddingEventEntries.forEach(([uid, weddingEvent]: [string, WeddingEvent], index) => {
      if (!weddingEvent.rsvp) return
      const previousWeddingEventType = weddingEventEntries[index - 1]?.[1].rsvp?.type
      eventColumn += previousWeddingEventType
        ? WEDDING_EVENT_COLUMN_NUM[previousWeddingEventType]
        : 0

      const isInvited = row[eventColumn]
      if (!isInvited) return

      const isDetailedRSVP = weddingEvent.rsvp.type === RSVPTypes.detailed

      // invitee data
      const inviteeEvent: InviteeEvent = {
        eventId: uid,
        ...(isDetailedRSVP && {
          // || 0: just in case if adult or children is not included in response due to empty column
          adult: row[eventColumn + 1] || 0,
          children: row[eventColumn + 2] || 0,
        }),
      }
      inviteeEvents.push(inviteeEvent)

      // inviteeRSVP data
      const inviteeRSVPColumnStart = eventColumn + (isDetailedRSVP ? 3 : 1)
      const isAttending = row[inviteeRSVPColumnStart]
      const inviteeRSVPEvent: InviteeRSVPEvent = {
        eventId: uid,
        isAttending,
        ...(isDetailedRSVP &&
          isAttending && {
            // || 0: just in case if adult or children is not included in response due to empty column
            adult: row[inviteeRSVPColumnStart + 1] || 0,
            children: row[inviteeRSVPColumnStart + 2] || 0,
          }),
      }
      inviteeRSVPEvents.push(inviteeRSVPEvent)
    })

    const invitee: Invitee = { name, contact: row[2], events: inviteeEvents }
    const inviteeRSVP: InviteeRSVP = { events: inviteeRSVPEvents }
    inviteeMap.set(inviteeUid, parseInvitee(invitee))
    inviteeRSVPMap.set(inviteeUid, parseInviteeRSVP(inviteeRSVP))
  })

  return {
    newInviteeUids,
    inviteeMap,
    inviteeRSVPMap,
  }
}

export const syncSpreadsheetToFirestore = onRequest(
  { region: defaultSettings.region },
  async (req, res) => {
    const tenantId = parseSearchParams(req.query.tenantId)

    if (!tenantId) {
      res.end()
      return
    }

    // get sheet id
    const sheetId = await getSheetId(tenantId)
    if (!sheetId) {
      res.end()
      return
    }

    // get wedding events
    const weddingEventEntries = await getWeddingEventEntries(tenantId)
    if (!weddingEventEntries?.length) {
      res.end()
      return
    }

    // get spreadsheet data
    const sheets = await getSheets()
    const rows = await getSpreadsheet({ sheets, sheetId, weddingEventEntries })
    if (!rows?.length) {
      res.end()
      return
    }

    // firestore
    const inviteesFirestore = inviteesFirestoreFn(tenantId)
    const inviteeRSVPFirestore = inviteeRSVPFirestoreFn(tenantId)

    const { newInviteeUids, inviteeMap, inviteeRSVPMap } = await makeInvitees({
      inviteesFirestore,
      rows,
      weddingEventEntries,
    })

    await batchUpdate(sheets, sheetId, newInviteeUids)
    await syncToFirestore(inviteeMap, inviteesFirestore)
    await syncToFirestore(inviteeRSVPMap, inviteeRSVPFirestore)

    res.end()
  },
)
