<template lang="pug">
.wrapper
  .container
    img.logo(src="~/assets/images/brand/brand_light.svg")
    a.link(href="https://github.com/darienjonathan/wedding" target="_blank" rel="noreferrer noopener") 
      img.link__icon(src="~/assets/images/sns/icon-github.png")
      .link__text darienjonathan/wedding
</template>
<script lang="ts" setup>
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
  @include flex($direction: column);
  padding: 20px;
}

.logo {
  width: 200px;
}

.link {
  @include flex($justify: flex-start);
  @include flex-gap($column-gap: 8px);
  @include font-family('marcellus');
}

.link__icon {
  width: 20px;
}
.link__text {
  @include font($color: $black, $line-height: 2);
}
</style>
