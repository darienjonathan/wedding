import { Invitee, InviteeRSVP } from 'types/model/wedding/invitee'
import { InvitationType, WeddingSettings } from 'types/model/wedding/weddingSettings'
import { useInvitee } from '~/composables/wedding/useInvitee'

export const useWeddingSettings = (
  weddingSettings: Ref<WeddingSettings | null>,
  invitee: Ref<Invitee | null>,
  inviteeRSVP: Ref<InviteeRSVP | null>
) => {
  const { isMatrimonyInvitation, isReceptionInvitation } = useInvitee(
    invitee,
    inviteeRSVP,
    computed(() => weddingSettings.value?.rsvp || null)
  )

  const getIsSectionShown = (sectionKey: keyof WeddingSettings['sectionSettings']) => {
    const section = weddingSettings.value?.sectionSettings[sectionKey]
    if (!section?.isEnabled) return false

    return !section.isExclusiveToInvitees || !!invitee
  }

  const eventSectionShowStates = computed<Record<NonNullable<InvitationType>, boolean>>(() => {
    const section = weddingSettings.value?.sectionSettings.event
    if (!section?.isEnabled) {
      return {
        matrimony: false,
        reception: false,
      }
    }

    if (!section.isExclusiveToInvitees) {
      return {
        matrimony: true,
        reception: true,
      }
    }

    return {
      matrimony: isMatrimonyInvitation.value,
      reception: isReceptionInvitation.value,
    }
  })

  const isEventSectionShown = computed(() =>
    weddingSettings.value?.events.some(weddingEvent =>
      weddingEvent.type ? eventSectionShowStates.value[weddingEvent.type] === true : true
    )
  )

  const isCoupleSectionShown = computed(() => {
    if (!getIsSectionShown('couple')) return false
    return weddingSettings.value?.couple.length === 2
  })

  const isStorySectionShown = computed(
    () => getIsSectionShown('story') && weddingSettings.value?.stories.length
  )

  const isGallerySectionShown = computed(
    () => getIsSectionShown('gallery') && weddingSettings.value?.gallery.imageSrcs.length
  )

  const isWishesSectionShown = computed(() => getIsSectionShown('wishes'))

  const isRegistrySectionShown = computed(() => {
    console.log(getIsSectionShown('registry'), JSON.parse(JSON.stringify(weddingSettings.value)))
    return getIsSectionShown('registry') && weddingSettings.value?.registries.length
  })

  const isClosingSectionShown = computed(() => getIsSectionShown('closing'))

  return {
    eventSectionShowStates,
    isEventSectionShown,
    isCoupleSectionShown,
    isStorySectionShown,
    isGallerySectionShown,
    isWishesSectionShown,
    isRegistrySectionShown,
    isClosingSectionShown,
  }
}
