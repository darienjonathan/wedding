<template lang="pug">
Base
  .wrapper
    slot
</template>

<script lang="ts" setup>
import Base from '~/layouts/base.vue'
</script>
<script lang="ts">
export default {
  name: 'DefaultLayout',
  components: { Base },
}
</script>
<style lang="scss" scoped>
@import '@/assets/css/main';
.wrapper {
  overflow-x: hidden;
  background: $navy-dark;
  min-width: vw(100);
  min-height: vh(100);
}
</style>
