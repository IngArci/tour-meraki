import React from "react";

export default function LotModal({ lot, onClose }) {
  const status = String(lot.status || "").toUpperCase().trim();


  const blockContact = status !== "DISPONIBLE";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.35)",
        display: "grid",
        placeItems: "center",
        zIndex: 50
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px, 92vw)",
          background: "white",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,.25)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <strong>Lote {lot.lote}</strong>
          <button onClick={onClose} style={{ border: 0, background: "transparent", cursor: "pointer" }}>
            ✕
          </button>
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
          <div><b>Proyecto:</b> {lot.proyecto ?? "—"}</div>
          <div><b>Sector:</b> {lot.sector ?? "—"}</div>
          <div><b>Área:</b> {lot.areaM2 ?? "—"} m²</div>
          <div><b>Estado:</b> {lot.status ?? "—"}</div>
        </div>

        {!blockContact && (
          <button
            onClick={() => {
              const phone = "573001112233";
              const text = `Hola, me interesa el terreno ${lot.lote ?? "N/A"} del proyecto ${lot.proyecto ?? ""}. ¿Me das más información?`;
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
            }}
            style={{
              width: "100%",
              marginTop: 14,
              padding: "12px 14px",
              borderRadius: 10,
              border: 0,
              cursor: "pointer",
              background: "#0B4D8B",
              color: "white",
              fontWeight: 800
            }}
          >
            Contactar a un asesor
          </button>
        )}
      </div>
    </div>
  );
}
