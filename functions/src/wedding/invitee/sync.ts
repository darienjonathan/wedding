import { Invitee, InviteeRSVP, parseInvitee, parseInviteeRSVP } from '~/types/model/wedding/invitee'
import {
  invitees as inviteesFirestoreFn,
  inviteeRSVP as inviteeRSVPFirestoreFn,
} from '~/lib/firebase/firestore/collections'
import { getSheetRows, getSheets, parseCellValue } from '~/lib/google-sheets'
import { onRequest } from 'firebase-functions/v2/https'
import FirestoreCollection from '~/lib/firebase/firestore/Firestore'

const inviteePropertyIndexes: ('uid' | keyof Invitee)[] = [
  'uid',
  'databaseName',
  'databasePhoneNumber',
  'invitationType',
  'inviteePrefix',
  'inviteeSuffix',
  'adultGuestNumber',
  'childrenGuestNumber',
]

const inviteeRSVPPropertyIndexes: (keyof InviteeRSVP)[] = [
  'isAttendingReception',
  'name',
  'phoneNumber',
  'adultGuestNumber',
  'childrenGuestNumber',
]

const getInviteeRSVPIndexOffset = () => {
  if (!process.env.INVITEE_RSVP_START_COLUMN || !process.env.START_COLUMN) return 0
  return (
    process.env.INVITEE_RSVP_START_COLUMN.charCodeAt(0) - process.env.START_COLUMN.charCodeAt(0)
  )
}

const getInviteeMapFromSpreadsheet = async () => {
  const sheets = await getSheets()

  const range = `${process.env.START_COLUMN}${process.env.START_ROW}:${process.env.END_COLUMN}${process.env.END_ROW}`
  const rows = (await getSheetRows(sheets, range)) || []

  const inviteeMap = new Map<string, Invitee>()
  const inviteeRSVPMap = new Map<string, InviteeRSVP>()

  rows.forEach(row => {
    if (!row.some(cell => !!cell)) return

    const inviteeUid = row[0]
    if (!inviteeUid) return

    // create Invitee object from spreadsheet data
    const invitee = inviteePropertyIndexes.reduce<Invitee>(
      (result, property, index) => ({
        ...result,
        [property]: parseCellValue(row[index]),
      }),
      parseInvitee({})
    )
    inviteeMap.set(inviteeUid, parseInvitee(invitee))

    // create InviteeRSVP object from spreadsheet data
    const inviteeRSVPIndexOffset = getInviteeRSVPIndexOffset()

    const hasResponded = row[inviteeRSVPIndexOffset] === 'TRUE'
    if (!hasResponded) return

    const inviteeRSVP = inviteeRSVPPropertyIndexes.reduce<InviteeRSVP>(
      (result, property, index) => ({
        ...result,
        [property]: parseCellValue(row[index + inviteeRSVPIndexOffset + 1]),
      }),
      parseInviteeRSVP({})
    )
    inviteeRSVPMap.set(inviteeUid, parseInviteeRSVP(inviteeRSVP))
  })

  return {
    inviteeMap,
    inviteeRSVPMap,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const syncSpreadsheetToFirestore = async <T extends Record<string, any>>(
  spreadsheetMap: Map<string, T>,
  firestoreInstance: FirestoreCollection<T>
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

export const sync = onRequest(async (_, res) => {
  const inviteesFirestore = inviteesFirestoreFn()
  const inviteeRSVPFirestore = inviteeRSVPFirestoreFn()

  const { inviteeMap: inviteeMapFromSpreadsheet, inviteeRSVPMap: inviteeRSVPMapFromSpreadsheet } =
    await getInviteeMapFromSpreadsheet()

  await syncSpreadsheetToFirestore(inviteeMapFromSpreadsheet, inviteesFirestore)
  await syncSpreadsheetToFirestore(inviteeRSVPMapFromSpreadsheet, inviteeRSVPFirestore)

  res.end()
})
