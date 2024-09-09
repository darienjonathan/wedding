<template>
  <div class="wrapper">
    <div class="container">
      <div class="error">
        <div class="error__text -heading">{{ heading }}</div>
        <div class="error__text -subheading">{{ subheading }}</div>
      </div>
      <a :href="baseURL">
        <img class="logo" src="~/assets/images/brand/brand_light.svg" />
      </a>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const baseURL = useRuntimeConfig().public.baseURL

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

definePageMeta({
  layout: 'base',
})
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.wrapper {
  @include size(100vw, 100vh);
  @include flex;
}

.container {
  @include flex($direction: column, $align-items: flex-start);
  @include flex-gap($row-gap: 60px);
  padding: 20px;
}

.logo {
  width: 200px;
}

.error {
  @include font-family('marcellus');
}
.error__text.-heading {
  @include font($size: $font-huge, $color: $black, $line-height: 2);
  margin-bottom: 16px;
}

.error__text.-subheading {
  @include font($size: $font-lg, $color: $black, $line-height: 1.5);
}
</style>
