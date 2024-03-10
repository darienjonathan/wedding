<!-- eslint-disable vue/multi-word-component-names -->
<template lang="pug">
.hero
  .hero__filler
    .hero__button-intersection-observer(ref="buttonObserverElementRef")
    .hero__intersection-observer(ref="observerElementRef")
  .hero__content(:data-is-blur="isBlur")
    NuxtImg.hero__image(
      v-if="weddingSettings?.hero.imageSrc"
      :src="weddingSettings?.hero.imageSrc"
      @load="$emit('loadingDone')"
    )
    .hero__invitation-text.invitation-text
      template(v-if="!isNotInvited")
        .invitation-text__item {{ inviteeNameText }}
      .invitation-text__item {{ weddingSettings?.hero.invitationText }}
    .hero__kv.kv
      template(v-if="weddingSettings?.hero.tagline.jp")
        .kv__subheading.kv__subheading--jp {{ weddingSettings?.hero.tagline.jp }}
      template(v-if="weddingSettings?.hero.tagline.en")
        .kv__subheading.kv__subheading--en {{ weddingSettings?.hero.tagline.en }}
      .kv__heading {{ weddingSettings?.hero.title.toLocaleUpperCase() }}
      .kv__line
      .kv__date {{ kvDate }}
      template(v-if="isEventSectionShown")
        .kv__nav-btn
          .nav-btn__icon.material-icons-outlined expand_more
          .nav-btn__text(@click="emit('navClick')") {{ 'Events' }}

    .bottom__wrapper
      .bottom__buttons
        template(v-if="shouldShowRSVPButton")
          .bottom__button.bottom__button--left(
            @click="handleClickRSVPButton"
            :data-is-blur="isButtonBlur"
          ) {{ inviteeRSVP ? 'Review Your RSVP' : 'Wedding Reception RSVP' }}
        a.bottom__button.bottom__button--right(
          v-if="eventToShowStreaming"
          :href="eventToShowStreaming.streamingLink"
          :data-is-blur="isButtonBlur"
          target="_blank"
          rel="noopener noreferrer"
          role="button"
        ) {{ 'Attend Online' }}
      .bottom__text(v-if="eventToShowStreaming") {{ streamingEventText }}
</template>
<script lang="ts" setup>
import { useInvitee } from '~/composables/wedding/useInvitee'
import { useWeddingSettings } from '~/composables/wedding/useWeddingSettings'
import type { Invitee, InviteeRSVP } from '~/types/model/wedding/invitee'
import type { WeddingEvent, WeddingSettings } from '~/types/model/wedding/weddingSettings'
import { getTimezoneText } from '~/utils/time'

type Props = {
  weddingSettings: WeddingSettings | null
  invitee: Invitee | null
  inviteeRSVP: InviteeRSVP | null
}

const props = defineProps({
  weddingSettings: {
    type: Object as () => Props['weddingSettings'],
    default: null,
  },
  invitee: {
    type: Object as () => Props['invitee'],
    default: null,
  },
  inviteeRSVP: {
    type: Object as () => Props['inviteeRSVP'],
    default: null,
  },
})

const { isReceptionInvitation, isMatrimonyInvitation, isNotInvited, canRSVP, canReviewRSVP } =
  useInvitee(
    toRef(props, 'invitee'),
    toRef(props, 'inviteeRSVP'),
    computed(() => props.weddingSettings?.rsvp || null)
  )

const inviteeName = computed(() => props.inviteeRSVP?.name || props.invitee?.databaseName || '')

const inviteeNameText = computed(() => {
  const inviteePrefix = props.invitee?.inviteePrefix ? `${props.invitee?.inviteePrefix} ` : ''

  const inviteeSuffix =
    props.invitee?.inviteeSuffix === 'family'
      ? ' & Family'
      : props.invitee?.inviteeSuffix === 'partner'
      ? ' & Partner'
      : ''
  return `Dear ${inviteePrefix}${inviteeName.value}${inviteeSuffix},`
})

const emit = defineEmits(['loadingDone', 'navClick', 'RSVPButtonClick'])

// --------------------------------------------------
// Hero Intersection Observer
// --------------------------------------------------

