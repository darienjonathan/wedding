<template lang="pug">
div
  Head
    Title {{ title }}
    Link(
      rel="canonical"
      :href="url"
    )
    Link(
      rel="icon"
      href="favicon_dark.ico"
      media="(prefers-color-scheme: dark)"
    )
    Link(
      rel="icon"
      href="favicon_light.ico"
      media="(prefers-color-scheme: light)"
    )
  NuxtLayout
    NuxtPage
</template>
<script lang="ts" setup>
const { baseURL: url, brand: title } = useRuntimeConfig().public
const description = 'Wedding Template Service'
const image = url + '/ogp.png'

const meta = computed(() => {
  const metaArr: Record<string, string>[] = [
    {
      name: 'og:url',
      content: url,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'fav',
    },
  ]

  metaArr.push(
    ...['description', 'og:description', 'twitter:description'].map(name => ({
      name,
      content: description,
    })),
  )
  metaArr.push(
    ...['og:title', 'twitter:title'].map(name => ({
      name,
      content: title,
    })),
  )
  metaArr.push(
    ...['og:image', 'twitter:image'].map(name => ({
      name,
      content: image,
    })),
  )

  metaArr.push({
    name: 'format-detection',
    content: 'telephone=no',
  })

  return metaArr
})

useHead({
  title,
  meta: meta.value,
})
</script>
