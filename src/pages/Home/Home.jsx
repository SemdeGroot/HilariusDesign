import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import HomeMosaic from "../../components/HomeMosaic/HomeMosaic.jsx";
import { getImage } from "../../router/images";
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

function useScrollReveal({ threshold = 0.22, rootMargin = "0px 0px -20% 0px" } = {}) {
  const [inMap, setInMap] = useState(() => ({}));
  const observerRef = useRef(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReduced) {
      observerRef.current = null;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const next = {};
        for (const e of entries) {
          if (e.isIntersecting) {
            const key = e.target?.dataset?.revealKey;
            if (key) next[key] = true;
          }
        }
        if (Object.keys(next).length) {
          setInMap((prev) => ({ ...prev, ...next }));
        }
      },
      { root: null, threshold, rootMargin }
    );

    observerRef.current = io;
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  function observe(el) {
    if (!el) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReduced) {
      const key = el.dataset?.revealKey;
      if (key) setInMap((prev) => ({ ...prev, [key]: true }));
      return;
    }

    observerRef.current?.observe(el);
  }

  return { inMap, observe };
}

function HomeMobile({ intro, categories }) {
  const { inMap, observe } = useScrollReveal({
    threshold: 0.24,
    rootMargin: "0px 0px -22% 0px"
  });

  const [loaded, setLoaded] = useState(() => ({}));

  return (
    <section className="homeMobile" aria-label="Home">
      <div
        className={`homeMobileIntro homeRevealBlock ${inMap["intro"] ? "isIn" : ""}`}
        data-reveal-key="intro"
        ref={observe}
      >
        <div className="homeMobileIntroTitle">{intro.title}</div>
        <div className="homeMobileIntroBody">{intro.body}</div>
      </div>

      <div className="homeMobileCats" aria-label="Categories">
        {categories.map((c) => {
          const key = `cat-${c.slug}`;
          const isIn = !!inMap[key];
          const isLoaded = !!loaded[key];

          return (
            <article
              key={c.slug}
              className={`homeMobileCatCard homeRevealBlock ${isIn ? "isIn" : ""}`}
              data-reveal-key={key}
              ref={observe}
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
                      onError={(e) => (e.currentTarget.style.display = "none")}
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

  const { tiles, mobileIntro, mobileCategories } = useMemo(() => {
    const c = routesConfig.categories;
    const p = routesConfig.projects;

    const coverFor = (slug) => {
      const manual = routesConfig.homeCovers?.[slug];
      if (manual) return getImage(manual);
      return p.find((x) => x.category === slug)?.cover || "";
    };

    const baseTiles = [
      {
        key: "t1",
        type: "image",
        size: "s3",
        to: `/category/${c[0].slug}`,
        src: coverFor(c[0].slug),
        label: pick(c[0], "title"),
        sub: pick(c[0], "subtitle")
      },
      {
        key: "txt1",
        type: "text",
        size: "s5",
        title: pick(routesConfig.copy.home, "leadTitle"),
        body: pick(routesConfig.copy.home, "leadBody")
      },
      {
        key: "c2a",
        type: "image",
        size: "s2",
        to: `/category/${c[1].slug}`,
        src: coverFor(c[1].slug),
        label: pick(c[1], "title"),
        sub: pick(c[1], "subtitle")
      },
      {
        key: "c3a",
        type: "image",
        size: "s2",
        to: `/category/${c[2].slug}`,
        src: coverFor(c[2].slug),
        label: pick(c[2], "title"),
        sub: pick(c[2], "subtitle")
      },
      {
        key: "c4a",
        type: "image",
        size: "s2",
        to: `/category/${c[3].slug}`,
        src: coverFor(c[3].slug),
        label: pick(c[3], "title"),
        sub: pick(c[3], "subtitle")
      },
      {
        key: "c5a",
        type: "image",
        size: "s2",
        to: `/category/${c[4].slug}`,
        src: coverFor(c[4].slug),
        label: pick(c[4], "title"),
        sub: pick(c[4], "subtitle")
      },
      {
        key: "c6a",
        type: "image",
        size: "s2",
        to: `/category/${c[5].slug}`,
        src: coverFor(c[5].slug),
        label: pick(c[5], "title"),
        sub: pick(c[5], "subtitle")
      }
    ];

    const intro = {
      title: pick(routesConfig.copy.home, "leadTitle"),
      body: pick(routesConfig.copy.home, "leadBody")
    };

    const cats = c.slice(0, 6).map((cat) => ({
      slug: cat.slug,
      src: coverFor(cat.slug),
      title: pick(cat, "title"),
      sub: pick(cat, "subtitle")
    }));

    return { tiles: baseTiles, mobileIntro: intro, mobileCategories: cats };
  }, [pick]);

  const { inMap, observe } = useScrollReveal({
    threshold: 0.22,
    rootMargin: "0px 0px -20% 0px"
  });

  if (isMobile) {
    return <HomeMobile intro={mobileIntro} categories={mobileCategories} />;
  }

  return (
    <section className="home">
      <div
        className={`homeRevealBlock ${inMap["mosaic"] ? "isIn" : ""}`}
        data-reveal-key="mosaic"
        ref={observe}
      >
        <HomeMosaic tiles={tiles} />
      </div>
    </section>
  );
}