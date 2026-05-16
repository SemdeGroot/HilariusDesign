import "../styles/tokens.css";
import "../styles/fonts.css";
import "../styles/global.css";
import ClientProviders from "../components/ClientProviders";

export const metadata = {
  title: {
    default: "Hilarius Design",
    template: "%s - Hilarius Design"
  },
  description: "Ideas Made of Board - Where Material Meets Creation",
  icons: { icon: "/logo.svg" }
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head>
        <link rel="dns-prefetch" href="https://use.typekit.net" />
        <link rel="dns-prefetch" href="https://p.typekit.net" />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/zko8kch.css" />
      </head>
      <body>
        {/* Hidden form for Netlify Forms detection at build time */}
        <form name="contact" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
          <input type="text" name="name" />
          <input type="email" name="email" />
          <textarea name="message"></textarea>
        </form>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
