<script>
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user.js'

export default {
  name: 'RegisterForm',
  data() {
    return {
      schema: {
        name: 'required|min:2|max:25|alpha_spaces',
        email: 'required|min:6|max:35|email',
        age: 'required|min_value:18|max_value:150',
        password: 'required|min:8|max:50|hasSmallLetter|hasBigLetter|hasDigit|hasSpecialChar',
        password_confirmation: 'confirmed:@password',
        gender: 'required|excluded_genders:Furry,Male',
        country: 'required|excluded_countries:USA,Germany',
        tos: 'tos_required',
      },
      userData: {
        country: 'Poland',
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: 'bg-blue-500',
      reg_alert_msg: 'Poczkaj bo Ci konto rejestrujemy',
    }
  },
  methods: {
    ...mapActions(useUserStore, {
      createUser: 'register',
    }),
    async register(values) {
      this.reg_in_submission = true
      this.reg_show_alert = true
      this.reg_alert_variant = 'bg-blue-500'
      this.reg_alert_msg = 'Poczkaj bo Ci konto rejestrujemy'

      try {
        await this.createUser(values)
      } catch (e) {
        this.reg_in_submission = false
        this.reg_alert_variant = 'bg-red-500'
        this.reg_alert_msg = `No masz Ci los... ${e.message}`
        return
      }

      this.reg_alert_variant = 'bg-green-500'
      this.reg_alert_msg = 'Uff, udało się! Masz konto :)'
      window.location.reload()
    },
  },
}
</script>

<template>
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="reg_show_alert"
    :class="reg_alert_variant"
  >
    {{ reg_alert_msg }}
  </div>
  <vee-form :validation-schema="schema" @submit="register" :initial-values="userData">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <error-message class="text-red-600" name="name" />
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <error-message class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
          v-bind="field"
        />
        <div class="text-red-600" v-for="error in errors" :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        type="password"
        name="password_confirmation"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <error-message class="text-red-600" name="password_confirmation" />
    </div>
    <!-- Gender -->
    <div class="mb-3">
      <label class="inline-block mb-2">Gender</label>
      <vee-field
        as="select"
        name="gender"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="Female">Queen</option>
        <option value="Male">King</option>
        <option value="Non-Binary">Monarch</option>
        <option value="Helicopter">Helikopter Szturmowy</option>
        <option value="Furry">F*cking Furry</option>
      </vee-field>
      <error-message class="text-red-600" name="gender" />
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        type="number"
        name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <error-message class="text-red-600" name="age" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">United Obesity</option>
        <option value="Poland">Polska Gurom</option>
        <option value="Germany">JaGut</option>
      </vee-field>
      <error-message class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        name="tos"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <i18n-t class="inline-block" keypath="register.accept_tos" tag="label">
        <a href="#">{{ $t('register.tos') }}</a>
      </i18n-t>
      <br />
      <error-message class="text-red-600" name="tos" />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="reg_in_submission"
    >
      Submit
    </button>
  </vee-form>
</template>
