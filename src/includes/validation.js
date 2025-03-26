import {
  configure,
  defineRule,
  ErrorMessage,
  Field as VeeField,
  Form as VeeForm,
} from 'vee-validate' // we're renaming those components to avoid overlapping with existing names
import {
  alpha_spaces as alphaSpaces,
  confirmed,
  email,
  max,
  max_value as maxValue,
  min,
  min_value as minValue,
  not_one_of as notOneOf,
  required,
} from '@vee-validate/rules'

export default {
  //install(app, opts) {}, <-- this one would use the options from the main.js
  install(app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('tos_required', required)
    defineRule('song_title_req', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('alpha_spaces', alphaSpaces)
    defineRule('email', email)
    defineRule('min_value', minValue)
    defineRule('max_value', maxValue)
    defineRule('confirmed', confirmed)
    defineRule('not_one_of', notOneOf)
    defineRule('excluded_countries', notOneOf)
    defineRule('excluded_genders', notOneOf)

    defineRule('hasSmallLetter', (value) => {
      if (!/.*[a-z]+/.test(value)) {
        return 'At least one lowercase character required'
      }
      return true
    })
    defineRule('hasBigLetter', (value) => {
      if (!/.*[A-Z]+/.test(value)) {
        return 'At least one uppercase character required'
      }
      return true
    })
    defineRule('hasDigit', (value) => {
      if (!/.*[0-9]+/.test(value)) {
        return 'At least one digit required'
      }
      return true
    })
    defineRule('hasSpecialChar', (value) => {
      if (!/.*[@$!%*#?&]+/.test(value)) {
        return 'At least one special character required (@$!%*#?&)'
      }
      return true
    })

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `Your ${ctx.field} is required.`,
          tos_required: `Please accept the Terms of Service`,
          song_title_req: 'The Song Title is required.',
          min: `Your ${ctx.field} should have at least ${ctx.rule.params} characters.`,
          max: `Your ${ctx.field} shouldn't be longer than ${ctx.rule.params} characters.`,
          alpha_spaces: `Your ${ctx.field} should only contain letters and whitespaces.`,
          email: `Please enter a valid email address`,
          min_value: `You must be ${ctx.rule.params} or older`,
          max_value: `You must be ${ctx.rule.params} or younger`,
          confirmed: `No match for password`,
          not_one_of: `This option is currently unavailable`,
          excluded_countries: `Service unavailable for: ${ctx.rule.params}`,
          excluded_genders: `We appreciate it if you feel like a: ${ctx.rule.params}, but please choose sth different`,
        }

        return messages[ctx.rule.name] ? messages[ctx.rule.name] : `Your ${ctx.field} is invalid`
      },
      validateOnBlur: true, //this one fires every time you move away from the input field
      validateOnChange: true, //this one fires after you move away from the input field, but only if there was a change in the input
      validateOnInput: false, //this one is the most aggressive, it fires at every keystroke
      validateOnModelUpdate: true, //this one fires after a change in value through v-model directive
    })
  },
}
