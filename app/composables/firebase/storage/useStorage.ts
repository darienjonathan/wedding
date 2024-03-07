import {
  deleteObject,
  listAll,
  ref as reference,
  StorageReference,
  StringFormat,
  uploadBytes,
  UploadMetadata,
  uploadString,
} from 'firebase/storage'
import { getBase64Mime } from '~/utils/getMime'

interface PutArgs<T extends File | string> {
  file: T
  fileName: string
  customMetadata?: UploadMetadata['customMetadata']
}

interface PutStringArgs extends PutArgs<string> {
  stringFormat?: StringFormat
}

export const useStorage = (path = '', allowedTypes?: string[]) => {
  const { instance: storage, getDownloadURL: storageGetDownloadURL } =
    useNuxtApp().$firebase.storage

  const getFileRef = (fileName = ''): StorageReference =>
    reference(storage, [path, fileName].filter(v => v).join('/'))

  const validate = (type: string): boolean => (allowedTypes ? allowedTypes.includes(type) : true)

  const authorUidMetadata = (authorUid: string) => ({
    authorUid,
  })

  const createMetadata = (
    customMetadata: UploadMetadata['customMetadata'],
    type: string | undefined
  ): UploadMetadata => {
    return {
      ...customMetadata,
      ...(type && { contentType: type }),
    }
  }

  const getDownloadURL = (fileName: string): Promise<string> =>
    storageGetDownloadURL(getFileRef(fileName).fullPath)

  const list = () => listAll(getFileRef())

  const put = async ({ file, fileName, customMetadata }: PutArgs<File>) => {
    const isValidated = validate(file.type)
    if (!isValidated) {
      throw new Error('File validation failed')
    }
    try {
      const metadata = createMetadata(customMetadata, file.type)
      const snapshot = await uploadBytes(getFileRef(fileName), file, metadata)
      return snapshot
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }

  const putString = async ({
    file,
    fileName,
    stringFormat = StringFormat.RAW,
    customMetadata,
  }: PutStringArgs) => {
    let metadata: UploadMetadata | undefined = customMetadata
    if (stringFormat === StringFormat.BASE64) {
      const type = getBase64Mime(file)
      const isValidated = validate(type)
      if (!isValidated) {
        throw new Error('File validation failed')
      }
      metadata = createMetadata(customMetadata, type)
    }
    try {
      const snapshot = await uploadString(getFileRef(fileName), file, stringFormat, metadata)
      return snapshot
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e)
    }
  }

  const deleteItem = (fileName: string) => deleteObject(getFileRef(fileName))

  return {
    authorUidMetadata,
    getDownloadURL,
    list,
    put,
    putString,
    deleteItem,
  }
}
