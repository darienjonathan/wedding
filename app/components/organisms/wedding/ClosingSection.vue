<template>
  <div class="closing">
    <div v-if="sectionSettings.title" class="heading__wrapper">
      <div class="heading">{{ sectionSettings.title }}</div>
    </div>
    <div class="text">
      <div class="text__main">{{ sectionSettings.description.main }}</div>
      <div class="text__sub">{{ sectionSettings.description.sub }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { SectionSettings } from '~/types/model/wedding/weddingSettings'

defineOptions({
  name: 'ClosingSection',
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
