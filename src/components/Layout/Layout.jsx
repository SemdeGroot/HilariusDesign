import { Outlet } from "react-router-dom";
import Header from "../Header/Header.jsx";
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
          <span>© {new Date().getFullYear()} Your Name</span>
          <span className="footerRight">Amsterdam · Available worldwide</span>
        </div>
      </footer>
    </div>
  );
}
