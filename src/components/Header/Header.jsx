import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch.jsx";
import logo from "../../assets/logo.png";
import "./Header.css";

function IconMenu({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 7h14M5 12h14M5 17h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

function IconClose({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 7l10 10M17 7L7 17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export default function Header() {
  const { pick } = useContext(I18nContext);
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const closeTimer = useRef(null);

  const categories = routesConfig.categories;
  const nav = routesConfig.nav;

  const mega = useMemo(() => {
    const map = new Map();
    for (const c of categories) {
      const items = routesConfig.projects.filter((p) => p.category === c.slug).slice(0, 6);
      map.set(c.slug, items);
    }
    return map;
  }, [categories]);

  useEffect(() => {
    setMobileOpen(false);
    setPortfolioOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  function openPortfolio() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setPortfolioOpen(true);
  }

  function scheduleClosePortfolio() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPortfolioOpen(false), 120);
  }

  return (
    <header className="header">
      <div className="headerInner">
        <Link to="/" className="brand" aria-label="HilariusDesign">
          <img className="brandLogo" src={logo} alt="" />
        </Link>

        <nav className="navDesktop" aria-label="Primary">
          <div
            className={`navGroup ${portfolioOpen ? "open" : ""}`}
            onMouseEnter={openPortfolio}
            onMouseLeave={scheduleClosePortfolio}
          >
            <NavLink to="/" className="navItem">
              <span className="navLabel">
                {pick(routesConfig.copy.nav, "portfolio")}
                <span className="navUnderline" />
              </span>
            </NavLink>

            <div
              className={`mega ${portfolioOpen ? "open" : ""}`}
              role="menu"
              aria-label="Portfolio submenu"
              onMouseEnter={openPortfolio}
              onMouseLeave={scheduleClosePortfolio}
            >
              <div className="megaInner">
                {categories.map((c) => (
                  <div key={c.slug} className="megaCol">
                    <Link to={`/category/${c.slug}`} className="megaTitle">
                      <span className="megaTitleLabel">
                        {pick(c, "title")}
                        <span className="megaUnderline" />
                      </span>
                    </Link>
                    <div className="megaSub">{pick(c, "subtitle")}</div>

                    <div className="megaItems">
                      {(mega.get(c.slug) ?? []).map((p) => (
                        <Link key={p.id} to={`/project/${p.id}`} className="megaItem">
                          <span className="megaItemLabel">
                            {pick(p, "title")}
                            <span className="megaUnderlineThin" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {nav.map((item) => (
            <NavLink key={item.path} to={item.path} className="navItem">
              <span className="navLabel">
                {pick(item, "label")}
                <span className="navUnderline" />
              </span>
            </NavLink>
          ))}

          <LanguageSwitch />
        </nav>

        <button
          className="mobileBtn"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Menu sluiten" : "Menu openen"}
        >
          {mobileOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      <div className={`mobileOverlay ${mobileOpen ? "open" : ""}`}>
        <div
          className="mobileOverlayBg"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div className="mobilePanel">
          <div className="mobileTop">
            <div className="mobileTitle">{pick(routesConfig.copy.nav, "menu")}</div>
            <div className="mobileTopRight">
              <LanguageSwitch compact />
              <button className="mobileClose" onClick={() => setMobileOpen(false)} aria-label="Sluiten">
                <IconClose />
              </button>
            </div>
          </div>

          <div className="mobileNav">
            <div className="mobileSection">
              <div className="mobileSectionLabel">{pick(routesConfig.copy.nav, "portfolio")}</div>
              {categories.map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`} className="mobileLink">
                  <span className="mobileLinkTitle">{pick(c, "title")}</span>
                  <span className="mobileLinkSub">{pick(c, "subtitle")}</span>
                </Link>
              ))}
            </div>

            {nav.map((item) => (
              <Link key={item.path} to={item.path} className="mobileLinkSolo">
                {pick(item, "label")}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
