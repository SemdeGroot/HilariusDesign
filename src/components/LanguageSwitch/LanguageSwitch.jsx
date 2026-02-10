import { useContext, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { I18nContext } from "../../i18n/I18nProvider";
import "./LanguageSwitch.css";

export default function LanguageSwitch({ compact = false }) {
  const { lang, setLang } = useContext(I18nContext);
  const [open, setOpen] = useState(false);

  const options = useMemo(
    () => [
      { key: "nl", label: "NL" },
      { key: "en", label: "EN" },
      { key: "de", label: "DE" }
    ],
    []
  );

  return (
    <div className={`lang ${compact ? "compact" : ""}`}>
      <button
        className="langBtn"
        onClick={() => setOpen((v) => !v)}
        aria-label="Taal"
        aria-expanded={open ? "true" : "false"}
      >
        <span className="langBtnLabel">{lang.toUpperCase()}</span>
        <ChevronDown className={`langChev ${open ? "open" : ""}`} size={16} strokeWidth={1.8} />
      </button>

      <div className={`langMenu ${open ? "open" : ""}`} role="menu" aria-label="Taalmenu">
        {options.map((o) => (
          <button
            key={o.key}
            className={`langItem ${o.key === lang ? "active" : ""}`}
            onClick={() => {
              setLang(o.key);
              setOpen(false);
            }}
            role="menuitem"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
