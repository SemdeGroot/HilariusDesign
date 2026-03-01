import { Link } from "react-router-dom";
import WorldOfBoard from "../../assets/WorldOfBoard.svg";
import "./HomeMosaic.css";

export default function HomeMosaic({ tiles }) {
  return (
    <div className="mosaic">
      {tiles.map((t) => {
        if (t.type === "wob") {
          const WobWrapper = t.to ? Link : "div";
          return (
            <WobWrapper
              key={t.key}
              to={t.to}
              className={`mosaicTile ${t.size || ""} ${t.to ? "isLink" : ""}`}
              aria-label="The Art Of Board"
            >
              <div className="mosaicMedia mosaicMediaWob">
                <img
                  src={WorldOfBoard}
                  alt="World of Board"
                  className="mosaicWobImg"
                />
              </div>
              <div className="mosaicCaption" aria-hidden="true" />
            </WobWrapper>
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
            </div>

            {/* Caption lives below the image — slides up on hover */}
            <div className="mosaicCaption">
              <div className="mosaicCaptionLabel">{t.label}</div>
              {t.sub ? <div className="mosaicCaptionSub">{t.sub}</div> : null}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}