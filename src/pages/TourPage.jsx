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

  const [coordsUrl, setCoordsUrl] = useState(null);

  const [mapImage, setMapImage] = useState(null);
  const [mapSize, setMapSize] = useState(null);

  const COLORS = {
    gold: "#CFAB42",
    white: "#FFFFFF",
    black: "#000000",
    gray: "#BFBFBF",
    border: "rgba(207,171,66,0.35)",
  };


  const PIN_CONFIGS = {
    texas: {
      iconSize: 24,
      iconSizeSelected: 50,
      circleRadius: 8,
      circleRadiusSelected: 20
    },

    colorado: {
      iconSize: 20,
      iconSizeSelected: 60,
      circleRadius: 12,
      circleRadiusSelected: 30
    },

    "los-angeles": {
      iconSize: 26,
      iconSizeSelected: 80,
      circleRadius: 14,
      circleRadiusSelected: 34
    },
    "las-vegas": {
      iconSize: 20,
      iconSizeSelected: 60,
      circleRadius: 12,
      circleRadiusSelected: 30
    },
    "san-francisco": {
      iconSize: 30,
      iconSizeSelected: 60,
      circleRadius: 12,
      circleRadiusSelected: 30
    },
    "rio-medina": {
      iconSize: 40,
      iconSizeSelected: 60,
      circleRadius: 12,
      circleRadiusSelected: 30
    },
    "rio-lagunilla": {
      iconSize: 40,
      iconSizeSelected: 60,
      circleRadius: 12,
      circleRadiusSelected: 30
    },
  };



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
    if (!project) return;

    if (!sectorId) {
      setMapImage(project.planImage || "/plano-color.jpeg");
      setMapSize(project.planSize || null);
      setViewBox(null);
      setCoordsUrl(project.coordsFile);
      setSelected(null);
      return;
    }

    const s = (project.sectors || []).find((x) => x.id === sectorId);
    if (!s) return;

    setMapImage(s.planImage || project.planImage || "/plano-color.jpeg");
    setMapSize(s.planSize || project.planSize || null);

    const w = s.planSize?.w ?? project.planSize?.w;
    const h = s.planSize?.h ?? project.planSize?.h;

    if (w && h) setViewBox(`0 0 ${w} ${h}`);
    else setViewBox(null);

    setCoordsUrl(s.coordsFile || project.coordsFile);
    setSelected(null);
  }, [project, sectorId]);


  useEffect(() => {
    if (!coordsUrl) return;

    let alive = true;

    fetch(coordsUrl, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (alive) setCoords(Array.isArray(data) ? data : []);
      })
      .catch(console.error);

    return () => {
      alive = false;
    };
  }, [coordsUrl]);


  const lots = useMemo(() => {
    const joined = joinLots(coords, sheetRows);

    const unique = new Map();
    for (const l of joined) {

      const prev = unique.get(l.code);
      if (!prev) unique.set(l.code, l);
      else {

        const score = (x) =>
          (x.status ? 10 : 0) + (x.sector ? 3 : 0) + (x.areaM2 != null ? 2 : 0);
        unique.set(l.code, score(l) >= score(prev) ? l : prev);
      }
    }
    return [...unique.values()];
  }, [coords, sheetRows]);


  const filteredLots = useMemo(() => {
    const upFilter = filter.toUpperCase();

    return lots.filter((l) => {
      if (!l.inSheet) return false;

      const matchesSector = sectorId ? l.sectorKey === sectorId : true;

      const status = (l.status || "").toUpperCase();
      const matchesFilter = upFilter === "TODOS" ? true : status === upFilter;

      const q = search.trim();
      const matchesSearch = q
        ? String(l.code).includes(q) ||
        String(l.sector || "").toUpperCase().includes(q.toUpperCase())
        : true;

      return matchesSector && matchesFilter && matchesSearch;
    });
  }, [lots, filter, search, sectorId]);


  const visibleLots = useMemo(() => {
    if (!sectorId) return filteredLots;

    const byId = filteredLots.filter(
      (l) => String(l.sectorId || "").toLowerCase() === String(sectorId).toLowerCase()
    );
    if (byId.length > 0) return byId;

    const sectorName = (project?.sectors || []).find((s) => s.id === sectorId)?.name;
    if (!sectorName) return filteredLots;

    return filteredLots.filter(
      (l) => String(l.sector || "").toLowerCase().trim() === String(sectorName).toLowerCase().trim()
    );
  }, [filteredLots, sectorId, project]);

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
        gridTemplateColumns: isMobile ? "1fr" : "400px 1fr",
        gridTemplateRows: "auto 1fr",
        gap: 16,
        padding: isMobile ? 10 : 20,
        height: "100vh",
        background: COLORS.black,
        color: COLORS.white,
        boxSizing: "border-box",
      }}
    >

      {/* HEADER MERAKI */}
      <header
        style={{
          gridColumn: "1 / -1",
          background: COLORS.black,
          border: `1px solid ${COLORS.border}`,
          padding: "18px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: COLORS.gold,
              fontSize: 12,
              letterSpacing: 3,
              marginBottom: 4,
            }}
          >
            GRUPO CONSTRUCTOR MERAKI
          </div>

          <div
            style={{
              fontSize: 20,
              fontWeight: 300,
              letterSpacing: 1,
            }}
          >
            {project.name}
          </div>

          <div
            style={{
              fontSize: 13,
              color: COLORS.gray,
            }}
          >
            {project.location ?? ""}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>

          {/* PDF BUTTON */}
          <button
            onClick={handleDownloadPdf}
            style={{
              padding: "10px 18px",
              background: "transparent",
              border: `1px solid ${COLORS.border}`,
              color: COLORS.gold,
              cursor: "pointer",
              letterSpacing: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = "1px solid #CFAB42";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = COLORS.border;
            }}
          >
            DESCARGAR PDF
          </button>

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 18px",
              background: "transparent",
              border: `1px solid ${COLORS.border}`,
              color: COLORS.white,
              cursor: "pointer",
              letterSpacing: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = "1px solid #CFAB42";
              e.currentTarget.style.color = "#CFAB42";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = COLORS.border;
              e.currentTarget.style.color = COLORS.white;
            }}
          >
            ← PROYECTOS
          </button>

        </div>
      </header>


      {/* LEFT PANEL */}
      <div
        style={{
          border: `1px solid ${COLORS.border}`,
          background: COLORS.black,
        }}
      >
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
      </div>


      {/* MAP PANEL */}
      <div
        style={{
          border: `1px solid ${COLORS.border}`,
          background: COLORS.black,
        }}
      >
        <MapView
          svgRef={svgRef}
          lots={filteredLots}
          selected={selected}
          onSelect={setSelected}
          viewBox={viewBox}
          planImage={mapImage || project.planImage}
          planSize={mapSize || project.planSize}
          pinConfig={PIN_CONFIGS[sectorId]}
        />
      </div>


      {/* MODAL */}
      {selected && (
        <LotModal
          lot={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  );

}
