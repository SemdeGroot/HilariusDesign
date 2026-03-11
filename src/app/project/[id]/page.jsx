import Project from "../../../views/Project/Project";
import { routesConfig } from "../../../router/routesConfig";

export function generateStaticParams() {
  return routesConfig.projects.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }) {
  const project = routesConfig.projects.find((p) => p.id === params.id);
  const title = project?.i18n?.nl?.title ?? params.id;
  return {
    title,
    description: project?.i18n?.nl?.description ?? ""
  };
}

export default function ProjectPage() {
  return <Project />;
}
