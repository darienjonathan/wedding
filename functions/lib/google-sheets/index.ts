import { google, sheets_v4 } from 'googleapis'
import { serviceAccount } from '~/credentials/serviceAccount'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseCellValue = (val: any) => {
  if (val === 'FALSE') return false
  if (val === 'TRUE') return true
  return val
}

export const getSheets = (): Promise<sheets_v4.Sheets> => {
  const auth = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return new Promise((resolve, reject) =>
    auth.authorize(err => {
      if (err) reject(err)

      const sheets = google.sheets({ version: 'v4', auth })
      resolve(sheets)
    }),
  )
}

export const batchUpdate = async (
  sheets: sheets_v4.Sheets,
  data: sheets_v4.Schema$ValueRange[],
) => {
  const request: sheets_v4.Params$Resource$Spreadsheets$Values$Batchupdate = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    requestBody: {
      data,
      valueInputOption: 'RAW',
    },
  }

  return sheets.spreadsheets.values.batchUpdate(request).catch(err => {
    console.log(err)
  })
}

export const getSheetRows = async (
  sheets: sheets_v4.Sheets,
  range?: string,
): Promise<sheets_v4.Schema$ValueRange['values']> => {
  if (!range) return

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
  })

  return res.data.values
}
