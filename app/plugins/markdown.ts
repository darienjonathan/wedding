import markdownIt from 'markdown-it'
import hljs from 'highlight.js'

export default defineNuxtPlugin(() => {
  const md = markdownIt({
    highlight(str: string, lang: string) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value
        } catch (__) {}
      }
      return '' // use external default escaping
    },
  })
  return {
    provide: {
      md,
    },
  }
})
