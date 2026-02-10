import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { routesConfig } from "../router/routesConfig";

export const I18nContext = createContext({
  lang: "nl",
  setLang: () => {},
  pick: (obj, field) => obj?.[field]
});

export default function I18nProvider({ children }) {
  const supported = routesConfig.i18n?.supported ?? ["nl", "en", "de"];
  const fallback = routesConfig.i18n?.fallback ?? "nl";

  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem("hd_lang");
    return supported.includes(saved) ? saved : (routesConfig.i18n?.default ?? "nl");
  });

  const setLang = useCallback((next) => {
    if (!supported.includes(next)) return;
    setLangState(next);
    localStorage.setItem("hd_lang", next);
  }, [supported]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // pick(obj, "title") => obj.i18n[lang].title || obj.i18n.nl.title || obj.title
  const pick = useCallback(
    (obj, field) => {
      if (!obj) return "";
      const fromI18n =
        obj.i18n?.[lang]?.[field] ??
        obj.i18n?.[fallback]?.[field];
      if (fromI18n !== undefined) return fromI18n;
      return obj[field] ?? "";
    },
    [lang, fallback]
  );

  const value = useMemo(() => ({ lang, setLang, pick }), [lang, setLang, pick]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
