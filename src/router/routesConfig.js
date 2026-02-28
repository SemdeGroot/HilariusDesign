import { texts } from "./texts";
import { projectOverrides, projectOrder } from "./projectsData";
import { getImage, getImagesInDir } from "./images";

const titleFromFile = (file) => {
  const base = file.split("/").pop().replace(/\.[^/.]+$/, "");
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
};

const mergeDeep = (base, patch) => {
  if (!patch) return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const [k, v] of Object.entries(patch)) {
    if (v && typeof v === "object" && !Array.isArray(v) && typeof out[k] === "object") {
      out[k] = mergeDeep(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
};

const defaultProjectI18n = (file, categoryDefaults = {}) => {
  const t = titleFromFile(file);

  return {
    nl: {
      title: t,
      description:
        "Ontwerp en productie in gerecycled karton. Strak, functioneel en volledig te personaliseren in uw huisstijl.",
      body:
        "Toepassing\n— Waar wordt dit product voor gebruikt?\n\nDetails\n— Formaat / variaties\n— Afwerking (bijv. stans, folie, lak)\n— Personalisatie / branding\n\nProductie\n— Oplage (indicatie)\n— Levertijd (indicatie)\n\nOpmerking\n— Extra context of wensen van de klant",
      type: categoryDefaults?.nl?.type ?? "Relatiegeschenk / Karton",
      year: categoryDefaults?.nl?.year ?? "—",
      materials: "Gerecycled karton"
    },
    en: {
      title: t,
      description:
        "Design and production in recycled board. Clean, functional and fully customizable to your brand.",
      body:
        "Use case\n— What is this used for?\n\nDetails\n— Size / variations\n— Finishing (e.g. die-cut, foil, varnish)\n— Custom branding\n\nProduction\n— Quantity (estimate)\n— Lead time (estimate)\n\nNotes\n— Any extra context or client requests",
      type: categoryDefaults?.en?.type ?? "Corporate gift / Board",
      year: categoryDefaults?.en?.year ?? "—",
      materials: "Recycled board"
    },
    de: {
      title: t,
      description:
        "Design und Produktion aus recycelter Pappe. Klar, funktional und vollständig an Ihre Marke anpassbar.",
      body:
        "Einsatz\n— Wofür wird es genutzt?\n\nDetails\n— Größe / Varianten\n— Veredelung (z.B. Stanzung, Folie, Lack)\n— Branding / Personalisierung\n\nProduktion\n— Auflage (Schätzung)\n— Lieferzeit (Schätzung)\n\nNotizen\n— Zusätzlicher Kontext oder Kundenwünsche",
      type: categoryDefaults?.de?.type ?? "Werbegeschenk / Pappe",
      year: categoryDefaults?.de?.year ?? "—",
      materials: "Recycelte Pappe"
    }
  };
};

const makeProject = ({ id, category, file, i18n }) => {
  const cover = getImage(file);

  const parts = file.split("/").filter(Boolean);
  let images = [cover].filter(Boolean);

  if (parts.length >= 3) {
    const dir = parts.slice(0, 2).join("/") + "/";
    const fromDir = getImagesInDir(dir);
    if (fromDir.length) images = fromDir;
  }

  return {
    id,
    category,
    cover,
    images,
    i18n
  };
};

const makeId = (file) => file.split("/").pop().replace(/\.[^/.]+$/, "").toLowerCase();

const buildCategoryProjects = (categorySlug, files, categoryDefaults) => {
  const ordered = projectOrder?.[categorySlug];
  const fileSet = new Set(files);

  const finalFiles = [];

  if (Array.isArray(ordered)) {
    for (const f of ordered) {
      if (fileSet.has(f)) finalFiles.push(f);
    }
  }

  const remaining = files
    .filter((f) => !finalFiles.includes(f))
    .sort((a, b) => a.localeCompare(b, "nl"));

  finalFiles.push(...remaining);

  return finalFiles.map((file) => {
    const baseI18n = defaultProjectI18n(file, categoryDefaults);
    const override = projectOverrides[file];

    const mergedI18n = mergeDeep(baseI18n, override?.i18n);

    return makeProject({
      id: makeId(file),
      category: categorySlug,
      file,
      i18n: mergedI18n
    });
  });
};

export const routesConfig = {
  i18n: {
    default: "nl",
    supported: ["nl", "en", "de"],
    fallback: "nl"
  },

  copy: {
    nav: {
      i18n: {
        nl: { home: "Home", menu: "Menu", portfolio: "Portfolio" },
        en: { home: "Home", menu: "Menu", portfolio: "Portfolio" },
        de: { home: "Start", menu: "Menü", portfolio: "Portfolio" }
      }
    },
    common: {
      i18n: {
        nl: { notFound: "Niet gevonden", backHome: "Terug naar Home" },
        en: { notFound: "Not found", backHome: "Back to Home" },
        de: { notFound: "Nicht gefunden", backHome: "Zur Startseite" }
      }
    },
    home: texts.home,
    category: {
      i18n: {
        nl: { colProject: "Product", colType: "Type", colYear: "Jaar", scrollHint: "Scroll voor producten" },
        en: { colProject: "Project", colType: "Type", colYear: "Year", scrollHint: "Scroll for products" },
        de: { colProject: "Projekt", colType: "Typ", colYear: "Jahr", scrollHint: "Scroll für Produkte" }
      }
    },
    project: {
      i18n: {
        nl: { prev: "Vorig project", next: "Volgend project", year: "Jaar", type: "Type", materials: "Materiaal" },
        en: { prev: "Previous", next: "Next", year: "Year", type: "Type", materials: "Materials" },
        de: { prev: "Vorheriges", next: "Nächstes", year: "Jahr", type: "Typ", materials: "Material" }
      }
    }
  },

  nav: [
    {
      path: "/about",
      i18n: {
        nl: { label: "Over HilariusDesign", labelMobile: "Over HD" },
        en: { label: "About HilariusDesign", labelMobile: "About HD" },
        de: { label: "Über HilariusDesign", labelMobile: "Über HD" }
      }
    },
    { path: "/faq", i18n: { nl: { label: "FAQ" }, en: { label: "FAQ" }, de: { label: "FAQ" } } },
    { path: "/contact", i18n: { nl: { label: "Contact" }, en: { label: "Contact" }, de: { label: "Kontakt" } } }
  ],

  categories: [
    {
      slug: "transport",
      i18n: {
        nl: { title: "Transport", subtitle: "Vrachtwagens, auto's, vliegtuigen en treinen.", titleLine1: "Zakelijke", titleLine2: "transport", titleLine3: "modellen." },
        en: { title: "Transport", subtitle: "Trucks, cars, aircraft and trains.", titleLine1: "Commercial", titleLine2: "transport", titleLine3: "models." },
        de: { title: "Transport", subtitle: "LKW, Autos, Flugzeuge und Züge.", titleLine1: "Transport", titleLine2: "modelle", titleLine3: "für Business." }
      }
    },
    {
      slug: "bureau-accessoires",
      i18n: {
        nl: { title: "Bureau accessoires", subtitle: "Bureaukalenders, (wand)klokken en meer.", titleLine1: "Bureau", titleLine2: "accessoires.", titleLine3: "" },
        en: { title: "Desk accessories", subtitle: "Desk calendars, (wall) clocks and more.", titleLine1: "Desk", titleLine2: "accessories.", titleLine3: "" },
        de: { title: "Schreibtisch", subtitle: "Schreibtischkalender, (Wand-)Uhren und mehr.", titleLine1: "Schreibtisch", titleLine2: "accessoires.", titleLine3: "" }
      }
    },
    {
      slug: "verpakkingen",
      i18n: {
        nl: { title: "Verpakkingen", subtitle: "Luxe verpakkingen, kokers en displays.", titleLine1: "Verpak-", titleLine2: "kingen.", titleLine3: "" },
        en: { title: "Packaging", subtitle: "Premium packaging, tubes and displays.", titleLine1: "Pack-", titleLine2: "aging.", titleLine3: "" },
        de: { title: "Verpackungen", subtitle: "Premium-Verpackungen, Hülsen und Displays.", titleLine1: "Ver-", titleLine2: "packungen.", titleLine3: "" }
      }
    },
    {
      slug: "boeken-mappen",
      i18n: {
        nl: { title: "Boeken & Mappen", subtitle: "Stalenboeken, (info)mappen en boekjes.", titleLine1: "Boeken", titleLine2: "& mappen.", titleLine3: "" },
        en: { title: "Books & Folders", subtitle: "Sample books, folders and booklets.", titleLine1: "Books", titleLine2: "& folders.", titleLine3: "" },
        de: { title: "Bücher & Mappen", subtitle: "Musterbücher, Mappen und Booklets.", titleLine1: "Bücher", titleLine2: "& mappen.", titleLine3: "" }
      }
    },
    {
      slug: "spellen",
      i18n: {
        nl: { title: "Spellen", subtitle: "Bord- en werpspellen, puzzels en meer.", titleLine1: "Spellen.", titleLine2: "", titleLine3: "" },
        en: { title: "Games", subtitle: "Board games, throwing games, puzzles and more.", titleLine1: "Games.", titleLine2: "", titleLine3: "" },
        de: { title: "Spiele", subtitle: "Brettspiele, Wurfspiele, Puzzles und mehr.", titleLine1: "Spiele.", titleLine2: "", titleLine3: "" }
      }
    },
    {
      slug: "the-art-of-board",
      i18n: {
        nl: { title: "The Art Of Board", subtitle: "Standbouw, maquettes en bijzondere presentaties.", titleLine1: "The Art", titleLine2: "Of Board.", titleLine3: "" },
        en: { title: "The Art Of Board", subtitle: "Booth builds, scale models and presentations.", titleLine1: "The Art", titleLine2: "Of Board.", titleLine3: "" },
        de: { title: "The Art Of Board", subtitle: "Messestand, Modelle und Präsentationen.", titleLine1: "The Art", titleLine2: "Of Board.", titleLine3: "" }
      }
    },
    {
      slug: "eindejaarsgeschenken",
      i18n: {
        nl: { title: "Eindejaarsgeschenken", subtitle: "Sfeervolle producten voor het einde van het jaar.", titleLine1: "Einde-", titleLine2: "jaars-", titleLine3: "geschenken." },
        en: { title: "Year-end Gifts", subtitle: "Festive products for the end of the year.", titleLine1: "Year-end", titleLine2: "gifts.", titleLine3: "" },
        de: { title: "Jahresendgeschenke", subtitle: "Stimmungsvolle Produkte für das Jahresende.", titleLine1: "Jahres-", titleLine2: "end-", titleLine3: "geschenke." }
      }
    }
  ],

  homeCovers: {
    transport: "transport/vrachtwagens/vrachtwagens.jpg",
    "bureau-accessoires": "bureau-accessoires/klokken/klokken.jpg",
    verpakkingen: "wijnverpakkingen-displays/uitklapverpakking/uitklapverpakking.jpg",
    "boeken-mappen": "boeken-mappen/grafiekmappen/grafiekmappen.jpg",
    spellen: "kerst-spellen/schaakspel/schaakspel.jpg",
    "the-art-of-board": "interieur-exterieur/maquette/maquette.jpg",
    eindejaarsgeschenken: "kerst-spellen/kerstversiering/kerstversiering.jpg"
  },

  pages: texts.pages,

  linkedin: "https://www.linkedin.com/in/wim-hilarius-529817228/",

  contact: {
    email: "info@hilariusdesign.nl",
    phone: "+31 6 24 67 36 20",
    location: "Koog a/d Zaan",
    address: "Rozeboom 68\n1541 RK Koog a/d Zaan"
  },

  projects: [
    ...buildCategoryProjects(
      "transport",
      [
        "transport/bedrijfsautos/bedrijfsautos.jpg",
        "transport/containers/containers.jpg",
        "transport/dieplader/dieplader.jpg",
        "transport/heineken/heineken.jpg",
        "transport/tankauto/tankauto.jpg",
        "transport/treinen/treinen.jpg",
        "transport/vliegtuigen/vliegtuigen.jpg",
        "transport/vrachtwagens/vrachtwagens.jpg"
      ],
      {
        nl: { type: "Transportmodel / Relatiegeschenk" },
        en: { type: "Transport model / Gift" },
        de: { type: "Transportmodell / Geschenk" }
      }
    ),

    ...buildCategoryProjects(
      "bureau-accessoires",
      [
        "bureau-accessoires/bureaukalenders/bureaukalenders.jpg",
        "bureau-accessoires/fotolijstjes/fotolijstjes.jpg",
        "bureau-accessoires/groenepostbak/groenepostbak.jpg",
        "bureau-accessoires/klokken/klokken.jpg",
        "bureau-accessoires/korenbloem/korenbloem.jpg",
        "bureau-accessoires/memobakjes/memobakjes.jpg",
        "bureau-accessoires/onderzetters/onderzetters.jpg",
        "bureau-accessoires/popup/popup.jpg"
      ],
      {
        nl: { type: "Bureau-accessoire" },
        en: { type: "Desk accessory" },
        de: { type: "Schreibtisch-Accessoire" }
      }
    ),

    ...buildCategoryProjects(
      "verpakkingen",
      [
        "wijnverpakkingen-displays/2-vakswijndoos/2-vakswijndoos.jpg",
        "wijnverpakkingen-displays/africa/africa.jpg",
        "wijnverpakkingen-displays/bloemendozen/bloemendozen.jpg",
        "wijnverpakkingen-displays/cdverpakking/cdverpakking.jpg",
        "wijnverpakkingen-displays/chocoladedoosje/chocoladedoosje.jpg",
        "wijnverpakkingen-displays/divadistrict/divadistrict.jpg",
        "wijnverpakkingen-displays/draagtassen/draagtassen.jpg",
        "wijnverpakkingen-displays/luxarnw/luxarnw.jpg",
        "wijnverpakkingen-displays/magictubes/magictubes.jpg",
        "wijnverpakkingen-displays/metopdoos/metopdoos.jpg",
        "wijnverpakkingen-displays/uitklapverpakking/uitklapverpakking.jpg",
        "wijnverpakkingen-displays/viko-shockproof/viko_shockproof.jpg",
        "wijnverpakkingen-displays/vikokoker/vikokoker.jpg",
        "wijnverpakkingen-displays/wijnvogelhuisje/wijnvogelhuisje.jpg"
      ],
      {
        nl: { type: "Verpakking / Display" },
        en: { type: "Packaging / Display" },
        de: { type: "Verpackung / Display" }
      }
    ),

    ...buildCategoryProjects(
      "boeken-mappen",
      [
        "boeken-mappen/euromap/euromap.jpg",
        "boeken-mappen/golfrecords/golfrecords3.jpg",
        "boeken-mappen/grafiekmappen/grafiekmappen.jpg",
        "boeken-mappen/herdenkingsboek/herdenkingsboek.jpg",
        "boeken-mappen/informatiemap/informatiemap.jpg",
        "boeken-mappen/kunstmappen/kunstmappen.jpg",
        "boeken-mappen/libris/libris.jpg",
        "boeken-mappen/mappen/mappen.jpg",
        "boeken-mappen/stalenboek/stalenboek.jpg"
      ],
      {
        nl: { type: "Boek / Map" },
        en: { type: "Book / Folder" },
        de: { type: "Buch / Mappe" }
      }
    ),

    ...buildCategoryProjects(
      "spellen",
      [
        "kerst-spellen/bordspellen/bordspellen.jpg",
        "kerst-spellen/poulebal/poulebal.jpg",
        "kerst-spellen/puzzel/puzzel.jpg",
        "kerst-spellen/schaakspel/schaakspel.jpg",
        "kerst-spellen/werpspel/werpspel.jpg"
      ],
      {
        nl: { type: "Spel / Give-away" },
        en: { type: "Game / Give-away" },
        de: { type: "Spiel / Give-away" }
      }
    ),

    ...buildCategoryProjects(
      "the-art-of-board",
      [
        "interieur-exterieur/apothekerskast/apothekerskast.jpg",
        "interieur-exterieur/argent/argent.jpg",
        "interieur-exterieur/caleidoscoop/caleidoscoop.jpg",
        "interieur-exterieur/maquette/maquette.jpg",
        "interieur-exterieur/oogwereld/oogwereld.jpg",
        "interieur-exterieur/standbouw/standbouw.jpg",
        "interieur-exterieur/visafslag-volendam/visafslag-volendam.jpg"
      ],
      {
        nl: { type: "Interieur / Exterieur" },
        en: { type: "Interior / Exterior" },
        de: { type: "Innen / Außen" }
      }
    ),

    ...buildCategoryProjects(
      "eindejaarsgeschenken",
      [
        "kerst-spellen/kerstversiering/kerstversiering.jpg"
      ],
      {
        nl: { type: "Eindejaarsgeschenk" },
        en: { type: "Year-end gift" },
        de: { type: "Jahresendgeschenk" }
      }
    )
  ]
};
