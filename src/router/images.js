// Static image paths served from /public/images/

export function getImage(path) {
  if (!path) return "";
  return `/images/${path}`;
}

// Static registry of all images per product directory.
// Keys = directory path relative to public/images/, values = filenames.
const imagesByDir = {
  // ─── Transport ────────────────────────────────────────────────
  "transport/bedrijfsautos": ["bedrijfsautos2.jpg"],
  "transport/bierwagen": ["IMG_0548Biertransport.jpg"],
  "transport/containers": ["IMG_0562ContainerRoodHL.jpg"],
  "transport/diepladers": ["dieplader2.jpg"],
  "transport/tankauto": ["tankauto2.jpg"],
  "transport/treinen": ["treinen2.jpg"],
  "transport/vliegtuigen": ["vliegtuigen2.jpg"],
  "transport/vrachtwagens": [
    "vrachtwagens2-2.jpg",
    "IMG_0568Verpakking_wijntransport.jpg",
    "IMG_0993 2.jpg",
    "IMG_6711.JPG"
  ],

  // ─── Bureau accessoires ───────────────────────────────────────
  "bureau-accessoires/bureaukalenders": ["bureaukalenders3.jpg"],
  "bureau-accessoires/fotolijstjes": ["fotolijstjes2.jpg"],
  "bureau-accessoires/klokken": ["klokken2.jpg"],
  "bureau-accessoires/memobakjes": ["memobakjes2.jpg"],
  "bureau-accessoires/onderzetters": ["onderzetters2.jpg"],
  "bureau-accessoires/pop-up": ["popup2.jpg"],

  // ─── Verpakkingen ─────────────────────────────────────────────
  "verpakkingen/bloemenverpakking": ["bloemendozen2.jpg"],
  "verpakkingen/cd-verpakking": ["cdverpakking2.jpg"],
  "verpakkingen/chocoladedoosje": ["twee_chocoladedoosjes.jpg"],
  "verpakkingen/handtasjes": ["IMG_1012.jpg", "luxe_verpakking.jpg"],
  "verpakkingen/magic-packaging": [
    "magictubes2.jpg",
    "uitklapverpakking2.jpg",
    "uitklapverpakking3.jpg",
    "IMG_0989.jpg",
    "IMG_6195.JPG"
  ],
  "verpakkingen/ontspiegelde-showcase": ["luxar2.jpg"],
  "verpakkingen/schockproof-wijnverpakking": ["viko_shockproof2.jpg"],
  "verpakkingen/uitklapdoos": ["metopdoos2.jpg"],
  "verpakkingen/viko-kokers": ["vikokoker2.jpg"],
  "verpakkingen/wijnverpakkingen": [
    "IMG_0579_3vakswijndoos.jpg",
    "IMG_0580_banderol.jpg",
    "wijnvogelhuisje2.jpg"
  ],
  "verpakkingen/zakken": ["zakkengroot.jpg"],

  // ─── Boeken & Mappen ──────────────────────────────────────────
  "boeken-mappen/boekverpakkingen": ["libris2.jpg", "stalenboek2.jpg"],
  "boeken-mappen/euromap": ["euromap2.jpg"],
  "boeken-mappen/golfrecords": ["golfrecords2.jpg"],
  "boeken-mappen/grafiekmappen": ["grafiekmappen2-1.jpg"],
  "boeken-mappen/herdenkingsboek": ["herdenkingsboek2.jpg"],
  "boeken-mappen/informatiemap": ["informatiemap2.jpg"],
  "boeken-mappen/kunstmappen": ["kunstmappen2.jpg"],
  "boeken-mappen/zelfsluitende-mappen": ["mappen3.jpg"],

  // ─── Spellen ──────────────────────────────────────────────────
  "spellen/bordspellen": ["bordspellen2.jpg"],
  "spellen/poulebal": ["poulebal2.jpg"],
  "spellen/puzzel": ["puzzel2.jpg"],
  "spellen/schaakspel": ["schaakspel2.jpg"],
  "spellen/werpspel": ["werpspel2.jpg"],

  // ─── The Art Of Board ─────────────────────────────────────────
  "the-art-of-board/eiffeltoren": ["eiffeltoren1.JPG", "eiffeltoren2.JPG"],
  "the-art-of-board/golfkartonnen-stoel": ["stoelkarton-Hilariusdesign.jpg"],
  "the-art-of-board/tezeras": ["tezeras.jpg"],
  "the-art-of-board/westminster-abbey": [
    "westminster-abbey1.JPG",
    "westminster-abbey-2.JPG",
    "westminster-abbey3.JPG"
  ],
  "the-art-of-board/wild-flowers": ["klaproos.jpg", "IMG_7269.JPG"],
  "interieur-exterieur/apothekerskast": ["apothekerskast2.jpg"],
  "interieur-exterieur/enorme-displays": ["oogwereld2.jpg"],
  "interieur-exterieur/gebouwen": ["villavna.jpg"],
  "interieur-exterieur/maquette": ["maquette2-1.jpg"],

  // ─── Eindejaarsgeschenken ─────────────────────────────────────
  "eindejaarsgeschenken/compilatie": ["compilatie-1.jpg"],
  "eindejaarsgeschenken/kerst": ["kerstversiering2.jpg"]
};

export function getImagesInDir(dir) {
  const key = dir.replace(/\/$/, "");
  const files = imagesByDir[key];
  if (!files || !files.length) return [];
  return files.map((f) => `/images/${key}/${f}`);
}
