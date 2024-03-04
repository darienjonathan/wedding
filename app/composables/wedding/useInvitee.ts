import { Invitee, InviteeRSVP } from 'types/model/wedding/invitee'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import type { InvitationType } from '~/types/model/wedding/invitee'
dayjs.extend(isSameOrBefore)

const getIsReceptionInvitation = (invitationType?: InvitationType) => invitationType === 'reception'
const getIsMatrimonyInvitation = (invitationType?: InvitationType) => invitationType === 'matrimony'
const getIsNotInvited = (invitationType?: InvitationType) =>
  !invitationType || !['reception', 'matrimony'].includes(invitationType)

export const useInvitee = (invitee: Ref<Invitee | null>, inviteeRSVP: Ref<InviteeRSVP | null>) => {
  const config = useRuntimeConfig().public.wedding
  const isBeforeRSVPDeadline = computed(() =>
    dayjs().isSameOrBefore(dayjs.unix(config.rsvpDeadline))
  )

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

  const canRSVP = computed<boolean>(() => {
    if (!isReceptionInvitation.value) return false
    return !inviteeRSVP.value
  })

  const canEditRSVP = computed<boolean>(() => {
    if (!isReceptionInvitation.value) return false
    return !!inviteeRSVP.value && isBeforeRSVPDeadline.value
  })

  const canReviewRSVP = computed<boolean>(() => {
    if (!isReceptionInvitation.value) return false
    return !!inviteeRSVP.value
  })

  const shouldContact = computed<boolean>(() => {
    if (!isReceptionInvitation.value) return false
    if (canRSVP || canEditRSVP) return false
    return !isBeforeRSVPDeadline.value
  })

  const rsvpDeadlineString = computed(() => dayjs.unix(config.rsvpDeadline).format('MMMM D, YYYY'))

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
