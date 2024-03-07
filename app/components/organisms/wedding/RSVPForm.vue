<template lang="pug">
.rsvp-form
  MInput.input(:label="'Name'")
    input.phone-number__input(
      type="text"
      :value="name"
      @input="handleChangeName"
    )
  template(v-if="isReceptionInvitation")
    MInput.input(:label="'Are you attending?'")
      select.input__item(
        name="isAttendingReception"
        :value="isAttendingReception"
        @change="handleChangeReceptionAttendance"
      )
        option(
          :disabled="true"
          :selected="isAttendingReception === undefined"
          value
        )
        option(:value="false") No, I'm not attending
        option(:value="true") Yes, I'm attending
  template(v-if="isAttendingReception")
    MInput.input(
      :label="'Phone Number'"
      :error-text="isPhoneNumberError ? 'Please input only numbers' : ''"
      :note-text="'※ do not include the starting number 0'"
    )
      select.input__item.input__item--phone(
        name="phoneNumber"
        :value="phoneCodeNumber"
        @change="handlePhoneCodeChange"
      )
        option(
          v-for="phoneCode in phoneCodeList"
          :value.num="phoneCode.number"
        ) {{ phoneCode.country }}
      .phone-number__break
      .phone-number__number
        .phone-number__code {{ `+${phoneCodeNumber}` }}
        input.phone-number__input(
          type="text"
          :value="phoneNumber"
          @input="handlePhoneNumberChange"
        )
    MInput.input(
      :label="'Number of Guests (Adult)'"
      :note-text="'※ over 12 years old, including yourself'"
    )
      select.input__item.input__item--phone(
        name="adultGuestNumber"
        :value="adultGuestNumber"
        @change="handleAdultGuestNumberChange"
      )
        option(
          v-for="number in invitee?.adultGuestNumber"
          :value.num="number"
        ) {{ number }}
    template(v-if="invitee?.childrenGuestNumber")
      MInput.input(
        :label="'Number of Guests (Children)'"
        :note-text="'※ max. 12 years old'"
      )
        select.input__item.input__item--phone(
          name="childrenGuestNumber"
          :value="childrenGuestNumber"
          @change="handleChildrenGuestNumberChange"
        )
          option(:value.num="0") {{ 0 }}
          option(
            v-for="number in invitee?.childrenGuestNumber"
            :value.num="number"
          ) {{ number }}
  .note {{ '※ Your data will only be used for RSVP purposes. The data will be deleted after the events conclude.' }}
  button.button(
    @click="handleSubmit"
    :disabled="!canSubmit"
  ) {{ inviteeRSVP ? 'Update' : 'Submit' }}
</template>
<script lang="ts" setup>
import MInput from '~/components/molecules/wedding/MInput.vue'
import type { Invitee, InviteeRSVP } from '~/types/model/wedding/invitee'
import { phoneCodeList } from '~/utils/phone'

type Props = {
  invitee: Invitee
  inviteeRSVP: InviteeRSVP | null
  isReceptionInvitation: boolean
}

const props = defineProps({
  invitee: {
    type: Object as () => Props['invitee'],
    required: true,
  },
  inviteeRSVP: {
    type: Object as () => Props['inviteeRSVP'],
    default: null,
  },
  isReceptionInvitation: {
    type: Boolean as () => Props['isReceptionInvitation'],
    default: false,
  },
})

const emit = defineEmits<{ (e: 'submit', inviteeRSVP: InviteeRSVP): void }>()

// --------------------------------------------------
// Form
// --------------------------------------------------

const name = ref<string>('')
const handleChangeName = (e: Event) => {
  const target = e.target as HTMLInputElement
  name.value = String(target.value)
}

// We don't require RSVP for Holy Matrimony Attendance
const isAttendingReception = ref<boolean | undefined>(undefined)

const handleChangeReceptionAttendance = (e: Event) => {
  const target = e.target as HTMLSelectElement
  isAttendingReception.value = target.value === 'true'
}

const phoneCodeNumber = ref<number>()
const handlePhoneCodeChange = (e: Event) => {
  const target = e.target as HTMLSelectElement
  phoneCodeNumber.value = Number(target.value)
}

const phoneNumber = ref<number>()
const isPhoneNumberError = ref(false)
const handlePhoneNumberChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const inputtedPhoneNumber = Number(target.value)
  phoneNumber.value = inputtedPhoneNumber
  isPhoneNumberError.value = isNaN(inputtedPhoneNumber)
}

