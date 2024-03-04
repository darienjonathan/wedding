<template lang="pug">
.events
  .heading__wrapper
    .heading {{ 'EVENTS' }}
    .heading__sub {{ subHeadingText }}

  template(v-if="!isNotInvited")
    .content
      .content__heading {{ 'HOLY MATRIMONY' }}
      .content__item
        .item__text
          .item__info
            .info__main {{ 'Gereja Kristus Yesus (GKY)\nMangga Besar' }}
            .info__sub {{ 'Saturday, 6 January 2024,\n10:00 AM WIB (UTC+7)' }}
          .item__info
            .info__sub {{ 'We would love to have your physical presence at our marriage\'s holy matrimony. However, if you are unable to attend physically, please attend online through below link:' }}
            a.button(
              :href="streamingButtonLink"
              target="_blank"
              rel="noopener noreferrer"
              role="button"
            ) {{ 'Attend Online' }}
        .item__graphic.item__graphic--map(ref="holyMatrimonyMapElementRef")

  template(v-if="isReceptionInvitation") 
    .content(data-order="reverse")
      .content__heading {{ 'WEDDING RECEPTION' }}
      .content__item
        .item__text
          .item__info
            .info__main {{ 'Sailendra Restaurant -\nJW Marriott Hotel Jakarta' }}
            .info__sub {{ 'Saturday, 6 January 2024,\n18:30 WIB' }}
        .item__graphic.item__graphic--map(ref="receptionMapElementRef")
  template(v-if="shouldShowRSVPSection")
    .content
      .content__heading {{ 'WEDDING RECEPTION RSVP' }}
      .content__item
        MRSVPNotes(
          :invitee="invitee"
          :inviteeRSVP="databaseInviteeRSVP"
        )
      template(v-if="canRSVP || canEditRSVP")
        .button(@click="handleClickRSVPButton") {{ databaseInviteeRSVP ? 'Edit Your RSVP' : 'RSVP Here' }}
</template>
<script lang="ts" setup>
import { useInvitee } from '~/composables/wedding/useInvitee'
import MRSVPNotes from '~/components/molecules/wedding/MRSVPNotes.vue'
import useMap from '~/composables/wedding/useMap'
import type { Invitee, InviteeRSVP } from '~/types/model/wedding/invitee'
import ConfirmRSVPModal from '~/components/organisms/wedding/ConfirmRSVPModal.vue'

type Props = {
  invitee: Invitee | null
  databaseInviteeRSVP: InviteeRSVP | null
}

const props = defineProps({
  invitee: {
    type: Object as () => Props['invitee'],
    required: true,
  },
  databaseInviteeRSVP: {
    type: Object as () => Props['databaseInviteeRSVP'],
    default: null,
  },
})

const {
  isReceptionInvitation,
  isMatrimonyInvitation,
  isNotInvited,
  canRSVP,
  canReviewRSVP,
  canEditRSVP,
  shouldContact,
} = useInvitee(toRef(props, 'invitee'), toRef(props, 'databaseInviteeRSVP'))

const subHeadingText = computed(() => {
  if (isReceptionInvitation.value)
    return "We would love to have your presence and blessings at our marriage's holy matrimony and wedding reception."
  if (isMatrimonyInvitation.value)
    return "We would love to have your presence and blessings at our marriage's holy matrimony."
  return "We would love to have your presence and blessings at the live streaming of our marriage's holy matrimony."
})

const config = useRuntimeConfig().public.wedding
const streamingButtonLink = computed(() => config.streamingLink)

const { receptionMapElementRef, holyMatrimonyMapElementRef } = useMap()

const shouldShowRSVPSection = computed(
  () => canRSVP.value || canReviewRSVP.value || shouldContact.value
)
const emit = defineEmits(['RSVPButtonClick'])

const handleClickRSVPButton = () => {
  emit('RSVPButtonClick')
}
</script>
<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Events',
  components: { ConfirmRSVPModal },
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.heading {
  &__wrapper {
    margin-bottom: 60px;
  }

  &,
  &__sub {
    @include font-family('marcellus');
    text-align: center;
  }

  & {
    margin-bottom: 20px;
    @include pc {
      @include font($size: $font-xxhuge, $letter-spacing: 2px);
    }
    @include sp {
      @include font($size: $font-xhuge, $letter-spacing: 2px);
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
}

@mixin floating-button {
  @include flex($is-inline: true);
  @include font-family('marcellus');
  border: 1px solid rgba($white, 0.5);
  border-radius: 8px;
  cursor: pointer;
  filter: drop-shadow(0 0 5px $white);
  transition: background-color 0.25s ease-in-out, color 0.25s ease-in-out, opacity 0.5s;
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
