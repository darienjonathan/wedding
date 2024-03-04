import { invitees, inviteeRSVP } from '~/lib/firebase/firestore/collections'

// on delete, delete corresponding inviteeRSVP
export const onDelete = invitees().trigger.onDelete(async (_, context) => {
  const { inviteeUid } = context.params
  const existingInviteeRSVP = await inviteeRSVP().loadDocument(inviteeUid)
  if (!existingInviteeRSVP) return

  return inviteeRSVP().deleteDocument(inviteeUid)
})
