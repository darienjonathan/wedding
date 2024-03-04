<template lang="pug">
AModal.story-modal(
  :is-open="props.isOpen"
  :width="isSP ? 'calc(100% - 50px)' : '75%'"
  @close="$emit('close')"
)
  .inner
    .heading
      h2.heading__main {{ story.title }}
    .content
      img.content__thumbnail(
        loading="lazy"
        :src="story.thumbnail"
      )
      .content__full-text
        template(v-for="content in story.contents")
          .content__paragraph {{ content }}
</template>

<script lang="ts" setup>
import AModal from '~/components/atoms/AModal.vue'
import ALoading from '~/components/atoms/ALoading.vue'
import type { Story } from '~/types/model/wedding/story'

type Props = {
  isOpen: boolean
  story: Story
}

const props = defineProps({
  isOpen: {
    type: Boolean as () => Props['isOpen'],
    default: false,
  },
  story: {
    type: Object as () => Props['story'],
    required: true,
  },
})

const { isSP } = useMedia()

defineEmits(['close'])
</script>
<script lang="ts">
export default {
  name: 'StoryModal',
  components: { AModal, ALoading },
}
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
