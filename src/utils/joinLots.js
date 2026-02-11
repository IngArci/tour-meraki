import { normalizeArea, normalizeCode, normalizeStatus } from "./normalize";

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
        },
      ];
    })
  );

  return coords.map((c) => {
    const code = normalizeCode(c.code);
    return {
      ...c,
      code,
      ...(byCode.get(code) ?? { status: "SIN_DATO" }),
    };
  });
}
