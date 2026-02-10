import { Outlet } from "react-router-dom";
import Header from "../Header/Header.jsx";
import { routesConfig } from "../../router/routesConfig";
import "./Layout.css";

export default function Layout() {
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
