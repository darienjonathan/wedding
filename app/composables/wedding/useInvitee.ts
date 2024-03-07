import type { Invitee, InviteeRSVP } from '~/types/model/wedding/invitee'

import type { InvitationType, RSVP } from '~/types/model/wedding/weddingSettings'

const getIsReceptionInvitation = (invitationType?: InvitationType) => invitationType === 'reception'
const getIsMatrimonyInvitation = (invitationType?: InvitationType) => invitationType === 'matrimony'
const getIsNotInvited = (invitationType?: InvitationType) =>
  !invitationType || !['reception', 'matrimony'].includes(invitationType)

export const useInvitee = (
  invitee: Ref<Invitee | null>,
  inviteeRSVP: Ref<InviteeRSVP | null>,
  rsvpSettings: Ref<RSVP | null>
) => {
  const dayjs = useNuxtApp().$dayjs

  const isBeforeRSVPDeadline = computed(() => {
    if (!rsvpSettings.value?.isEnabled) return false

    return (
      !!rsvpSettings.value?.deadlineTimestamp &&
      dayjs().isSameOrBefore(dayjs(rsvpSettings.value?.deadlineTimestamp))
    )
  })

  const hasDeclinedReceptionInvitation = computed(
    () =>
      getIsReceptionInvitation(invitee.value?.invitationType) &&
      !isBeforeRSVPDeadline.value &&
      inviteeRSVP.value?.isAttendingReception === false
  )

  const isReceptionInvitation = computed(() => {
    return (
      getIsReceptionInvitation(invitee.value?.invitationType) &&
      !hasDeclinedReceptionInvitation.value
    )
  })

  const isMatrimonyInvitation = computed(
    () =>
      getIsMatrimonyInvitation(invitee.value?.invitationType) ||
      hasDeclinedReceptionInvitation.value
  )

  const isNotInvited = computed(() => getIsNotInvited(invitee.value?.invitationType))

  const isRSVPActionsDoable = computed(
    () => rsvpSettings.value?.isEnabled && isReceptionInvitation.value
  )

  const canRSVP = computed<boolean>(() => {
    if (!isRSVPActionsDoable.value) return false
    return !inviteeRSVP.value
  })

  const canEditRSVP = computed<boolean>(() => {
    if (!isRSVPActionsDoable.value) return false
    return !!inviteeRSVP.value && isBeforeRSVPDeadline.value
  })

  const canReviewRSVP = computed<boolean>(() => {
    if (!isRSVPActionsDoable.value) return false
    return !!inviteeRSVP.value
  })

  const shouldContact = computed<boolean>(() => {
    if (!isRSVPActionsDoable.value) return false
    if (canRSVP || canEditRSVP) return false
    return !isBeforeRSVPDeadline.value
  })

  const rsvpDeadlineString = computed(() => {
    if (!isRSVPActionsDoable) return ''
    if (!rsvpSettings.value?.deadlineTimestamp) return ''

    return dayjs(rsvpSettings.value?.deadlineTimestamp).format('MMMM D, YYYY')
  })

  return {
    isBeforeRSVPDeadline,
    isReceptionInvitation,
    isMatrimonyInvitation,
    isNotInvited,
    canRSVP,
    canEditRSVP,
    canReviewRSVP,
    shouldContact,
    rsvpDeadlineString,
  }
}
