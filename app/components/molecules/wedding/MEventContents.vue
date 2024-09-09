<template>
  <div class="m-event-contents">
    <header class="m-event-contents__header">
      <h2 class="m-event-contents__title">{{ title }}</h2>
    </header>
    <div class="m-event-contents__description">
      {{ description }}
    </div>
    <template v-for="weddingEvent in weddingEvents" :key="weddingEvent.id">
      <div class="m-event-contents__content content">
        <div class="content__title">{{ weddingEvent.eventName }}</div>
        <slot name="content" :wedding-event="weddingEvent"></slot>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { WeddingEvent } from '~/types/model/wedding/weddingEvent'
defineProps<{
  title: string
  description: string
  weddingEvents: WeddingEvent[]
}>()
</script>
<style lang="scss" scoped>
@import '@/assets/css/main';

.m-event-contents__header {
  margin-block-end: 20px;
}

.m-event-contents__description {
  @include font($size: $font-xl, $color: $white);
  margin-block-end: 20px;
}

.content {
  background: rgba($white, 0.15);
  padding: 20px;
  border: 4px solid rgba($white, 0.15);
  border-radius: 4px;

  & + & {
    margin-block-start: 20px;
  }
}

.content__title {
  @include font($size: $font-xl, $color: $white) {
    font-weight: bold;
  }
  margin-block-end: 12px;
}
</style>
