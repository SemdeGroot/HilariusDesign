import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { routesConfig } from "../../router/routesConfig";
import ProjectGrid from "../../components/ProjectGrid/ProjectGrid";
import "./Home.css";

export default function Home() {
  const { slug } = useParams();

  const projects = useMemo(() => {
    if (!slug) return routesConfig.projects;
    return routesConfig.projects.filter((p) => p.category === slug);
  }, [slug]);

  return (
    <section className="home">
      <div className="homeHero">
        <h1 className="homeTitle">{routesConfig.home.heroTitle}</h1>
        <p className="homeSub">{routesConfig.home.heroSubtitle}</p>
      </div>

      <ProjectGrid projects={projects} />
    </section>
  );
}
