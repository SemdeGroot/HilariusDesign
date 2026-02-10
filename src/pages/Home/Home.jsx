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

function HomeMobile({ intro, categories, feature }) {
  const [visibleCount, setVisibleCount] = useState(() => Math.min(1, categories.length));
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (visibleCount >= categories.length) return;
    const el = sentinelRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;

        // Reveal exactly one extra item at a time
        setVisibleCount((v) => Math.min(v + 1, categories.length));

        // If reduced motion, just keep going without waiting for animation timing
        if (prefersReduced) {
          setVisibleCount((v) => Math.min(v + 1, categories.length));
        }
      },
      { root: null, threshold: 0.12, rootMargin: "0px 0px -18% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [visibleCount, categories.length]);

  const shown = categories.slice(0, visibleCount);

  return (
    <section className="homeMobile" aria-label="Home">
      <div className="homeMobileIntro">
        <div className="homeMobileIntroTitle">{intro.title}</div>
        <div className="homeMobileIntroBody">{intro.body}</div>
      </div>

      <div className="homeMobileCats" aria-label="Categories">
        {shown.map((c) => (
          <article key={c.slug} className="homeMobileCatCard isIn">
            <Link to={`/category/${c.slug}`} className="homeMobileCatLink">
              <div className="homeMobileCatMedia" aria-hidden="true">
                {c.src ? <img src={c.src} alt="" loading="lazy" decoding="async" /> : null}
              </div>
              <div className="homeMobileCatCaption">
                <div className="homeMobileCatTitle">{c.title}</div>
                <div className="homeMobileCatSub">{c.sub}</div>
              </div>
            </Link>
          </article>
        ))}

        {/* Sentinel: zodra je hierheen scrollt, verschijnt er 1 categorie extra */}
        {visibleCount < categories.length ? <div ref={sentinelRef} className="homeRevealSentinel" /> : null}
      </div>

      {feature.heroSrc ? (
        <div className="homeMobileFeatureHeroWrap" aria-hidden="true">
          <img
            className="homeMobileFeatureHero"
            src={feature.heroSrc}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}

      <div className="homeMobileFeatureText">
        <div className="homeMobileFeatureTitle">{feature.title}</div>
        <div className="homeMobileFeatureBody">{feature.body}</div>
      </div>
    </section>
  );
}

export default function Home() {
  const { pick } = useContext(I18nContext);
  const isMobile = useIsMobile(860);

  const { tiles, feature, mobileIntro, mobileCategories } = useMemo(() => {
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

    const heroSrc = getImage("uitstalling.jpg");

    const featureBlock = {
      title: pick(routesConfig.copy.home, "secondTitle"),
      body: pick(routesConfig.copy.home, "secondBody"),
      heroSrc
    };

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

    return {
      tiles: baseTiles,
      feature: featureBlock,
      mobileIntro: intro,
      mobileCategories: cats
    };
  }, [pick]);

  if (isMobile) {
    return <HomeMobile intro={mobileIntro} categories={mobileCategories} feature={feature} />;
  }

  return (
    <section className="home">
      <HomeMosaic tiles={tiles} />

      <div className="homeFeature">
        <div className="homeFeatureLeft">
          {feature.heroSrc ? (
            <img
              className="homeFeatureHero"
              src={feature.heroSrc}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>

        <div className="homeFeatureRight">
          <div className="homeFeatureText">
            <div className="homeFeatureTitle">{feature.title}</div>
            <div className="homeFeatureBody">{feature.body}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
