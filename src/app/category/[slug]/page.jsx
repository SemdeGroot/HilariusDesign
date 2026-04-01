import Category from "../../../views/Category/Category";
import { routesConfig } from "../../../router/routesConfig";

export function generateStaticParams() {
  return routesConfig.categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = routesConfig.categories.find((c) => c.slug === slug);
  const title = cat?.i18n?.nl?.title ?? slug;
  return {
    title,
    description: cat?.i18n?.nl?.subtitle ?? ""
  };
}

export default function CategoryPage() {
  return <Category />;
}
