// Static image paths served from /public/images/

export function getImage(path) {
  if (!path) return "";
  return `/images/${path}`;
}

// Static registry of all images per product directory.
// Keys = directory path relative to public/images/, values = filenames.
const imagesByDir = {
  // ─── Transport ────────────────────────────────────────────────
  "transport/bedrijfsautos": ["bedrijfsautos2.webp"],
  "transport/bierwagen": ["IMG_0548Biertransport.webp"],
  "transport/containers": ["IMG_0562ContainerRoodHL.webp"],
  "transport/diepladers": ["dieplader2.webp"],
  "transport/tankauto": ["tankauto2.webp"],
  "transport/treinen": ["treinen2.webp"],
  "transport/vliegtuigen": ["vliegtuigen2.webp"],
  "transport/vrachtwagens": [
    "vrachtwagens2-2.webp",
    "IMG_0568Verpakking_wijntransport.webp",
    "IMG_0993 2.webp",
    "IMG_6711.webp"
  ],

  // ─── Bureau accessoires ───────────────────────────────────────
  "bureau-accessoires/bureaukalenders": ["bureaukalenders3.webp"],
  "bureau-accessoires/fotolijstjes": ["fotolijstjes2.webp"],
  "bureau-accessoires/klokken": ["klokken2.webp"],
  "bureau-accessoires/memobakjes": ["memobakjes2.webp"],
  "bureau-accessoires/onderzetters": ["onderzetters2.webp"],
  "bureau-accessoires/pop-up": ["popup2.webp"],

  // ─── Verpakkingen ─────────────────────────────────────────────
  "verpakkingen/bloemenverpakking": ["bloemendozen2.webp"],
  "verpakkingen/cd-verpakking": ["cdverpakking2.webp"],
  "verpakkingen/chocoladedoosje": ["twee_chocoladedoosjes.webp"],
  "verpakkingen/handtasjes": ["IMG_1012.webp", "luxe_verpakking.webp"],
  "verpakkingen/magic-packaging": [
    "magictubes2.webp",
    "uitklapverpakking2.webp",
    "uitklapverpakking3.webp",
    "IMG_0989.webp",
    "IMG_6195.webp"
  ],
  "verpakkingen/ontspiegelde-showcase": ["luxar2.webp"],
  "verpakkingen/schockproof-wijnverpakking": ["viko_shockproof2.webp"],
  "verpakkingen/uitklapdoos": ["metopdoos2.webp"],
  "verpakkingen/viko-kokers": ["vikokoker2.webp"],
  "verpakkingen/wijnverpakkingen": [
    "IMG_0579_3vakswijndoos.webp",
    "IMG_0580_banderol.webp",
    "wijnvogelhuisje2.webp"
  ],
  "verpakkingen/zakken": ["zakkengroot.webp"],

  // ─── Boeken & Mappen ──────────────────────────────────────────
  "boeken-mappen/boekverpakkingen": ["libris2.webp", "stalenboek2.webp"],
  "boeken-mappen/euromap": ["euromap2.webp"],
  "boeken-mappen/golfrecords": ["golfrecords2.webp"],
  "boeken-mappen/grafiekmappen": ["grafiekmappen2-1.webp"],
  "boeken-mappen/herdenkingsboek": ["herdenkingsboek2.webp"],
  "boeken-mappen/informatiemap": ["informatiemap2.webp"],
  "boeken-mappen/kunstmappen": ["kunstmappen2.webp"],
  "boeken-mappen/zelfsluitende-mappen": ["mappen3.webp"],

  // ─── Spellen ──────────────────────────────────────────────────
  "spellen/bordspellen": ["bordspellen2.webp"],
  "spellen/poulebal": ["poulebal2.webp"],
  "spellen/puzzel": ["puzzel2.webp"],
  "spellen/schaakspel": ["schaakspel2.webp"],
  "spellen/werpspel": ["werpspel2.webp"],

  // ─── The Art Of Board ─────────────────────────────────────────
  "the-art-of-board/eiffeltoren": ["eiffeltoren1.webp", "eiffeltoren2.webp"],
  "the-art-of-board/golfkartonnen-stoel": ["stoelkarton-Hilariusdesign.webp"],
  "the-art-of-board/tezeras": ["tezeras.webp"],
  "the-art-of-board/westminster-abbey": [
    "westminster-abbey1.webp",
    "westminster-abbey-2.webp",
    "westminster-abbey3.webp"
  ],
  "the-art-of-board/wild-flowers": ["klaproos.webp", "IMG_7269.webp"],
  "interieur-exterieur/apothekerskast": ["apothekerskast2.webp"],
  "interieur-exterieur/enorme-displays": ["oogwereld2.webp"],
  "interieur-exterieur/gebouwen": ["villavna.webp"],
  "interieur-exterieur/maquette": ["maquette2-1.webp"],

  // ─── Eindejaarsgeschenken ─────────────────────────────────────
  "eindejaarsgeschenken/compilatie": ["compilatie-1.webp"],
  "eindejaarsgeschenken/kerst": ["kerstversiering2.webp"]
};

export function getImagesInDir(dir) {
  const key = dir.replace(/\/$/, "");
  const files = imagesByDir[key];
  if (!files || !files.length) return [];
  return files.map((f) => `/images/${key}/${f}`);
}
