import { roles, userInfo, users } from '~/lib/firebase/firestore/collections'
import FirestoreQueryBuilder from '~/lib/firebase/firestore/FirestoreQueryBuilder'
import getFunctions from '~/lib/firebase/getFunctions'
import { Role } from '~/types/model/blog/role'
import { UserInfo } from '~/types/model/user'

const getRoleUid = async (roleName: string) => {
  const role = await roles().loadDocumentByQuery(
    new FirestoreQueryBuilder<Role>().eq('name', roleName)
  )
  if (!role) return
  return role.id
}

export const onCreate = getFunctions()
  .auth.user()
  .onCreate(async user => {
    try {
      if (!user.email) {
        throw new Error('Invalid User Data')
      }
      const roleUid = await getRoleUid('user')
      if (!roleUid) {
        throw new Error('No User Role')
      }
      const emailRegex = /^(.*?)@.*$/.exec(user.email)
      if (!emailRegex) {
        throw new Error('Invalid Email')
      }
      users().set(user.uid, {
        username: emailRegex[1],
        roleUid,
      })
      return userInfo().set(user.uid, {
        email: user.email,
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      return err
    }
  })

export const onDelete = getFunctions()
  .auth.user()
  .onDelete(async user => {
    try {
      if (!user.email) {
        throw new Error('Invalid User Data')
      }
      const userInfoCollection = userInfo()
      const userInfoDocument = await userInfoCollection.loadDocumentByQuery(
        new FirestoreQueryBuilder<UserInfo>().eq('email', user.email)
      )
      if (!userInfoDocument) {
        throw new Error('No User Document')
      }
      userInfoCollection.deleteDocument(userInfoDocument.id)
      return users().deleteDocument(userInfoDocument.id)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      return err
    }
  })
