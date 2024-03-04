import { useModalStore } from '~/store'
export const useModal = () => {
  const modalStore = useModalStore()

  const { getValues, vh } = useViewportUnitSizes()

  const freezeBody = () => {
    // freeze body
    getValues()
    const hasScroll = document.body.clientHeight > vh.value * 100
    document.body.style.top = `-${window.scrollY}px`
    document.body.style.position = 'fixed'
    document.body.style.overflowY = hasScroll ? 'scroll' : ''

    modalStore.freezeBody()
  }

  const unfreezeBody = () => {
    // unfreeze body
    const top = parseInt(document.body.style.top || '0') * -1
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.overflowY = ''
    window.scrollTo({
      left: 0,
      top,
      behavior: 'instant',
    })

    modalStore.unfreezeBody()
  }

  modalStore.$subscribe((_, state) => {
    if (state.modalCount > 0 && !state.isBodyFrozen) {
      freezeBody()
    }

    if (state.modalCount <= 0 && state.isBodyFrozen) {
      unfreezeBody()
    }
  })
}
