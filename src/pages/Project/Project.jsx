import { useContext, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import "./Project.css";

function GridIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.75"
      />
    </svg>
  );
}

export default function Project() {
  const { id } = useParams();
  const { pick } = useContext(I18nContext);

  const project = useMemo(() => routesConfig.projects.find((p) => p.id === id), [id]);
  const category = useMemo(() => {
    if (!project) return null;
    return routesConfig.categories.find((c) => c.slug === project.category) ?? null;
  }, [project]);

  const siblings = useMemo(() => {
    if (!category) return [];
    return routesConfig.projects.filter((p) => p.category === category.slug);
  }, [category]);

  const nav = useMemo(() => {
    if (!project || !siblings.length) return { prev: null, next: null };
    const idx = siblings.findIndex((p) => p.id === project.id);
    return {
      prev: idx > 0 ? siblings[idx - 1] : null,
      next: idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null
    };
  }, [project, siblings]);

  if (!project) {
    return (
      <section className="proj">
        <h1 className="projTitle">{pick(routesConfig.copy.common, "notFound")}</h1>
        <Link to="/" className="projBack">{pick(routesConfig.copy.common, "backHome")}</Link>
      </section>
    );
  }

  const images = project.images?.length ? project.images : [project.cover].filter(Boolean);
  const description = pick(project, "description");
  const body = pick(project, "body");

  return (
    <section className="proj">
      <div className="breadcrumb">
        <Link to="/" className="uLink crumbLink">
          <span className="uLinkLabel">
            {pick(routesConfig.copy.nav, "home")}
            <span className="uUnderline" />
          </span>
        </Link>
        <span className="sep">/</span>
        {category ? (
          <>
            <Link to={`/category/${category.slug}`} className="uLink crumbLink">
              <span className="uLinkLabel">
                {pick(category, "title")}
                <span className="uUnderline" />
              </span>
            </Link>
            <span className="sep">/</span>
          </>
        ) : null}
        <span className="crumbNow">{pick(project, "title")}</span>
      </div>

      <div className="projLayout">
        <div className="collage">
          <div className="collageA">
            <div className="imgBox">
              {images[0] ? <img src={images[0]} alt={pick(project, "title")} loading="lazy" /> : null}
              <div className="fallback" />
            </div>
          </div>
          <div className="collageB">
            <div className="imgBox">
              {images[1] ? <img src={images[1]} alt="" loading="lazy" /> : null}
              <div className="fallback" />
            </div>
          </div>
          <div className="collageC">
            <div className="imgBox">
              {images[2] ? <img src={images[2]} alt="" loading="lazy" /> : null}
              <div className="fallback" />
            </div>
          </div>
          <div className="collageD">
            <div className="imgBox">
              {images[3] ? <img src={images[3]} alt="" loading="lazy" /> : null}
              <div className="fallback" />
            </div>
          </div>
        </div>

        <aside className="projRight">
          <h1 className="projTitle">{pick(project, "title")}</h1>

          {description ? <p className="projIntro">{description}</p> : null}
          {body ? <div className="projBody">{body}</div> : null}

          <div className="detailList">
            <div className="detailRow">
              <div className="detailKey">{pick(routesConfig.copy.project, "year")}</div>
              <div className="detailVal">{pick(project, "year")}</div>
            </div>
            <div className="detailRow">
              <div className="detailKey">{pick(routesConfig.copy.project, "type")}</div>
              <div className="detailVal">{pick(project, "type")}</div>
            </div>
            <div className="detailRow">
              <div className="detailKey">{pick(routesConfig.copy.project, "materials")}</div>
              <div className="detailVal">{pick(project, "materials")}</div>
            </div>
          </div>
        </aside>
      </div>

      <div className="pn">
        <div className="pnLeft">
          {nav.prev ? (
            <Link to={`/project/${nav.prev.id}`} className="pnLink">
              <span className="pnArrow">←</span>
              <span className="pnText">{pick(routesConfig.copy.project, "prev")}</span>
            </Link>
          ) : <div />}
        </div>

        <Link
          to={category ? `/category/${category.slug}` : "/"}
          className="pnCenter"
          aria-label="Back to category"
        >
          <GridIcon />
        </Link>

        <div className="pnRight">
          {nav.next ? (
            <Link to={`/project/${nav.next.id}`} className="pnLink right">
              <span className="pnText">{pick(routesConfig.copy.project, "next")}</span>
              <span className="pnArrow">→</span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </section>
  );
}
