import fs from "fs";
import path from "path";

// Configuración
const planosDir = "./public/planos";
const outputDir = "./public/coords";


if (!fs.existsSync(planosDir)) {
  fs.mkdirSync(planosDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}


function parseTranslate(transform) {
  const m = /translate\(([-\d.]+)\s+([-\d.]+)\)/.exec(transform);
  if (!m) return null;
  return { x: Number(m[1]), y: Number(m[2]) };
}

// Normaliza código
function normalizeCode(code) {
  return String(code).trim().padStart(7, "0");
}

const regex =
  /<text[^>]*transform="([^"]+)"[^>]*>\s*<tspan[^>]*>\s*([0-9]+)\s*<\/tspan>\s*<\/text>/g;


const svgFiles = fs.readdirSync(planosDir).filter((f) => f.endsWith(".svg"));

if (svgFiles.length === 0) {
  console.error(`❌ No hay archivos .svg en ${planosDir}`);
  process.exit(1);
}

console.log(`📁 Encontrados ${svgFiles.length} planos SVG:`);
svgFiles.forEach((f) => console.log(`   - ${f}`));

svgFiles.forEach((svgFile) => {
  const inputPath = path.join(planosDir, svgFile);
  const outputFile = svgFile.replace(".svg", ".json");
  const outputPath = path.join(outputDir, outputFile);

  console.log(`\n🔄 Procesando ${svgFile}...`);

  try {
    const svg = fs.readFileSync(inputPath, "utf8");
    regex.lastIndex = 0;


    const coords = [];
    let match;

    while ((match = regex.exec(svg)) !== null) {
      const transform = match[1];
      const rawCode = match[2];

      const s = String(rawCode).trim();

      if (!/^\d{7}$/.test(s) && !/^\d{6}$/.test(s) && !/^\d{4}$/.test(s)) {
        continue;
      }

      const pos = parseTranslate(transform);
      if (!pos) continue;

      coords.push({
        code: normalizeCode(rawCode),
        x: pos.x,
        y: pos.y,
      });
    }



    fs.writeFileSync(
      outputPath,
      JSON.stringify(coords, null, 2),
      "utf8"
    );


    console.log(`✅ ${unique.size} lotes → ${outputFile}`);
  } catch (error) {
    console.error(` Error procesando ${svgFile}:`, error.message);
  }
});

console.log(`\n Listo! Archivos en ${outputDir}`);
