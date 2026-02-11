// scripts/extractCoords.js
import fs from "fs";

const inputPath = "./public/plano.svg";
const outputPath = "./public/coords.json";

// Extrae translate(x y)
function parseTranslate(transform) {
  const m = /translate\(([-\d.]+)\s+([-\d.]+)\)/.exec(transform);
  if (!m) return null;
  return { x: Number(m[1]), y: Number(m[2]) };
}

function normalizeCode(code) {
  return String(code).trim().padStart(7, "0");
}

const svg = fs.readFileSync(inputPath, "utf8");

// Regex básico para tu patrón <text ... transform="translate(x y)"> ... <tspan>CODE</tspan>
const regex =
  /<text[^>]*transform="([^"]+)"[^>]*>\s*<tspan[^>]*>\s*([0-9]+)\s*<\/tspan>\s*<\/text>/g;

const coords = [];
let match;

while ((match = regex.exec(svg)) !== null) {
  const transform = match[1];
  const rawCode = match[2];

  const pos = parseTranslate(transform);
  if (!pos) continue;

  coords.push({
    code: normalizeCode(rawCode),
    x: pos.x,
    y: pos.y,
  });
}

// Elimina duplicados por si hay repetidos
const unique = new Map();
for (const c of coords) unique.set(c.code, c);

fs.writeFileSync(outputPath, JSON.stringify([...unique.values()], null, 2), "utf8");

console.log(`✅ coords.json generado con ${unique.size} lotes -> ${outputPath}`);
