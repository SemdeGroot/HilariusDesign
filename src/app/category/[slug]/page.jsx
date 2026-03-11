import Category from "../../../views/Category/Category";
import { routesConfig } from "../../../router/routesConfig";

export function generateStaticParams() {
  return routesConfig.categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = routesConfig.categories.find((c) => c.slug === params.slug);
  const title = cat?.i18n?.nl?.title ?? params.slug;
  return {
    title,
    description: cat?.i18n?.nl?.subtitle ?? ""
  };
}

export default function CategoryPage() {
  return <Category />;
}
