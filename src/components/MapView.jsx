import React from "react";

const VIEWBOX_W = 2478.26;
const VIEWBOX_H = 1197.39;

function statusColor(status) {
    const s = String(status || "").toUpperCase().trim();
    if (s === "DISPONIBLE") return "#22C55E";
    if (s === "SEPARADO") return "#F59E0B";
    if (s === "VENDIDO") return "#EF4444";
    return "#6B7280";
}

export default function MapView({ lots, selected, onSelect }) {
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
                viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
                style={{ width: "100%", height: "100%", display: "block" }}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Fondo  */}
                <image
                    href="/plano-color.jpeg"
                    x="0"
                    y="0"
                    width={VIEWBOX_W}
                    height={VIEWBOX_H}
                />

                {/* Pines */}
                {lots.map((lot) => {
                    const isSelected = selected?.code === lot.code;
                    const status = String(lot.status || "").toUpperCase().trim();

                    const isSold = status === "VENDIDO";
                    const isNegotiation = status === "NEGOCIACION" || status === "NEGOCIACIÓN";

                    const iconSize = isSelected ? 60 : 52;

                    if (isSold) {
                        return (
                            <g key={lot.code} style={{ cursor: "default" }}>
                                <image
                                    href="/sold-happy.png"
                                    x={lot.x - iconSize / 2}
                                    y={lot.y - iconSize / 2}
                                    onClick={() => onSelect(lot)}
                                    style={{ cursor: "pointer" }}
                                    width={iconSize}
                                    height={iconSize}
                                />
                            </g>
                        );
                    }

                    if (isNegotiation) {
                        return (
                            <g key={lot.code} style={{ cursor: "default" }}>
                                <image
                                    href="/negotiation.png"
                                    x={lot.x - iconSize / 2}
                                    y={lot.y - iconSize / 2}
                                    onClick={() => onSelect(lot)}
                                    style={{ cursor: "pointer" }}
                                    width={iconSize}
                                    height={iconSize}
                                />
                            </g>
                        );
                    }

                    const r = isSelected ? 24 : 18;

                    return (
                        <g
                            key={lot.code}
                            onClick={() => onSelect(lot)}
                            style={{ cursor: "pointer" }}
                        >
                            <circle
                                cx={lot.x}
                                cy={lot.y}
                                r={r}
                                fill={statusColor(lot.status)}
                                stroke="white"
                                strokeWidth={3}
                            />
                            <text
                                x={lot.x}
                                y={lot.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="14"
                                fontWeight="800"
                                fill="white"
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
