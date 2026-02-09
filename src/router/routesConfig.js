export const routesConfig = {
  brand: {
    name: "Your Name",
    tagline: "Designer / Art Direction / Product Photography"
  },

  nav: [
    {
      label: "Portfolio",
      path: "/",
      kind: "route",
      // dropdown only on desktop
      children: [
        { label: "Minimal", path: "/" },
        { label: "Product", path: "/category/product" },
        { label: "Interiors", path: "/category/interiors" },
        { label: "Branding", path: "/category/branding" }
      ]
    },
    { label: "About", path: "/about", kind: "page" },
    { label: "Services", path: "/services", kind: "page" },
    { label: "Contact", path: "/contact", kind: "page" }
  ],

  pages: {
    about: {
      title: "About",
      intro:
        "Short bio that feels premium. What you do, your taste, and how you work."
    },
    services: {
      title: "Services",
      intro:
        "Art direction, styling, photography, visual identity. Add your packages here."
    },
    contact: {
      title: "Contact",
      intro:
        "For commissions, collaborations, or availability. Provide email + socials."
    }
  },

  home: {
    heroTitle: "Selected Work",
    heroSubtitle: "Minimal compositions, strong typography, crafted details."
  },

  projects: [
    // Voeg later je echte items toe
    {
      id: "still-life-01",
      title: "Still Life — Glass Study",
      category: "product",
      year: "2026",
      cover: "/src/assets/images/sample-01.jpg"
    },
    {
      id: "interior-02",
      title: "Interior — Natural Light",
      category: "interiors",
      year: "2026",
      cover: "/src/assets/images/sample-02.jpg"
    },
    {
      id: "branding-03",
      title: "Branding — Monochrome Set",
      category: "branding",
      year: "2025",
      cover: "/src/assets/images/sample-03.jpg"
    }
  ]
};
