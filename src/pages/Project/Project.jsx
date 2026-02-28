// src/pages/Project/Project.jsx
import { useContext, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import "./Project.css";

function Collage({ images, title }) {
  const count = images.length;
  const [loaded, setLoaded] = useState(() => ({}));

  function markLoaded(src) {
    if (!src) return;
    setLoaded((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  }

  if (count === 0) return null;

  if (count === 1) {
    const src = images[0];
    return (
      <div className="collage collage--1">
        <div className="collageSlot">
          <div className="imgBox imgBox--single">
            <img
              src={src}
              alt={title}
              loading="lazy"
              decoding="async"
              className={loaded[src] ? "isLoaded" : ""}
              onLoad={() => markLoaded(src)}
            />
            <div className="fallback" />
          </div>
        </div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="collage collage--2">
        {images.slice(0, 2).map((src, i) => (
          <div key={i} className="collageSlot">
            <div className="imgBox imgBox--half">
              <img
                src={src}
                alt={i === 0 ? title : ""}
                loading="lazy"
                decoding="async"
                className={loaded[src] ? "isLoaded" : ""}
                onLoad={() => markLoaded(src)}
              />
              <div className="fallback" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="collage collage--3">
        <div className="collageSlot collageSlot--wide">
          <div className="imgBox imgBox--wide">
            <img
              src={images[0]}
              alt={title}
              loading="lazy"
              decoding="async"
              className={loaded[images[0]] ? "isLoaded" : ""}
              onLoad={() => markLoaded(images[0])}
            />
            <div className="fallback" />
          </div>
        </div>
        {images.slice(1, 3).map((src, i) => (
          <div key={i} className="collageSlot">
            <div className="imgBox imgBox--square">
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className={loaded[src] ? "isLoaded" : ""}
                onLoad={() => markLoaded(src)}
              />
              <div className="fallback" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="collage collage--4">
      <div className="collageA">
        <div className="imgBox">
          <img
            src={images[0]}
            alt={title}
            loading="lazy"
            decoding="async"
            className={loaded[images[0]] ? "isLoaded" : ""}
            onLoad={() => markLoaded(images[0])}
          />
          <div className="fallback" />
        </div>
      </div>
      <div className="collageB">
        <div className="imgBox">
          {images[1] ? (
            <img
              src={images[1]}
              alt=""
              loading="lazy"
              decoding="async"
              className={loaded[images[1]] ? "isLoaded" : ""}
              onLoad={() => markLoaded(images[1])}
            />
          ) : null}
          <div className="fallback" />
        </div>
      </div>
      <div className="collageC">
        <div className="imgBox">
          {images[2] ? (
            <img
              src={images[2]}
              alt=""
              loading="lazy"
              decoding="async"
              className={loaded[images[2]] ? "isLoaded" : ""}
              onLoad={() => markLoaded(images[2])}
            />
          ) : null}
          <div className="fallback" />
        </div>
      </div>
      <div className="collageD">
        <div className="imgBox">
          {images[3] ? (
            <img
              src={images[3]}
              alt=""
              loading="lazy"
              decoding="async"
              className={loaded[images[3]] ? "isLoaded" : ""}
              onLoad={() => markLoaded(images[3])}
            />
          ) : null}
          <div className="fallback" />
        </div>
      </div>
    </div>
  );
}

export default function Project() {
  const { id } = useParams();
  const { pick } = useContext(I18nContext);

  const project = useMemo(
    () => routesConfig.projects.find((p) => p.id === id),
    [id]
  );

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
        <h1 className="projTitle">
          {pick(routesConfig.copy.common, "notFound")}
        </h1>
        <Link to="/" className="projBack">
          {pick(routesConfig.copy.common, "backHome")}
        </Link>
      </section>
    );
  }

  const images = project.images?.length
    ? project.images
    : [project.cover].filter(Boolean);

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
        <Collage images={images} title={pick(project, "title")} />

        <aside className="projRight">
          <h1 className="projTitle">{pick(project, "title")}</h1>

          {description ? (
            <p className="projIntro">{description}</p>
          ) : null}

          {body ? <div className="projBody">{body}</div> : null}
        </aside>
      </div>

      <div className="pn">
        <div className="pnLeft">
          {nav.prev ? (
            <Link to={`/project/${nav.prev.id}`} className="pnLink">
              <span className="pnIcon" aria-hidden="true">
                <ArrowLeft strokeWidth={1.8} />
              </span>
              <span className="pnText">
                {pick(routesConfig.copy.project, "prev")}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>

        <Link
          to={category ? `/category/${category.slug}` : "/"}
          className="pnCenter"
          aria-label="Back to category"
        >
          <LayoutGrid strokeWidth={1.6} />
        </Link>

        <div className="pnRight">
          {nav.next ? (
            <Link to={`/project/${nav.next.id}`} className="pnLink right">
              <span className="pnText">
                {pick(routesConfig.copy.project, "next")}
              </span>
              <span className="pnIcon" aria-hidden="true">
                <ArrowRight strokeWidth={1.8} />
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}