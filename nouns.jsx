// Nouns.world — Filterable Directory (Google Sheets)
// -------------------------------------------------
// Config updated for your sheet:
// Columns: Logo | Name (with url hyperlinked) | Description | Category
// Category supports multiple values per cell (comma-separated) ✅

import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

const CONFIG = {
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT2QEJ1rF958d-HWyfhuCMGVjBCIxED4ACRBCLtGw1yAzYON0afVFXxY_YOHhRjHVwGvOh7zpMyaRs7/pub?gid=0&single=true&output=csv",
  COLUMNS: {
    title: "Name (with url hyperlinked)",
    categories: "Category",
    description: "Description",
    link: "Link", // ← please add this column in your sheet
    image: "Logo",
    status: "Status", // optional (if you add it later)
    date: "Date",     // optional (if you add it later)
    tags: "Tags",     // optional (if you add it later)
  },
  site: {
    openLinksInNewTab: true,
  },
};

const slug = (s) =>
  (s || "").toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const parseList = (val) =>
  (val || "")
    .split(/[,;]/)
    .map((v) => v.trim())
    .filter(Boolean);

const pastelFromText = (text) => {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 360;
  return `hsl(${h} 70% 92%)`;
};

const Pill = ({ children, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`select-none whitespace-nowrap rounded-2xl border px-3 py-1 text-sm transition ${
      selected
        ? "border-neutral-800 bg-neutral-900 text-white shadow"
        : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
    }`}
    style={{ backgroundColor: selected ? undefined : pastelFromText(children) }}
  >
    {children}
  </button>
);

export default function NounsDirectory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCats, setSelectedCats] = useState([]);

  useEffect(() => {
    Papa.parse(CONFIG.SHEET_CSV_URL, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (res) => {
        const data = res.data.map((row, i) => {
          const logo = row[CONFIG.COLUMNS.logo]?.trim() || "";
          const nameCell = row[CONFIG.COLUMNS.name] || "";

          let title = nameCell;
          let link = "";
          const match = nameCell.match(/href=\"(.*?)\".*?>(.*?)<\\/a>/);
          if (match) {
            link = match[1];
            title = match[2];
          }

          const description = row[CONFIG.COLUMNS.description]?.trim() || "";
          const categories = parseList(row[CONFIG.COLUMNS.categories]);
          return { key: `${slug(title)}-${i}`, title, link, description, logo, categories };
        });
        setRows(data);
        setLoading(false);
      },
    });
  }, []);

  const allCategories = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => r.categories.forEach((c) => set.add(c)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const filtered = useMemo(() => {
    if (!selectedCats.length) return rows;
    const wanted = new Set(selectedCats.map((c) => slug(c)));
    return rows.filter((r) => r.categories.some((c) => wanted.has(slug(c))));
  }, [rows, selectedCats]);

  const toggleCat = (cat) => {
    const sl = slug(cat);
    setSelectedCats((prev) =>
      prev.some((c) => slug(c) === sl) ? prev.filter((c) => slug(c) !== sl) : [...prev, cat]
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24">
      <h1 className="font-[Londrina] text-2xl mb-4">Explore Nounish Projects</h1>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allCategories.map((c) => (
          <Pill key={c} selected={selectedCats.includes(c)} onClick={() => toggleCat(c)}>
            {c}
          </Pill>
        ))}
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <article key={r.key} className="rounded-2xl border p-4 bg-white shadow-sm">
              {r.logo && (
                <img src={r.logo} alt={r.title} className="h-16 w-16 object-contain mb-2" />
              )}
              <h3 className="text-lg font-semibold">
                {r.link ? (
                  <a href={r.link} target="_blank" rel="noreferrer" className="hover:underline">
                    {r.title}
                  </a>
                ) : (
                  r.title
                )}
              </h3>
              <p className="mt-2 text-sm text-neutral-700">{r.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {r.categories.map((c) => (
                  <span key={`${r.key}-${c}`} className="rounded-full border px-2 py-0.5 text-xs bg-neutral-50">
                    {c}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
