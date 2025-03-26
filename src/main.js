import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'

import App from './App.vue'
import router from './router'
import VeeValidatePlugin from '@/includes/validation.js'
import { auth } from '@/includes/firebase.js'
import Icon from '@/directives/icon.js'
import i18n from '@/includes/i18n.js'
import { registerSW } from 'virtual:pwa-register'
//let's register our Service Worker
registerSW({ immediate: true })

let app

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin) //, { tmpOption: 100 }) <-- we could pass some options for the second parameter in the 'install' method
    app.use(i18n)
    app.directive('icon', Icon)
    app.mount('#app')
  }
})
