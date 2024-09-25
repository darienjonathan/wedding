<template>
  <AModal :is-open="props.isOpen" type="full-size" @close="$emit('close')">
    <header class="header">
      <h2 class="header__title">RSVP</h2>
    </header>
    <div class="description">Confirm your presence at the couple's happy day below.</div>

    <form @submit.prevent="handleSubmitForm">
      <div class="form form--text-input">
        <label class="form__label" for="name">Name</label>
        <input id="name" v-model="name" type="text" required placeholder="Your name" />
        <label class="form__label" for="contact">Contact</label>
        <input id="contact" v-model="contact" type="text" required placeholder="Your contact" />
      </div>

      <template v-for="weddingEvent in eventsWithRSVP" :key="weddingEvent.id">
        <div class="item">
          <div class="item__title">{{ weddingEvent.eventName }}</div>
          <div class="item__form-question">Are you going to attend this event?</div>
          <div class="item__form form form--radio">
            <div class="form__item">
              <input
                :id="`${weddingEvent.id}__attendance-yes`"
                class="form__input"
                type="radio"
                :name="`${weddingEvent.id}__attendance`"
                :value="true"
                :checked="inviteeRSVPEventsInputMap.get(weddingEvent.id)?.isAttending"
                @change="
                  handleChangeAttendance(weddingEvent.id, ($event.target as HTMLInputElement).value)
                "
              />
              <label class="form__label" :for="`${weddingEvent.id}__attendance-yes`">Yes</label>
            </div>
            <div class="form__item">
              <input
                :id="`${weddingEvent.id}__attendance-no`"
                class="form__input"
                type="radio"
                :name="`${weddingEvent.id}__attendance`"
                :value="false"
                :checked="inviteeRSVPEventsInputMap.get(weddingEvent.id)?.isAttending"
                @change="
                  handleChangeAttendance(weddingEvent.id, ($event.target as HTMLInputElement).value)
                "
              />
              <label class="form__label" :for="`${weddingEvent.id}__attendance-no`">No</label>
            </div>
          </div>

          <template
            v-if="
              inviteeRSVPEventsInputMap.get(weddingEvent.id)?.isAttending &&
              weddingEvent.rsvp.type === 'detailed'
            "
          >
            <div class="item__form-question">
              How many people are you bringing with you? (Yourself included)
            </div>
            <div class="item__form form form--select">
              <div class="form__item">
                <select
                  :id="`${weddingEvent.id}__adult-num`"
                  :name="`${weddingEvent.id}__adult-num`"
                  @change="
                    handleChangeAdultNum(
                      weddingEvent.id,
                      ($event.target as HTMLSelectElement).value,
                    )
                  "
                >
                  <option
                    v-for="n in inviteeEventsMap.get(weddingEvent.id)?.adult"
                    :key="n"
                    :value="n"
                    :selected="n === inviteeRSVPEventsInputMap.get(weddingEvent.id)?.adult"
                  >
                    {{ n }}
                  </option>
                  >
                </select>
                <label class="form__label" :for="`${weddingEvent.id}__adult-num`">Adult</label>
              </div>
              <div v-if="inviteeEventsMap.get(weddingEvent.id)?.children" class="form__item">
                <select
                  :id="`${weddingEvent.id}__children-num`"
                  :name="`${weddingEvent.id}__children-num`"
                  @change="
                    handleChangeChildrenNum(
                      weddingEvent.id,
                      ($event.target as HTMLSelectElement).value,
                    )
                  "
                >
                  <option
                    v-for="n in inviteeEventsMap.get(weddingEvent.id)?.children"
                    :key="n"
                    :value="n"
                    :selected="n === inviteeEventsMap.get(weddingEvent.id)?.children"
                  >
                    {{ n }}
                  </option>
                  >
                </select>
                <label class="form__label" :for="`${weddingEvent.id}__children-num`"
                  >Children</label
                >
              </div>
            </div>
          </template>
        </div>
      </template>
    </form>
  </AModal>
</template>

<script lang="ts" setup>
import AModal from '~/components/atoms/AModal.vue'
import {
  type Invitee,
  type InviteeEvent,
  type InviteeRSVP,
  type InviteeRSVPEvent,
} from '~/types/model/wedding/invitee'
import { type WeddingEvent } from '~/types/model/wedding/weddingEvent'
import { type WeddingSettings } from '~/types/model/wedding/weddingSettings'
import { useWeddingRSVP } from '~/composables/wedding/useWeddingRSVP'

