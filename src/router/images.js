// src/router/images.js
// Zorgt dat Vite alle images mee-bundelt (ook in productie).

const modules = import.meta.glob("../assets/images/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default"
});

function normalize(p) {
  return p.replace(/^\/+/, "");
}

export function getImage(path) {
  const key = `../assets/images/${normalize(path)}`;
  const hit = modules[key];

  if (!hit) {
    // eslint-disable-next-line no-console
    console.warn(`[images] not found: ${key}`);
    return "";
  }
  return hit;
}

// Geeft alle images terug die in een directory zitten (relatief aan src/assets/images/)
// Voorbeeld: getImagesInDir("transport/vrachtwagens/")
export function getImagesInDir(dir) {
  const prefix = `../assets/images/${normalize(dir)}`;
  const hits = Object.entries(modules)
    .filter(([k]) => k.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, "nl"))
    .map(([, v]) => v)
    .filter(Boolean);

  return hits;
}
