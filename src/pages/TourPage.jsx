import React, { useEffect, useMemo, useState } from "react";
import { joinLots } from "../utils/joinLots";
import MapView from "../components/MapView";
import LotsTable from "../components/LotsTable";
import LotModal from "../components/LotModal";

const SHEET_URL = "https://script.google.com/macros/s/AKfycby_A-J3UmhniywRJysaoGV1Xb5DGOORQQaxnjrJJiVT5eJz82_F6ANqi0Tn_nxLEE5b/exec?proyecto=RIO CLARO"; // <-- aquí

export default function TourPage() {
  const [coords, setCoords] = useState([]);
  const [sheetRows, setSheetRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("TODOS");
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetch("/coords.json")
      .then((r) => r.json())
      .then((data) => setCoords(data))
      .catch(console.error);
  }, []);


  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch(SHEET_URL, { cache: "no-store" });
        const data = await res.json();
        if (alive) setSheetRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    };

    load();
    const id = setInterval(load, 2000); // 2s
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

 
  const lots = useMemo(() => joinLots(coords, sheetRows), [coords, sheetRows]);

  
  const filteredLots = useMemo(() => {
    return lots.filter((l) => {
      const status = (l.status || "").toUpperCase();
      const matchesFilter = filter === "TODOS" ? true : status === filter;

      const q = search.trim();
      const matchesSearch = q
        ? String(l.code).includes(q) || String(l.sector || "").toUpperCase().includes(q.toUpperCase())
        : true;

      return matchesFilter && matchesSearch;
    });
  }, [lots, filter, search]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 16, padding: 16,height: "100vh",boxSizing:"border-box" }}>
      <LotsTable
        lots={filteredLots}
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        onSelect={setSelected}
      />

      <MapView lots={filteredLots} selected={selected} onSelect={setSelected} />

      {selected && <LotModal lot={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
