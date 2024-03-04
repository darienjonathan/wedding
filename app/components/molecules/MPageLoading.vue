<template lang="pug">
.slot(:data-show="showSlot")
  slot
.loading-wrapper(
  ref="loadingWrapperRef"
  :data-show="showLoading"
)
  ALoading.loading-ui
</template>
<script lang="ts" setup>
import ALoading from '~/components/atoms/ALoading.vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const { defineViewportVariables } = useViewportUnitSizes(false)

const showLoading = ref(true)
const showSlot = ref(false)

const loadingWrapperRef = ref<HTMLDivElement | null>()

const unwatch = watch(
  () => props.isLoading,
  (isLoading: boolean) => {
    if (isLoading) return

    if (!loadingWrapperRef.value) return
    showLoading.value = false

    loadingWrapperRef.value.addEventListener(
      'transitionend',
      (event: TransitionEvent) => {
        const loadingElement = event.target as HTMLDivElement
        if (!loadingElement) return

        const isShown = (event.target as HTMLDivElement).dataset.show === 'true'
        if (isShown) return

        // remove the loading element
        loadingElement.style.display = 'none'

        // show the slot element, then after the scrollbar (if exists) shows, recalculate vw & vh values
        showSlot.value = true
        nextTick(() => {
          defineViewportVariables()
        })
      },
      { once: true }
    )
  }
)

onUnmounted(() => {
  unwatch()
})
</script>
<script lang="ts">
export default {
  name: 'MPageLoading',
  components: { ALoading },
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

$transition-time: 0.25s;

.slot,
.loading-wrapper {
  opacity: 0;
  transition: opacity $transition-time ease-in-out;
  &[data-show='true'] {
    opacity: 1;
  }
}

.slot {
  height: 0;
  &[data-show='true'] {
    height: auto;
  }
}

.loading-wrapper {
  @include size(100%, 100%);
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
}

.loading-ui {
  @include absolute-center;
}
</style>
