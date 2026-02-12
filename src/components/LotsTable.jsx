import React from "react";

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

  return (
    <aside
      style={{
        background: "white",
        borderRadius: 14,
        padding: 14,
        boxShadow: "0 10px 30px rgba(0,0,0,.12)",
        maxHeight: isMobile ? "45vh" : "calc(100vh - 32px - 70px)",
        overflow: "hidden",
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 16 }}>Listado de Lotes</div>

      {sectors.length > 0 && (
        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
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
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: active
                    ? `2px solid ${s.color || "#2563EB"}`
                    : "1px solid #E5E7EB",
                  background: active ? s.color || "#2563EB" : "white",
                  color: active ? "white" : "#111827",
                  cursor: "pointer",
                  fontWeight: 900,
                }}
              >
                {s.name}
              </button>
            );
          })}

          <button
            onClick={() => onViewAll?.()}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              background: "#F3F4F6",
              color: "#111827",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            Ver todo
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 12,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar código o sector..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #E5E7EB",
          }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #E5E7EB",
          }}
        >
          <option value="TODOS">Todos</option>
          <option value="DISPONIBLE">Disponible</option>
          <option value="SEPARADO">Separado</option>
          <option value="VENDIDO">Vendido</option>
        </select>
      </div>

      <div
        style={{
          marginTop: 12,
          maxHeight: isMobile ? "28vh" : "70vh",
          overflow: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: 12, color: "#374151" }}>
              <th
                style={{
                  padding: "10px 8px",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                CÓDIGO
              </th>
              <th
                style={{
                  padding: "10px 8px",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                ÁREA
              </th>
              <th
                style={{
                  padding: "10px 8px",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                ESTADO
              </th>
            </tr>
          </thead>

          <tbody>
            {lots.map((l) => {
              const active = selectedCode && l.code === selectedCode;

              return (
                <tr
                  key={l.code}
                  onClick={() => onSelect(l)}
                  style={{
                    cursor: "pointer",
                    background: active ? "#EFF6FF" : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #F3F4F6",
                      fontWeight: 800,
                    }}
                  >
                    {l.code}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #F3F4F6",
                    }}
                  >
                    {l.areaM2 ?? "—"}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #F3F4F6",
                    }}
                  >
                    {String(l.status || "").trim()}
                  </td>
                </tr>
              );
            })}

            {lots.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: 16, color: "#6B7280" }}>
                  No hay lotes para mostrar con este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </aside>
  );
}
