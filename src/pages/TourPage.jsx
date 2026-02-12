import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { joinLots } from "../utils/joinLots";
import { exportSvgElementToPdf } from "../utils/exportSvgToPdf";

import MapView from "../components/MapView";
import LotsTable from "../components/LotsTable";
import LotModal from "../components/LotModal";

export default function TourPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const projectId = sp.get("project");
  const sectorId = sp.get("sector");

  const [project, setProject] = useState(null);
  const [coords, setCoords] = useState([]);
  const [sheetRows, setSheetRows] = useState([]);

  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("TODOS");
  const [search, setSearch] = useState("");
  const [viewBox, setViewBox] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  const svgRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    let alive = true;

    const loadProject = async () => {
      try {
        const res = await fetch("/projects.json", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.projects || [];
        const found = (Array.isArray(list) ? list : []).find((p) => p.id === projectId);
        if (alive) setProject(found || null);
      } catch (e) {
        console.error(e);
        if (alive) setProject(null);
      }
    };

    loadProject();
    return () => {
      alive = false;
    };
  }, [projectId]);

  useEffect(() => {
    if (!project) return;

    let alive = true;

    fetch(project.coordsFile, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (alive) setCoords(Array.isArray(data) ? data : []);
      })
      .catch(console.error);

    const loadSheet = async () => {
      try {
        const res = await fetch(project.sheetUrl, { cache: "no-store" });
        const data = await res.json();
        if (alive) setSheetRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    };

    loadSheet();
    const id = setInterval(loadSheet, 2000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [project]);

  useEffect(() => {
    if (!project?.sectors?.length) return;

    if (!sectorId) {
      setViewBox(null);
      return;
    }

    const sector = project.sectors.find((s) => s.id === sectorId);
    if (!sector?.coords) return;

    const { x, y, w, h } = sector.coords;
    setViewBox(`${x} ${y} ${w} ${h}`);
    setSelected(null);
  }, [project, sectorId]);

  const lots = useMemo(() => joinLots(coords, sheetRows), [coords, sheetRows]);

  const filteredLots = useMemo(() => {
    const upFilter = filter.toUpperCase();
    return lots.filter((l) => {
      const status = (l.status || "").toUpperCase();
      const matchesFilter = upFilter === "TODOS" ? true : status === upFilter;

      const q = search.trim();
      const matchesSearch = q
        ? String(l.code).includes(q) ||
          String(l.sector || "").toUpperCase().includes(q.toUpperCase())
        : true;

      return matchesFilter && matchesSearch;
    });
  }, [lots, filter, search]);

  useEffect(() => {
    if (!selected) return;

    const padding = 250;
    const x = Math.max(0, selected.x - padding);
    const y = Math.max(0, selected.y - padding);
    const w = padding * 2;
    const h = padding * 2;
    setViewBox(`${x} ${y} ${w} ${h}`);
  }, [selected]);

  const onSelectSector = (id) => {
    navigate(`/tour?project=${encodeURIComponent(projectId)}&sector=${encodeURIComponent(id)}`);
  };

  const onViewAll = () => {
    setSelected(null);
    setViewBox(null);
    navigate(`/tour?project=${encodeURIComponent(projectId)}`);
  };

  const handleDownloadPdf = async () => {
    await exportSvgElementToPdf({
      svgElement: svgRef.current,
      filename: `plano-${projectId || "proyecto"}-${sectorId || "general"}.pdf`,
      orientation: "landscape",
      format: "a4",
      scale: 2
    });
  };

  if (!projectId) {
    return (
      <div style={{ padding: 16 }}>
        Falta el parámetro <b>project</b>.
        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: 0,
              background: "#0B4D8B",
              color: "white",
              cursor: "pointer",
              fontWeight: 900
            }}
          >
            Ir a Clubes
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return <div style={{ padding: 16 }}>Cargando proyecto...</div>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "380px 1fr",
        gridTemplateRows: isMobile ? "auto 1fr" : "1fr",
        gap: isMobile ? 12 : 16,
        padding: isMobile ? 8 : 16,
        height: "100vh",
        boxSizing: "border-box"
      }}
    >
      <header
        style={{
          gridColumn: "1 / -1",
          background: "linear-gradient(90deg, #0B4D8B, #22C55E)",
          color: "white",
          padding: "14px 16px",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12
        }}
      >
        <div>
          <div style={{ fontWeight: 900, fontSize: 18 }}>{project.name}</div>
          <div style={{ opacity: 0.9, fontSize: 13 }}>{project.location ?? ""}</div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={handleDownloadPdf}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,.35)",
              background: "rgba(255,255,255,.15)",
              color: "white",
              cursor: "pointer",
              fontWeight: 900
            }}
          >
            Descargar PDF
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,.35)",
              background: "rgba(255,255,255,.15)",
              color: "white",
              cursor: "pointer",
              fontWeight: 900
            }}
          >
            ← Clubes
          </button>
        </div>
      </header>

      <LotsTable
        lots={filteredLots}
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        onSelect={setSelected}
        sectors={project.sectors || []}
        currentSectorId={sectorId}
        onSelectSector={onSelectSector}
        onViewAll={onViewAll}
        selectedCode={selected?.code || null}
      />

      <MapView
        svgRef={svgRef}
        lots={filteredLots}
        selected={selected}
        onSelect={setSelected}
        viewBox={viewBox}
        planImage={project.planImage || "/plano-color.jpeg"}
      />

      {selected && <LotModal lot={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
