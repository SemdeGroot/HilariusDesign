// src/components/Layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../Header/Header.jsx";
import { routesConfig } from "../../router/routesConfig";
import "./Layout.css";

function smoothScrollTop(duration = 520) {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (prefersReduced) {
    window.scrollTo(0, 0);
    return;
  }

  const startY = window.scrollY || window.pageYOffset || 0;
  if (startY <= 0) return;

  const start = performance.now();
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(t);
    window.scrollTo(0, Math.round(startY * (1 - eased)));
    if (t < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function isCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(hover: none) and (pointer: coarse)")?.matches ?? false;
}

function nudgeScrollToRestoreHitTesting() {
  const x = window.scrollX || 0;
  const y = window.scrollY || 0;
  window.scrollTo(x, y + 1);
  window.scrollTo(x, y);
}

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    smoothScrollTop(520);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isCoarsePointer()) return;

    const onFocusOut = (e) => {
      const t = e.target;
      const tag = t?.tagName?.toLowerCase?.();
      if (tag !== "input" && tag !== "textarea" && tag !== "select") return;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          nudgeScrollToRestoreHitTesting();
        });
      });
    };

    window.addEventListener("focusout", onFocusOut, true);
    return () => window.removeEventListener("focusout", onFocusOut, true);
  }, []);

  return (
    <div className="appShell">
      <Header />
      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrandBlock">
            <div className="footerBrand">HILARIUSDESIGN</div>
            <div className="footerTagline">
              <div>IDEAS MADE OF BOARD</div>
              <div>WHERE MATERIAL MEETS CREATION</div>
            </div>
          </div>

          <div className="footerCols">
            <div className="footerCol">
              <div className="footerLabel">Contact</div>
              <div className="footerBody">
                <a
                  className="uLink footerLink footerContactLink"
                  href={`mailto:${routesConfig.contact.email}`}
                >
                  <span className="uLinkLabel">
                    {routesConfig.contact.email}
                    <span className="uUnderline" />
                  </span>
                </a>

                <a
                  className="uLink footerLink footerContactLink"
                  href={`tel:${routesConfig.contact.phone.replace(/\s/g, "")}`}
                >
                  <span className="uLinkLabel">
                    {routesConfig.contact.phone}
                    <span className="uUnderline" />
                  </span>
                </a>

                <div className="footerText">KVK 34321364</div>
                <div className="footerText">BTW NL001184466B83</div>
              </div>
            </div>

            <div className="footerCol">
              <div className="footerLabel">Social</div>
              <div className="footerBody">
                <a
                  className="uLink footerLink"
                  href={routesConfig.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="uLinkLabel">
                    LinkedIn
                    <span className="uUnderline" />
                  </span>
                </a>

                <div className="footerLegal">
                  All showed items are registrated by:
                  <br />
                  CC Proof © 2026 Hilarius Design
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}