<template lang="pug">
.registry
  .heading__wrapper
    .heading {{ sectionSettings.title.toLocaleUpperCase() || 'REGISTRY' }}
  .kv
    .kv__main {{ sectionSettings.description.main }}
    .kv__sub {{ sectionSettings.description.sub }}
  .account__wrapper
    .account
      template(v-for="registry in registries")
        .account__item.item
          template(v-for="[label, value] in Object.entries(registry)")
            .item__label {{ label }}
            .item__value {{ value }}
</template>
<script lang="ts" setup>
import type { Registry, SectionSettings } from '~/types/model/wedding/weddingSettings'

type Props = {
  registries: Registry[]
  sectionSettings: SectionSettings
}

defineProps<Props>()
</script>
<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Registry',
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.heading {
  &__wrapper {
    margin-bottom: 12px;
  }

  & {
    @include font-family('marcellus');
    text-align: center;
    @include pc {
      @include font($size: $font-xl, $letter-spacing: 1px);
    }
    @include sp {
      @include font($size: $font-lg, $letter-spacing: 1px);
    }
  }
}

.kv {
  & {
    @include font-family('marcellus');
    text-align: center;
    margin: 0 auto 40px;
    @include pc {
      padding: 0 40px;
      max-width: 1200px;
    }
    @include sp {
      width: 100%;
      padding: 0 20px;
    }
  }

  &__main {
    white-space: pre-line;
    @include pc {
      margin-bottom: 4px;
    }
    @include sp {
      @include font($size: $font-sm, $line-height: 1.5);
      margin-bottom: 8px;
    }
  }

  &__sub {
    @include pc {
      @include font($size: $font-sm);
    }
    @include sp {
      @include font($size: $font-xs);
    }
  }
}

.account {
  &__wrapper {
    @include flex;
  }

  & {
    @include flex;

    @include pc {
      @include flex-gap(100px, 40px);
      max-width: 800px;
    }

    @include sp {
      @include flex-gap(40px, 40px);
    }
  }
}

.item {
  display: grid;
  grid-template-columns: minmax(100px, 1fr) 1fr;
  align-items: center;
  gap: 8px 20px;

  &--jp {
    @include font-family('noto-sans-jp');
  }

  &__label {
    font-weight: bold;
  }

  @include sp {
    &__label,
    &__value {
      @include font($size: $font-sm);
    }
  }
}
</style>
