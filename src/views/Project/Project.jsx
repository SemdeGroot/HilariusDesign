"use client";

import { useContext, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import "./Project.css";

function Collage({ images, title }) {
  const count = images.length;
  const [loaded, setLoaded] = useState({});

  function markLoaded(src) {
    if (!src) return;
    setLoaded((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  }

  const renderImg = (src, alt = "") => (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={loaded[src] ? "isLoaded" : ""}
      onLoad={() => markLoaded(src)}
    />
  );

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div className="collage collage--1">
        <div className="imgBox">
          {renderImg(images[0], title)}
          <div className="fallback" />
        </div>
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="collage collage--2">
        <div className="imgBox imgBox--main">
          {renderImg(images[0], title)}
          <div className="fallback" />
        </div>
        <div className="imgBox imgBox--accent">
          {renderImg(images[1])}
          <div className="fallback" />
        </div>
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="collage collage--3">
        <div className="imgBox imgBox--tall">
          {renderImg(images[0], title)}
          <div className="fallback" />
        </div>
        <div className="collageStack">
          {images.slice(1, 3).map((src, i) => (
            <div key={i} className="imgBox imgBox--thumb">
              {renderImg(src)}
              <div className="fallback" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="collage collage--4">
      <div className="imgBox imgBox--hero">
        {renderImg(images[0], title)}
        <div className="fallback" />
      </div>
      <div className="collageRow">
        {images.slice(1, 4).map((src, i) => (
          <div key={i} className="imgBox imgBox--tile">
            {renderImg(src)}
            <div className="fallback" />
          </div>
        ))}
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
        <Link href="/" className="projBack">
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
        <Link href="/" className="uLink crumbLink">
          <span className="uLinkLabel">
            {pick(routesConfig.copy.nav, "home")}
            <span className="uUnderline" />
          </span>
        </Link>
        <span className="sep">/</span>

        {category ? (
          <>
            <Link href={`/category/${category.slug}`} className="uLink crumbLink">
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
            <Link href={`/project/${nav.prev.id}`} className="pnLink">
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
          href={category ? `/category/${category.slug}` : "/"}
          className="pnCenter"
          aria-label="Back to category"
        >
          <LayoutGrid strokeWidth={1.6} />
        </Link>

        <div className="pnRight">
          {nav.next ? (
            <Link href={`/project/${nav.next.id}`} className="pnLink right">
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
