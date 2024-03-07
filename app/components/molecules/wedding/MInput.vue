<template lang="pug">
.m-input
  .input__label {{ label }}
  .input__item
    slot
  .input__notes
    .note(
      data-type="note"
      v-if="!!noteText"
    ) {{ noteText }}
    .note(
      data-type="error"
      v-if="!!errorText"
    ) {{ errorText }}
</template>
<script lang="ts" setup>
interface Props {
  label: string
  noteText?: string
  errorText?: string
}
defineProps({
  label: {
    type: String as () => Props['label'],
    required: true,
  },
  noteText: {
    type: String as () => Props['noteText'],
    default: '',
  },
  errorText: {
    type: String as () => Props['errorText'],
    default: '',
  },
})
</script>
<script lang="ts">
export default {
  name: 'MInput',
}
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
