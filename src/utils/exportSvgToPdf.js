import jsPDF from "jspdf";
import { Canvg } from "canvg";

async function urlToDataUrl(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`No se pudo cargar: ${url}`);
  const blob = await res.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // data:...
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getImageHref(node) {
  return (
    node.getAttribute("href") ||
    node.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
    node.getAttribute("xlink:href")
  );
}

async function inlineAllSvgImages(svgEl) {
  const images = Array.from(svgEl.querySelectorAll("image"));
  for (const img of images) {
    const href = getImageHref(img);
    if (!href) continue;
    if (href.startsWith("data:")) continue;

    const dataUrl = await urlToDataUrl(href);
    img.setAttribute("href", dataUrl);
    img.removeAttribute("xlink:href");
  }
}

function getViewBox(svgEl) {
  const vb = svgEl.getAttribute("viewBox");
  if (!vb) return { x: 0, y: 0, w: 1000, h: 1000 };
  const [x, y, w, h] = vb.split(/\s+/).map(Number);
  return { x, y, w, h };
}

export async function exportSvgElementToPdf({
  svgElement,
  filename = "plano.pdf",
  orientation = "landscape",
  format = "a4",
  scale = 2
}) {
  if (!svgElement) return;

  const clone = svgElement.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

  await inlineAllSvgImages(clone);

  const { w: vbW, h: vbH } = getViewBox(clone);

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(vbW * scale);
  canvas.height = Math.round(vbH * scale);

  const ctx = canvas.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const svgText = new XMLSerializer().serializeToString(clone);

  const v = await Canvg.fromString(ctx, svgText, {
    ignoreMouse: true,
    ignoreAnimation: true
  });
  await v.render();

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation, unit: "mm", format });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  let drawW = pageW;
  let drawH = (canvas.height * drawW) / canvas.width;

  if (drawH > pageH) {
    drawH = pageH;
    drawW = (canvas.width * drawH) / canvas.height;
  }

  const x = (pageW - drawW) / 2;
  const y = (pageH - drawH) / 2;

  pdf.addImage(imgData, "PNG", x, y, drawW, drawH);
  pdf.save(filename);
}
