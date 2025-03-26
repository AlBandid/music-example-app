import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  //here you define properties and methods for your state
  state: () => ({
    isOpen: false,
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? 'hidden' : ''
    },
  },
})
