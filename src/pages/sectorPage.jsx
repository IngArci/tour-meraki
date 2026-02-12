import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { joinLots } from "../utils/joinLots";
import MapView from "../components/MapView";
import LotsTable from "../components/LotsTable";
import LotModal from "../components/LotModal";

export default function SectorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("project");
  const sectorId = searchParams.get("sector");

  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [currentSector, setCurrentSector] = useState(null);
  const [coords, setCoords] = useState([]);
  const [sheetRows, setSheetRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("TODOS");
  const [search, setSearch] = useState("");
  const [viewBox, setViewBox] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetch("/projects.json")
      .then((r) => r.json())
      .then(setProjects);
  }, []);

  useEffect(() => {
    if (!projectId || !projects.length) return;

    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProject(project);

      fetch(project.coordsFile)
        .then((r) => r.json())
        .then(setCoords);

      const loadSheet = async () => {
        try {
          const res = await fetch(project.sheetUrl, { cache: "no-store" });
          const data = await res.json();
          setSheetRows(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error(e);
        }
      };
      loadSheet();

      const interval = setInterval(loadSheet, 2000);
      return () => clearInterval(interval);
    }
  }, [projectId, projects]);

  useEffect(() => {
    if (!sectorId || !currentProject?.sectors) return;
    const sector = currentProject.sectors.find((s) => s.id === sectorId);
    if (sector) {
      setCurrentSector(sector);
      const coords = sector.coords;
      setViewBox(`${coords.x} ${coords.y} ${coords.w} ${coords.h}`);
    }
  }, [sectorId, currentProject]);

  const zoomToSector = (sectorId) => {
    if (!sectorId) {
      setViewBox(null);
      navigate(`?project=${currentProject.id}`);
      return;
    }
    const sector = currentProject.sectors.find((s) => s.id === sectorId);
    if (sector) {
      setCurrentSector(sector);
      navigate(`?project=${currentProject.id}&sector=${sector.id}`);
    }
  };

  const lots = useMemo(() => joinLots(coords, sheetRows), [coords, sheetRows]);
  const filteredLots = useMemo(() => {
    const upFilter = filter.toUpperCase();
    return lots.filter((l) => {
      const status = (l.status || "").toUpperCase();
      const matchesFilter = upFilter === "TODOS" ? true : status === upFilter;
      const q = search.trim();
      const matchesSearch = q
        ? String(l.code).includes(q) ||
          String(l.sector || "")
            .toUpperCase()
            .includes(q.toUpperCase())
        : true;
      return matchesFilter && matchesSearch;
    });
  }, [lots, filter, search]);

  useEffect(() => {
    if (!selected) {
      setViewBox(
        currentSector
          ? `${currentSector.coords.x} ${currentSector.coords.y} ${currentSector.coords.w} ${currentSector.coords.h}`
          : null,
      );
      return;
    }
    const padding = 250;
    const x = Math.max(0, selected.x - padding);
    const y = Math.max(0, selected.y - padding);
    const w = padding * 2;
    const h = padding * 2;
    setViewBox(`${x} ${y} ${w} ${h}`);
  }, [selected, currentSector]);

  if (!currentProject) return <div>Cargando proyecto...</div>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "380px 1fr",
        gridTemplateRows: isMobile ? "auto 1fr" : "1fr",
        gap: isMobile ? 12 : 16,
        padding: isMobile ? "8px" : "16px",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          gridColumn: "1 / -1",
          background: "linear-gradient(90deg, #080808, #f8e324)",
          color: "white",
          padding: "20px",
          borderRadius: 16,
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 10px 30px rgba(0,0,0,.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1 style={{ fontSize: 28, margin: 0 }}>{currentProject.name}</h1>
            <p style={{ margin: 4, opacity: 0.9 }}>
              Sector {currentSector?.name || "General"}
            </p>
          </div>
          <button
            onClick={() => navigate("/projects")}
            style={{
              padding: "12px 24px",
              background: "rgba(255,255,255,.2)",
              border: "1px solid rgba(255,255,255,.3)",
              borderRadius: 12,
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ← Todos los Clubes
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
        onZoomZone={zoomToSector}
        sectors={currentProject.sectors}
        currentSector={currentSector}
        isMobile={isMobile}
      />

      <MapView
        lots={filteredLots}
        selected={selected}
        onSelect={setSelected}
        viewBox={viewBox}
      />

      {selected && (
        <LotModal lot={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
