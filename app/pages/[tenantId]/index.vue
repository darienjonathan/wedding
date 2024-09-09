<template>
  <div class="wedding">
    <MPageLoading :is-loading="isLoading">
      <div ref="observerElementRef" class="buttons-intersection-observer" />
      <div class="wrapper">
        <PageHero
          class="hero"
          :wedding-settings="weddingSettings"
          :wedding-events="weddingEvents"
          :invitee="invitee"
          @nav-click="handleNavClick"
          @loading-done="handleLoadingDone"
        >
        </PageHero>
        <div v-if="weddingSettings" class="content">
          <AboutUs
            v-if="isCoupleSectionShown"
            class="about-us"
            :couple="weddingSettings.couple"
            :section-settings="weddingSettings.sectionSettings.couple"
          />
          <WeddingEvents
            ref="eventsElementRef"
            class="events"
            :wedding-events="weddingEvents"
            :invitee="invitee"
            :rsvp="weddingSettings.rsvp"
            :section-settings="weddingSettings.sectionSettings.weddingEvents"
          />
          <OurStory
            v-if="isStorySectionShown"
            class="our-story"
            :stories="weddingSettings.stories"
            :section-settings="weddingSettings.sectionSettings.story"
          />
          <ImageGallery
            v-if="isGallerySectionShown"
            class="gallery"
            :section-settings="weddingSettings.sectionSettings.gallery"
            :gallery="weddingSettings.gallery"
          />
          <div v-if="isWishesSectionShown" class="wishes__wrapper">
            <WeddingWishes
              class="wishes"
              :section-settings="weddingSettings.sectionSettings.wishes"
              :tenant-id="tenantId"
            />
          </div>
          <WeddingRegistry
            v-if="isRegistrySectionShown"
            class="registry"
            :registries="weddingSettings.registries"
            :section-settings="weddingSettings.sectionSettings.registry"
          />
          <template v-if="isClosingSectionShown">
            <div class="line" />
            <ClosingSection
              class="closing"
              :section-settings="weddingSettings.sectionSettings.closing"
            />
          </template>
          <PageFooter class="footer" :type="weddingSettings.footer.type" />
        </div>
      </div>
    </MPageLoading>
  </div>
</template>
<script lang="ts" setup>
import type EventsType from '~/components/organisms/wedding/WeddingEvents.vue'
import WeddingEvents from '~/components/organisms/wedding/WeddingEvents.vue'
import AboutUs from '~/components/organisms/wedding/AboutUs.vue'
import PageHero from '~/components/organisms/wedding/PageHero.vue'
import WeddingRegistry from '~/components/organisms/wedding/WeddingRegistry.vue'
import { useWeddingSettings } from '~/composables/wedding/useWeddingSettings'
import MPageLoading from '~~/components/molecules/MPageLoading.vue'
import ClosingSection from '~~/components/organisms/wedding/ClosingSection.vue'
import PageFooter from '~~/components/organisms/wedding/PageFooter.vue'
import ImageGallery from '~~/components/organisms/wedding/ImageGallery.vue'
import OurStory from '~~/components/organisms/wedding/OurStory.vue'
import WeddingWishes from '~~/components/organisms/wedding/WeddingWishes.vue'
import type { FetchWeddingEventsResponse } from '~/server/api/fetchWeddingEvents'
import type { FetchWeddigSettingsResponse } from '~/server/api/fetchWeddingSettings'

defineOptions({
  name: 'WeddingPage',
})

const route = useRoute()
const tenantId = Array.isArray(route.params.tenantId)
  ? route.params.tenantId[0]
  : route.params.tenantId

const inviteeUid = route.query.inviteeUid as string | undefined

// --------------------------------------------------
// Server Side
// --------------------------------------------------

const { data: response, status } = await useAsyncData<{
  weddingSettings: FetchWeddigSettingsResponse
  weddingEvents: FetchWeddingEventsResponse
}>('data', async () => {
  const [weddingSettingsResponse, weddingEventsResponse] = await Promise.all([
    $fetch(`/api/fetchWeddingSettings?tenantId=${tenantId}`),
    $fetch(`/api/fetchWeddingEvents?tenantId=${tenantId}`),
  ])

  return {
    weddingSettings: weddingSettingsResponse,
    weddingEvents: weddingEventsResponse,
  }
})

