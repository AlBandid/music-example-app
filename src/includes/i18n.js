import { createI18n } from 'vue-i18n'
import en from '@/locales/en'
import pl from '@/locales/pl'

export default createI18n({
  locale: 'pl',
  fallbackLocale: 'pl',
  pluralizationRules: {
    pl: polishRule,
  },
  messages: {
    pl,
    en,
  },
  numberFormats: {
    pl: {
      currency: {
        style: 'currency',
        currency: 'PLN',
      },
    },
    en: {
      currency: {
        style: 'currency',
        currency: 'EUR',
      },
    },
  },
})

function polishRule(value) {
  if (value === 0) {
    return 0
  }
  if (value === 1) {
    return 1
  }
  if ([2, 3, 4].includes(value % 10) && ![12, 13, 14].includes(value % 100)) {
    return 2
  }
  return 3
}
