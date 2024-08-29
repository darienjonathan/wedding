<template>
  <template v-if="!sortedViewableWeddingEvents.length">
    <!-- show nothing -->
  </template>
  <template v-else>
    <div class="events">
      <div class="heading__wrapper">
        <div class="heading">{{ sectionSettings?.title || 'EVENTS' }}</div>
      </div>
      <div class="kv">
        <div class="kv__main">{{ sectionSettings?.description.main }}</div>
        <div class="kv__sub">{{ sectionSettings?.description.sub }}</div>
      </div>
      <template
        v-for="(weddingEvent, index) in sortedViewableWeddingEvents"
        :key="weddingEvent.eventName"
      >
        <div class="content" :data-order="index % 2 !== 0 ? 'reverse' : ''">
          <div class="content__heading">{{ weddingEvent.eventName }}</div>
          <div class="content__item">
            <div class="item__text">
              <div class="item__info">
                <div class="info__main">{{ weddingEvent.venue }}</div>
                <div class="info__sub">
                  {{ getDate(weddingEvent.timestamp, weddingEvent.timezone) }}
                </div>
              </div>
              <template v-if="weddingEvent.streamingLink">
                <div class="item__info">
                  <div class="info__sub">
                    {{
                      'We would love to have your physical presence at this ceremony. However, if you are unable to attend physically, please attend online through below link:'
                    }}
                  </div>
                  <a
                    class="button"
                    :href="weddingEvent.streamingLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="button"
                    >{{ 'Attend Online' }}</a
                  >
                </div>
              </template>
            </div>
            <div
              ref="mapElementRefs"
              class="item__graphic item__graphic--map"
              :data-index="index"
            />
          </div>
        </div>
      </template>
      <template v-if="rsvp && hasRSVP">
        <div class="content">
          <div class="content__heading">RSVP</div>
          <!-- TODO: Other RSVP Formats -->
          <template v-if="rsvp.formType === RSVPFormTypes.markdown">
            <div class="content__item">
              <div class="item__text">
                <div class="item__info">
                  <AMarkdown class="info__markdown" :content="markdown" />
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </template>
</template>
<script lang="ts" setup>
import AMarkdown from '~/components/atoms/AMarkdown.vue'
import { useMap } from '~/composables/wedding/useMap'
import { useWeddingEvents } from '~/composables/wedding/useWeddingEvents'
import type { RSVP, SectionSettings } from '~/types/model/wedding/weddingSettings'
import type { WeddingEvent } from '~/types/model/wedding/weddingEvent'
import type { Invitee } from '~/types/model/wedding/invitee'
import { getTimezoneText } from '~/utils/time'
import { RSVPFormTypes } from '~/types/model/wedding/weddingSettings'

defineOptions({
  name: 'WeddingEvents',
})

type Props = {
  weddingEventsRecord?: Record<string, WeddingEvent>
  rsvp?: RSVP | null
  invitee?: Invitee | null
  sectionSettings: SectionSettings | null
}

const props = withDefaults(defineProps<Props>(), {
  weddingEventsRecord: undefined,
  invitee: null,
  rsvp: null,
})

const { sortedViewableWeddingEvents } = useWeddingEvents(
  toRef(props, 'weddingEventsRecord'),
  toRef(props, 'invitee'),
)

// SETTINGS

const dayjs = useNuxtApp().$dayjs

const getDate = (timestamp: number, timezone: string) => {
  const dayjsObject = dayjs(timestamp).tz(timezone)
  const date = dayjsObject.format('dddd, D MMMM YYYY, H:mm')
  const offset = getTimezoneText(timezone, dayjsObject)

  return `${date} ${offset}`
}

const { mapElementRefs } = useMap(sortedViewableWeddingEvents)

// RSVP

const hasRSVP = computed(
  () =>
    !!props.rsvp?.isEnabled &&
    sortedViewableWeddingEvents.value.some(weddingEvent => !!weddingEvent.rsvp),
)

const markdown = ref()

watch(
  () => props.rsvp,
  async (rsvp): Promise<void> => {
    if (!rsvp) return
    if (rsvp.formType !== RSVPFormTypes.markdown) return

    markdown.value = await (await fetch(rsvp.content)).text()
  },
  {
    immediate: true,
  },
)
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.heading {
  &__wrapper {
    margin-bottom: 60px;
  }

  & {
    @include font-family('marcellus');
    margin-bottom: 20px;
    text-align: center;

    @include pc {
      @include font($size: $font-xxhuge, $letter-spacing: 2px);
    }

    @include sp {
      @include font($size: $font-xhuge, $letter-spacing: 2px);
    }
  }
}

