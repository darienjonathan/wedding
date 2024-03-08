<template lang="pug">
.wrapper
  .error
    .error__text.-heading {{ `${error?.statusCode}: ${error?.statusMessage}` }}
    .error__text.-subheading {{ error?.message || error?.cause }}
</template>
<script lang="ts" setup>
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
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
