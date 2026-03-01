// src/pages/Home/Home.jsx
import { useContext, useEffect, useMemo, useRef, useState } from "react";
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

function useScrollReveal({ threshold = 0.1, rootMargin = "0px" } = {}) {
  const [inMap, setInMap] = useState(() => ({}));
  const observerRef = useRef(null);
  const pendingRef = useRef([]);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReduced) {
      observerRef.current = null;
      setInMap((prev) => {
        const all = {};
        for (const el of pendingRef.current) {
          const key = el.dataset?.revealKey;
          if (key) all[key] = true;
        }
        return { ...prev, ...all };
      });
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

    // Observe elements that were registered before the effect ran
    for (const el of pendingRef.current) {
      io.observe(el);
    }

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

    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) {
      const key = el.dataset?.revealKey;
      if (key) setInMap((prev) => ({ ...prev, [key]: true }));
      return;
    }

    if (observerRef.current) {
      observerRef.current.observe(el);
    } else {
      pendingRef.current.push(el);
    }
  }

  return { inMap, observe };
}

function HomeMobile({ categories }) {
  const { inMap, observe } = useScrollReveal({
    threshold: 0.24,
    rootMargin: "0px 0px -22% 0px"
  });

  const [loaded, setLoaded] = useState(() => ({}));

  return (
    <section className="homeMobile" aria-label="Home">
      <div
        className={`homeMobileWob homeRevealBlock ${inMap["wob"] ? "isIn" : ""}`}
        data-reveal-key="wob"
        ref={observe}
      >
        <img src={WorldOfBoard} alt="World of Board" className="homeMobileWobImg" />
      </div>

      <div className="homeMobileCats" aria-label="Categories">
        {categories.map((c) => {
          const key = `cat-${c.slug}`;
          const isLoaded = !!loaded[key];
          // Block the reveal until the image has loaded — text and image appear together
          const isIn = !!inMap[key] && isLoaded;

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
                      className="revealImg isLoaded"
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

  const { inMap, observe } = useScrollReveal({
    threshold: 0.1,
    rootMargin: "0px"
  });

  if (isMobile) {
    return <HomeMobile categories={mobileCategories} />;
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