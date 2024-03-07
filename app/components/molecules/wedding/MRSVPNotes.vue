<template lang="pug">
.m-rsvp-notes
  template(v-if="canRSVP || canReviewRSVP || shouldContact")
    .info(:class="canRSVP || canEditRSVP ? 'info--quote' : ''")
      .info__description
        span.info__description-text {{ 'You are currently ' }}
        span.info__description-text.info__description-text--focus {{ `${invitationStatusText}.` }}
        template(v-if="inviteeRSVP?.isAttendingReception && canReviewRSVP")
          span.info__description-text {{ ' Your RSVP details are as follows: ' }}
      template(v-if="inviteeRSVP?.isAttendingReception && canReviewRSVP")
        .info__description
          span.info__description-text {{ 'Name: ' }}
          span.info__description-text {{ inviteeRSVP?.name || '-' }}
        .info__description
          span.info__description-text {{ 'Adult(s): ' }}
          span.info__description-text {{ inviteeRSVP?.adultGuestNumber || 0 }}
        .info__description
          span.info__description-text {{ 'Children: ' }}
          span.info__description-text {{ inviteeRSVP?.childrenGuestNumber || 0 }}
        .info__description
          span.info__description-text {{ 'Phone number (For final attendance confirmation): ' }}
          span.info__description-text {{ inviteeRSVP?.phoneNumber || '-' }}
      template(v-if="shouldContact")
        .info__description
          span.info__description-text {{ 'As the RSVP deadline has now passed, if you want to make any changes to your RSVP details, please contact us directly or through our Wedding Organizer Representatives.' }}
  template(v-if="canEditRSVP")
    .info
      span.info__description-text {{ 'You can review and update your RSVP details using below form through ' }}
      span.info__description-text.info__description-text--focus {{ `${rsvpDeadlineString}.` }}
  template(v-else-if="canRSVP")
    .info
      .info__description
        template(v-if="isBeforeRSVPDeadline")
          span.info__description-text {{ 'Due to limited space, and to ensure the smooth running of the events, We kindly ask your cooperation by confirming your attendance to the wedding reception before ' }}
          span.info__description-text.info__description-text--focus {{ `${rsvpDeadlineString}.` }}
        template(v-else="isBeforeRSVPDeadline")
          span.info__description-text {{ 'Due to limited space, and to ensure the smooth running of the events, We kindly ask your cooperation by confirming your attendance to the wedding reception ' }}
          span.info__description-text.info__description-text--focus {{ 'as soon as possible.' }}
      .info__note
        .info__note-text.info__note-text--focus {{ 'Unconfirmed attendance is considered as not attending.' }}
        .info__note-text {{ ' We thank you for your kind understanding.' }}
</template>

<script lang="ts" setup>
import { useInvitee } from '~/composables/wedding/useInvitee'
import type { Invitee, InviteeRSVP } from '~/types/model/wedding/invitee'
import type { RSVP } from '~/types/model/wedding/weddingSettings'

type Props = {
  rsvpSettings: RSVP | null
  invitee: Invitee | null
  inviteeRSVP: InviteeRSVP | null
}

const props = defineProps({
  rsvpSettings: {
    type: Object as () => Props['rsvpSettings'],
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

const {
  isBeforeRSVPDeadline,
  canRSVP,
  canEditRSVP,
  canReviewRSVP,
  shouldContact,
  rsvpDeadlineString,
} = useInvitee(toRef(props, 'invitee'), toRef(props, 'inviteeRSVP'), toRef(props, 'rsvpSettings'))

const invitationStatusText = computed(() => {
  if (props.inviteeRSVP)
    return props.inviteeRSVP.isAttendingReception ? 'attending' : 'not attending'
  return 'yet to confirm your RSVP'
})
</script>
<script lang="ts">
export default {
  name: 'MRSVPNotes',
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/main';

.info {
  &--quote {
    padding-left: 16px;
    border-left: 1px solid $white;
    margin-bottom: 16px;
  }

  &__description {
    margin-bottom: 12px;
    &-text--focus {
      font-weight: bold;
      text-decoration: underline;
    }
  }

  &--quote &__description {
    @include font($size: $font-sm);
    margin-bottom: 4px;
  }

  &__note {
    @include font($size: $font-sm);
    &-text--focus {
      font-weight: bold;
    }
  }
}
</style>
