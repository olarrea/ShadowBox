import { useTheme } from "../themeContext";
import { translations, TranslationKey } from "./translations";

export function useTranslation() {
  const { language } = useTheme();

  function t(key: TranslationKey) {
    return translations[language][key] || key;
  }

  return { t };
}