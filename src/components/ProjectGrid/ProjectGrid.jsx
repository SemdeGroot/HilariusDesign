import { Link } from "react-router-dom";
import "./ProjectGrid.css";

export default function ProjectGrid({ projects }) {
  return (
    <div className="grid">
      {projects.map((p) => (
        <Link key={p.id} to={`/project/${p.id}`} className="card">
          <div className="thumb">
            {/* Als je cover nog niet bestaat: laat dan een “placeholder” zien */}
            <img
              src={p.cover}
              alt={p.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="thumbFallback" />
          </div>

          <div className="meta">
            <div className="metaTitle">{p.title}</div>
            <div className="metaSub">
              <span className="pill">{p.category}</span>
              <span className="dot">·</span>
              <span>{p.year}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
