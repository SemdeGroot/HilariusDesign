import { useContext } from "react";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import "./Page.css";

export default function Page({ pageKey }) {
  const { pick } = useContext(I18nContext);
  const page = routesConfig.pages[pageKey];
  const isContact = pageKey === "contact";

  return (
    <section className="page">
      <h1 className="pageTitle">{pick(page, "title")}</h1>
      <p className="pageIntro">{pick(page, "intro")}</p>

      <div className="pageBody">
        <p>{pick(page, "body")}</p>

        {isContact ? (
          <a
            className="uLink pageLink"
            href={routesConfig.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            <span className="uLinkLabel">
              LinkedIn
              <span className="uUnderline" />
            </span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
