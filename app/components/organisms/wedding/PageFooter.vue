<template>
  <div class="footer" :data-type="type">
    <div class="footer__text text">
      <div class="text__item">{{ curatedText }}</div>
      <div class="text__item text__item--emphasis">{{ curatorText }}</div>
    </div>
    <div class="footer__links">
      <a class="footer__link" :href="baseURL" target="_blank">
        <img class="footer__icon" src="@/assets/images/brand/brand_icon_dark.svg" />
      </a>
      <template v-if="type === 'self'">
        <a class="footer__link" href="https://darienjonathan.com" target="_blank">
          <img class="footer__icon footer__icon--blog" src="@/assets/images/sns/blog.png" />
        </a>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Footer } from '~/types/model/wedding/weddingSettings'

defineOptions({
  name: 'PageFooter',
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