.kv {
  & {
    @include font-family('marcellus');
    text-align: center;
    margin: 0 auto 60px;

    @include pc {
      padding: 0 40px;
      max-width: 1200px;
    }

    @include sp {
      width: 100%;
      padding: 0 20px;
    }
  }

  &__main {
    white-space: pre-line;

    @include pc {
      margin-bottom: 8px;
    }

    @include sp {
      @include font($size: $font-sm, $line-height: 1.5);
      margin-bottom: 16px;
    }
  }

  &__sub {
    @include pc {
      @include font($size: $font-sm);
    }

    @include sp {
      @include font($size: $font-xs);
    }
  }
}

$reversed-content-class: ".content[data-order='reverse']";

.content {
  & {
    margin: 0 auto 40px;

    @include pc {
      max-width: 1200px;
    }
  }

  &__heading {
    @include font-family('marcellus');
    padding-bottom: 16px;
    margin-bottom: 16px;
    width: 100%;
    border-bottom: 1px solid $white;

    @include pc {
      @include font($size: $font-huge, $letter-spacing: 1px);
    }

    @include sp {
      @include font($size: $font-xxxl, $letter-spacing: 1px);
    }

    #{$reversed-content-class} & {
      text-align: right;
    }
  }

  &__item {
    width: 100%;

    @include pc {
      @include flex($justify: space-between, $align-items: flex-start);

      #{$reversed-content-class} & {
        flex-direction: row-reverse;
      }
    }
  }
}

.item {
  &__info {
    &:not(:last-child) {
      @include pc {
        margin-bottom: 12px;
      }

      @include sp {
        margin-bottom: 8px;
      }
    }
  }

  &__text {
    @include pc {
      margin-right: 32px;
    }

    @include sp {
      margin-bottom: 16px;
    }

    #{$reversed-content-class} & {
      text-align: right;

      @include pc {
        margin-right: 0;
        margin-left: 32px;
      }
    }
  }

  &__hr {
    margin: 16px 0;
    color: rgba($white, 0.25);
  }

  &__graphic {
    width: 100%;
    max-width: 750px;
    margin-top: 4px; // NOTE: 地図の上が住所のテキストの上と揃うように

    @include pc {
      height: 300px;
    }

    @include sp {
      height: 500px;
    }

    &--map {
      :deep(.address) {
        @include font-family('cabin');
        padding: 4px;
      }

      :deep(.address__title),
      :deep(.address__text) {
        @include font($size: $font-sm, $line-height: 1.25, $color: $wedding_brown);
      }

      :deep(.address__title) {
        font-weight: bold;
        padding-bottom: 2px;
      }

      :deep(.address__text) {
        padding-bottom: 4px;
      }

      :deep(.address__link) {
        @include flex($justify: flex-start);
        border-bottom: 1px solid $wedding-brown;
        padding-bottom: 2px;
        width: fit-content;
      }

      :deep(.link__icon) {
        @include font($size: $font-sm, $color: $wedding_brown);
        margin-right: 4px;
      }

      :deep(.link__href) {
        @include font($size: $font-sm, $color: $wedding_brown);
        text-decoration: none;
      }
    }
  }
}

.info {
  &__main {
    @include pc {
      @include font($size: $font-xxl);
      margin-bottom: 12px;
    }

    @include sp {
      @include font($size: $font-xl);
      margin-bottom: 8px;
      white-space: pre-wrap;
    }
  }

  &__sub {
    @include sp {
      @include font($size: $font-sm);
      white-space: pre-wrap;
    }
  }

  &__markdown {
    width: 100%;

    :deep(pre) {
      overflow-x: auto;
      padding: 10px;
      background: rgba(gray, 0.25);
      border-radius: 4px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    :deep(code) {
      @include font-family('cabin');
      @include font($size: $font-sm);
    }
  }
}

@mixin floating-button {
  @include flex($is-inline: true);
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

.button {
  @include floating-button;
  text-decoration: none;
  color: inherit;

  @include pc {
    margin-top: 16px;
  }

  @include sp {
    margin-top: 8px;
  }
}
</style>
