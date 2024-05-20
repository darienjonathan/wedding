<template lang="pug">
.footer(:data-type="type")
  .footer__text.text
    .text__item {{ curatedText }}
    .text__item.text__item--emphasis {{ curatorText }}
  .footer__links
    a.footer__link(
      :href="baseURL"
      target="_blank"
    )
      img.footer__icon(src="@/assets/images/brand/brand_icon_dark.svg")
    template(v-if="type === 'self'")
      a.footer__link(
        href="https://darienjonathan.com"
        target="_blank"
      )
        img.footer__icon.footer__icon--blog(src="@/assets/images/sns/blog.png")
</template>
<script lang="ts" setup>
import type { Footer } from '~/types/model/wedding/weddingSettings'

defineOptions({
  name: 'ContentFooter',
})

type Props = {
  type: Footer['type']
}

const props = defineProps<Props>()

const { baseURL, brand } = useRuntimeConfig().public

const curatedText = computed(() =>
  props.type === 'self' ? 'Curated with love by:' : 'Curated by:',
)
const curatorText = computed(() => (props.type === 'self' ? 'Calon Pengantin Pria' : brand))
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.footer {
  & {
    padding: 10px 0;
    display: grid;
    justify-content: center;
    align-items: center;
    align-content: center;
    column-gap: 6px;
    grid-template-columns: repeat(2, auto);

    &[data-type='self'] {
      @include sp {
        grid-template-columns: auto;
      }
    }
  }

  &__text {
    &.text {
      display: flex;
      @include flex-gap($column-gap: 0.2ch);

      &__item {
        @include font-family('marcellus');

        &--emphasis {
          font-weight: bold;
        }
      }
    }
  }

  &__links {
    @include flex;
    gap: 12px;
  }

  &__link {
    @include font-family('cabin');
    @include flex($justify: flex-start);
    @include font($line-height: 2.25);
  }

  &__icon {
    height: 30px;

    &--blog {
      height: 35px;
    }
  }
}
</style>