defineOptions({
  name: 'RSVPModal',
})

type Props = {
  isOpen: boolean
  weddingSettings: WeddingSettings | null
  weddingEvents: WeddingEvent[]
  invitee: Invitee
  inviteeRSVP: InviteeRSVP | null
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
})

defineEmits(['close'])

const { eventsWithRSVP } = useWeddingRSVP({
  // todo: refactor
  rsvpForm: props.weddingSettings ? toRef(props.weddingSettings, 'rsvpForm') : ref(null),
  weddingEvents: toRef(props, 'weddingEvents'),
  invitee: toRef(props, 'invitee'),
})

const inviteeEventsMap = computed(() => {
  const map = new Map<WeddingEvent['id'], InviteeEvent>()
  props.invitee?.events.forEach(event => map.set(event.eventId, event))

  return map
})

const inviteeRSVPEventsMap = computed(() => {
  const map = new Map<InviteeRSVPEvent['eventId'], InviteeRSVPEvent>()
  props.inviteeRSVP?.events.forEach(event => map.set(event.eventId, event))

  return map
})

// Forms

const name = ref(props.invitee?.name ?? '')
const contact = ref(props.invitee?.contact ?? '')

const initializeInviteeRSVP = () =>
  eventsWithRSVP.value.map(event => ({
    eventId: event.id,
    isAttending: false,
    ...inviteeEventsMap.value.get(event.id),
    ...inviteeRSVPEventsMap.value.get(event.id),
  }))

const inviteeRSVPEventsInput = ref<InviteeRSVPEvent[]>(initializeInviteeRSVP())
const inviteeRSVPEventsInputMap = computed(() => {
  const map = new Map<InviteeRSVPEvent['eventId'], InviteeRSVPEvent>()
  inviteeRSVPEventsInput.value.forEach(event => map.set(event.eventId, event))

  return map
})

const handleChangeAttendance = (weddingEventId: WeddingEvent['id'], value: string) => {
  inviteeRSVPEventsInput.value = inviteeRSVPEventsInput.value.map(event => ({
    ...event,
    isAttending: event.eventId === weddingEventId ? value === 'true' : event.isAttending,
  }))
}

const handleChangeAdultNum = (weddingEventId: WeddingEvent['id'], value: string) => {
  inviteeRSVPEventsInput.value = inviteeRSVPEventsInput.value.map(event => ({
    ...event,
    adult: event.eventId === weddingEventId ? Number(value) : event.adult,
  }))
}

const handleChangeChildrenNum = (weddingEventId: WeddingEvent['id'], value: string) => {
  inviteeRSVPEventsInput.value = inviteeRSVPEventsInput.value.map(event => ({
    ...event,
    children: event.eventId === weddingEventId ? Number(value) : event.children,
  }))
}

const handleSubmitForm = () => {}
</script>
<style lang="scss" scoped>
@import '@/assets/css/main';

.header {
  margin-block-end: 20px;
}

.description {
  @include font($size: $font-xl, $color: $white);
  margin-block-end: 20px;
}

.form.form--text-input {
  display: grid;
  margin-block-end: 20px;
  grid-template-columns: 100px 200px;
  grid-auto-rows: 30px;
  gap: 12px;
}

.form--text-input .form__label {
  align-self: center;
}

.form.form--radio {
  display: flex;

  & > * + * {
    margin-inline-start: 12px;
  }
}

.form--radio .form__label,
.form--radio .form__input {
  align-self: center;
  cursor: pointer;
}

.form--radio .form__label {
  margin-inline-start: 6px;
}

.item {
  background: rgba($white, 0.15);
  padding: 20px;
  border: 4px solid rgba($white, 0.15);
  border-radius: 4px;

  & + & {
    margin-block-start: 20px;
  }
}

.item__title {
  @include font($size: $font-xl, $color: $white) {
    font-weight: bold;
  }
  margin-block-end: 12px;
}

.item__form-question {
  @include font($size: $font-lg, $color: $white);
  margin-block-end: 8px;
}
</style>