const isBlur = ref(false)
const observerElementRef = ref<HTMLDivElement>()
const observerInstance = ref<IntersectionObserver>()
onMounted(() => {
  if (!observerElementRef.value) return
  const observer = new IntersectionObserver(
    entries => {
      const entry = entries.find(e => e.target === observerElementRef.value)
      if (!entry) return
      isBlur.value = !entry.isIntersecting
    },
    {
      rootMargin: '0px',
      threshold: [0.0, 1.0],
    }
  )
  observer.observe(observerElementRef.value)
  observerInstance.value = observer
})

onUnmounted(() => {
  if (!observerInstance.value) return
  observerInstance.value.disconnect()
})

// --------------------------------------------------
// Events
// --------------------------------------------------

const { isEventSectionShown } = useWeddingSettings(
  toRef(props, 'weddingSettings'),
  toRef(props, 'invitee'),
  toRef(props, 'inviteeRSVP')
)

const dayjs = useNuxtApp().$dayjs

const getEarliestAvailableEvent = (filterFn?: (weddingEvent: WeddingEvent) => boolean) => {
  const events = [...(props.weddingSettings?.events || [])]
  let nextEvents = events.filter(
    weddingEvent =>
      (filterFn ? filterFn(weddingEvent) : true) && dayjs().isBefore(dayjs(weddingEvent.timestamp))
  )

  if (!nextEvents.length) {
    nextEvents = events.filter(weddingEvent => (filterFn ? filterFn(weddingEvent) : true))
  }

  return nextEvents.sort((firstEvent, secondEvent) => {
    const firstEventTimestamp = firstEvent.timestamp || 0
    const secondEventTimestamp = secondEvent.timestamp || 0

    return firstEventTimestamp - secondEventTimestamp
  })[0]
}

const kvDate = computed(() => {
  const earliestAvailableEvent = getEarliestAvailableEvent()
  if (!earliestAvailableEvent) return

  const { timestamp, timezone } = earliestAvailableEvent
  const dayjsObject = dayjs(timestamp).tz(timezone)

  return dayjsObject.format('dddd, D MMMM YYYY')
})

const eventToShowStreaming = computed(() =>
  getEarliestAvailableEvent(weddingEvent => !!weddingEvent.streamingLink)
)

const streamingEventText = computed(() => {
  if (!eventToShowStreaming.value) return

  const { timestamp, timezone } = eventToShowStreaming.value
  const dayjsObject = dayjs(timestamp).tz(timezone)
  const time = dayjsObject.format('D MMMM YYYY, HH:mm')
  const timezoneText = getTimezoneText(eventToShowStreaming.value.timezone, dayjsObject)

  return `${eventToShowStreaming.value.eventName} Live Streaming starts at ${time} ${timezoneText}`
})

// --------------------------------------------------
// Buttons
// --------------------------------------------------

const isButtonBlur = ref(false)
const buttonObserverElementRef = ref<HTMLDivElement>()
const buttonObserverInstance = ref<IntersectionObserver>()
onMounted(() => {
  if (!buttonObserverElementRef.value) return
  const observer = new IntersectionObserver(
    entries => {
      const entry = entries.find(e => e.target === buttonObserverElementRef.value)
      if (!entry) return
      isButtonBlur.value = !entry.isIntersecting
    },
    {
      rootMargin: '150px',
      threshold: [0.0, 1.0],
    }
  )
  observer.observe(buttonObserverElementRef.value)
  buttonObserverInstance.value = observer
})

onUnmounted(() => {
  if (!buttonObserverInstance.value) return
  buttonObserverInstance.value.disconnect()
})

const handleClickRSVPButton = () => {
  emit('RSVPButtonClick')
}

const shouldShowRSVPButton = computed(() => {
  return canRSVP.value || canReviewRSVP.value
})
</script>
<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Hero',
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.hero {
  &__filler {
    @include size(vw(100), 100vh);
  }
  &__intersection-observer {
    padding-top: 30vh;
  }
  &__content {
    @include size(vw(100), 100vh);
    position: fixed;
    top: 0;
    transition: filter 1s;
    &[data-is-blur='true'] {
      filter: blur(15px);
    }
    &::after {
      @include size(100%, 100%);
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      background-color: rgba($black, 0.25);
    }
  }

  &__image {
    @include size(100%, 100%);
    @include absolute;
    object-fit: cover;
    filter: blur(3px);
  }

  &__invitation-text {
    @include font-family('marcellus');
    position: relative;
    text-align: center;
    text-shadow: 2px 2px 2px rgba($black, 0.25);
    z-index: 1;

    @include pc {
      margin-top: vh(15);
    }
    @include sp {
      @include font($size: $font-sm);
      padding: 0 20px;
      margin-top: vh(10);
    }
  }
}

