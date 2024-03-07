import { onCreate as onUserCreate, onDelete as onUserDelete } from 'src/auth/triggers'
import { onChange as onMediaChange, onDelete as onMediaDelete } from 'src/media/triggers'

// Wedding
import { sync as syncWeddingInvitees } from '~/src/wedding/invitee/sync'
import { onDelete as onInviteeDelete } from '~/src/wedding/invitee/triggers'
import { onWrite as onInviteeRSVPWrite } from '~/src/wedding/inviteeRSVP/triggers'

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export {
  onUserCreate,
  onUserDelete,
  onMediaChange,
  onMediaDelete,

  // Wedding
  syncWeddingInvitees,
  onInviteeDelete,
  onInviteeRSVPWrite,
}
