import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { z } from 'zod'
import { makeZodI18nMap } from 'zod-i18n-map'
import zodUk from 'zod-i18n-map/locales/uk-UA/zod.json'

export function setupZodI18n() {
  void i18n.use(initReactI18next).init({
    lng: 'uk',
    fallbackLng: 'uk',
    resources: {
      uk: { zod: zodUk },
    },
  })

  z.setErrorMap(makeZodI18nMap())
}
