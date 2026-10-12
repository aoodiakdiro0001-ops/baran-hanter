import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LANGS, detectLang, translations } from "../i18n/translations.js";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => detectLang());
  const dict = translations[lang] || translations.en;
  const meta = LANGS.find((l) => l.code === lang) || LANGS[0];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = meta.dir;
    localStorage.setItem("bh_lang", lang);
  }, [lang, meta.dir]);

  const value = useMemo(
    () => ({
      lang,
      langs: LANGS,
      dir: meta.dir,
      t: (key) => dict[key] || translations.en[key] || key,
      setLang: (code) => {
        if (translations[code]) setLangState(code);
      },
    }),
    [lang, dict, meta.dir]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
