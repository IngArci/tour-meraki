import React from "react";

const COLORS = {
  gold: "#CFAB42",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#BFBFBF",
  border: "rgba(207,171,66,0.35)",
};

export default function LotModal({ lot, onClose }) {

  const status = String(lot.status || "").toUpperCase().trim();
  const blockContact = status !== "DISPONIBLE";


  const getStatusStyle = () => {

    if (status === "DISPONIBLE")
      return {
        color: "#1be91e",
        border: `1px solid ${COLORS.gold}`,
      };

    if (status === "NEGOCIACION")
      return {
        color: "#30d8e0",
        border: `1px solid ${COLORS.gold}`,
      };

    if (status === "VENDIDO")
      return {
        color: "#ff0000",
        border: `1px solid ${COLORS.gold}`,
      };

    return {
      color: COLORS.gray,
      border: `1px solid ${COLORS.border}`,
    };
  };


  return (

    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "grid",
        placeItems: "center",
        zIndex: 999,
      }}
    >

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(500px, 92vw)",
          background: COLORS.black,
          padding: 28,
          border: `1px solid ${COLORS.border}`,
        }}
      >

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >

          <div>

            <div
              style={{
                color: COLORS.gray,
                fontSize: 11,
                letterSpacing: 3,
                marginBottom: 6,
              }}
            >
              INFORMACIÓN DEL LOTE
            </div>

            <div
              style={{
                color: COLORS.gold,
                fontSize: 26,
                letterSpacing: 2,
              }}
            >
              LOTE {lot.lote}
            </div>

          </div>


          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: `1px solid ${COLORS.border}`,
              color: COLORS.gray,
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ✕
          </button>

        </div>


        {/* CONTENT */}
        <div
          style={{
            display: "grid",
            gap: 14,
            marginBottom: 22,
            fontSize: 14,
          }}
        >

          <div>
            <div style={{ color: COLORS.gray, fontSize: 11, letterSpacing: 2 }}>
              PROYECTO
            </div>

            <div style={{ color: COLORS.white }}>
              {lot.proyecto ?? "—"}
            </div>
          </div>


          <div>
            <div style={{ color: COLORS.gray, fontSize: 11, letterSpacing: 2 }}>
              SECTOR
            </div>

            <div style={{ color: COLORS.white }}>
              {lot.sector ?? "—"}
            </div>
          </div>


          <div>
            <div style={{ color: COLORS.gray, fontSize: 11, letterSpacing: 2 }}>
              ÁREA
            </div>

            <div style={{ color: COLORS.white }}>
              {lot.areaM2 ?? "—"} m²
            </div>
          </div>


          <div>
            <div style={{ color: COLORS.gray, fontSize: 11, letterSpacing: 2 }}>
              ESTADO
            </div>

            <div style={{ marginTop: 4 }}>
              <span
                style={{
                  padding: "6px 14px",
                  fontSize: 12,
                  letterSpacing: 2,
                  ...getStatusStyle(),
                }}
              >
                {status}
              </span>
            </div>
          </div>

        </div>


        {/* CONTACT BUTTON */}
        {!blockContact && (

          <button
            onClick={() => {

              const phone = "573001112233";

              const text =
                `Hola, estoy interesado en el lote ${lot.lote} del proyecto ${lot.proyecto}. ¿Podrían darme más información?`;

              window.open(
                `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
                "_blank"
              );

            }}
            style={{
              width: "100%",
              padding: "14px",
              background: COLORS.gold,
              color: COLORS.black,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              letterSpacing: 2,
              fontSize: 13,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            CONTACTAR ASESOR
          </button>

        )}

      </div>

    </div>
  );
}
