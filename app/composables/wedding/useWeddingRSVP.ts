import type { Invitee } from '~/types/model/wedding/invitee'
import { type WeddingEvent } from '~/types/model/wedding/weddingEvent'
import { RSVPFormTypes, type RSVP, type RSVPFormType } from '~/types/model/wedding/weddingSettings'

export const useWeddingRSVP = ({
  rsvp,
  weddingEvents,
  invitee,
}: {
  rsvp: Ref<RSVP | null>
  weddingEvents: Ref<WeddingEvent[]>
  invitee: Ref<Invitee | null>
}) => {
  const rsvpAbleEvents = computed(() => {
    const invitedEventUids = invitee.value?.events.map(event => event.eventId) || []
    return weddingEvents.value.filter(event => event.rsvp && invitedEventUids.includes(event.id))
  })

  const hasRSVP = computed(() => {
    // RSVP is not enabled
    if (!rsvp.value?.isEnabled) return false

    // RSVP form type is not supported
    const rsvpWithForms: RSVPFormType[] = [RSVPFormTypes.externalLink, RSVPFormTypes.sheet]
    if (!rsvpWithForms.includes(rsvp.value.formType)) return false

    // no invitee against which RSVP action can be performed
    if (!rsvpAbleEvents.value.length) return false

    return true
  })

  const canRSVP = computed(() => {
    const now = useNuxtApp().$dayjs().unix()
    const canRSVPMap = new Map<WeddingEvent['id'], boolean>()
    rsvpAbleEvents.value.forEach(event => {
      const hasPastDeadline = event.rsvp?.deadlineTimestamp && now > event.rsvp.deadlineTimestamp
      canRSVPMap.set(event.id, !hasPastDeadline)
    })
  })

  return {
    hasRSVP,
    canRSVP,
  }
}
