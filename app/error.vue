<template lang="pug">
.wrapper
  .error
    .error__text.-heading {{ heading }}
    .error__text.-subheading {{ subheading }}
</template>
<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

const heading = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return '404: Page Not Found'
    default:
      return `${props.error?.statusCode}: ${props.error?.statusMessage}`
  }
})
const subheading = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return "We hope that is not also the case regarding your partner (if you're looking for one, though)."
    default:
      return props.error?.message || props.error?.cause
  }
})
</script>
<script lang="ts">
definePageMeta({
  layout: 'base',
})
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.wrapper {
  @include flex;
  @include size(100vw, 100vh);
  background-color: $wedding_brown;
}

.error {
  line-height: 3;
}
.error__text.-heading {
  @include font($size: $font-huge, $color: $wedding_green-lighter, $line-height: 2);
}

.error__text.-subheading {
  @include font($size: $font-lg, $color: $wedding_green-lighter, $line-height: 3);
}
</style>
