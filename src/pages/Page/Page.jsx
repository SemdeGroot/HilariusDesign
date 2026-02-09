import { routesConfig } from "../../router/routesConfig";
import "./Page.css";

export default function Page({ pageKey }) {
  const page = routesConfig.pages[pageKey];

  return (
    <section className="page">
      <h1 className="pageTitle">{page.title}</h1>
      <p className="pageIntro">{page.intro}</p>

      <div className="pageBody">
        <p>
          Replace this with your final copy. Keep it minimal and confident.
        </p>
      </div>
    </section>
  );
}
