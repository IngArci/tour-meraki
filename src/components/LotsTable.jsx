import React from "react";

const COLORS = {
  gold: "#CFAB42",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#BFBFBF",
  border: "rgba(207,171,66,0.35)",
};

export default function LotsTable({
  lots,
  filter,
  setFilter,
  search,
  setSearch,
  onSelect,
  sectors = [],
  currentSectorId = null,
  onSelectSector,
  onViewAll,
  selectedCode = null,
}) {
  const isMobile = window.innerWidth < 768;

  const getStatusStyle = (status) => {
    const s = String(status || "").trim().toUpperCase();

    if (s === "DISPONIBLE")
      return {
        border: "1px solid #CFAB42",
        color: "#1be91e",
      };

    if (s === "NEGOCIACION")
      return {
        border: "1px solid #CFAB42",
        color: "#30d8e0",
      };

    if (s === "VENDIDO")
      return {
        border: "1px solid #CFAB42",
        color: "#ff0000",
      };

    return {
      border: `1px solid ${COLORS.border}`,
      color: COLORS.gray,
    };
  };

  const visibleLots = lots
    .map((l) => ({ ...l, loteNum: Number(l.lote) }))
    .filter((l) => {
      const matchesSearch =
        !search ||
        l.code?.includes(search) ||
        l.sectorKey?.includes(search.toLowerCase()) ||
        l.lote?.toString().includes(search);

      return matchesSearch && (filter === "TODOS" || l.status === filter);
    })
    .sort((a, b) => a.loteNum - b.loteNum)
    .map((l) => ({ ...l, loteNum: undefined }));

  return (
    <aside
      style={{
        background: COLORS.black,
        padding: 18,
        height: isMobile ? "80vh" : undefined,
        maxHeight: isMobile ? "80vh" : "calc(100vh - 120px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* TITLE */}
      <div
        style={{
          color: COLORS.gold,
          fontSize: 13,
          letterSpacing: 3,
          marginBottom: 12,
        }}
      >
        LOTES DISPONIBLES ({visibleLots.length})
      </div>


      {/* SECTORS */}
      {sectors.length > 0 && (
        <div
          style={{
            marginBottom: 12,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {sectors.map((s) => {
            const active = s.id === currentSectorId;

            return (
              <button
                key={s.id}
                onClick={() => onSelectSector?.(s.id)}
                style={{
                  padding: "6px 14px",
                  border: active ? `2px solid ${s.color || "#2563EB"}` : "1px solid #E5E7EB",
                  background: active ? (s.color || "#2563EB") : "black",
                  color: active ? "black" : "#ffffff",
                  cursor: "pointer",
                  fontSize: 12,
                  letterSpacing: 1,
                }}
              >
                {s.name}
              </button>
            );
          })}

          <button
            onClick={() => onViewAll?.()}
            style={{
              padding: "6px 14px",
              background: "transparent",
              color: COLORS.gray,
              border: `1px solid ${COLORS.border}`,
              cursor: "pointer",
              fontSize: 12,
              letterSpacing: 1,
            }}
          >
            TODOS
          </button>
        </div>
      )}


      {/* SEARCH */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar lote..."
          style={{
            flex: 1,
            padding: "10px 12px",
            background: COLORS.black,
            color: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            outline: "none",
          }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "10px 12px",
            background: COLORS.black,
            color: COLORS.white,
            border: `1px solid ${COLORS.border}`,
            cursor: "pointer",
          }}
        >
          <option value="TODOS">TODOS</option>
          <option value="DISPONIBLE">DISPONIBLE</option>
          <option value="NEGOCIACION">NEGOCIACIÓN</option>
          <option value="VENDIDO">VENDIDO</option>
        </select>
      </div>


      {/* TABLE */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
          }}
        >
            {/* HEADER */}
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${COLORS.border}`,
                color: COLORS.gray,
                fontSize: 11,
                letterSpacing: 1,
              }}
            >
              <th style={{ padding: "10px 6px", textAlign: "left" }}>
                SECTOR
              </th>

              <th style={{ padding: "10px 6px", textAlign: "left" }}>
                LOTE
              </th>

              <th style={{ padding: "10px 6px", textAlign: "right" }}>
                ÁREA
              </th>

              <th style={{ padding: "10px 6px", textAlign: "center" }}>
                ESTADO
              </th>
            </tr>
          </thead>


          {/* BODY */}
          <tbody>
            {visibleLots.map((l) => {

              const active = selectedCode === l.code;

              return (
                <tr
                  key={l.code}
                  onClick={() => onSelect(l)}
                  style={{
                    cursor: "pointer",
                    borderBottom: `1px solid ${COLORS.border}`,
                    background: active ? "rgba(207,171,66,0.08)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "rgba(207,171,66,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      active ? "rgba(207,171,66,0.08)" : "transparent";
                  }}
                >
                  <td style={{ padding: "12px 6px", color: COLORS.gray }}>
                    {l.sectorKey || "—"}
                  </td>

                  <td
                    style={{
                      padding: "12px 6px",
                      color: COLORS.gold,
                      letterSpacing: 1,
                    }}
                  >
                    {l.lote || "—"}
                  </td>

                  <td
                    style={{
                      padding: "12px 6px",
                      textAlign: "right",
                    }}
                  >
                    {l.areaM2 ? l.areaM2.toLocaleString() : "—"}
                  </td>

                  <td
                    style={{
                      padding: "12px 6px",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 10px",
                        fontSize: 11,
                        letterSpacing: 1,
                        ...getStatusStyle(l.status),
                      }}
                    >
                      {String(l.status || "").trim()}
                    </span>
                  </td>
                </tr>
              );
            })}

            {visibleLots.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: 24,
                    textAlign: "center",
                    color: COLORS.gray,
                  }}
                >
                  SIN RESULTADOS
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </aside>
  );
}
