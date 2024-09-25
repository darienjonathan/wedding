import type { Invitee } from '~/types/model/wedding/invitee'
import { type WeddingEvent, type WeddingEventRSVP } from '~/types/model/wedding/weddingEvent'
import {
  RSVPFormTypes,
  type RSVPForm,
  type RSVPFormType,
} from '~/types/model/wedding/weddingSettings'
import { useWeddingEvents } from './useWeddingEvents'

export type EventWithRSVP = WeddingEvent & { rsvp: WeddingEventRSVP }

export const useWeddingRSVP = ({
  rsvpForm,
  weddingEvents,
  invitee,
}: {
  rsvpForm: Ref<RSVPForm | null>
  weddingEvents: Ref<WeddingEvent[]>
  invitee: Ref<Invitee | null>
}) => {
  const { sortedViewableWeddingEvents } = useWeddingEvents(weddingEvents, invitee)

  const eventsWithRSVP = computed<EventWithRSVP[]>(() => {
    const invitedEventUids = invitee.value?.events.map(event => event.eventId) || []
    return sortedViewableWeddingEvents.value.filter(
      (event): event is EventWithRSVP => !!(event.rsvp && invitedEventUids.includes(event.id)),
    )
  })

  const hasRSVP = computed(() => {
    // RSVP is not enabled
    if (!rsvpForm.value?.isEnabled) return false

    // RSVP form type is not supported
    const rsvpWithForms: RSVPFormType[] = [RSVPFormTypes.externalLink, RSVPFormTypes.sheet]
    if (!rsvpWithForms.includes(rsvpForm.value.formType)) return false

    // no invitee against which RSVP action can be performed
    if (!eventsWithRSVP.value.length) return false

    return true
  })

  const rsvpAbilityMap = computed<Map<WeddingEvent['id'], boolean>>(() => {
    const now = useNuxtApp().$dayjs().unix()
    const canRSVPMap = new Map<WeddingEvent['id'], boolean>()
    eventsWithRSVP.value.forEach(event => {
      const hasPastDeadline = !!event.rsvp.deadlineTimestamp && now > event.rsvp.deadlineTimestamp
      canRSVPMap.set(event.id, !hasPastDeadline)
    })

    return canRSVPMap
  })

  return {
    hasRSVP,
    eventsWithRSVP,
    rsvpAbilityMap,
  }
}
