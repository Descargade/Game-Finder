import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en";
import es from "@/locales/es";

const savedLang = (() => {
  try {
    return localStorage.getItem("gamedeals-lang") ?? "en";
  } catch {
    return "en";
  }
})();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
