<template lang="pug">
.our-story
  .heading__wrapper
    .heading {{ 'OUR STORY' }}
  .story
    template(v-for="(story, index) in stories")
      .story__item(
        @click="handleStoryClick(index)"
        :style="{ cursor: isStorySelectable(story) ? 'pointer' : 'auto' }"
      )
        img.story__thumbnail(
          loading="lazy"
          :src="story.thumbnail"
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
import type { Invitee } from 'types/model/wedding/invitee'
import StoryModal from '~/components/organisms/wedding/StoryModal.vue'
import type { Story } from '~/types/model/wedding/story'

import story1 from '~/assets/images/wedding/story/story_1.jpg'
import story2 from '~/assets/images/wedding/story/story_2.jpg'
import story3 from '~/assets/images/wedding/story/story_3.jpg'
import story4 from '~/assets/images/wedding/story/story_4.jpg'

type Props = {
  invitee: Invitee | null
}

defineProps({
  invitee: {
    type: Object as () => Props['invitee'],
    default: null,
  },
})

const stories: Story[] = [
  {
    title: 'Music Director and Pianist',
    thumbnail: story1,
    summary:
      'Their first meaningful interaction through melodies coming from the white and black they both know and love.',
    contents: [
      "They were both studying under the same faculty in a certain university, though in different majors. While they were members of that faculty's Christian Community, essentialy they didn't know each other, until the community's certain Easter Celebration Event, in which he was assigned to be the music director for the event's worship team. She took the pianist role in that team.",
      "They got along pretty well enough through the event's preparation. However, after the event ended, their communication also ended. The cause being he was already graduated at that time, and after that event there were nothing that necessitates their presence in the same place and the same time.",
      'The most important thing, though, is that through that event they understand that both of them know and love piano, albeit in different ways. He, who is mostly self-taught, has plenty of practical experience in non-classical music to make up for his terrible reading speed and technical skills. She, on the other hand, has classical music being part of her life since her childhood.',
      'Sometime later, he moved to another country for a job.',
    ],
  },
  {
    title: 'Is Christ Enough?',
    thumbnail: story2,
    summary:
      'He tried to grow seeds of love that were planted there, but it was futile. "Is Christ enough for you?", said his senior who saw how pitiful he was in the wake of the rejection.',
    contents: [
      "Living overseas and lonely, he looked at his snapchat friend list, hoping to find a companion for his lonely days, and this 'Daisy' person left a nice impression for him through the aforementioned event. Hence, 「お誕生日おめでとう！」 message sent as a birthday greeting to her, hoping to start a conversation.",
      'Apparently she responded well, which motivated him to try taking the relationship to further stages. While geographical distance meant chat is the only way for him to win over her, things went exceptionally well.',
      'He actually never had a chance, though. He was stubborn eventhough she already gave some warning signals, until a strong word of rejection came, and ended it all. "The sparks were not there", she said. Music was enough to get them close, but not enough to bring them to the next step.',
      'Left devastated and unable to concentrate in work, he contacted his senior to pour his miserable heart, who responded with "Is Christ enough for you?" after seeing that he probably had dethroned Jesus and in exchange put her on the pedestal of his heart.',
    ],
  },
  {
    title: 'The Sacred Search',
    thumbnail: story3,
    summary:
      'They soon found out that this cut-off time was a huge gamechanger for each of them, though, in which they searched within themselves, who, or what, are they truly searching for.',
    contents: [
      'For the sake of both parties, they both agreed to amicably cut-off their communication for a while.',
      "While his efforts ended in a failure, this has become a very meaningful experience for him. Through this experience, he realized that while he considers himself as a Christian, there were only feint traces of Christianity in how he approach his dating life, which lead him to rethink his relationship with Jesus, and to learn about Christian's worldview of dating.",
      'Unexpectedly, she also gave a lot of thought about this relationship even after she rejected him. He is unattractive and unable to bring "the sparks" to the relationship, which he acknowledges and admits. However, while attractiveness is certainly an important aspect of a relationship, if what she is seeking is based on Christianity which main objective is Christ-centered marriage, attractiveness should not be that important so that it eclipses all other boring qualities he has which probably bring more value to achieve the objective, should it?',
      'After some time, she decided to take a huge gamble: to be very rational to herself by disregarding the absence of "the sparks" towards him, and hoping that he has enough other qualities that bring more value to the ideal relationship she envisages. In the end, she agreed to try making it work.',
      'To answer her faith in him making this relationship work, in addition to him actually understands very well that attractiveness is still a very important part to have a healthy and happy relationship, he tried (and still trying) his best to improve in that category.',
      'Thankfully, the gamble paid off. They went off to a flying start.',
    ],
  },
  {
    title: 'The Sacred Marriage',
    thumbnail: story4,
    summary:
      'Finally, there is really nothing to write home about this relationship, except the above-average amount of time they spent being separated geographically to pursue their own dreams, until they decided to pursue their dreams together as one, and here they are.',
    contents: [],
  },
]

const isStorySelectable = (story: Story) => !!story.contents.length

const isStoryModalOpen = ref<boolean>(false)
const selectedStoryIndex = ref<number | undefined>()
const handleStoryClick = (index: number) => {
  if (!stories[index]?.contents?.length) return
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
