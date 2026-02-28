// src/router/images.js

const modules = import.meta.glob("../assets/images/**/*.{jpg,jpeg,png,webp,svg}", {
  eager: true,
  import: "default"
});

export function getImage(path) {
  // Ensure the path starts exactly how the glob sees it
  const key = `../assets/images/${path}`;
  const hit = modules[key];

  if (!hit) {
    console.warn(`[images] not found: ${key}`);
    return "";
  }
  return hit;
}

export function getImagesInDir(dir) {
  const prefix = `../assets/images/${dir}`;
  return Object.entries(modules)
    .filter(([k]) => k.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, "nl"))
    .map(([, v]) => v)
    .filter(Boolean);
}