import { google, sheets_v4 } from 'googleapis'

const credentials = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseCellValue = (val: any) => {
  if (val === 'FALSE') return false
  if (val === 'TRUE') return true
  return val
}

export const getSheets = (): Promise<sheets_v4.Sheets> => {
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return new Promise((resolve, reject) =>
    auth.authorize(err => {
      if (err) reject(err)

      const sheets = google.sheets({ version: 'v4', auth })
      resolve(sheets)
    })
  )
}

export const batchUpdate = async (
  sheets: sheets_v4.Sheets,
  data: sheets_v4.Schema$ValueRange[]
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
  range?: string
): Promise<sheets_v4.Schema$ValueRange['values']> => {
  if (!range) return

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
  })

  return res.data.values
}
