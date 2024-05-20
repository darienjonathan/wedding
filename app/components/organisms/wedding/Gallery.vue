<template lang="pug">
.gallery
  .heading__wrapper
    .heading {{ sectionSettings.title || 'GALLERY' }}
  .kv
    .kv__main {{ sectionSettings.description.main }}
    .kv__sub {{ sectionSettings.description.sub }}
  .content
    .loading-wrapper(:data-loaded="isAllImageLoaded")
      ALoading
    .grid(
      :data-loaded="isAllImageLoaded"
      :data-layout-type="gallery.layoutType"
    )
      template(v-for="imageState in imageStates")
        .image(
          :class="`image--${imageState.order}`"
          :data-order="imageState.order"
          @click="handleSelectImage(imageState)"
        )
          NuxtImg(
            ref="imgRefs"
            :src="imageState.src"
            loading="lazy"
            @load="handleImageLoaded(imageState.order)"
          )

  template(v-if="selectedImage")
    AModal(
      :type="'frameless'"
      :is-open="isModalOpen"
      :width="selectedImage.width"
      :height="selectedImage.height"
      @close="handleCloseModal"
    )
      NuxtImg.modal__img(
        v-if="selectedImage.src"
        :src="selectedImage.src"
        loading="lazy"
      )
</template>
<script lang="ts" setup>
import ALoading from '~/components/atoms/ALoading.vue'
import AModal from '~/components/atoms/AModal.vue'
import type { Gallery, SectionSettings } from '~/types/model/wedding/weddingSettings'

defineOptions({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Gallery',
})

type ImageState = {
  src: string
  order: number
  isLoaded: boolean
  width?: string
  height?: string
}

type Props = {
  sectionSettings: SectionSettings
  gallery: Gallery
}

const props = defineProps<Props>()

const getInitialImageStates = (imageSrcs: string[]): ImageState[] =>
  imageSrcs.map((src, index) => ({
    src,
    order: index + 1,
    isLoaded: false,
    width: undefined,
    height: undefined,
  }))

const imageStates = ref<ImageState[]>([])
const imgRefs = ref<HTMLImageElement[]>([])

watch(
  () => props.gallery,
  async gallery => {
    imageStates.value = getInitialImageStates(gallery.imageSrcs)
  },
  {
    immediate: true,
  },
)

const { vw, vh, getValues } = useViewportUnitSizes()

