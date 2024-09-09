<template>
  <div class="a-select">
    <div class="label">{{ label }}</div>
    <div class="items">
      <template v-for="(item, index) in items" :key="index">
        <div class="item">
          <input
            v-model="selectedItemIndex"
            class="item__radio"
            type="radio"
            :value="index"
            :disabled="isDisabled"
          />
          <div class="item__label">{{ item }}</div>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { ASelect } from '~/types/components'

type Props = Pick<ASelect, 'isDisabled' | 'label' | 'items'>

withDefaults(defineProps<Props>(), {
  isDisabled: false,
})

const emit = defineEmits<{
  (e: 'change', item: number): void
}>()

const selectedItemIndex = ref<number>()

watch(selectedItemIndex, () => {
  if (selectedItemIndex.value === undefined) return
  emit('change', selectedItemIndex.value)
})
</script>
<style lang="scss" scoped>
@import '@/assets/css/main';
.a-select {
  .label {
    @include font($size: $font-sm, $color: $black) {
      font-weight: bold;
    }
    margin-bottom: 8px;
  }

  .item {
    $line-height: 1.25;
    $font-size: $font-sm;
    @include flex($justify: flex-start, $align-items: flex-start);
    @include font($size: $font-sm, $color: $black, $line-height: $line-height);
    margin-bottom: 4px;

    &__radio {
      flex: none;
      min-width: 0;
      $size: $line-height * $font-size;
      @include size($size, $size);
      margin-right: 4px;
      cursor: pointer;
      &:disabled {
        cursor: auto;
      }
    }
  }
}
</style>
