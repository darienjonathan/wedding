import { google, sheets_v4 } from 'googleapis'
import { serviceAccount } from '~/credentials/serviceAccount'

type Cell = [number, number]

const cellToR1C1 = ([row, col]: Cell) => `R${row}C${col}`
export const getR1C1Notation = (startCell: Cell, endCell?: Cell) =>
  `${process.env.SHEET_NAME}!${cellToR1C1(startCell)}${endCell ? `:${cellToR1C1(endCell)}` : ''}`

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
  spreadsheetId: string,
  data: sheets_v4.Schema$ValueRange[],
) => {
  const request: sheets_v4.Params$Resource$Spreadsheets$Values$Batchupdate = {
    spreadsheetId,
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
  spreadsheetId: string,
  range: string,
): Promise<sheets_v4.Schema$ValueRange['values']> => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  return res.data.values
}
