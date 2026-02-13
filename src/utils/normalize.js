export const normalizeCode = (value) => String(value).trim().padStart(7, "0");
export const normalizeStatus = (s) => String(s ?? "").trim().toUpperCase();

export const normalizeArea = (a) => {
  if (a === null || a === undefined) return null;

  const s = String(a).trim();
  if (!s) return null;

  if (s.includes(",")) {
    const normalized = s.replace(/\./g, "").replace(",", ".");
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