watch(
  [status],
  () => {
    if (status.value === 'error') {
      throw createError({
        fatal: true,
        statusCode: 404,
      })
    }
  },
  {
    immediate: true,
  },
)

const weddingSettings = computed(() => response.value?.weddingSettings ?? null)
const weddingEvents = computed(() => response.value?.weddingEvents ?? [])

const {
  isCoupleSectionShown,
  isStorySectionShown,
  isGallerySectionShown,
  isWishesSectionShown,
  isRegistrySectionShown,
  isClosingSectionShown,
} = useWeddingSettings(weddingSettings)

const { useInvitees } = useFirestoreCollections()
const inviteesFirestore = useInvitees(tenantId)

const { data: invitee } = useAsyncData('invitee', async () => {
  if (!inviteeUid) return null
  return inviteesFirestore.loadDocument(inviteeUid)
})

// --------------------------------------------------
// Client Side
// --------------------------------------------------

const isMounted = ref(false)
const isHeroImageLoaded = ref(false)
const isLoading = computed(() => !isMounted.value || !isHeroImageLoaded.value)

onMounted(() => {
  isMounted.value = true
})

const handleLoadingDone = () => {
  isHeroImageLoaded.value = true
}

const eventsElementRef = ref<InstanceType<typeof EventsType> | null>()
const handleNavClick = () => {
  if (!eventsElementRef.value) return
  const element = eventsElementRef.value.$el as HTMLElement
  const eventsTop = element.getBoundingClientRect().top
  scrollTo(0, eventsTop)
}

// --------------------------------------------------
// Meta Tags
// --------------------------------------------------

const { baseURL, brand } = useRuntimeConfig().public

const url = `${baseURL}/${tenantId}`

const title = computed(() => `${weddingSettings?.value?.hero.title} | ${brand}`)

const description = computed(
  () =>
    `The Wedding of ${weddingSettings.value?.hero.title} | ${weddingSettings?.value?.hero.invitationText}`,
)

const image = computed(
  () => weddingSettings.value?.ogpImageSrc || weddingSettings.value?.hero.imageSrc || '',
)

const meta = computed(() => {
  const metaArr: Record<string, string>[] = [
    {
      name: 'og:url',
      content: image.value,
    },
    {
      name: 'og:image',
      content: image.value,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
  ]

  metaArr.push(
    ...['og:title', 'twitter:title'].map(name => ({
      name,
      content: title.value,
    })),
  )
  metaArr.push(
    ...['description', 'og:description', 'twitter:description'].map(name => ({
      name,
      content: description.value,
    })),
  )
  metaArr.push(
    ...['og:image', 'twitter:image'].map(name => ({
      name,
      content: image.value,
    })),
  )
  return metaArr
})

useHead({
  title,
  meta: meta.value,
  link: [
    {
      rel: 'canonical',
      href: url,
    },
  ],
})

definePageMeta({
  layout: 'base',
})
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.wedding {
  overscroll-behavior: none;
  overflow-x: hidden;

  .loading {
    @include absolute-center;
  }

  .wrapper {
    background-color: $wedding-brown;
  }

  .hero {
    position: relative;
  }

  .content {
    position: relative;
  }

  .events,
  .about-us,
  .gallery,
  .wishes,
  .registry {
    padding: 60px 20px;
  }

  .our-story,
  .closing {
    padding: 60px 40px;
  }

  .events {
    background-image: linear-gradient(
      to bottom,
      transparent,
      rgba($wedding_brown, 1) 50%,
      rgba($wedding_brown, 1) calc(100% - 20px),
      transparent
    );
  }

  .wishes {
    &__wrapper {
      position: relative;
    }

    & {
      position: relative;
    }
  }

  .line {
    margin: 0 auto;
    height: 1px;
    width: calc(100% - 2 * 40px);
    background-color: rgba($white, 0.5);

    @include pc {
      max-width: 1200px;
    }
  }

  .footer {
    width: 100%;
    background-color: rgba($wedding-brown, 0.5);
    box-shadow: 0 2px 30px 15px rgba($white, 0.5);
  }
}
</style>
