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
        "Toepassing\nWaar wordt dit product voor gebruikt?\n\nDetails\nFormaat / variaties\nAfwerking (bijv. stans, folie, lak)\nPersonalisatie / branding\n\nProductie\nOplage (indicatie)\nLevertijd (indicatie)\n\nOpmerking\nExtra context of wensen van de klant",
      type: categoryDefaults?.nl?.type ?? "Relatiegeschenk / Karton",
      year: categoryDefaults?.nl?.year ?? "",
      materials: "Gerecycled karton"
    },
    en: {
      title: t,
      description:
        "Design and production in recycled board. Clean, functional and fully tailored to your brand.",
      body:
        "Use case\nWhat is this used for?\n\nDetails\nSize / variations\nFinishing (e.g. die-cut, foil, varnish)\nCustom branding\n\nProduction\nQuantity (estimate)\nLead time (estimate)\n\nNotes\nAny extra context or client requests",
      type: categoryDefaults?.en?.type ?? "Corporate gift / Board",
      year: categoryDefaults?.en?.year ?? "",
      materials: "Recycled board"
    },
    de: {
      title: t,
      description:
        "Design und Produktion aus recycelter Pappe. Klar, funktional und vollständig an Ihre Marke anpassbar.",
      body:
        "Einsatz\nWofür wird es genutzt?\n\nDetails\nGröße / Varianten\nVeredelung (z.B. Stanzung, Folie, Lack)\nBranding / Personalisierung\n\nProduktion\nAuflage (Schätzung)\nLieferzeit (Schätzung)\n\nNotizen\nZusätzlicher Kontext oder Kundenwünsche",
      type: categoryDefaults?.de?.type ?? "Werbegeschenk / Pappe",
      year: categoryDefaults?.de?.year ?? "",
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

const slugify = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " en ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const makeId = (file, i18n) => {
  const title = i18n?.nl?.title;
  const fromTitle = title ? slugify(title) : "";
  if (fromTitle) return fromTitle;

  return slugify(file.split("/").pop().replace(/\.[^/.]+$/, ""));
};

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

  const usedIds = new Map();

  return finalFiles.map((file) => {
    const baseI18n = defaultProjectI18n(file, categoryDefaults);
    const override = projectOverrides[file];

    const mergedI18n = mergeDeep(baseI18n, override?.i18n);
    const baseId = makeId(file, mergedI18n);
    const count = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, count + 1);

    return makeProject({
      id: count === 0 ? baseId : `${baseId}-${count + 1}`,
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
        nl: { label: "Over Hilarius Design", labelMobile: "Over HD" },
        en: { label: "About Hilarius Design", labelMobile: "About HD" },
        de: { label: "Über Hilarius Design", labelMobile: "Über HD" }
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
        nl: { title: "The Art Of Board", subtitle: "Ideeën van karton.", titleLine1: "The Art", titleLine2: "Of Board.", titleLine3: "" },
        en: { title: "The Art Of Board", subtitle: "Ideas made of board.", titleLine1: "The Art", titleLine2: "Of Board.", titleLine3: "" },
        de: { title: "The Art Of Board", subtitle: "Ideen aus Karton.", titleLine1: "The Art", titleLine2: "Of Board.", titleLine3: "" }
      }
    },
    {
      slug: "interieur-exterieur",
      i18n: {
        nl: { title: "Interieur & Exterieur", subtitle: "Displays, maquettes en ruimtelijke presentaties.", titleLine1: "Interieur", titleLine2: "& exterieur.", titleLine3: "" },
        en: { title: "Interior & Exterior", subtitle: "Displays, scale models and spatial presentations.", titleLine1: "Interior", titleLine2: "& exterior.", titleLine3: "" },
        de: { title: "Innen & Außen", subtitle: "Displays, Modelle und räumliche Präsentationen.", titleLine1: "Innen", titleLine2: "& außen.", titleLine3: "" }
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
    transport: "transport/vrachtwagens/vrachtwagens2-2.webp",
    "bureau-accessoires": "bureau-accessoires/klokken/klokken2.webp",
    verpakkingen: "verpakkingen/magic-packaging/magictubes2.webp",
    "boeken-mappen": "boeken-mappen/grafiekmappen/grafiekmappen2-1.webp",
    spellen: "spellen/schaakspel/schaakspel2.webp",
    "the-art-of-board": "the-art-of-board/eiffeltoren/eiffeltoren1.webp",
    "interieur-exterieur": "interieur-exterieur/maquette/maquette2-1.webp",
    eindejaarsgeschenken: "eindejaarsgeschenken/kerst/kerstversiering2.webp"
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
        "transport/bedrijfsautos/bedrijfsautos2.webp",
        "transport/bierwagen/IMG_0548Biertransport.webp",
        "transport/containers/IMG_0562ContainerRoodHL.webp",
        "transport/diepladers/dieplader2.webp",
        "transport/tankauto/tankauto2.webp",
        "transport/treinen/treinen2.webp",
        "transport/vliegtuigen/vliegtuigen2.webp",
        "transport/vrachtwagens/vrachtwagens2-2.webp"
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
        "bureau-accessoires/bureaukalenders/bureaukalenders3.webp",
        "bureau-accessoires/fotolijstjes/fotolijstjes2.webp",
        "bureau-accessoires/klokken/klokken2.webp",
        "bureau-accessoires/memobakjes/memobakjes2.webp",
        "bureau-accessoires/onderzetters/onderzetters2.webp",
        "bureau-accessoires/pop-up/popup2.webp"
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
        "verpakkingen/bloemenverpakking/bloemendozen2.webp",
        "verpakkingen/cd-verpakking/cdverpakking2.webp",
        "verpakkingen/chocoladedoosje/twee_chocoladedoosjes.webp",
        "verpakkingen/handtasjes/IMG_1012.webp",
        "verpakkingen/magic-packaging/magictubes2.webp",
        "verpakkingen/ontspiegelde-showcase/luxar2.webp",
        "verpakkingen/schockproof-wijnverpakking/viko_shockproof2.webp",
        "verpakkingen/uitklapdoos/metopdoos2.webp",
        "verpakkingen/viko-kokers/vikokoker2.webp",
        "verpakkingen/wijnverpakkingen/IMG_0579_3vakswijndoos.webp",
        "verpakkingen/zakken/zakkengroot.webp"
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
        "boeken-mappen/boekverpakkingen/libris2.webp",
        "boeken-mappen/euromap/euromap2.webp",
        "boeken-mappen/golfrecords/golfrecords2.webp",
        "boeken-mappen/grafiekmappen/grafiekmappen2-1.webp",
        "boeken-mappen/herdenkingsboek/herdenkingsboek2.webp",
        "boeken-mappen/informatiemap/informatiemap2.webp",
        "boeken-mappen/kunstmappen/kunstmappen2.webp",
        "boeken-mappen/zelfsluitende-mappen/mappen3.webp"
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
        "spellen/bordspellen/bordspellen2.webp",
        "spellen/poulebal/poulebal2.webp",
        "spellen/puzzel/puzzel2.webp",
        "spellen/schaakspel/schaakspel2.webp",
        "spellen/werpspel/werpspel2.webp"
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
        "the-art-of-board/eiffeltoren/eiffeltoren1.webp",
        "the-art-of-board/golfkartonnen-stoel/stoelkarton-Hilariusdesign.webp",
        "the-art-of-board/tezeras/tezeras.webp",
        "the-art-of-board/westminster-abbey/westminster-abbey1.webp",
        "the-art-of-board/wild-flowers/klaproos.webp"
      ],
      {
        nl: { type: "Kunstwerk / Karton" },
        en: { type: "Art piece / Board" },
        de: { type: "Kunstwerk / Pappe" }
      }
    ),

    ...buildCategoryProjects(
      "interieur-exterieur",
      [
        "interieur-exterieur/apothekerskast/apothekerskast2.webp",
        "interieur-exterieur/enorme-displays/oogwereld2.webp",
        "interieur-exterieur/gebouwen/villavna.webp",
        "interieur-exterieur/maquette/maquette2-1.webp"
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
        "eindejaarsgeschenken/compilatie/compilatie-1.webp",
        "eindejaarsgeschenken/kerst/kerstversiering2.webp"
      ],
      {
        nl: { type: "Eindejaarsgeschenk" },
        en: { type: "Year-end gift" },
        de: { type: "Jahresendgeschenk" }
      }
    )
  ]
};
