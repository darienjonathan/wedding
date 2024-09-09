import type { Invitee } from '~/types/model/wedding/invitee'
import type { WeddingEvent } from '~/types/model/wedding/weddingEvent'

export const useWeddingEvents = (
  weddingEvents: Ref<WeddingEvent[]>,
  invitee: Ref<Invitee | null | undefined>,
) => {
  const sortedViewableWeddingEvents = computed<WeddingEvent[]>(() => {
    const inviteeEventIds = invitee.value?.events.map(event => event.eventId) || []
    return [...weddingEvents.value]
      .sort((a, b) => a.order - b.order)
      .filter(weddingEvent => {
        if (!weddingEvent.isExclusiveToInvitees) return true
        return inviteeEventIds.includes(weddingEvent.id)
      })
  })

  return {
    sortedViewableWeddingEvents,
  }
}
