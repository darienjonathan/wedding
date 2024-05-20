import type { WeddingSettings } from '~/types/model/wedding/weddingSettings'

export const useWeddingSettings = (weddingSettings: Ref<WeddingSettings | null>) => {
  const getIsSectionShown = (sectionKey: keyof WeddingSettings['sectionSettings']) => {
    const section = weddingSettings.value?.sectionSettings[sectionKey]
    if (!section?.isEnabled) return false

    // TODO: check for invitee existence
    return !section.isExclusiveToInvitees
  }

  const isWeddingEventsSectionShown = computed(
    () => getIsSectionShown('weddingEvents') && weddingSettings.value?.weddingEvents.length,
  )

  const isCoupleSectionShown = computed(() => {
    if (!getIsSectionShown('couple')) return false
    return weddingSettings.value?.couple.length === 2
  })

  const isStorySectionShown = computed(
    () => getIsSectionShown('story') && weddingSettings.value?.stories.length,
  )

  const isGallerySectionShown = computed(
    () => getIsSectionShown('gallery') && weddingSettings.value?.gallery.imageSrcs.length,
  )

  const isWishesSectionShown = computed(() => getIsSectionShown('wishes'))

  const isRegistrySectionShown = computed(
    () => getIsSectionShown('registry') && weddingSettings.value?.registries.length,
  )

  const isClosingSectionShown = computed(() => getIsSectionShown('closing'))

  return {
    isWeddingEventsSectionShown,
    isCoupleSectionShown,
    isStorySectionShown,
    isGallerySectionShown,
    isWishesSectionShown,
    isRegistrySectionShown,
    isClosingSectionShown,
  }
}
