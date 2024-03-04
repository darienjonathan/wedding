<template lang="pug">
AModal.confirm-rsvp-modal(
  :is-open="props.isOpen"
  :type="isSP ? 'full-size' : 'default'"
  @close="$emit('close')"
)
  .inner
    .heading
      h2.heading__main Confirm RSVP
      template(v-if="inviteeRSVP.isAttendingReception")
        h3.heading__sub Reserve with below details?
    .content
      .content__item
        .content__label Name
        .content__value {{ inviteeRSVP.name || invitee.databaseName }}
      .content__item
        .content__label Wedding Reception Attendance
        .content__value {{ attendanceValueText }}
      template(v-if="inviteeRSVP.isAttendingReception")
        .content__item
          .content__label Phone number
          .content__value {{ inviteeRSVP.phoneNumber }}
        .content__item
          .content__label Number of guests (adult)
          .content__value {{ inviteeRSVP.adultGuestNumber }}
        .content__item
          .content__label Number of guests (children)
          .content__value {{ inviteeRSVP.childrenGuestNumber }}
    button.submit-btn(
      @click="$emit('confirmRSVP')"
      :disabled="isSubmitting"
    )
      template(v-if="!isSubmitting")
        template(v-if="!isSubmitCompleted || hasError")
          | Confirm
        template(v-else)
          | Close
      template(v-else)
        ALoading.loading(
          :width="'20px'"
          :height="'20px'"
        )
    template(v-if="isSubmitCompleted")
      template(v-if="hasError")
        .notice.notice--error {{ 'There is an error in submitting your reservation. Please refresh your browser and try once again. Sorry for the inconvenience.' }}
      template(v-else)
        .notice {{ 'Your reservation information has been successfully recorded. Thankyou for submitting your reservation information.' }}
</template>

<script lang="ts" setup>
import AModal from '~/components/atoms/AModal.vue'
import useMedia from '~/composables/useMedia'
import type { Invitee, InviteeRSVP } from '~/types/model/wedding/invitee'
import ALoading from '~/components/atoms/ALoading.vue'

const { isSP } = useMedia()

type Props = {
  isOpen: boolean
  invitee: Invitee
  inviteeRSVP: InviteeRSVP
  isSubmitting: boolean
  isSubmitCompleted: boolean
  hasError: boolean
}

const props = defineProps({
  isOpen: {
    type: Boolean as () => Props['isOpen'],
    default: false,
  },
  invitee: {
    type: Object as () => Props['invitee'],
    required: true,
  },
  inviteeRSVP: {
    type: Object as () => Props['inviteeRSVP'],
    required: true,
  },
  isSubmitting: {
    type: Boolean as () => Props['isSubmitting'],
    default: false,
  },
  isSubmitCompleted: {
    type: Boolean as () => Props['isSubmitCompleted'],
    default: false,
  },
  hasError: {
    type: Boolean as () => Props['hasError'],
    default: false,
  },
})

defineEmits(['close', 'confirmRSVP'])

const attendanceValueText = computed(() =>
  props.inviteeRSVP?.isAttendingReception ? 'Attending' : 'Not Attending'
)
</script>
<script lang="ts">
export default {
  name: 'ConfirmRSVPModal',
  components: { AModal, ALoading },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/main';

.inner {
  @include pc {
    min-width: 400px;
  }
}

.heading {
  & {
    margin-bottom: 32px;
  }
  &__main {
    @include font($size: $font-xl);
    margin-bottom: 8px;
  }
  &__sub {
    @include font($size: $font-m);
    font-weight: normal;
  }
}

.content {
  & {
    margin-bottom: 32px;
  }
  &__item {
    margin-bottom: 8px;
    @include pc {
      display: grid;
      grid-template-columns: 250px 1fr;
    }
  }
  &__label {
    font-weight: bold;
    @include sp {
      margin-bottom: 4px;
    }
  }
}

.submit-btn {
  @include button($bg-color: rgba($navy-blue-light, 0.5), $font-size: $font-sm);
  width: 100%;
  height: 40px;
}

.notice {
  & {
    @include font($size: $font-sm);
    padding-top: 16px;
  }
  &--error {
    @include font($size: $font-sm, $color: $red-light);
  }
}
</style>
