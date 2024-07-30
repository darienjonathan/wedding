<template lang="pug">
.closing
  .heading__wrapper(v-if="sectionSettings.title")
    .heading {{ sectionSettings.title }}
  .text
    .text__main {{ sectionSettings.description.main }}
    .text__sub {{ sectionSettings.description.sub }}
</template>
<script lang="ts" setup>
import type { SectionSettings } from '~/types/model/wedding/weddingSettings'

defineOptions({
  name: 'ContentClosing',
})

type Props = {
  sectionSettings: SectionSettings
}

defineProps<Props>()
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.closing {
  margin: 0 auto;
  @include pc {
    max-width: 1200px;
  }
}

.heading {
  &__wrapper {
    margin-bottom: 60px;
  }

  & {
    @include font-family('marcellus');
    text-align: center;
    margin-bottom: 20px;
    @include pc {
      @include font($size: $font-xxhuge, $letter-spacing: 2px);
    }
    @include sp {
      @include font($size: $font-xhuge, $letter-spacing: 2px);
    }
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
