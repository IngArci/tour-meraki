import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/projects.json", { cache: "no-store" });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.projects || [];
        if (alive) setProjects(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Error loading /projects.json", e);
        if (alive) setProjects([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div
      style={{
        padding: "24px 16px",
        maxWidth: 1400,
        margin: "0 auto",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh"
      }}
    >
      <header style={{ textAlign: "center", color: "white", marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", margin: 0, fontWeight: 800 }}>
          Clubes de Campo Premium
        </h1>
        <p style={{ fontSize: "clamp(16px, 3vw, 20px)", opacity: 0.9, maxWidth: 600, margin: "16px auto 0" }}>
          Elige un club para ver sus sectores
        </p>
      </header>

      {loading && (
        <div style={{ color: "white", textAlign: "center", opacity: 0.95 }}>
          Cargando clubes...
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div
          style={{
            background: "rgba(255,255,255,.12)",
            border: "1px solid rgba(255,255,255,.25)",
            borderRadius: 16,
            padding: 16,
            color: "white",
            maxWidth: 760,
            margin: "0 auto"
          }}
        >
          No hay proyectos. Revisa <b>public/projects.json</b>.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          marginTop: 24
        }}
      >
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onClick={() => navigate(`/tour?project=${encodeURIComponent(p.id)}`)}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  const sectorsCount = project?.sectors?.length ?? 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: "white",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 25px 50px rgba(0,0,0,.15)",
        cursor: "pointer",
        transition: "transform .2s ease",
        position: "relative"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "rgba(255,255,255,.92)",
          padding: "8px 12px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 900
        }}
      >
        {sectorsCount} sectores
      </div>

      {project?.image ? (
        <img
          src={project.image}
          alt={project.name || "Proyecto"}
          style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div style={{ height: 220, background: "linear-gradient(135deg,#0B4D8B,#22C55E)" }} />
      )}

      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#111827" }}>
          {project?.name ?? "Proyecto"}
        </div>
        <div style={{ marginTop: 8, color: "#6B7280", fontSize: 14 }}>
          📍 {project?.location ?? "—"}
        </div>
        <div style={{ marginTop: 10, color: "#2563EB", fontWeight: 900, fontSize: 14 }}>
          Ver sectores →
        </div>
      </div>
    </div>
  );
}
