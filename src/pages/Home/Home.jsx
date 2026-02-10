import { useContext, useEffect, useMemo, useState } from "react";
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
  return (
    <section className="homeMobile" aria-label="Home">
      {/* 1) Intro */}
      <div className="homeMobileIntro">
        <div className="homeMobileIntroTitle">{intro.title}</div>
        <div className="homeMobileIntroBody">{intro.body}</div>
      </div>

      {/* 2) Categorie 1 (titel + beschrijving) */}
      {categories[0] ? (
        <article className="homeMobileCat">
          <Link to={`/category/${categories[0].slug}`} className="homeMobileCatLink">
            <div className="homeMobileCatMedia" aria-hidden="true">
              {categories[0].src ? (
                <img src={categories[0].src} alt="" loading="lazy" decoding="async" />
              ) : null}
            </div>
            <div className="homeMobileCatCaption">
              <div className="homeMobileCatTitle">{categories[0].title}</div>
              <div className="homeMobileCatSub">{categories[0].sub}</div>
            </div>
          </Link>
        </article>
      ) : null}

      {/* 3) Categorie 2 t/m 6 (titel + beschrijving) */}
      <div className="homeMobileCatList" aria-label="Categories">
        {categories.slice(1, 6).map((c) => (
          <Link key={c.slug} to={`/category/${c.slug}`} className="homeMobileCatRow">
            <span className="homeMobileCatRowTitle">{c.title}</span>
            <span className="homeMobileCatRowSub">{c.sub}</span>
          </Link>
        ))}
      </div>

      {/* 4) Grote uitstalling foto */}
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

      {/* 5) Laatste tekst */}
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

    /**
     * DESKTOP mosaic blijft exact zoals eerder
     */
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

    // Feature block (desktop + mobile)
    const heroSrc = getImage("uitstalling.jpg");

    const featureBlock = {
      title: pick(routesConfig.copy.home, "secondTitle"),
      body: pick(routesConfig.copy.home, "secondBody"),
      heroSrc
    };

    // MOBILE intro
    const intro = {
      title: pick(routesConfig.copy.home, "leadTitle"),
      body: pick(routesConfig.copy.home, "leadBody")
    };

    // MOBILE categorie data (1 t/m 6 met beschrijving)
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
