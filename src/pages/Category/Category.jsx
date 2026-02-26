import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import "./Category.css";

async function preloadAndDecode(src) {
  if (!src) return;
  const img = new Image();
  img.src = src;

  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("load failed"));
  });

  if (img.decode) {
    try {
      await img.decode();
    } catch {
      // ignore
    }
  }
}

export default function Category() {
  const { slug } = useParams();
  const { pick } = useContext(I18nContext);

  const category = useMemo(
    () => routesConfig.categories.find((c) => c.slug === slug),
    [slug]
  );

  const projects = useMemo(() => {
    if (!category) return [];
    return routesConfig.projects.filter((p) => p.category === category.slug);
  }, [category]);

  const [activeId, setActiveId] = useState(null);

  const [heroSrc, setHeroSrc] = useState("");
  const [heroFadeKey, setHeroFadeKey] = useState(0);

  const preloadedRef = useRef(new Set());
  const railRef = useRef(null);

  useEffect(() => {
    if (!projects.length) return;

    const first = projects[0];
    setActiveId(first.id);
    setHeroSrc(first.cover || "");
    setHeroFadeKey((k) => k + 1);

    let cancelled = false;

    Promise.allSettled(projects.map((p) => preloadAndDecode(p.cover))).then((results) => {
      if (cancelled) return;
      for (let i = 0; i < projects.length; i += 1) {
        const src = projects[i]?.cover;
        if (src && results[i]?.status === "fulfilled") {
          preloadedRef.current.add(src);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug, projects]);

  function hoverProject(p) {
    if (!p?.cover) return;
    if (p.id === activeId) return;

    setActiveId(p.id);

    if (preloadedRef.current.has(p.cover)) {
      setHeroSrc(p.cover);
      setHeroFadeKey((k) => k + 1);
      return;
    }

    preloadAndDecode(p.cover)
      .then(() => {
        preloadedRef.current.add(p.cover);
        setHeroSrc(p.cover);
        setHeroFadeKey((k) => k + 1);
      })
      .catch(() => {
        setHeroSrc(p.cover);
        setHeroFadeKey((k) => k + 1);
      });
  }

  function scrollRail(dir) {
    const el = railRef.current;
    if (!el) return;

    const first = el.firstElementChild;
    if (!first) return;

    const styles = window.getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const step = first.getBoundingClientRect().width + gap;
    if (!step) return;

    const currentIndex = Math.round(el.scrollLeft / step);
    const targetIndex = currentIndex + dir;
    const target = targetIndex * step;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReduced) {
      el.scrollLeft = target;
      return;
    }

    el.scrollTo({ left: target, top: 0, behavior: "smooth" });
  }

  if (!category) {
    return (
      <section className="catPage">
        <div className="catTop">
          <h1 className="catTitle">{pick(routesConfig.copy.common, "notFound")}</h1>
          <Link className="catBack" to="/">
            {pick(routesConfig.copy.common, "backHome")}
          </Link>
        </div>
      </section>
    );
  }

  const currentProject = projects.find((p) => p.id === activeId) ?? projects[0] ?? null;

  return (
    <section className="catPage">
      <div className="catLayout">
        <Link
          to={currentProject ? `/project/${currentProject.id}` : "#"}
          className="catHero"
          aria-label="Open project"
        >
          <div className="catHeroMedia">
            <div className="catHeroStack">
              {heroSrc ? (
                <img
                  key={heroFadeKey}
                  className="catHeroImg"
                  src={heroSrc}
                  alt={currentProject ? pick(currentProject, "title") : ""}
                  loading="eager"
                  decoding="async"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : null}
              <div className="catHeroFallback" />
            </div>
          </div>
        </Link>

        <div className="catRight">
          <h1 className="catHeading">
            {pick(category, "titleLine1")}
            <br />
            <span className="catStrong">{pick(category, "titleLine2")}</span>
            <br />
            {pick(category, "titleLine3")}
          </h1>

          <div className="catTableWrap">
            <div className="catTable">
              <div className="catTableHead">
                <div className="th">{pick(routesConfig.copy.category, "colProject")}</div>
              </div>

              {projects.map((p) => {
                const isActive = p.id === activeId;
                return (
                  <Link
                    key={p.id}
                    to={`/project/${p.id}`}
                    className={`catRow ${isActive ? "active" : ""}`}
                    onMouseEnter={() => hoverProject(p)}
                    onFocus={() => hoverProject(p)}
                  >
                    <div className="td projectOnly">
                      <span className="linkish">{pick(p, "title")}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="catMetaNote">{pick(category, "subtitle")}</div>
        </div>
      </div>

      <div className="catMobile">
        <div className="catMobileTitle">{pick(category, "title")}</div>
        <div className="catMobileSub">{pick(category, "subtitle")}</div>

        <div className="catMobileRailWrap" aria-label="Products">
          <button
            className="catArrowBtn"
            type="button"
            onClick={() => scrollRail(-1)}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} strokeWidth={1.8} />
          </button>

          <div ref={railRef} className="catMobileRail">
            {projects.map((p) => (
              <Link key={p.id} to={`/project/${p.id}`} className="catMobileCard">
                <div className="catMobileMedia">
                  {p.cover ? (
                    <img
                      src={p.cover}
                      alt={pick(p, "title")}
                      loading="eager"
                      decoding="async"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : null}
                  <div className="catHeroFallback" />
                </div>
                <div className="catMobileInfo">
                  <div className="catMobileName">{pick(p, "title")}</div>
                </div>
              </Link>
            ))}
          </div>

          <button
            className="catArrowBtn"
            type="button"
            onClick={() => scrollRail(1)}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </section>
  );
}