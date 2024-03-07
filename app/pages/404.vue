<template lang="pug">
.wrapper
  .error
    .error__text.-heading 404: Page Not Found.
    .error__text.-subheading We hope that is not also the case regarding your partner (if you're looking for one, though).
</template>
<script>
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
