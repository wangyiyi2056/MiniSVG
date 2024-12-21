import { ref } from 'vue';
import { translations, TranslationType } from '../i18n/translations';

type Language = keyof TranslationType;
type TranslationKey = keyof TranslationType["en"];
type TranslationParams = Record<string, string>;

const currentLanguage = ref<Language>('en');

export function useLanguage() {
  const t = (key: TranslationKey, params?: TranslationParams) => {
    let text = translations[currentLanguage.value][key];
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(`{${key}}`, value);
      });
    }
    return text;
  };

  const toggleLanguage = () => {
    currentLanguage.value = currentLanguage.value === 'en' ? 'zh' : 'en';
  };

  return {
    currentLanguage,
    t,
    toggleLanguage
  };
}