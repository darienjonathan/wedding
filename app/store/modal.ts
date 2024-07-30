import { defineStore } from 'pinia'

export const useModalStore = defineStore('main', {
  state: () => ({
    modalCount: 0,
    isBodyFrozen: false,
  }),
  actions: {
    incrementModalCount() {
      this.modalCount++
    },
    decrementModalCount() {
      this.modalCount--
    },
    freezeBody() {
      this.isBodyFrozen = true
    },
    unfreezeBody() {
      this.isBodyFrozen = false
    },
  },
})
