// src/pages/Home/Home.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import HomeMosaic from "../../components/HomeMosaic/HomeMosaic.jsx";
import { getImage } from "../../router/images";
import WorldOfBoard from "../../assets/WorldOfBoard.svg";
import "./Home.css";

function useIsMobile(breakpoint = 860) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

function HomeMobile({ categories }) {
  const [loaded, setLoaded] = useState(() => ({}));

  return (
    <section className="homeMobile" aria-label="Home">
      <div className="homeMobileWob homeRevealBlock isIn">
        <img src={WorldOfBoard} alt="World of Board" className="homeMobileWobImg" />
      </div>

      <div className="homeMobileCats" aria-label="Categories">
        {categories.map((c) => {
          const key = `cat-${c.slug}`;
          const isLoaded = !!loaded[key];

          return (
            <article
              key={c.slug}
              className={`homeMobileCatCard ${isLoaded ? "textLoaded" : ""}`}
            >
              <Link to={`/category/${c.slug}`} className="homeMobileCatLink">
                <div className="homeMobileCatMedia" aria-hidden="true">
                  {c.src ? (
                    <img
                      src={c.src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={`revealImg ${isLoaded ? "isLoaded" : ""}`}
                      onLoad={() => setLoaded((p) => ({ ...p, [key]: true }))}
                      onError={() => setLoaded((p) => ({ ...p, [key]: true }))}
                    />
                  ) : null}
                  <div className="homeImgFallback" />
                </div>
                <div className="homeMobileCatCaption">
                  <div className="homeMobileCatTitle">{c.title}</div>
                  <div className="homeMobileCatSub">{c.sub}</div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function Home() {
  const { pick } = useContext(I18nContext);
  const isMobile = useIsMobile(860);

  const { tiles, mobileCategories } = useMemo(() => {
    const c = routesConfig.categories;
    const p = routesConfig.projects;

    const coverFor = (slug) => {
      const manual = routesConfig.homeCovers?.[slug];
      if (manual) return getImage(manual);
      return p.find((x) => x.category === slug)?.cover || "";
    };

    const baseTiles = [
      { key: "wob", type: "wob", size: "s3", to: "/category/the-art-of-board" },
      ...c
        .filter((cat) => cat.slug !== "the-art-of-board")
        .map((cat, i) => ({
          key: `c${i}`,
          type: "image",
          size: i < 2 ? "s3" : "s2",
          to: `/category/${cat.slug}`,
          src: coverFor(cat.slug),
          label: pick(cat, "title"),
          sub: pick(cat, "subtitle")
        }))
    ];

    const cats = c.map((cat) => ({
      slug: cat.slug,
      src: coverFor(cat.slug),
      title: pick(cat, "title"),
      sub: pick(cat, "subtitle")
    }));

    return { tiles: baseTiles, mobileCategories: cats };
  }, [pick]);

  if (isMobile) {
    return <HomeMobile categories={mobileCategories} />;
  }

  return (
    <section className="home">
      <HomeMosaic tiles={tiles} />
    </section>
  );
}