onMounted(() => {
  getValues()
  window.addEventListener('resize', getValues, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('resize', getValues)
})

const isAllImageLoaded = computed(() => imageStates.value.every(({ isLoaded }) => isLoaded))

watchEffect(() => {
  if (!isAllImageLoaded.value || !vw.value || !vh.value) return

  const maxValuePercentage = 80
  const maxWidth = maxValuePercentage * vw.value
  const maxHeight = maxValuePercentage * vh.value

  const sizesByOrder = new Map<number, Pick<ImageState, 'width' | 'height'>>()
  imgRefs.value.forEach(el => {
    const parent = el.parentElement

    const order = Number(parent?.getAttribute('data-order'))

    const imageRatio = el.naturalWidth / el.naturalHeight
    const screenRatio = window.innerWidth / window.innerHeight
    const isMaxValueInWidth = imageRatio > screenRatio

    const width = isMaxValueInWidth ? maxWidth : imageRatio * maxHeight
    const height = isMaxValueInWidth ? maxWidth / imageRatio : maxHeight

    sizesByOrder.set(order, { width: `${width}px`, height: `${height}px` })
  })

  imageStates.value = imageStates.value.map(imageState => ({
    ...imageState,
    ...sizesByOrder.get(imageState.order),
  }))
})

const handleImageLoaded = (loadedImageOrder: number) => {
  imageStates.value = imageStates.value.map(state => {
    if (loadedImageOrder !== state.order) return state
    return {
      ...state,
      isLoaded: true,
    }
  })
}

// apparently there are cases when img element's load event is not triggered. check loaded status by interval
const updateImageLoaded = () => {
  const imageLoadedByOrder = new Map<number, ImageState['isLoaded']>()
  imgRefs.value.forEach(el => {
    const parent = el.parentElement
    const order = Number(parent?.getAttribute('data-order'))
    imageLoadedByOrder.set(order, el.complete)
  })

  imageStates.value = imageStates.value.map(imageState => ({
    ...imageState,
    isLoaded: imageState.isLoaded || imageLoadedByOrder.get(imageState.order) || false,
  }))
}

const INTERVAL_TIME = 2500
const updateImageLoadedInterval = ref<ReturnType<typeof setInterval>>()

onMounted(() => {
  updateImageLoadedInterval.value = setInterval(updateImageLoaded, INTERVAL_TIME)
})

watch(isAllImageLoaded, () => {
  if (isAllImageLoaded.value) {
    clearInterval(updateImageLoadedInterval.value)
  }
})

// Selected Image
const isModalOpen = ref(false)

const selectedImage = ref<ImageState>()
const handleSelectImage = (imageState: ImageState) => {
  selectedImage.value = imageState
  isModalOpen.value = true
}
const handleCloseModal = () => {
  selectedImage.value = undefined
  isModalOpen.value = false
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

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

.content {
  position: relative;
  margin: 0 auto;
  max-width: 100%;
  @include pc {
    max-width: 1000px;
    aspect-ratio: 9/10;
  }
  @include sp {
    max-width: 700px;
    aspect-ratio: 6/15;
  }
}

.grid,
.loading-wrapper {
  @include size(100%, 100%);
}

.grid {
  display: grid;
  gap: 12px;

  opacity: 0;
  transition: opacity 0.25s ease-in-out;

  &[data-loaded='true'] {
    opacity: 1;
  }

  &[data-layout-type='default'] {
    @include pc {
      grid-template-columns: repeat(3, 1fr);
    }
    @include sp {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &[data-layout-type='masonry'] {
    @include pc {
      grid-template-rows: repeat(10, 1fr);
      grid-template-columns: repeat(9, 1fr);
    }
    @include sp {
      grid-template-rows: repeat(15, 1fr);
      grid-template-columns: repeat(6, 1fr);
    }
  }
}

.loading-wrapper {
  @include flex;
  position: absolute;
  opacity: 1;
  transition: opacity 0.25s ease-in-out;
  pointer-events: none;

  &[data-loaded='true'] {
    opacity: 0;
  }
}

.image {
  @include flex;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  filter: drop-shadow(0 0 5px $black);
  transition: filter 0.5s ease-in-out;

  &::after {
    @include absolute($top: 0, $left: 0);
    @include size(100%, 100%);
    content: '';
    transition: background-color 0.4s ease-in-out;
    pointer-events: none;
  }

  &:hover {
    filter: drop-shadow(0 0 10px $black);

    &::after {
      background-color: rgba($white, 0.25);
    }
  }

  img {
    @include size(100%, 100%);
    object-fit: cover;
  }
}

.grid[data-layout-type='masonry'] .image {
  @mixin image($grid-row-start, $grid-row-end, $grid-column-start, $grid-column-end) {
    grid-row-start: $grid-row-start;
    grid-row-end: $grid-row-end;
    grid-column-start: $grid-column-start;
    grid-column-end: $grid-column-end;
  }

  &--1 {
    @include pc {
      @include image(1, 4, 1, 5);
    }
    @include sp {
      @include image(1, 4, 1, 5);
    }
  }

  &--2 {
    @include pc {
      @include image(1, 4, 5, 7);
    }
    @include sp {
      @include image(1, 4, 5, 7);
    }
  }

  &--3 {
    @include pc {
      @include image(1, 5, 7, 10);
    }
    @include sp {
      @include image(4, 8, 4, 7);
    }
  }

  &--4 {
    @include pc {
      @include image(4, 7, 1, 4);
    }
    @include sp {
      @include image(4, 7, 1, 4);
    }
  }

  &--5 {
    @include pc {
      @include image(4, 6, 4, 7);
    }
    @include sp {
      @include image(14, 16, 1, 4);
    }
  }

  &--6 {
    @include pc {
      @include image(5, 8, 7, 10);
    }
    @include sp {
      @include image(8, 11, 4, 7);
    }
  }

  &--7 {
    @include pc {
      @include image(7, 11, 1, 4);
    }
    @include sp {
      @include image(7, 11, 1, 4);
    }
  }

  &--8 {
    @include pc {
      @include image(6, 9, 4, 7);
    }
    @include sp {
      @include image(11, 14, 1, 4);
    }
  }

  &--9 {
    @include pc {
      @include image(9, 11, 4, 7);
    }
    @include sp {
      @include image(11, 13, 4, 7);
    }
  }

  &--10 {
    @include pc {
      @include image(8, 11, 7, 10);
    }
    @include sp {
      @include image(13, 16, 4, 7);
    }
  }
}

.modal {
  &__img {
    @include size(100%, 100%);
    object-fit: cover;
  }
}
</style>
