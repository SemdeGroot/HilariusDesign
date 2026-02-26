import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/tokens.css";
import "./styles/fonts.css";
import "./styles/global.css";

import I18nProvider from "./i18n/I18nProvider.jsx";
import logoUrl from "./assets/logo.svg";

function ensureFavicon(href) {
  const existing = document.querySelector('link[rel="icon"]');
  if (existing) {
    existing.setAttribute("href", href);
    return;
  }
  const link = document.createElement("link");
  link.setAttribute("rel", "icon");
  link.setAttribute("href", href);
  document.head.appendChild(link);
}

ensureFavicon(logoUrl);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
