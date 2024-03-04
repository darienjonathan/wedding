<template lang="pug">
.wedding
  MPageLoading(:is-loading="isLoading")
    .buttons-intersection-observer(ref="observerElementRef")
    .wrapper
      Hero.hero(
        :invitee="invitee"
        :inviteeRSVP="inviteeRSVP"
        @nav-click="handleNavClick"
        @loading-done="handleLoadingDone"
        @RSVPButtonClick="isRSVPModalOpen = true"
      )
      .content
        Events.events(
          :invitee="invitee"
          :databaseInviteeRSVP="inviteeRSVP"
          ref="eventsElementRef"
          @RSVPButtonClick="isRSVPModalOpen = true"
        )
        AboutUs.about-us
        OurStory.our-story(:invitee="invitee")
        Gallery.gallery
        .wishes__wrapper
          Wishes.wishes
        Registry.registry
        .line
        Closing.closing
        Footer.footer
  template(v-if="isDataLoaded && invitee")
    RSVP(
      :isRSVPModalOpen="isRSVPModalOpen"
      :invitee="invitee"
      :databaseInviteeRSVP="inviteeRSVP"
      @closeRSVPModal="isRSVPModalOpen = false"
      @promptUpdateInviteeRSVP="handleUpdateInviteRSVP"
    )
</template>
<script lang="ts" setup>
import { WeddingSettings } from 'types/model/wedding/weddingSettings'
import { useProvideLoading } from '~/composables/dependencyInjection/useLoadingDependencyInjection'
import Hero from '~/components/organisms/wedding/Hero.vue'
import Events from '~/components/organisms/wedding/Events.vue'
import type { Invitee, InviteeRSVP } from '~/types/model/wedding/invitee'
import AboutUs from '~/components/organisms/wedding/AboutUs.vue'
import MPageLoading from '~~/components/molecules/MPageLoading.vue'
import OurStory from '~~/components/organisms/wedding/OurStory.vue'
import Wishes from '~~/components/organisms/wedding/Wishes.vue'
import useUid from '~~/composables/wedding/useUid'
import Gallery from '~~/components/organisms/wedding/Gallery.vue'
import Closing from '~~/components/organisms/wedding/Closing.vue'
import Footer from '~~/components/organisms/wedding/Footer.vue'
import RSVP from '~/components/organisms/wedding/RSVP.vue'
import Registry from '~/components/organisms/wedding/Registry.vue'

const tenantId = useTenant()

useProvideLoading('wedding')

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
// User Data
// --------------------------------------------------

const { uid } = useUid()
const { useWeddingSettings, useInvitees, useInviteeRSVP } = useFirestoreCollections()
const weddingSettingsFirestore = useWeddingSettings(tenantId)
const inviteesFirestore = useInvitees(tenantId)
const inviteeRSVPFirestore = useInviteeRSVP(tenantId)

const isDataLoaded = ref(false)
const weddingSettings = ref<WeddingSettings | null>()
const invitee = ref<Invitee | null>()
const inviteeRSVP = ref<InviteeRSVP | null>()

const setInvitee = async () => {
  if (!uid.value) return
  const fetchedInvitee = await inviteesFirestore.loadDocument(uid.value)
  invitee.value = fetchedInvitee
}

const setInviteeRSVP = async () => {
  if (!uid.value) return
  const fetchedInviteeRSVP = await inviteeRSVPFirestore.loadDocument(uid.value)
  inviteeRSVP.value = fetchedInviteeRSVP
}

const setWeddingSettings = async () => {
  weddingSettings.value = await weddingSettingsFirestore.loadDocument(tenantId)
}

watch(
  uid,
  async () => {
    await Promise.all([setInvitee(), setInviteeRSVP(), setWeddingSettings()])
    isDataLoaded.value = true
  },
  {
    immediate: true,
  }
)

// --------------------------------------------------
// RSVP
// --------------------------------------------------

const isRSVPModalOpen = ref(false)

const handleUpdateInviteRSVP = () => {
  setInviteeRSVP()
}

// --------------------------------------------------
// Meta Tags
// --------------------------------------------------

// TODO: set base URL
const DOMAIN = 'darienjonathan.com'
const PROTOCOL = 'https://'

const baseUrl = `${PROTOCOL}${DOMAIN}`

const url = `${PROTOCOL}${tenantId}/${DOMAIN}`

const title = `${
  weddingSettings.value?.couple.map(c => c.name.first).join(' & ') || ''
} | Wedding Invitation`

const description = title

const image =
  weddingSettings.value?.ogpImageSrc ||
  weddingSettings.value?.hero?.imageSrc ||
  `${baseUrl}/ogp-wedding.jpg`

const meta = computed(() => {
  const metaArr: Record<string, string>[] = [
    {
      name: 'og:url',
      content: image,
    },
    {
      name: 'og:image',
      content: image,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
  ]

  metaArr.push(
    ...['og:title', 'twitter:title'].map(name => ({
      name,
      content: title,
    }))
  )
  metaArr.push(
    ...['description', 'og:description', 'twitter:description'].map(name => ({
      name,
      content: description,
    }))
  )
  metaArr.push(
    ...['og:image', 'twitter:image'].map(name => ({
      name,
      content: image,
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
