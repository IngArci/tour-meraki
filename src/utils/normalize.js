export const normalizeCode = (value) => String(value).trim().padStart(7, "0");
export const normalizeStatus = (s) => String(s ?? "").trim().toUpperCase();

export const normalizeArea = (a) => {
  if (a === null || a === undefined) return null;
  // "400,05" -> 400.05
  const n = Number(String(a).trim().replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
};
