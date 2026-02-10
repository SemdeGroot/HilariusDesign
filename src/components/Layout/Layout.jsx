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

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    smoothScrollTop(520);
  }, [location.pathname]);

  return (
    <div className="appShell">
      <Header />
      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrand">HilariusDesign</div>

          <div className="footerCols">
            <div className="footerCol">
              <div className="footerLabel">Contact</div>

              <div className="footerBody">
                <div className="footerText">{routesConfig.contact.email}</div>
                <div className="footerText">{routesConfig.contact.phone}</div>
                <div className="footerText">{routesConfig.contact.location}</div>
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
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
