export const BASE_URL = import.meta.env.BASE_URL;

export function guideUrl(path = ""): string {
  const base = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;

  return `${base}${path.replace(/^\/+/, "")}`;
}
