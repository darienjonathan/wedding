import FirestoreTrigger from '~/lib/firebase/firestore/FirestoreTrigger'
import { inviteeRSVP } from '~/lib/firebase/firestore/collections'
import { parseInvitee } from '~/types/model/wedding/invitee'

const inviteeTrigger = new FirestoreTrigger(
  'wedding/{tenantId}/invitees/{inviteeUid}',
  parseInvitee
)

// on delete, delete corresponding inviteeRSVP
export const onDelete = inviteeTrigger.onDelete(async (_, context) => {
  const { tenantId, inviteeUid } = context.params
  const existingInviteeRSVP = await inviteeRSVP(tenantId).loadDocument(inviteeUid)
  if (!existingInviteeRSVP) return

  return inviteeRSVP(tenantId).deleteDocument(inviteeUid)
})
