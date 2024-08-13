<template>
  <div class="m-input">
    <div class="input__label">{{ label }}</div>
    <div class="input__item">
      <slot />
    </div>
    <div class="input__notes">
      <div v-if="!!noteText" class="note" data-type="note">{{ noteText }}</div>
      <div v-if="!!errorText" class="note" data-type="error">{{ errorText }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'MInput',
})

type Props = {
  label: string
  noteText?: string
  errorText?: string
}

withDefaults(defineProps<Props>(), {
  noteText: '',
  errorText: '',
})
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.m-input {
  display: grid;
  grid-template-areas:
    'label item'
    'label notes';
  gap: 4px 0;
  @include pc {
    grid-template-columns: 140px 1fr;
  }
  @include sp {
    grid-template-columns: 130px 1fr;
  }
}

.input {
  &__label {
    grid-area: label;
    @include sp {
      @include font($size: $font-sm);
    }
  }
  &__item {
    @include flex($justify: flex-start);
    flex-wrap: wrap;
    min-width: 0;
    grid-area: item;
    @include sp {
      @include font($size: $font-sm);
    }
  }
  &__notes {
    grid-area: notes;
  }
}

.note {
  @include font($size: $font-xs);
  &[data-type='error'] {
    color: $red-light;
  }
}
</style>
