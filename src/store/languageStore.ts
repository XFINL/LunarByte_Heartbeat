import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { locales, LocaleKey } from '@/locales';

interface LanguageState {
  locale: LocaleKey;
  setLocale: (locale: LocaleKey) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: 'zh-CN',
      
      setLocale: (locale: LocaleKey) => {
        set({ locale });
      },
      
      t: (path: string, params?: Record<string, string | number>) => {
        const { locale } = get();
        const keys = path.split('.');
        let result: string | object | undefined = locales[locale];
        
        for (const key of keys) {
          if (result && typeof result === 'object' && key in result) {
            result = (result as Record<string, unknown>)[key] as string | object | undefined;
          } else {
            return path;
          }
        }
        
        if (typeof result !== 'string') {
          return path;
        }
        
        if (params) {
          return result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? String(params[key]) : match;
          });
        }
        
        return result;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
