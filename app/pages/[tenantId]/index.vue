<template lang="pug">
.wedding
  MPageLoading(:is-loading="isLoading")
    .buttons-intersection-observer(ref="observerElementRef")
    .wrapper
      Hero.hero(
        :weddingSettings="weddingSettings"
        :weddingEvents="weddingEvents"
        @nav-click="handleNavClick"
        @loading-done="handleLoadingDone"
      )
      .content(v-if="weddingSettings")
        AboutUs.about-us(
          v-if="isCoupleSectionShown"
          :couple="weddingSettings.couple"
          :sectionSettings="weddingSettings.sectionSettings.couple"
        )
        Events.events(
          v-if="isWeddingEventsSectionShown && weddingEvents"
          :weddingEventsRecord="weddingEvents"
          :rsvp="weddingSettings.rsvp"
          :sectionSettings="weddingSettings.sectionSettings.weddingEvents"
          ref="eventsElementRef"
        )
        OurStory.our-story(
          v-if="isStorySectionShown"
          :stories="weddingSettings.stories"
          :sectionSettings="weddingSettings.sectionSettings.story"
        )
        Gallery.gallery(
          v-if="isGallerySectionShown"
          :sectionSettings="weddingSettings.sectionSettings.gallery"
          :gallery="weddingSettings.gallery"
        )
        .wishes__wrapper(v-if="isWishesSectionShown")
          Wishes.wishes(
            :sectionSettings="weddingSettings.sectionSettings.wishes"
            :tenantId="tenantId"
          )
        Registry.registry(
          v-if="isRegistrySectionShown"
          :registries="weddingSettings.registries"
          :sectionSettings="weddingSettings.sectionSettings.registry"
        )
        template(v-if="isClosingSectionShown")
          .line
          Closing.closing(:sectionSettings="weddingSettings.sectionSettings.closing")
        Footer.footer(:type="weddingSettings.footer.type")
</template>
<script lang="ts" setup>
import type EventsType from '~/components/organisms/wedding/Events.vue'
import Events from '~/components/organisms/wedding/Events.vue'
import AboutUs from '~/components/organisms/wedding/AboutUs.vue'
import Hero from '~/components/organisms/wedding/Hero.vue'
import Registry from '~/components/organisms/wedding/Registry.vue'
import { useWeddingSettings } from '~/composables/wedding/useWeddingSettings'
import MPageLoading from '~~/components/molecules/MPageLoading.vue'
import Closing from '~~/components/organisms/wedding/Closing.vue'
import Footer from '~~/components/organisms/wedding/Footer.vue'
import Gallery from '~~/components/organisms/wedding/Gallery.vue'
import OurStory from '~~/components/organisms/wedding/OurStory.vue'
import Wishes from '~~/components/organisms/wedding/Wishes.vue'
import type { FetchWeddingEventsResponse } from '~/server/api/fetchWeddingEvents'
import type { FetchWeddigSettingsResponse } from '~/server/api/fetchWeddingSettings'

defineOptions({
  name: 'WeddingPage',
})

const route = useRoute()
const tenantId = Array.isArray(route.params.tenantId)
  ? route.params.tenantId[0]
  : route.params.tenantId

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
const weddingEvents = computed(() => response.value?.weddingEvents ?? null)

const {
  isWeddingEventsSectionShown,
  isCoupleSectionShown,
  isStorySectionShown,
  isGallerySectionShown,
  isWishesSectionShown,
  isRegistrySectionShown,
  isClosingSectionShown,
} = useWeddingSettings(weddingSettings, weddingEvents)

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
