import { useContext, useEffect, useMemo, useRef, useState } from "react";
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

function MobileShowcase({ slides }) {
  const refs = useRef([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("inView");
        }
      },
      { threshold: 0.5 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="homeShowcase" aria-label="Showcase">
      {/* Top tekst: altijd bovenaan, botst niet met captions */}
      <div className="homeShowcaseTop">
        <div className="homeShowcaseBrand">HilariusDesign</div>
      </div>

      <div className="homeShowcaseStack">
        {slides.map((s, idx) => (
          <article
            key={s.key}
            className="homeShowcaseSlide"
            ref={(el) => (refs.current[idx] = el)}
          >
            <div className="homeShowcaseMedia" aria-hidden="true">
              {s.src ? <img src={s.src} alt="" loading="lazy" decoding="async" /> : null}
            </div>

            {/* Caption: onderin de slide (zodat hij niet met toptekst botst) */}
            <div className="homeShowcaseCaption">
              <div className="homeShowcaseTitle">{s.title}</div>
              {s.sub ? <div className="homeShowcaseSub">{s.sub}</div> : null}
            </div>
          </article>
        ))}
      </div>

      {/* Bottom spacer zodat laatste caption niet tegen de rand plakt */}
      <div className="homeShowcaseBottom" aria-hidden="true" />
    </section>
  );
}

export default function Home() {
  const { pick } = useContext(I18nContext);
  const isMobile = useIsMobile(860);

  const { tiles, feature, mobileSlides } = useMemo(() => {
    const c = routesConfig.categories;
    const p = routesConfig.projects;

    const coverFor = (slug) => {
      const manual = routesConfig.homeCovers?.[slug];
      if (manual) return getImage(manual);
      return p.find((x) => x.category === slug)?.cover || "";
    };

    /**
     * DESKTOP:
     * - Eerste 2 rijen EXACT behouden zoals jij ze nu hebt:
     *   -> dit zijn de eerste 6 items hieronder (incl. txt1).
     * - Alles daarna weg (geen extra c.slice(0,6) meer).
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

    // Feature block onder de mosaic (blijft)
    const heroSrc = getImage("uitstalling.jpg");

    // MOBILE showcase: 6 categorieën als verticale showcase
    const slides = c.slice(0, 6).map((cat) => ({
      key: `mob-${cat.slug}`,
      src: coverFor(cat.slug),
      title: pick(cat, "title"),
      sub: pick(cat, "subtitle")
    }));

    return {
      tiles: baseTiles,
      feature: {
        title: pick(routesConfig.copy.home, "secondTitle"),
        body: pick(routesConfig.copy.home, "secondBody"),
        heroSrc
      },
      mobileSlides: slides
    };
  }, [pick]);

  if (isMobile) {
    return <MobileShowcase slides={mobileSlides} />;
  }

  return (
    <section className="home">
      <HomeMosaic tiles={tiles} />

      <div className="homeFeature">
        <div className="homeFeatureLeft">
          {feature.heroSrc ? (
            <img className="homeFeatureHero" src={feature.heroSrc} alt="" loading="lazy" decoding="async" />
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
