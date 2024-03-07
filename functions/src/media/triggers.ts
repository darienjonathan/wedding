import adminInstance from '~/lib/firebase'
import { medias } from '~/lib/firebase/firestore/collections'
import { Media } from '~/types/model/blog/media'

const deleteFile = (fileLocation: Media['fileLocation']) => {
  try {
    const storage = adminInstance.storage()
    return storage.bucket().file(fileLocation).delete()
  } catch (e) {
    return
  }
}

export const onChange = medias().trigger.onUpdate((before, after) => {
  if (!before || !after) return
  if (before.fileLocation === after.fileLocation) {
    return
  }
  return deleteFile(before.fileLocation)
})

export const onDelete = medias().trigger.onDelete(snapshot => {
  if (!snapshot) return
  return deleteFile(snapshot.fileLocation)
})
