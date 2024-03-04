<template lang="pug">
div
  Head
    Title {{ title }}
    Link(
      rel="canonical"
      :href="url"
    )
  NuxtLayout
    NuxtPage
</template>
<script lang="ts" setup>
const url = 'https://darienjonathan.com'
const title = 'darienjonathan.com'
const description = 'A public space for personal views'
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
  ]

  metaArr.push(
    ...['description', 'og:description', 'twitter:description'].map(name => ({
      name,
      content: description,
    }))
  )
  metaArr.push(
    ...['og:title', 'twitter:title'].map(name => ({
      name,
      content: title,
    }))
  )
  metaArr.push(
    ...['og:image', 'twitter:image'].map(name => ({
      name,
      content: image,
    }))
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
