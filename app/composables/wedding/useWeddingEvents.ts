import type { Invitee } from '~/types/model/wedding/invitee'
import type { WeddingEvent } from '~/types/model/wedding/weddingEvent'

export const useWeddingEvents = (
  weddingEventsRecord: Ref<Record<string, WeddingEvent> | null | undefined>,
  invitee: Ref<Invitee | null | undefined>,
) => {
  const sortedWeddingEventsMap = computed(() => {
    const weddingEventsMap = new Map<string, WeddingEvent>()
    const sortedWeddingEvents = [...Object.entries(weddingEventsRecord.value || {})].sort(
      ([_, a], [__, b]) => a.order - b.order,
    )
    sortedWeddingEvents.forEach(([k, v]) => weddingEventsMap.set(k, v))

    return weddingEventsMap
  })

  const sortedViewableWeddingEvents = computed<WeddingEvent[]>(() => {
    const inviteeEventIds = invitee.value?.events.map(event => event.eventId) || []
    return [...sortedWeddingEventsMap.value.entries()]
      .filter(([weddingEventUid, weddingEvent]) => {
        if (!weddingEvent.isExclusiveToInvitees) return true
        return inviteeEventIds.includes(weddingEventUid)
      })
      .map(([_, weddingEvent]) => weddingEvent)
  })

  return {
    sortedViewableWeddingEvents,
  }
}
