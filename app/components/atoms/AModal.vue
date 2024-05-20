<template lang="pug">
.a-modal(v-show="isOpen")
  transition(
    name="fade"
    @after-leave="$emit('close')"
    appear
  )
    .overlay(
      @click="handleClose"
      v-show="isModalOpen"
    )
      .wrapper(
        :style="{ width, height }"
        :data-type="type"
        @click.stop
      )
        slot
        .close__btn(@click="handleClose")
          .close__icon.material-icons-outlined close
</template>
<script lang="ts" setup>
import { useModalStore } from '~/store'

type Props = {
  type: 'default' | 'full-size' | 'auto' | 'frameless'
  width?: string
  height?: string
  isOpen: boolean
}
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  width: '',
  height: '',
  isOpen: false,
})

const modalStore = useModalStore()

const { isOpen } = toRefs(props)
const isModalOpen = ref(false)

watch(
  isOpen,
  (currentValue, prevValue) => {
    const isOpened = !prevValue && currentValue
    if (isOpened) {
      isModalOpen.value = true
      modalStore.incrementModalCount()
    }

    const isClosed = prevValue && !currentValue
    if (isClosed) {
      // if it's closed from outside, set isModalOpen to false
      isModalOpen.value = false
      modalStore.decrementModalCount()
    }
  },
  {
    immediate: true,
  },
)

const handleClose = () => {
  isModalOpen.value = false
}

onUnmounted(() => {
  modalStore.decrementModalCount()
})
</script>
<style lang="scss" scoped>
@use 'sass:math';
@import '@/assets/css/main';

.a-modal {
  @include size(vw(100), vh(100));
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10000;
}

.overlay {
  @include size(100%, 100%);
  position: fixed;
  left: 0;
  top: 0;
  background: rgba($white, 0.25);
}

.wrapper {
  @include absolute-center;
  border-radius: $radius-sm;
  background-color: $black;
  color: $white;
  box-shadow: 0 0 12.5px $black;
  max-height: vh(80);
  max-width: vw(80);
  overflow-y: auto;
  @include pc {
    padding: 32px;
  }
  @include sp {
    padding: 24px;
  }
  &[data-type='default'] {
    height: auto;
    overflow: auto;
    @include pc {
      width: 768px;
    }
    @include sp {
      width: calc(100% - 20px);
    }
  }
  &[data-type='auto'] {
    @include size('auto', 'auto');
  }
  &[data-type='full-size'] {
    @include size(100%, 100%);
    max-width: initial;
    max-height: initial;
  }
  &[data-type='frameless'] {
    padding: 0;
  }
}

.close {
  $icon-size: 3rem;
  &__btn {
    $btn-el-size: math.div(2, 3) * $icon-size;
    @include size($btn-el-size, $btn-el-size);
    @include pc {
      @include absolute(32px, 32px);
    }
    @include sp {
      @include absolute(24px, 24px);
    }
    @include flex;

    @at-root {
      .wrapper[data-type='frameless'] .close__btn {
        mix-blend-mode: difference;
      }
    }
  }
  &__icon {
    @include font($size: $icon-size, $line-height: 1);
    cursor: pointer;
    transition: filter 0.25s;
    &:hover {
      filter: drop-shadow(0 0 2px $white);
    }
  }
}
</style>
