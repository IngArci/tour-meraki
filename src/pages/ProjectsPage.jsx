import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  gold: "#CFAB42",
  white: "#FFFFFF",
  black: "#000000",
  gray: "#A0A0A0",
  border: "rgba(207,171,66,0.35)",
};

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
        console.error(e);
        if (alive) setProjects([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => (alive = false);
  }, []);

  return (
    <div
      style={{
        background: COLORS.black,
        minHeight: "100vh",
        padding: "60px 32px",
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        
        {/* HEADER */}
        <header style={{ marginBottom: 60 }}>
          
          <div
            style={{
              color: COLORS.gold,
              fontSize: 14,
              letterSpacing: 4,
              marginBottom: 12,
            }}
          >
            GRUPO CONSTRUCTOR MERAKI
          </div>

          <h1
            style={{
              color: COLORS.white,
              fontSize: "clamp(34px, 5vw, 52px)",
              fontWeight: 300,
              letterSpacing: 2,
              margin: 0,
            }}
          >
            PROYECTOS
          </h1>

          <div
            style={{
              width: 120,
              height: 1,
              background: COLORS.gold,
              marginTop: 20,
            }}
          />

        </header>

        {/* LOADING */}
        {loading && (
          <div style={{ color: COLORS.gray }}>
            Cargando proyectos...
          </div>
        )}

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: 40,
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() =>
                navigate(`/tour?project=${encodeURIComponent(project.id)}`)
              }
            />
          ))}
        </div>
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
        cursor: "pointer",
        border: `1px solid ${COLORS.border}`,
        transition: "all .25s ease",
        background: COLORS.black,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = "1px solid #CFAB42";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = COLORS.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      
      {/* IMAGE */}
      <div style={{ position: "relative" }}>
        
        {project?.image ? (
          <img
            src={project.image}
            alt={project.name}
            style={{
              width: "100%",
              height: 260,
              objectFit: "cover",
              display: "block",
              filter: "brightness(0.9)",
            }}
          />
        ) : (
          <div style={{ height: 260, background: "#111" }} />
        )}

        {/* SECTORS BADGE */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            background: COLORS.black,
            color: COLORS.gold,
            padding: "10px 18px",
            fontSize: 12,
            letterSpacing: 2,
          }}
        >
          {sectorsCount} SECTORES
        </div>

      </div>

      {/* CONTENT */}
      <div style={{ padding: "26px 24px" }}>
        
        <div
          style={{
            color: COLORS.white,
            fontSize: 20,
            fontWeight: 300,
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          {project?.name}
        </div>

        <div
          style={{
            color: COLORS.gray,
            fontSize: 14,
            marginBottom: 18,
          }}
        >
          {project?.location}
        </div>

        <div
          style={{
            color: COLORS.gold,
            fontSize: 13,
            letterSpacing: 2,
          }}
        >
          VER PROYECTO
        </div>

      </div>
    </div>
  );
}
