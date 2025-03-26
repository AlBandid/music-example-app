<script>
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user.js'

export default {
  name: 'LoginForm',
  data() {
    return {
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: 'bg-blue-500',
      login_alert_msg: 'Poczkaj bo Cię loguję',
    }
  },
  methods: {
    ...mapActions(useUserStore, { authenticate: 'login' }),
    async login(values) {
      this.login_in_submission = true
      this.login_show_alert = true
      this.login_alert_variant = 'bg-blue-500'
      this.login_alert_msg = 'Poczkaj bo Cię loguję'

      try {
        await this.authenticate(values)
      } catch (e) {
        this.login_in_submission = false
        this.login_alert_variant = 'bg-red-500'
        this.login_alert_msg = `No masz Ci los... ${e.message}`
        return
      }

      this.login_alert_variant = 'bg-green-500'
      this.login_alert_msg = 'Uff, udało się! Miłej zabawy :)'
      window.location.reload()
    },
  },
}
</script>

<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="login_show_alert"
    :class="login_alert_variant"
  >
    {{ login_alert_msg }}
  </div>
  <vee-form @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
        rules="required|email"
      />
      <error-message class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
        rules="required"
      />
      <error-message class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="login_in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>
