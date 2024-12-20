import { ref } from 'vue';
import { translations } from '../i18n/translations';

type Language = 'en' | 'zh';

const currentLanguage = ref<Language>('en');

export function useLanguage() {
  const t = (key: keyof typeof translations.en) => {
    return translations[currentLanguage.value][key];
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