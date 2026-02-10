import { Link } from "react-router-dom";
import "./HomeMosaic.css";

export default function HomeMosaic({ tiles }) {
  return (
    <div className="mosaic">
      {tiles.map((t) => {
        if (t.type === "text") {
          return (
            <div key={t.key} className={`mosaicText ${t.size || ""}`}>
              <div className="mosaicTextInner">
                <div className="mosaicTextTitle">{t.title}</div>
                <div className="mosaicTextBody">{t.body}</div>
              </div>
            </div>
          );
        }

        const Wrapper = t.to ? Link : "div";
        return (
          <Wrapper
            key={t.key}
            to={t.to}
            className={`mosaicTile ${t.size || ""} ${t.to ? "isLink" : ""}`}
            aria-label={t.alt || t.label}
          >
            <div className="mosaicMedia">
              {t.src ? (
                <img
                  src={t.src}
                  alt={t.alt || ""}
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : null}
              <div className="mosaicFallback" />
              <div className="mosaicHover">
                <div className="mosaicHoverLabel">{t.label}</div>
                {t.sub ? <div className="mosaicHoverSub">{t.sub}</div> : null}
              </div>
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}
