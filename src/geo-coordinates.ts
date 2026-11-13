export type GeoPoint = { latitude: number; longitude: number };
const DECIMAL = "(-?\\d{1,3}(?:\\.\\d+)?)";
function point(lat: string, lng: string): GeoPoint | null {
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return {latitude: Number(latitude.toFixed(6)), longitude: Number(longitude.toFixed(6))};
}
export function parseGeoCoordinates(input: string): GeoPoint | null {
  const original = input.trim();
  if (!original || original.length > 2048) return null;
  const candidates = [original];
  try {
    const url = new URL(original);
    if (!["https:", "http:"].includes(url.protocol)) return null;
    for (const key of ["q", "query", "ll", "center"]) {
      const value = url.searchParams.get(key);
      if (value) candidates.push(value);
    }
    candidates.push(decodeURIComponent(url.pathname));
    candidates.push(decodeURIComponent(url.hash));
  } catch { /* Direct coordinate pair is also supported. */ }
  const pair = /^\s*(-?\d{1,3}(?:\.\d+)?)\s*[,; ]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;
  const at = new RegExp("@" + DECIMAL + "," + DECIMAL);
  const bang = new RegExp("!3d" + DECIMAL + "!4d" + DECIMAL);
  for (const candidate of candidates) {
    const found = candidate.match(pair) || candidate.match(at) || candidate.match(bang);
    if (found) return point(found[1], found[2]);
  }
  return null;
}
