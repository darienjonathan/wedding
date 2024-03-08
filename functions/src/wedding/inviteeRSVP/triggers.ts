import FirestoreTrigger from '~/lib/firebase/firestore/FirestoreTrigger'
import { getSheetRows, getSheets, batchUpdate } from '~/lib/google-sheets'
import { parseInviteeRSVP } from '~/types/model/wedding/invitee'

const inviteeRSVPTrigger = new FirestoreTrigger(
  'wedding/{tenantId}/inviteeRSVP/{inviteeRSVPUid}',
  parseInviteeRSVP
)

// on write, update spreadsheet's data
export const onWrite = inviteeRSVPTrigger.onWrite(async (_, after, context) => {
  const { inviteeRSVPUid } = context.params

  const sheets = await getSheets()

  // fetch uids only to find the corresponding row to update
  const range = `${process.env.START_COLUMN}${process.env.START_ROW}:${process.env.END_COLUMN}${process.env.END_ROW}`
  const rows = await getSheetRows(sheets, range)

  if (!rows?.length) return

  const uidIndex = rows.findIndex(row => row[0] === inviteeRSVPUid)
  if (uidIndex === -1) return

  const isDelete = after === undefined
  const values = isDelete
    ? [false, false, '', '', '', '']
    : [
        true,
        after.isAttendingReception,
        after.name,
        after.phoneNumber,
        after.adultGuestNumber,
        after.childrenGuestNumber,
      ]

  const rowNumber = Number(process.env.START_ROW) + uidIndex
  const data = [
    {
      range: `${process.env.INVITEE_RSVP_START_COLUMN}${rowNumber}:${process.env.END_COLUMN}${rowNumber}`,
      values: [values],
    },
  ]

  return batchUpdate(sheets, data)
})
