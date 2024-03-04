<template lang="pug">
AModal.rsvp-modal(
  :is-open="props.isOpen"
  :type="isSP ? 'full-size' : 'default'"
  @close="$emit('close')"
)
  .inner
    .heading
      h2.heading__main {{ inviteeRSVP ? 'Review Your RSVP' : 'Wedding Reception RSVP' }}
    .content
      MRSVPNotes.content__notes(
        :invitee="invitee"
        :inviteeRSVP="inviteeRSVP"
      )
      template(v-if="canRSVP || canEditRSVP")
        RSVPForm(
          :key="String(forceRerender)"
          :invitee="invitee"
          :inviteeRSVP="inviteeRSVP"
          @submit="handleSubmit"
        )
</template>

<script lang="ts" setup>
import MRSVPNotes from '~/components/molecules/wedding/MRSVPNotes.vue'
import AModal from '~/components/atoms/AModal.vue'
import useMedia from '~/composables/useMedia'
import type { Invitee, InviteeRSVP } from '~/types/model/wedding/invitee'
import ALoading from '~/components/atoms/ALoading.vue'
import RSVPForm from '~/components/organisms/wedding/RSVPForm.vue'

import { useInvitee } from '~/composables/wedding/useInvitee'

type Props = {
  isOpen: boolean
  invitee: Invitee
  inviteeRSVP: InviteeRSVP | null
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
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const { isSP } = useMedia()

const { canRSVP, canEditRSVP } = useInvitee(toRef(props, 'invitee'), toRef(props, 'inviteeRSVP'))

const handleSubmit = (inviteeRSVP: InviteeRSVP) => {
  emit('submit', inviteeRSVP)
}

const forceRerender = ref(0)
watch(
  () => props.inviteeRSVP,
  () => {
    forceRerender.value += 1
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>
<script lang="ts">
export default {
  name: 'RSVPModal',
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
    @include pc {
      margin-bottom: 16px;
    }
    @include sp {
      margin-bottom: 16px;
    }
  }
  &__main {
    @include font($size: $font-xl);
    font-weight: bold;
    margin-bottom: 8px;
  }
}

.content {
  &__notes {
    margin-bottom: 20px;
  }
}
</style>
