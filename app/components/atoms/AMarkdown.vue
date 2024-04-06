<template lang="pug">
.a-markdown(v-html="markdownHTML")
</template>
<script lang="ts" setup>
const { $md } = useNuxtApp()
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})
const markdownHTML = computed(() => {
  return $md.render(props.content)
})
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.a-markdown {
  line-height: 1.5;
}

:deep(h1),
:deep(h2),
:deep(h3),
:deep(p) {
  margin: 16px 0;
}

:deep(img) {
  max-width: 100%;
  margin: 12px 0;
}
:deep(blockquote) {
  margin: 12px 0;
  padding: 4px 0 4px 8px;
  border-left: 4px solid $gray;

  & p {
    margin: 4px 0;
  }
}

:deep(a) {
  color: $navy-blue-light;

  &:visited {
    color: $navy-blue-light;
  }
}

:deep(pre) {
  overflow-x: auto;
  padding: 10px;
  background: rgba(gray, 0.25);
  border-radius: 4px;
  white-space: pre-wrap;
}
</style>
