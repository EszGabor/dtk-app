import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from '../locales/en.json'
import hu from '../locales/hu.json'

export const languabeResources = {
    en: {translation: en},
    hu: {translation: hu},
};

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'hu',
    fallbackLng: 'en',
    resources: languabeResources,
    interpolation: {
        escapeValue: false
      }
});

export default i18n;