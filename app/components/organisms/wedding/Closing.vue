<template lang="pug">
.closing
  .text
    .text__main {{ 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast. For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.' }}
    .text__sub {{ 'Ephesians 2:8-10 (ESV)' }}
</template>
<script lang="ts" setup></script>
<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Closing',
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.closing {
  margin: 0 auto;
  @include pc {
    max-width: 1200px;
  }
}

.text {
  @include font-family('marcellus');
  @include font($line-height: 1.5);
  text-align: center;
  &__main {
    margin-bottom: 8px;
  }

  &__sub {
    @include font($size: $font-sm);
  }
}
</style>
