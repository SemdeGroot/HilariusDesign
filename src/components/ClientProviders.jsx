"use client";

import I18nProvider from "../i18n/I18nProvider";
import Layout from "./Layout/Layout";

export default function ClientProviders({ children }) {
  return (
    <I18nProvider>
      <Layout>{children}</Layout>
    </I18nProvider>
  );
}
