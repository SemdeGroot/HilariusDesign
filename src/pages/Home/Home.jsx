// src/pages/Home/Home.jsx
import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { routesConfig } from "../../router/routesConfig";
import { I18nContext } from "../../i18n/I18nProvider";
import HomeMosaic from "../../components/HomeMosaic/HomeMosaic.jsx";
import { getImage } from "../../router/images";
import "./Home.css";

export default function Home() {
  const { pick } = useContext(I18nContext);

  const { tiles, feature, extras } = useMemo(() => {
    const c = routesConfig.categories;
    const p = routesConfig.projects;

    const coverFor = (slug) => {
      const manual = routesConfig.homeCovers?.[slug];
      if (manual) return getImage(manual);
      return p.find((x) => x.category === slug)?.cover || "";
    };

    // Boven: 2 rijen (in dezelfde geest als nu)
    // Rij 1: 4 items die exact op 12 kolommen uitkomen
    const row1 = [
      {
        key: "r1-c1",
        type: "image",
        size: "s3",
        to: `/category/${c[0].slug}`,
        src: coverFor(c[0].slug),
        label: pick(c[0], "title"),
        sub: pick(c[0], "subtitle")
      },
      {
        key: "r1-txt",
        type: "text",
        size: "s5",
        title: pick(routesConfig.copy.home, "leadTitle"),
        body: pick(routesConfig.copy.home, "leadBody")
      },
      {
        key: "r1-c2",
        type: "image",
        size: "s2",
        to: `/category/${c[1].slug}`,
        src: coverFor(c[1].slug),
        label: pick(c[1], "title"),
        sub: pick(c[1], "subtitle")
      },
      {
        key: "r1-c3",
        type: "image",
        size: "s2",
        to: `/category/${c[2].slug}`,
        src: coverFor(c[2].slug),
        label: pick(c[2], "title"),
        sub: pick(c[2], "subtitle")
      }
    ];

    // Rij 2: kleine tiles (zoals je huidige tweede rij-gevoel)
    const row2 = c.slice(0, 6).map((cat) => ({
      key: `r2-${cat.slug}`,
      type: "image",
      size: "s2",
      to: `/category/${cat.slug}`,
      src: coverFor(cat.slug),
      label: pick(cat, "title"),
      sub: pick(cat, "subtitle")
    }));

    const heroSrc = getImage("uitstalling.jpg");
    const sideSrc = getImage(routesConfig.homeExtras?.[0]?.file ?? "transport/dieplader/dieplader.jpg");

    const extrasList = (routesConfig.homeExtras ?? []).map((x) => ({
      key: x.key,
      src: getImage(x.file),
      label: pick(x, "label"),
      sub: pick(x, "sub"),
      // Optioneel: als je dit liever naar een category linkt, kun je hier een route van maken.
      to: null
    }));

    return {
      tiles: [...row1, ...row2],
      feature: {
        title: pick(routesConfig.copy.home, "secondTitle"),
        body: pick(routesConfig.copy.home, "secondBody"),
        heroSrc,
        sideSrc
      },
      extras: extrasList
    };
  }, [pick]);

  return (
    <section className="home">
      <HomeMosaic tiles={tiles} />

      <div className="homeFeature">
        <div className="homeFeatureLeft">
          <div className="homeMediaCard homeMediaCardHero">
            {feature.heroSrc ? (
              <img
                className="homeMediaImg"
                src={feature.heroSrc}
                alt=""
                loading="lazy"
                decoding="async"
              />
            ) : null}
            <div className="homeMediaFallback" />
          </div>
        </div>

        <div className="homeFeatureRight">
          <div className="homeFeatureText">
            <div className="homeFeatureTitle">{feature.title}</div>
            <div className="homeFeatureBody">{feature.body}</div>
          </div>

          <div className="homeFeatureMedia">
            <div className="homeMediaCard">
              {feature.sideSrc ? (
                <img
                  className="homeMediaImg"
                  src={feature.sideSrc}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <div className="homeMediaFallback" />
            </div>
          </div>
        </div>
      </div>

      {extras.length ? (
        <div className="homeExtras">
          {extras.map((x) => {
            const Wrapper = x.to ? Link : "div";
            return (
              <Wrapper
                key={x.key}
                to={x.to}
                className={`homeExtraCard ${x.to ? "isLink" : ""}`}
                aria-label={x.label || "Extra"}
              >
                <div className="homeMediaCard">
                  {x.src ? (
                    <img className="homeMediaImg" src={x.src} alt="" loading="lazy" decoding="async" />
                  ) : null}
                  <div className="homeMediaFallback" />
                </div>

                <div className="homeExtraMeta">
                  {x.label ? <div className="homeExtraLabel">{x.label}</div> : null}
                  {x.sub ? <div className="homeExtraSub">{x.sub}</div> : null}
                </div>
              </Wrapper>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
