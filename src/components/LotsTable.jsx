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

  const getStatusColor = (status) => {
    const s = String(status || "")
      .trim()
      .toUpperCase();
    if (s === "DISPONIBLE") return "#10B981";
    if (s === "NEGOCIACION") return "#F59E0B";
    if (s === "VENDIDO") return "#EF4444";
    return "#2855ad";
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
        background: "white",
        borderRadius: 14,
        padding: 14,
        boxShadow: "0 10px 30px rgba(0,0,0,.12)",
        height: isMobile ? "80vh" : undefined,
        maxHeight: isMobile ? "80vh" : "calc(100vh - 32px - 70px)",
        minHeight: isMobile ? "500px" : "auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: 16,
          marginBottom: 8,
          paddingBottom: 8,
        }}
      >
        📋 Listado de Terrenos ({visibleLots.length})
      </div>

      {sectors.length > 0 && (
        <div
          style={{
            marginBottom: 6,
            maxHeight: isMobile ? 60 : "auto",
            overflow: "auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            paddingBottom: 4,
          }}
        >
          {sectors.map((s) => {
            const active = s.id === currentSectorId;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSector?.(s.id)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: active
                    ? `2px solid ${s.color || "#2563EB"}`
                    : "1px solid #E5E7EB",
                  background: active ? s.color || "#2563EB" : "white",
                  color: active ? "white" : "#111827",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {s.name}
              </button>
            );
          })}
          <button
            onClick={() => onViewAll?.()}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              background: "#F9FAFB",
              color: "#6B7280",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Todos
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 8,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            fontSize: 14,
          }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #E5E7EB",
            fontSize: 14,
            minWidth: isMobile ? "100%" : 120,
            background: "white",
          }}
        >
          <option value="TODOS">Todos</option>
          <option value="DISPONIBLE">Disponible</option>
          <option value="NEGOCIACION">Separado</option>
          <option value="VENDIDO">Vendido</option>
        </select>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#F9FAFB",
                fontWeight: 700,
                fontSize: 12,
                color: "#6B7280",
              }}
            >
              <th
                style={{
                  padding: "10px 8px",
                  textAlign: "left",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                Sector
              </th>
              <th
                style={{
                  padding: "10px 8px",
                  textAlign: "left",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                Terrenos
              </th>
              <th
                style={{
                  padding: "10px 8px",
                  textAlign: "right",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                Área
              </th>
              <th
                style={{
                  padding: "10px 8px",
                  textAlign: "center",
                  borderBottom: "1px solid #E5E7EB",
                }}
              >
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleLots.map((l) => {
              const active = selectedCode === l.code;
              return (
                <tr
                  key={l.code}
                  onClick={() => onSelect(l)}
                  style={{
                    cursor: "pointer",
                    background: active ? "#EFF6FF" : "transparent",
                    transition: "background 0.2s ease",
                  }}
                >
                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom: "1px solid #F3F4F6",
                      fontWeight: 600,
                    }}
                  >
                    {l.sectorKey || "—"}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom: "1px solid #F3F4F6",
                      fontWeight: 800,
                      color: "#1E40AF",
                    }}
                  >
                    {l.lote || "—"}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom: "1px solid #F3F4F6",
                      textAlign: "right",
                    }}
                  >
                    {l.areaM2 ? l.areaM2.toLocaleString() : "—"}
                  </td>
                  <td
                    style={{
                      padding: "12px 8px",
                      borderBottom: "1px solid #F3F4F6",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        backgroundColor: getStatusColor(l.status),
                        color: "white",
                        fontSize: 11,
                        fontWeight: 700,
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
                    color: "#9CA3AF",
                  }}
                >
                  No hay lotes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </aside>
  );
}
