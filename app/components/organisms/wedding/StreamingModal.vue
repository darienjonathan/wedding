<template>
  <AModal :type="isSP ? 'full-size' : 'auto'" :is-open="isOpen" @close="$emit('close')">
    <header class="header">
      <h2 class="header__title">Attend Events Online</h2>
    </header>
    <div class="description">Below are the links to attend the events online.</div>
    <template v-for="weddingEvent in weddingEvents" :key="weddingEvent.id">
      <div class="item">
        <div class="item__title">{{ weddingEvent.eventName }}</div>
        <div class="item__content content">
          <div class="content__description">{{ formatDate(weddingEvent) }}</div>
          <a
            :href="weddingEvent.streamingLink"
            target="_blank"
            rel="noopener noreferrer"
            class="content__link"
          >
            {{ `Click here to attend "${weddingEvent.eventName}" online` }}
          </a>
        </div>
      </div>
    </template>
  </AModal>
</template>
<script lang="ts" setup>
import type { WeddingEvent } from '~/types/model/wedding/weddingEvent'
import AModal from '~/components/atoms/AModal.vue'

const dayjs = useNuxtApp().$dayjs

defineProps<{
  isOpen: boolean
  weddingEvents: WeddingEvent[]
}>()

defineEmits(['close'])

const formatDate = ({ timestamp, timezone }: WeddingEvent) =>
  dayjs(timestamp).tz(timezone).format('dddd, D MMMM YYYY, HH:mm')

const { isSP } = useMedia()
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

.content__description {
  @include font($size: $font-lg, $color: $white);
  margin-block-end: 8px;
}

.content__link {
  @include font($size: $font-lg, $color: $white);
}
</style>
