// Images are served as static paths from /public/images/

export function getImage(path) {
  if (!path) return "";
  return `/images/${path}`;
}

export function getImagesInDir(dir) {
  // Dynamic directory scanning is not available in browser context.
  // Projects fall back to their cover image.
  // To show multiple images per project, list them explicitly in projectsData.js.
  return [];
}
