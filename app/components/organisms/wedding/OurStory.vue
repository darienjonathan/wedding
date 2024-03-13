<template lang="pug">
.our-story
  .heading__wrapper
    .heading {{ sectionSettings.title || 'OUR STORY' }}
  .kv
    .kv__main(v-if="sectionSettings.description.main") {{ sectionSettings.description.main }}
    .kv__sub(v-if="sectionSettings.description.sub") {{ sectionSettings.description.sub }}
  .story
    template(v-for="(story, index) in stories")
      .story__item(
        @click="handleStoryClick(index)"
        :style="{ cursor: isStorySelectable(story) ? 'pointer' : 'auto' }"
      )
        NuxtImg.story__thumbnail(
          :v-if="story.picture"
          :src="story.picture"
          loading="lazy"
        )
        .story__content.content
          .content__title {{ `${index + 1}. ${story.title}` }}
          .content__text {{ story.summary }}
          template(v-if="isStorySelectable(story)")
            .content__read-more {{ 'Read More' }}
  template(v-if="selectedStoryIndex !== undefined")
    StoryModal(
      :is-open="isStoryModalOpen"
      :story="stories[selectedStoryIndex]"
      @close="handleCloseStoryModal"
    )
</template>
<script lang="ts" setup>
import StoryModal from '~/components/organisms/wedding/StoryModal.vue'
import type { SectionSettings, Story } from '~/types/model/wedding/weddingSettings'

type Props = {
  stories: Story[]
  sectionSettings: SectionSettings
}

const props = defineProps({
  stories: {
    type: Array as () => Props['stories'],
    default: () => [],
  },
  sectionSettings: {
    type: Object as () => Props['sectionSettings'],
    required: true,
  },
})

/**
 * Download Images
 */

const isStorySelectable = (story: Story) => !!story.contents.length

const isStoryModalOpen = ref<boolean>(false)
const selectedStoryIndex = ref<number | undefined>()
const handleStoryClick = (index: number) => {
  if (!props.stories[index]?.contents?.length) return
  selectedStoryIndex.value = index
  isStoryModalOpen.value = true
}

const handleCloseStoryModal = () => {
  selectedStoryIndex.value = undefined
  isStoryModalOpen.value = false
}
</script>
<script lang="ts">
export default {
  name: 'OurStory',
  components: { StoryModal },
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.our-story {
  max-width: 1200px;
  margin: 0 auto;
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

.kv {
  & {
    @include font-family('marcellus');
    text-align: center;
    margin: 0 auto 60px;
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
      margin-bottom: 8px;
    }
    @include sp {
      @include font($size: $font-sm, $line-height: 1.5);
      margin-bottom: 16px;
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

.story {
  & {
    margin: 0 auto;
    display: grid;

    @include pc {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 300px;
      max-width: 800px;
    }

    @include sp {
      grid-auto-rows: 250px;
      max-width: 400px;
    }
  }

  &__item {
    position: relative;
  }

  &__thumbnail {
    @include absolute;
    @include size(100%, 100%);
    object-fit: cover;
    opacity: 0.4;
    box-shadow: 0 0 30px $black;
    filter: blur(2px);
  }
  &__content {
    & {
      position: relative;
      @include pc {
        padding: 30px;
      }
      @include sp {
        padding: 25px;
      }
    }
    .content {
      &__title,
      &__text {
        margin-bottom: 16px;
      }

      &__text,
      &__read-more {
        @include pc {
          @include font($size: $font-sm, $line-height: 1.35);
        }
        @include sp {
          @include font($size: $font-xs, $line-height: 1.35);
        }
      }

      &__title {
        @include font-family('marcellus');
        @include pc {
          @include font($size: $font-lg);
        }
        @include sp {
          @include font($size: $font-m);
        }
      }

      &__read-more {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}
</style>
