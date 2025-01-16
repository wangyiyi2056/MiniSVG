import { ref } from 'vue';
import { translations, TranslationType } from '../i18n/translations';

type Language = keyof TranslationType;
type TranslationKey = keyof TranslationType["en"];
type TranslationParams = Record<string, string>;

// 从本地存储获取语言设置，如果没有则默认为英文
const savedLanguage = localStorage.getItem('language') as Language;
const currentLanguage = ref<Language>(savedLanguage || 'en');

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
    // 保存语言设置到本地存储
    localStorage.setItem('language', currentLanguage.value);
  };

  return {
    currentLanguage,
    t,
    toggleLanguage
  };
}