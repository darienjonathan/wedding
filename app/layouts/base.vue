<template lang="pug">
.base
  slot
</template>

<script lang="ts" setup>
useModal()
useViewportUnitSizes(true)

if (process.env.NODE_ENV === 'development') {
  useEmulator()
}
</script>
