import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { menu, brand } from "./menuData";
import "./Header.css";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const overlayRef = useRef(null);

  const portfolioItem = useMemo(() => menu.find((m) => m.label === "Portfolio"), []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="header">
      <div className="headerInner">
        <Link to="/" className="brand">
          <span className="brandName">{brand.name}</span>
          <span className="brandTag">{brand.tagline}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="navDesktop" aria-label="Primary">
          {menu.map((item) => {
            if (item.children?.length) {
              return (
                <div className="navGroup" key={item.label}>
                  <NavLink to={item.path} className="navItem">
                    {item.label}
                  </NavLink>

                  <div className="dropdown" role="menu" aria-label={`${item.label} submenu`}>
                    <div className="dropdownInner">
                      {item.children.map((child) => (
                        <NavLink key={child.path} to={child.path} className="dropdownItem">
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink key={item.path} to={item.path} className="navItem">
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile button */}
        <button
          className="mobileBtn"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        className={`mobileOverlay ${mobileOpen ? "open" : ""}`}
        onClick={(e) => {
          if (e.target === overlayRef.current) setMobileOpen(false);
        }}
      >
        <div className="mobilePanel">
          <div className="mobileTop">
            <div className="mobileTitle">Menu</div>
            <button className="mobileClose" onClick={() => setMobileOpen(false)} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div className="mobileNav">
            {/* Portfolio section with subcats */}
            {portfolioItem?.children?.length ? (
              <div className="mobileSection">
                <div className="mobileSectionLabel">Portfolio</div>
                {portfolioItem.children.map((child) => (
                  <Link
                    key={child.path}
                    to={child.path}
                    className="mobileLink"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}

            {/* Other pages */}
            {menu
              .filter((m) => !m.children?.length)
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="mobileLink"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
