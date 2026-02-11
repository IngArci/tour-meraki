import React from "react";

export default function LotsTable({ lots, filter, setFilter, search, setSearch, onSelect }) {
  return (
    <aside style={{ background: "white", borderRadius: 14, padding: 14, boxShadow: "0 10px 30px rgba(0,0,0,.12)" }}>
      <div style={{ fontWeight: 800, fontSize: 16 }}>Listado de Lotes</div>

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar código o sector..."
          style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid #E5E7EB" }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #E5E7EB" }}
        >
          <option value="TODOS">Todos</option>
          <option value="DISPONIBLE">Disponible</option>
          <option value="SEPARADO">Separado</option>
          <option value="VENDIDO">Vendido</option>
        </select>
      </div>

      <div style={{ marginTop: 12, maxHeight: "70vh", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", fontSize: 12, color: "#374151" }}>
              <th style={{ padding: "10px 8px", borderBottom: "1px solid #E5E7EB" }}>CÓDIGO</th>
              <th style={{ padding: "10px 8px", borderBottom: "1px solid #E5E7EB" }}>ÁREA</th>
              <th style={{ padding: "10px 8px", borderBottom: "1px solid #E5E7EB" }}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((l) => (
              <tr key={l.code} onClick={() => onSelect(l)} style={{ cursor: "pointer" }}>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid #F3F4F6" }}>{l.code}</td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid #F3F4F6" }}>
                  {l.areaM2 ?? "—"}
                </td>
                <td style={{ padding: "10px 8px", borderBottom: "1px solid #F3F4F6" }}>
                  {String(l.status || "").trim()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  );
}
