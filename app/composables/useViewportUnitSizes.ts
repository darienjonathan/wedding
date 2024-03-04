const VW_VAR_NAME = '--vw'
const VH_VAR_NAME = '--vh'
const DEVICE_PIXEL_RATIO_VAR_NAME = '--device-pixel-ratio'

const defineVw = () => {
  document.documentElement.style.setProperty(
    VW_VAR_NAME,
    `${document.documentElement.clientWidth / 100}px`
  )
}

const defineVh = () => {
  document.documentElement.style.setProperty(VH_VAR_NAME, `${window.innerHeight / 100}px`)
}

const defineDevicePixelRatio = () => {
  document.documentElement.style.setProperty(
    DEVICE_PIXEL_RATIO_VAR_NAME,
    window.devicePixelRatio.toString()
  )
}

const defineViewportVariables = () => {
  defineVw()
  defineVh()
  defineDevicePixelRatio()
}

const useViewportUnitSizes = (createListener = false) => {
  onBeforeMount(() => {
    if (!createListener) return
    defineViewportVariables()
    window.addEventListener('resize', defineViewportVariables, { passive: true })
  })
  onUnmounted(() => {
    if (!createListener) return
    window.removeEventListener('resize', defineViewportVariables)
  })

  const vw = ref<number>(0)
  const vh = ref<number>(0)

  const getValues = () => {
    vw.value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(VW_VAR_NAME))
    vh.value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(VH_VAR_NAME))
  }

  return { defineViewportVariables, getValues, vw: shallowReadonly(vw), vh: shallowReadonly(vh) }
}

export default useViewportUnitSizes
