<template lang="pug">
.loading(
  :style="{ width, height }"
  :data-type="loadingType"
)
</template>
<script lang="ts" setup>
import { useInjectLoading } from '~/composables/dependencyInjection/useLoadingDependencyInjection'

defineOptions({
  name: 'ALoading',
})

type Props = {
  width?: string
  height?: string
}

withDefaults(defineProps<Props>(), {
  width: '',
  height: '',
})
const { loadingType } = useInjectLoading()
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.loading {
  width: 48px;
  height: 48px;
  display: inline-block;
  position: relative;

  &::after,
  &::before {
    content: '';
    @include size(100%, 100%);
    box-sizing: border-box;
    border-width: 2px;
    border-style: solid;
    position: absolute;
    left: 0;
    top: 0;
    animation: rotation 5s ease-in-out infinite alternate;
  }

  &::after {
    animation-direction: alternate-reverse;
  }

  &[data-type='default'] {
    &::before {
      border-color: $white;
    }

    &::after {
      border-color: $navy-blue-light;
    }
  }

  &[data-type='wedding'] {
    &::before {
      border-color: $wedding_brown;
    }

    &::after {
      border-color: $wedding_green;
    }
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
