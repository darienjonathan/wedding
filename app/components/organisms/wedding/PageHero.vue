<template>
  <div class="hero">
    <div class="hero__filler">
      <div ref="buttonObserverElementRef" class="hero__button-intersection-observer" />
      <div ref="observerElementRef" class="hero__intersection-observer" />
    </div>
    <div class="hero__content" :data-is-blur="isBlur">
      <NuxtImg
        v-if="weddingSettings?.hero.imageSrc"
        class="hero__image"
        :src="weddingSettings?.hero.imageSrc"
        @load="$emit('loadingDone')"
      />
      <div class="hero__invitation-text invitation-text">
        <div class="invitation-text__item">{{ weddingSettings?.hero.invitationText }}</div>
      </div>
      <div class="hero__kv kv">
        <template v-if="weddingSettings?.hero.tagline.jp">
          <div class="kv__subheading kv__subheading--jp">
            {{ weddingSettings?.hero.tagline.jp }}
          </div>
        </template>
        <template v-if="weddingSettings?.hero.tagline.en">
          <div class="kv__subheading kv__subheading--en">
            {{ weddingSettings?.hero.tagline.en }}
          </div>
        </template>
        <div class="kv__heading">{{ title }}</div>
        <div class="kv__line" />
        <template v-for="eventDate in eventDates" :key="eventDate">
          <div class="kv__date">{{ eventDate }}</div>
        </template>
        <template v-if="!!sortedViewableWeddingEvents.length">
          <div class="kv__nav-btn">
            <div class="nav-btn__icon material-icons-outlined">expand_more</div>
            <div class="nav-btn__text" @click="emit('navClick')">{{ 'Events' }}</div>
          </div>
        </template>
      </div>
      <div class="bottom__wrapper">
        <div class="bottom__buttons">
          <div
            v-if="streamingLinks.length > 0"
            class="bottom__button"
            :data-is-blur="isButtonBlur"
            target="_blank"
            rel="noopener noreferrer"
            role="button"
          >
            {{ 'Attend Online' }}
          </div>
          <div
            v-if="hasRSVP"
            class="bottom__button"
            :data-is-blur="isButtonBlur"
            target="_blank"
            rel="noopener noreferrer"
            role="button"
          >
            {{ 'RSVP' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { WeddingEvent } from '~/types/model/wedding/weddingEvent'
import type { WeddingSettings } from '~/types/model/wedding/weddingSettings'
import type { Invitee } from '~/types/model/wedding/invitee'
import { useWeddingEvents } from '~/composables/wedding/useWeddingEvents'
import { useWeddingRSVP } from '~/composables/wedding/useWeddingRSVP'

defineOptions({
  name: 'PageHero',
})

type Props = {
  invitee: Invitee | null
  weddingEvents: WeddingEvent[]
  weddingSettings: WeddingSettings | null
}

const props = defineProps<Props>()

const title = computed(() => props.weddingSettings?.hero.title.replace(/ /g, '\n') || '')

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
    },
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

const { sortedViewableWeddingEvents } = useWeddingEvents(
  toRef(props, 'weddingEvents'),
  toRef(props, 'invitee'),
)

// --------------------------------------------------
// Events: Dates
// --------------------------------------------------

const dayjs = useNuxtApp().$dayjs

const eventDates = computed(() => [
  ...Array.from(
    new Set(
      sortedViewableWeddingEvents.value.map(weddingEvent => {
        const { timestamp, timezone } = weddingEvent
        const dayjsObject = dayjs(timestamp).tz(timezone)

        return dayjsObject.format('dddd, D MMMM YYYY')
      }),
    ),
  ),
])

// --------------------------------------------------
// Events: Streaming
// --------------------------------------------------

const streamingLinks = computed(() =>
  sortedViewableWeddingEvents.value.filter(event => event.streamingLink),
)

// --------------------------------------------------
// Events: RSVP
// --------------------------------------------------

const { hasRSVP } = useWeddingRSVP({
  // todo: refactor
  rsvp: props.weddingSettings ? toRef(props.weddingSettings, 'rsvp') : ref(null),
  weddingEvents: toRef(props, 'weddingEvents'),
  invitee: toRef(props, 'invitee'),
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
    },
  )
  observer.observe(buttonObserverElementRef.value)
  buttonObserverInstance.value = observer
})

onUnmounted(() => {
  if (!buttonObserverInstance.value) return
  buttonObserverInstance.value.disconnect()
})
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
    @include sp {
      white-space: pre-line;
      word-break: break-word;
    }
  }

  &__line {
    height: 1px;
    background: $white;
    margin: 16px auto;
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
    line-height: 1.75;
    text-align: center;
  }
  &__nav-btn {
    @include flex;
    @include font-family('marcellus');
    @include bounce-animation;
    cursor: pointer;
    margin-top: 16px;
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
  transition:
    background-color 0.25s ease-in-out,
    color 0.25s ease-in-out,
    opacity 0.5s;
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
    bottom: 50px;
  }

  &__buttons {
    @include flex;
    margin-bottom: 16px;

    & > * + * {
      margin-left: 16px;
    }
  }

  &__button {
    @include floating-button;
    text-decoration: none;
    color: inherit;
    white-space: pre;
  }

  &__text {
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
