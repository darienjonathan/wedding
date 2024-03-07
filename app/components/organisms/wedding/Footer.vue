<template lang="pug">
.footer
  .footer__text.text
    .text__item {{ curatedText }}
    .text__item.text__item--emphasis {{ curatorText }}
  .footer__links
    a.footer__link(
      href="https://github.com/darienjonathan/wedding"
      target="_blank"
    )
      img.footer__icon(src="@/assets/images/sns/icon-github-white.png")
    template(v-if="type === 'self'")
      a.footer__link(
        href="/blogs"
        target="_blank"
      )
        img.footer__icon.footer__icon--blog(src="@/assets/images/sns/blog.png")
</template>
<script lang="ts" setup>
import type { Footer } from '~/types/model/wedding/weddingSettings'

type Props = {
  type: Footer['type']
}

const props = defineProps<Props>()

const curatedText = computed(() =>
  props.type === 'self' ? 'Curated with love by:' : 'Curated by:'
)
const curatorText = computed(() =>
  props.type === 'self' ? 'Calon Pengantin Pria' : 'darienjonathan'
)
</script>
<script lang="ts">
export default {
  name: 'WeddingFooter',
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

$size: 20px;

.footer {
  & {
    display: grid;
    justify-content: center;
    align-items: center;
    align-content: center;
    column-gap: 12px;
    @include pc {
      grid-template-columns: repeat(2, auto);
    }
  }

  &__text,
  &__sns {
    height: $size;
  }

  &__text {
    &.text {
      display: flex;
      @include flex-gap($column-gap: 0.5ch);

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
    height: $size;

    &--blog {
      height: $size * 1.75;
    }
  }
}
</style>
