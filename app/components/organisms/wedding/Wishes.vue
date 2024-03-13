<template lang="pug">
.wishes
  .heading__wrapper
    .heading {{ sectionSettings.title || 'GREETINGS & WISHES' }}
  .content
    .content__form.form
      input.form__name(
        type="text"
        placeholder="Name"
        :value="currentWish.name"
        @input="handleInputName"
      )
      textarea.form__textarea(
        placeholder="Your greetings & wishes for the couple"
        :value="currentWish.content"
        @input="handleInputContent"
      )
      button.form__submit(
        :disabled="!canSubmit"
        @click="handleSubmit"
      ) {{ submitButtonText }}
    .content__item.item(:data-empty="!sortedWishes.length")
      template(v-if="sortedWishes.length")
        template(v-for="{ name, timestamp, content } in sortedWishes")
          .item__wrapper
            .item__name {{ name }}
            .item__date {{ wishTimestampToString(timestamp) }}
            .item__content {{ content }}
      template(v-else)
        .item__empty-text {{ 'Be the first to greet the couple!' }}
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import type { Unsubscribe } from 'firebase/firestore'
import useUid from '~/composables/wedding/useUid'
import type { SectionSettings } from '~/types/model/wedding/weddingSettings'
import type { Wish } from '~/types/model/wedding/wish'

const WISH_UID_LOCALSTORAGE_KEY = 'wish_uid'

type Props = {
  tenantId: string
  sectionSettings: SectionSettings
}

const props = defineProps<Props>()

const { uid } = useUid()
const { useWishes } = useFirestoreCollections()
const wishesFirestore = useWishes(props.tenantId)

const existingWish = ref<Wish>()
const currentWish = ref<Wish>({
  name: '',
  timestamp: 0,
  content: '',
})

const wishTimestampToString = (timestamp: Wish['timestamp']) =>
  dayjs(timestamp).format('D MMMM YYYY')

const isUpdate = computed(() => wishUid.value !== undefined && existingWish.value !== undefined)

// Existing wish's identifier
const wishUid = ref<string>()
const updateWishUid = () => {
  wishUid.value = localStorage.getItem(WISH_UID_LOCALSTORAGE_KEY) || uid.value || undefined
}
onMounted(updateWishUid)

// Subscribe to Wishes
const wishes = ref<Wish[]>([])
const sortedWishes = computed(() => wishes.value.sort((wa, wb) => wb.timestamp - wa.timestamp))
const unsubscribeWishes = ref<Unsubscribe>()
onMounted(() => {
  wishesFirestore.subscribeCollection(wishMap => {
    if (!wishMap) return
    wishes.value = Array.from(wishMap.values())

    if (wishUid.value) {
      const fetchedWish = wishMap.get(wishUid.value)
      existingWish.value = structuredClone(fetchedWish)
      currentWish.value = structuredClone(fetchedWish) || currentWish.value
    }
  })
})
onUnmounted(() => {
  if (!unsubscribeWishes.value) return
  unsubscribeWishes.value()
})

// Submit
const canSubmit = computed(() => {
  const isInputComplete = !!currentWish.value.name.trim() && !!currentWish.value.content.trim()

  if (!isUpdate.value) return isInputComplete

  const hasNameChange = existingWish.value?.name.trim() !== currentWish.value.name.trim()
  const hasContentChange = existingWish.value?.content.trim() !== currentWish.value.content.trim()
  const hasChange = hasNameChange || hasContentChange

  return isInputComplete && hasChange
})

const submitButtonText = computed(() => (isUpdate.value ? 'Update' : 'Submit'))

// Event Handler
const handleInputName = (e: Event) => {
  const name = (e.target as HTMLInputElement).value
  currentWish.value.name = name
}

const handleInputContent = (e: Event) => {
  const content = (e.target as HTMLTextAreaElement).value
  currentWish.value.content = content
}

const handleSubmit = () => {
  if (!canSubmit.value) return
  currentWish.value.timestamp = Date.now()

  const uid = wishUid.value && isUpdate.value ? wishUid.value : wishesFirestore.getNewId()
  wishesFirestore.set(uid, currentWish.value).then(() => {
    // NOTE: refs are proxies, which cannot be structuredCloned, thus toRaw being used to get rid of the proxy
    existingWish.value = structuredClone(toRaw(currentWish.value))
    localStorage.setItem(WISH_UID_LOCALSTORAGE_KEY, uid)
    updateWishUid()
  })
}
</script>
<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Wishes',
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.wishes {
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

.content {
  display: grid;
  gap: 40px;
  @include pc {
    grid-template-columns: 2fr 3fr;
    height: 300px;
  }
}

.form {
  & {
    @include flex($direction: column, $justify: flex-start, $align-items: flex-start);
    @include sp {
      height: 300px;
    }
  }

  &__name,
  &__textarea,
  &__submit {
    display: block;
    width: 100%;
  }

  &__name,
  &__textarea {
    @include font-family('cabin');
    @include font($size: $font-sm, $color: $black);
    margin-bottom: 12px;
    padding: 6px;
  }

  &__textarea {
    height: 100%;
  }

  &__submit {
    @include button($bg-color: rgba($navy-blue-light, 0.5), $font-size: $font-sm);
  }
}

.item {
  & {
    overflow: auto;
    @include pc {
      padding-right: 20px;
    }
    @include sp {
      height: 300px;
      padding-right: 8px;
      &[data-empty='true'] {
        height: auto;
      }
    }
  }

  &__wrapper {
    display: grid;
    grid-template-areas:
      'name'
      'date'
      'content';
    grid-template-columns: auto 1fr;
    align-items: baseline;
    column-gap: 20px;
    row-gap: 4px;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  &__name {
    grid-area: name;
  }

  &__date {
    grid-area: date;
    @include pc {
      @include font($size: $font-xs);
    }
    @include sp {
      @include font($size: $font-xxs);
    }
  }

  &__content {
    @include font($size: $font-sm);
    grid-area: content;
    word-break: break-word;
  }

  &__empty-text {
    @include font-family('marcellus');
  }
}
</style>
