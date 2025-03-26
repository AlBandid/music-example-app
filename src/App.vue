<script>
import AppHeader from '@/components/AppHeader.vue'
import AppAuth from '@/components/AppAuth.vue'
import AppPlayer from '@/components/AppPlayer.vue'
import { mapWritableState } from 'pinia'
import { useUserStore } from '@/stores/user.js'
import { auth } from '@/includes/firebase.js'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppAuth,
    AppPlayer,
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn']),
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true
    }
  },
}
</script>

<template>
  <!-- Header -->
  <app-header />

  <!-- Main Content -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <!-- Player -->
  <app-player />

  <!-- Auth Modal -->
  <app-auth />
</template>

<style>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.5s linear;
}
.fade-leave-to {
  transition: all 0.5s linear;
  opacity: 0;
}
</style>
