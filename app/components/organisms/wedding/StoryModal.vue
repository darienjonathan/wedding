<template>
  <AModal
    :is-open="props.isOpen"
    :width="isSP ? 'calc(100% - 50px)' : '75%'"
    @close="$emit('close')"
  >
    <div class="inner">
      <div class="heading">
        <h2 class="heading__main">{{ story.title }}</h2>
      </div>
      <div class="content">
        <NuxtImg
          v-if="story.picture"
          class="content__thumbnail"
          :src="story.picture"
          loading="lazy"
        />
        <div class="content__full-text">
          <template v-for="(content, index) in story.contents" :key="index">
            <div class="content__paragraph">{{ content }}</div>
          </template>
        </div>
      </div>
    </div>
  </AModal>
</template>

<script lang="ts" setup>
import AModal from '~/components/atoms/AModal.vue'
import type { Story } from '~/types/model/wedding/weddingSettings'

defineOptions({
  name: 'StoryModal',
})

type Props = {
  isOpen: boolean
  story: Story
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
})

const { isSP } = useMedia()

defineEmits(['close'])
</script>
<style lang="scss" scoped>
@import '@/assets/css/main';

.heading {
  & {
    margin-bottom: 32px;
    padding-right: 28px;
  }

  &__main {
    @include font-family('marcellus');
    @include font($size: $font-xxxl, $letter-spacing: 1px);
    text-transform: uppercase;
  }
}

.content {
  &__thumbnail {
    margin-bottom: 32px;
    @include pc {
      max-width: 450px;
      max-height: 300px;
    }
    @include sp {
      width: 100%;
    }
  }

  &__paragraph {
    line-height: 1.5;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>
