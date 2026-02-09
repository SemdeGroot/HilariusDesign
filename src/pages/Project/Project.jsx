import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { routesConfig } from "../../router/routesConfig";
import "./Project.css";

export default function Project() {
  const { id } = useParams();

  const project = useMemo(
    () => routesConfig.projects.find((p) => p.id === id),
    [id]
  );

  if (!project) {
    return (
      <section className="project">
        <div className="projectTop">
          <h1 className="projectTitle">Not found</h1>
          <Link className="back" to="/">
            Back to portfolio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="project">
      <div className="projectTop">
        <div>
          <h1 className="projectTitle">{project.title}</h1>
          <div className="projectMeta">
            <span className="pill">{project.category}</span>
            <span className="dot">·</span>
            <span>{project.year}</span>
          </div>
        </div>

        <Link className="back" to="/">
          Back
        </Link>
      </div>

      <div className="projectHero">
        <img
          src={project.cover}
          alt={project.title}
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div className="heroFallback" />
      </div>

      <div className="projectBody">
        <p>
          Add your story: creative direction, materials, constraints, outcome.
        </p>
      </div>
    </section>
  );
}
