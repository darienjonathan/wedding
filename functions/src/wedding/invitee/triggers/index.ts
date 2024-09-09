import { inviteeRSVP } from '~/lib/firebase/firestore/collections'
import { getSheets, batchUpdate, getR1C1Notation } from '~/lib/google-sheets'
import {
  invitees as inviteesFirestoreFn,
  inviteeRSVP as inviteeRSVPFirestoreFn,
} from '~/lib/firebase/firestore/collections'
import {
  HAS_RESPONDED_ROW_INDEX,
  INVITEE_INFO_COLUMN_NUM,
  START_COLUMN,
  START_ROW,
  WEDDING_EVENT_COLUMN_NUM,
  getSheetId,
  getSpreadsheet,
  getWeddingEventEntries,
} from '~/services/spreadsheet'
import { RSVPTypes } from '~/types/model/wedding/weddingEvent'
import { InviteeRSVPEvent } from '~/types/model/wedding/invitee'
import { sheets_v4 } from 'googleapis'

// on delete, delete corresponding inviteeRSVP
export const onInviteeDelete = inviteesFirestoreFn('tenantId').trigger.onDelete(
  async (_, context) => {
    const { tenantUid, inviteeUid } = context.params
    const existingInviteeRSVP = await inviteeRSVP(tenantUid).loadDocument(inviteeUid)
    if (!existingInviteeRSVP) return

    return inviteeRSVP(tenantUid).deleteDocument(inviteeUid)
  },
)

// on write, update spreadsheet's data
export const onInviteeRSVPWrite = inviteeRSVPFirestoreFn('tenantId').trigger.onWrite(
  async (_, after, context) => {
    const { tenantUid, inviteeRSVPUid } = context.params

    // get sheet id
    const sheetId = await getSheetId(tenantUid)
    if (!sheetId) return

    // get wedding events
    const weddingEventEntries = await getWeddingEventEntries(tenantUid)
    if (!weddingEventEntries?.length) return

    // get spreadsheet data
    const sheets = await getSheets()
    const rows = await getSpreadsheet({ sheets, sheetId, weddingEventEntries })
    if (!rows?.length) return

    const uidIndex = rows.findIndex(row => row[0] === inviteeRSVPUid)
    if (uidIndex === -1) return

    const rsvpEvents = after?.events.reduce<Record<string, InviteeRSVPEvent>>(
      (record, weddingEvent) => ({
        ...record,
        [weddingEvent.eventId]: weddingEvent,
      }),
      {},
    )

    const rowNum = START_ROW + uidIndex
    let currentColumn = START_COLUMN + INVITEE_INFO_COLUMN_NUM
    const inviteeRSVPResponses = weddingEventEntries
      .filter(([, { rsvp }]) => rsvp)
      .reduce<sheets_v4.Schema$ValueRange[]>(
        (responses, [uid, weddingEvent]) => {
          // calculate range
          const isDetailedRSVP = weddingEvent.rsvp!.type === RSVPTypes.detailed
          const startCell = currentColumn + (isDetailedRSVP ? 3 : 1)
          const endCell = startCell + (isDetailedRSVP ? 2 : 0)
          const range = getR1C1Notation(
            [rowNum, startCell],
            isDetailedRSVP ? [rowNum, endCell] : undefined,
          )
          currentColumn += WEDDING_EVENT_COLUMN_NUM[weddingEvent.rsvp!.type]

          // values to write to spreadsheet
          const isAttending = !!(rsvpEvents && rsvpEvents[uid]?.isAttending)
          const adult = rsvpEvents ? (rsvpEvents && rsvpEvents[uid]?.adult) || 0 : ''
          const children = rsvpEvents ? (rsvpEvents && rsvpEvents[uid]?.children) || 0 : ''
          return [
            ...responses,
            {
              range: range,
              values: [[isAttending, ...(isDetailedRSVP ? [adult, children] : [])]],
            },
          ]
        },
        [
          {
            range: getR1C1Notation([rowNum, START_COLUMN + HAS_RESPONDED_ROW_INDEX]),
            values: [[!!rsvpEvents]],
          },
        ],
      )

    await batchUpdate(sheets, sheetId, inviteeRSVPResponses)
    return
  },
)
