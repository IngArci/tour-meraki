import { normalizeArea, normalizeCode, normalizeStatus } from "./normalize";

const slug = (s) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "-");

export function joinLots(coords, sheetRows) {
  const byCode = new Map(
    sheetRows.map((r) => {
      const code = normalizeCode(r.codigo);

      return [
        code,
        {
          ...r,
          code,
          status: normalizeStatus(r.estado),
          areaM2: normalizeArea(r.area),
          sectorKey: slug(r.sector), 
          inSheet: true,             
        },
      ];
    })
  );

  return coords.map((c) => {
    const code = normalizeCode(c.code);
    const sheet = byCode.get(code);

    return {
      ...c,
      code,
      ...(sheet ?? { status: "SIN_DATO", sectorKey: "", inSheet: false }),
    };
  });
}
