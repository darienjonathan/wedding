<template lang="pug">
.rsvp
  template(v-if="invitee")
    RSVPModal(
      :is-open="isRSVPModalOpen"
      :invitee="invitee"
      :inviteeRSVP="databaseInviteeRSVP"
      @close="$emit('closeRSVPModal')"
      @submit="handleSubmitRSVP"
    )
  template(v-if="invitee && inviteeRSVPToSubmit")
    ConfirmRSVPModal(
      :is-open="confirmRSVPModalStates.isOpen"
      :is-submitting="confirmRSVPModalStates.isSubmitting"
      :is-submit-completed="confirmRSVPModalStates.isSubmitCompleted"
      :has-error="confirmRSVPModalStates.hasError"
      :invitee="invitee"
      :inviteeRSVP="inviteeRSVPToSubmit"
      @close="handleCloseRSVPSubmission"
      @confirmRSVP="handleConfirmRSVP"
    )
</template>
<script lang="ts" setup>
import RSVPModal from '~/components/organisms/wedding/RSVPModal.vue'
import type { Invitee, InviteeRSVP } from '~/types/model/wedding/invitee'
import ConfirmRSVPModal from '~/components/organisms/wedding/ConfirmRSVPModal.vue'
import useUid from '~/composables/wedding/useUid'

const { uid } = useUid()

type Props = {
  isRSVPModalOpen: boolean
  invitee: Invitee | null
  databaseInviteeRSVP: InviteeRSVP | null
}

defineProps({
  isRSVPModalOpen: {
    type: Boolean as () => Props['isRSVPModalOpen'],
    default: false,
  },
  invitee: {
    type: Object as () => Props['invitee'],
    default: null,
  },
  databaseInviteeRSVP: {
    type: Object as () => Props['databaseInviteeRSVP'],
    default: null,
  },
})

const emit = defineEmits(['closeRSVPModal', 'promptUpdateInviteeRSVP'])

const confirmRSVPModalStates = reactive({
  isOpen: false,
  isSubmitting: false,
  isSubmitCompleted: false,
  hasError: false,
})

const initializeConfirmRSVPModalStates = () => {
  confirmRSVPModalStates.isSubmitting = false
  confirmRSVPModalStates.isSubmitCompleted = false
  confirmRSVPModalStates.hasError = false
}

const inviteeRSVPToSubmit = ref<InviteeRSVP>()
const handleSubmitRSVP = (inviteeRSVP: InviteeRSVP) => {
  confirmRSVPModalStates.isOpen = true
  inviteeRSVPToSubmit.value = inviteeRSVP
}

onMounted(initializeConfirmRSVPModalStates)

watch(() => confirmRSVPModalStates.isOpen, initializeConfirmRSVPModalStates)

const shouldCloseModal = computed(
  () => confirmRSVPModalStates.isSubmitCompleted && !confirmRSVPModalStates.hasError
)

const handleCloseRSVPSubmission = () => {
  confirmRSVPModalStates.isOpen = false
  inviteeRSVPToSubmit.value = undefined
  if (shouldCloseModal.value) {
    emit('closeRSVPModal')
  }
}

const { useInviteeRSVP } = useFirestoreCollections()
const inviteeRSVPFirestore = useInviteeRSVP()

const handleConfirmRSVP = () => {
  if (shouldCloseModal.value) {
    handleCloseRSVPSubmission()
    return
  }

  if (!uid.value || !inviteeRSVPToSubmit.value) {
    confirmRSVPModalStates.hasError = true
    return
  }

  confirmRSVPModalStates.isSubmitting = true

  inviteeRSVPFirestore
    .set(uid.value, inviteeRSVPToSubmit.value)
    .then(() => {
      emit('promptUpdateInviteeRSVP')
    })
    .catch(() => {
      confirmRSVPModalStates.hasError = true
    })
    .finally(() => {
      confirmRSVPModalStates.isSubmitting = false
      confirmRSVPModalStates.isSubmitCompleted = true
    })
}
</script>
<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Events',
  components: { RSVPModal, ConfirmRSVPModal },
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
      @include font($size: $font-xhuge);
    }
    @include sp {
      @include font($size: $font-huge);
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
    padding-bottom: 16px;
    margin-bottom: 16px;
    width: 100%;
    border-bottom: 1px solid $white;
    @include pc {
      @include font($size: $font-huge);
    }
    @include sp {
      @include font($size: $font-xxxl);
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
  &__text {
    @include pc {
      margin-right: 32px;
    }
    #{$reversed-content-class} & {
      text-align: right;
      @include pc {
        margin-right: 0;
        margin-left: 32px;
      }
    }
  }

  &__main-info {
    @include pc {
      @include font($size: $font-xxl);
      margin-bottom: 12px;
    }
    @include sp {
      @include font($size: $font-xl);
      margin-bottom: 4px;
      white-space: pre-wrap;
    }
  }
  &__sub-info {
    @include sp {
      @include font($size: $font-sm);
      margin-bottom: 16px;
      white-space: pre-wrap;
    }
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

    &--embed {
      @include sp {
        height: 200px;
      }
    }
  }
}

.rsvp {
  $content-margin: 30px;
  &__form {
    width: 100%;
    margin-top: 4px; // NOTE: 入力欄の上が予約説明のテキストの上と揃うように
    @include pc {
      max-width: calc(50% - $content-margin);
      margin-right: $content-margin;
      order: 0;
    }
  }
  &__info {
    margin-left: auto;
    @include pc {
      max-width: calc(50% - $content-margin);
      margin-left: $content-margin;
      order: 1;
    }
    @include sp {
      margin-bottom: 20px;
    }
  }
  &__description {
    margin-bottom: 12px;
    &-text--focus {
      font-weight: bold;
      text-decoration: underline;
    }
  }

  &__note {
    @include font($size: $font-sm);
    &-text--focus {
      font-weight: bold;
    }
  }
}
</style>
