<template lang="pug">
.wedding
  MPageLoading(:is-loading="isLoading")
    .buttons-intersection-observer(ref="observerElementRef")
    .wrapper
      Hero.hero(
        :weddingSettings="weddingSettings"
        :invitee="invitee"
        :inviteeRSVP="inviteeRSVP"
        @nav-click="handleNavClick"
        @loading-done="handleLoadingDone"
        @RSVPButtonClick="isRSVPModalOpen = true"
      )
      .content(v-if="isEventSectionShown && weddingSettings")
        Events.events(
          :weddingSettings="weddingSettings"
          :invitee="invitee"
          :databaseInviteeRSVP="inviteeRSVP"
          ref="eventsElementRef"
          @RSVPButtonClick="isRSVPModalOpen = true"
        )
        AboutUs.about-us(
          v-if="isCoupleSectionShown"
          :couple="weddingSettings.couple"
          :sectionSettings="weddingSettings.sectionSettings.couple"
        )
        OurStory.our-story(
          v-if="isStorySectionShown"
          :invitee="invitee"
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
        Footer.footer(:type="'default'")
  template(v-if="isInviteeDataLoaded && invitee && weddingSettings?.rsvp.isEnabled")
    RSVP(
      :tenantId="tenantId"
      :isRSVPModalOpen="isRSVPModalOpen"
      :invitee="invitee"
      :databaseInviteeRSVP="inviteeRSVP"
      :rsvpSettings="weddingSettings?.rsvp"
      @closeRSVPModal="isRSVPModalOpen = false"
      @promptUpdateInviteeRSVP="handleUpdateInviteRSVP"
    )
</template>
<script lang="ts" setup>
import AboutUs from '~/components/organisms/wedding/AboutUs.vue'
import Events from '~/components/organisms/wedding/Events.vue'
import Hero from '~/components/organisms/wedding/Hero.vue'
import RSVP from '~/components/organisms/wedding/RSVP.vue'
import Registry from '~/components/organisms/wedding/Registry.vue'
import { useProvideLoading } from '~/composables/dependencyInjection/useLoadingDependencyInjection'
import { useStorage } from '~/composables/firebase/storage/useStorage'
import { useWeddingSettings } from '~/composables/wedding/useWeddingSettings'
import type { Invitee, InviteeRSVP } from '~/types/model/wedding/invitee'
import type { WeddingSettings } from '~/types/model/wedding/weddingSettings'
import MPageLoading from '~~/components/molecules/MPageLoading.vue'
import Closing from '~~/components/organisms/wedding/Closing.vue'
import Footer from '~~/components/organisms/wedding/Footer.vue'
import Gallery from '~~/components/organisms/wedding/Gallery.vue'
import OurStory from '~~/components/organisms/wedding/OurStory.vue'
import Wishes from '~~/components/organisms/wedding/Wishes.vue'
import useUid from '~~/composables/wedding/useUid'

const tenantId = useTenant()
useProvideLoading('wedding')

// --------------------------------------------------
// User Data
// --------------------------------------------------

const { uid } = useUid()
const { useInvitees, useInviteeRSVP } = useFirestoreCollections()

const inviteesFirestore = useInvitees(tenantId)
const inviteeRSVPFirestore = useInviteeRSVP(tenantId)
const { data: invitee, status: inviteeFetchStatus } = await useAsyncData<Invitee | null>(
  () => inviteesFirestore.loadDocument(uid.value),
  {
    watch: [uid],
    server: false,
  }
)
const {
  data: inviteeRSVP,
  status: inviteeRSVPFetchStatus,
  refresh: refreshInviteeRSVP,
} = await useAsyncData<InviteeRSVP | null>(() => inviteeRSVPFirestore.loadDocument(uid.value), {
  watch: [uid],
  server: false,
})

const isInviteeDataLoaded = computed(
  () => inviteeFetchStatus.value === 'success' && inviteeRSVPFetchStatus.value === 'success'
)

// --------------------------------------------------
// Wedding Settings
// --------------------------------------------------

const { data: weddingSettings, status: weddingSettingsFetchStatus } =
  await useFetch<WeddingSettings>('/api/fetchWeddingSettings', {
    query: { tenantId },
  })

watch(
  [weddingSettingsFetchStatus],
  () => {
    if (weddingSettingsFetchStatus.value === 'error') {
      throw createError({
        fatal: true,
        statusCode: 404,
        statusMessage: 'Invitation Page Not Found',
        message:
          "We hope that is not also the case regarding your partner (if you're looking for one, though).",
      })
    }
  },
  {
    immediate: true,
  }
)

const {
  isEventSectionShown,
  isCoupleSectionShown,
  isStorySectionShown,
  isGallerySectionShown,
  isWishesSectionShown,
  isRegistrySectionShown,
  isClosingSectionShown,
} = useWeddingSettings(weddingSettings, invitee, inviteeRSVP)

// --------------------------------------------------
// RSVP
// --------------------------------------------------

const isRSVPModalOpen = ref(false)

const handleUpdateInviteRSVP = () => {
  refreshInviteeRSVP()
}

// --------------------------------------------------
// OGP
// --------------------------------------------------

const storage = useStorage('')

const ogpImageSrc = ref('')
const heroImageSrc = ref('')

watch(
  weddingSettings,
  async settings => {
    if (!settings) return

    ogpImageSrc.value = await storage.getDownloadURL(settings.ogpImageSrc)
    heroImageSrc.value = await storage.getDownloadURL(settings.hero?.imageSrc)
  },
  {
    immediate: true,
  }
)

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

const eventsElementRef = ref<InstanceType<typeof Events> | null>()
const handleNavClick = () => {
  if (!eventsElementRef.value) return
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const element = eventsElementRef.value.$el as HTMLElement
  const eventsTop = element.getBoundingClientRect().top
  scrollTo(0, eventsTop)
}

// --------------------------------------------------
// Meta Tags
// --------------------------------------------------

// TODO: set base URL
const DOMAIN = 'darienjonathan.com'
const PROTOCOL = 'https://'

const baseUrl = `${PROTOCOL}${DOMAIN}`

const url = `${PROTOCOL}${tenantId}/${DOMAIN}`

const title = computed(
  () =>
    `${weddingSettings.value?.couple.map(c => c.name.first).join(' & ') || ''} | Wedding Invitation`
)

const description = computed(() => title.value)

const image = computed(
  () => ogpImageSrc.value || heroImageSrc.value || `${baseUrl}/ogp-wedding.jpg`
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
    }))
  )
  metaArr.push(
    ...['description', 'og:description', 'twitter:description'].map(name => ({
      name,
      content: description.value,
    }))
  )
  metaArr.push(
    ...['og:image', 'twitter:image'].map(name => ({
      name,
      content: image.value,
    }))
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
<script lang="ts">
export default {
  name: 'WeddingPage',
  components: {
    MPageLoading,
    Hero,
    Events,
    AboutUs,
    OurStory,
    Wishes,
    Gallery,
    Closing,
    Registry,
    Footer,
    RSVP,
  },
}
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

    @include pc {
      height: 50px;
    }

    @include sp {
      height: 100px;
    }
  }
}
</style>
