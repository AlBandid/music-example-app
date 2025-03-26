<script>
import { mapActions, mapWritableState, mapState } from 'pinia'
import { useModalStore } from '@/stores/modal'
import { useUserStore } from '@/stores/user.js'

export default {
  name: 'AppHeader',
  computed: {
    ...mapWritableState(useModalStore, { modalOpen: 'isOpen' }),
    ...mapState(useUserStore, ['userLoggedIn']),
    currentLocale() {
      return this.$i18n.locale === 'pl' ? 'Polski' : 'English'
    },
  },
  methods: {
    ...mapActions(useUserStore, { logout: 'logout' }),
    toggleAuthModal() {
      this.modalOpen = !this.modalOpen
    },
    async logoutUser() {
      await this.logout()
      //if the user is logging out from a page, that requires authentication for access, then we want to redirect him to the home page
      if (this.$route.meta.requiresAuth) {
        this.$router.push({ name: 'home' })
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === 'pl' ? 'en' : 'pl'
    },
  },
}
</script>

<template>
  <header id="header" class="bg-gray-700">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        >Music</router-link
      >
      <!-- we used no-active to prevent it from turning yellow when we are on home page -->

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <router-link class="px-2 text-white" :to="{ name: 'about' }">About</router-link>
          </li>
          <li v-if="!this.userLoggedIn">
            <a class="px-2 text-white" href="#" @click.prevent="toggleAuthModal"
              >Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-white" :to="{ name: 'manage' }">Manage</router-link>
            </li>
            <li>
              <a class="px-2 text-white" href="#" @click.prevent="logoutUser">Logout</a>
            </li>
          </template>
        </ul>
        <ul class="ml-auto">
          <li>
            <a class="px-2 text-white" href="#" @click.prevent="changeLocale">
              <i class="fa fa-language" /> {{ currentLocale }}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