const adultGuestNumber = ref<number>()
const handleAdultGuestNumberChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  adultGuestNumber.value = Number(target.value)
}

watch(isAttendingReception, (currentValue, prevValue) => {
  if (!prevValue && currentValue && adultGuestNumber.value === 0) {
    adultGuestNumber.value = 1
  }
})

const childrenGuestNumber = ref<number>()
const handleChildrenGuestNumberChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  childrenGuestNumber.value = Number(target.value)
}

// Form Initialization

const initializeFormValues = () => {
  name.value = props.inviteeRSVP?.name || props.invitee.databaseName

  isAttendingReception.value = props.inviteeRSVP
    ? props.inviteeRSVP.isAttendingReception
    : undefined

  const basePhoneNumber = props.inviteeRSVP?.phoneNumber || props.invitee?.databasePhoneNumber
  const existingCode = phoneCodeList.find(c =>
    basePhoneNumber?.slice(1).startsWith(String(c.number))
  )
  const defaultCode = phoneCodeList.find(c => c.isDefault)
  phoneCodeNumber.value = existingCode?.number || defaultCode?.number

  phoneNumber.value =
    basePhoneNumber && existingCode
      ? Number(basePhoneNumber.replace(`+${String(existingCode.number)}`, ''))
      : undefined

  adultGuestNumber.value =
    props.inviteeRSVP?.adultGuestNumber ?? props.invitee.adultGuestNumber ?? 0

  childrenGuestNumber.value =
    props.inviteeRSVP?.childrenGuestNumber ?? props.invitee.childrenGuestNumber ?? 0
}
onMounted(initializeFormValues)

const inviteeRSVPToSubmit = computed<InviteeRSVP>(() => {
  const nameToSubmit = isAttendingReception.value ? name.value : ''
  const phoneNumberToSubmit = isAttendingReception.value
    ? `+${phoneCodeNumber.value || ''}${phoneNumber.value || ''}`
    : ''
  const adultGuestNumberToSubmit = (isAttendingReception.value && adultGuestNumber.value) || 0
  const childrenGuestNumberToSubmit = (isAttendingReception.value && childrenGuestNumber.value) || 0

  return {
    name: nameToSubmit,
    isAttendingReception: isAttendingReception.value ?? false,
    phoneNumber: phoneNumberToSubmit,
    adultGuestNumber: adultGuestNumberToSubmit,
    childrenGuestNumber: childrenGuestNumberToSubmit,
  }
})

const hasChange = computed(() => {
  return !(
    inviteeRSVPToSubmit.value.name === props.inviteeRSVP?.name &&
    inviteeRSVPToSubmit.value.isAttendingReception === props.inviteeRSVP?.isAttendingReception &&
    inviteeRSVPToSubmit.value.childrenGuestNumber === props.inviteeRSVP?.childrenGuestNumber &&
    inviteeRSVPToSubmit.value.adultGuestNumber === props.inviteeRSVP?.adultGuestNumber &&
    inviteeRSVPToSubmit.value.phoneNumber === props.inviteeRSVP?.phoneNumber
  )
})

const canSubmit = computed(() => {
  if (!hasChange.value) return false
  if (isAttendingReception.value === undefined) return false
  if (isAttendingReception.value === false) return true
  return !!phoneNumber.value
})

const handleSubmit = () => {
  emit('submit', inviteeRSVPToSubmit.value)
}
</script>
<script lang="ts">
export default {
  name: 'RSVPForm',
  components: { MInput },
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.rsvp-form {
  padding: 12px;
  border: 1px solid $white;
  box-shadow: 0 0 5px $white;
}

.input {
  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &__item {
    @include sp {
      width: 100%;
      &--phone {
        margin-bottom: 4px;
      }
    }
  }
}

.phone-number {
  &__code-select,
  &__number {
    min-width: 0;
  }

  &__code {
    margin-right: 4px;
    @include pc {
      margin-left: 4px;
    }
  }

  &__break {
    flex-basis: 100%;
    @include pc {
      display: none;
    }
  }

  &__number {
    @include flex($justify: flex-start);
  }

  &__input {
    min-width: 0;
    @include pc {
      width: 120px;
    }
  }
}

.note {
  @include font($size: $font-xs);
  margin-top: 8px;
}

.button {
  @include button($bg-color: rgba($white, 0.15), $font-size: $font-sm);
  display: block;
  margin: 12px auto 0;
}
</style>
