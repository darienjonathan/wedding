<template lang="pug">
.footer
  .footer__text.text
    span.text__item {{ 'Curated with love by: ' }}
    span.text__item.text__item--emphasis {{ 'Calon Pengantin Pria' }}
  .footer__links
    a.footer__link(
      href="https://github.com/darienjonathan/darienjonathan"
      target="_blank"
    )
      img.footer__icon(src="@/assets/images/sns/icon-github-white.png")
    a.footer__link(
      href="/blogs"
      target="_blank"
    )
      img.footer__icon.footer__icon--blog(src="@/assets/images/sns/blog.png")
</template>
<script lang="ts" setup></script>
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
    .text {
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
