const BREAKPOINT = 768

const useMedia = () => {
  const mql = ref<MediaQueryList>()
  const isPC = ref(false)
  const isSP = ref(false)

  function checkBreakpoint(mql: MediaQueryList | MediaQueryListEvent) {
    isPC.value = mql.matches
    isSP.value = !isPC.value
  }

  onBeforeMount(() => {
    mql.value = window.matchMedia(`only screen and (min-width: ${BREAKPOINT}px)`)
  })

  onMounted(() => {
    if (!mql.value) return
    checkBreakpoint(mql.value)
    if (mql.value.addEventListener) {
      mql.value.addEventListener('change', checkBreakpoint)
    } else {
      mql.value.addListener(checkBreakpoint)
    }
  })

  onUnmounted(() => {
    if (!mql.value) return
    if (mql.value.removeEventListener) {
      mql.value.removeEventListener('change', checkBreakpoint)
    } else {
      mql.value.removeListener(checkBreakpoint)
    }
  })

  return {
    isPC,
    isSP,
  }
}

export default useMedia
