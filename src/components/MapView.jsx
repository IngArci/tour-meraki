import React from "react";

function statusColor(status) {
  const s = String(status || "").toUpperCase().trim();
  if (s === "DISPONIBLE") return "#22C55E";
  if (s === "GERENCIA") return "#446fe4";
  if (s === "SEPARADO") return "#F59E0B";
  return "#6B7280";
}

export default function MapView({
  lots,
  selected,
  onSelect,
  viewBox,
  planImage,
  planSize,
  svgRef
}) {
  const w = planSize?.w ?? 2478.26;
  const h = planSize?.h ?? 1197.39;

  const vb = viewBox || `0 0 ${w} ${h}`;

  return (
    <div
      style={{
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,.12)",
        height: "calc(100vh - 32px)"
      }}
    >
      <svg
        ref={svgRef}
        viewBox={vb}
        style={{ width: "100%", height: "100%", display: "block" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <image href={planImage} x="0" y="0" width={w} height={h} />

        {lots.map((lot) => {
          const isSelected = selected?.code === lot.code;
          const status = String(lot.status || "").toUpperCase().trim();

          const isSold = status === "VENDIDO";
          const isNegotiation = status === "NEGOCIACION" || status === "NEGOCIACIÓN";

          const iconSize = isSelected ? 60 : 26;

          if (isSold) {
            return (
              <g key={lot.code} onClick={() => onSelect(lot)} style={{ cursor: "pointer" }}>
                <image
                  href="/sold-happy.png"
                  x={lot.x - iconSize / 2}
                  y={lot.y - iconSize / 2}
                  width={iconSize}
                  height={iconSize}
                  style={{ pointerEvents: "none" }}  
                />
              </g>
            );
          }

          if (isNegotiation) {
            return (
              <g key={lot.code} onClick={() => onSelect(lot)} style={{ cursor: "pointer" }}>
                <image
                  href="/negotiation.png"
                  x={lot.x - iconSize / 2}
                  y={lot.y - iconSize / 2}
                  width={iconSize}
                  height={iconSize}
                  style={{ pointerEvents: "none" }}
                />
              </g>
            );
          }

          const r = isSelected ? 28 : 10;

          return (
            <g key={lot.code} onClick={() => onSelect(lot)} style={{ cursor: "pointer" }}>
              <circle
                cx={lot.x}
                cy={lot.y}
                r={r}
                fill={statusColor(lot.status)}
                stroke="white"
                strokeWidth={2}
              />
              <text
                x={lot.x}
                y={lot.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={isSelected ? "18" : "14"}
                fontWeight="800"
                fill="white"
                style={{ pointerEvents: "none" }}
              >
                {lot.lote ?? "?"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