.invitation-text {
  * + * {
    margin-top: 4px;
  }

  &__item {
    white-space: pre-line;
  }
}

.kv {
  @mixin bounce-animation {
    @keyframes bounce {
      0% {
        transform: translateY(0px);
      }
      15% {
        transform: translateY(4px);
      }
      30% {
        transform: translateY(0);
      }
    }
    animation-name: bounce;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-duration: 3s;
  }

  & {
    @include absolute-center;
    @include flex(column);
    width: 100%;
    padding: 20px;
    // 親の疑似要素より前に出るように
    z-index: 1;
  }

  &__subheading {
    &--jp {
      @include font-family('biz-ud-mincho');
      @include font($size: $font-sm);
      text-align: center;
      margin-bottom: 8px;
    }
    &--en {
      @include font-family('rochester');
      @include font($size: $font-xxxl, $letter-spacing: 1.5px);
      white-space: pre;
      text-align: center;
      margin-bottom: 32px;
    }
  }

  &__heading {
    @include font-family('marcellus');
    @include font($letter-spacing: 0.2rem);
    text-align: center;
    font-size: 4rem;
  }
  &__line {
    height: 1px;
    background: $white;
    margin: 8px auto;
    @include pc {
      width: 400px;
    }
    @include sp {
      width: 100%;
    }
  }
  &__date {
    @include font-family('marcellus');
    @include font($size: $font-lg, $letter-spacing: 0.05rem);
    line-height: 2;
    text-align: center;
    margin-bottom: 16px;
  }
  &__nav-btn {
    @include flex;
    @include font-family('marcellus');
    @include bounce-animation;
    cursor: pointer;
    border-bottom: 1px solid transparent;
    transition: border-color 0.25s;
    &:hover {
      border-color: $white;
    }
  }
}

.nav-btn {
  &__icon {
    @include font($size: $font-xxl);
    margin-right: 4px;
  }

  &__text {
    @include font($size: $font-sm);
    cursor: pointer;
  }
}

@mixin floating-button {
  @include flex;
  @include font-family('marcellus');
  border: 1px solid rgba($white, 0.5);
  border-radius: 8px;
  cursor: pointer;
  filter: drop-shadow(0 0 5px $white);
  transition: background-color 0.25s ease-in-out, color 0.25s ease-in-out, opacity 0.5s;
  &:hover {
    background-color: rgba($white, 0.05);
  }

  &[data-scrolled='true'] {
    background-color: rgba($white, 0.75);
    color: rgba($wedding_brown, 1);
  }

  &[data-is-blur='true'] {
    pointer-events: none;
    cursor: auto;
    opacity: 0;
  }

  @include pc {
    height: 45px;
    min-width: 150px;
    padding: 10px 20px;
  }

  @include sp {
    @include font($size: $font-sm);
    height: 35px;
    min-width: 115px;
    padding: 5px 10px;
  }
}

.bottom {
  &__wrapper {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    gap: 16px;
    z-index: 1;
    @include pc {
      bottom: 75px;
    }
    @include sp {
      bottom: 25px;
    }
  }

  &__buttons {
    @include flex;
    margin-bottom: 16px;
  }

  &__button {
    @include floating-button;
    text-decoration: none;
    color: inherit;
    white-space: pre;

    &--left {
      grid-area: btn-left;
    }

    &--right {
      grid-area: btn-right;
    }

    &:not(:last-child) {
      margin-right: 16px;
    }
  }

  &__text {
    grid-area: text;
    text-align: center;
    @include font-family('marcellus');
    @include pc {
      @include font($size: $font-sm);
    }
    @include sp {
      @include font($size: $font-xs);
    }
  }
}
</style>
