// Nouns.world — Filterable Directory (Google Sheets)
// Sheet columns: Logo | Name (with url hyperlinked) | URL | Description | Category
// Category supports multiple values per cell (comma-separated)

import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

const CONFIG = {
  SHEET_CSV_URL:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT2QEJ1rF958d-HWyfhuCMGVjBCIxED4ACRBCLtGw1yAzYON0afVFXxY_YOHhRjHVwGvOh7zpMyaRs7/pub?gid=0&single=true&output=csv",
  COLUMNS: {
    title: "Name (with url hyperlinked)",
    link: "URL",
    description: "Description",
    categories: "Category",
    image: "Logo"
  },
  site: {
    openLinksInNewTab: true
  }
};

const slug = (s) =>
  (s || "").toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

const parseList = (val) =>
  (val || "")
    .split(/[;,]/)
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
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("az"); // "az" | "new" (requires Date col)

  useEffect(() => {
    Papa.parse(CONFIG.SHEET_CSV_URL, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (res) => {
        const raw = res.data || [];
        const data = raw.map((row, i) => {
          const title = (row[CONFIG.COLUMNS.title] || "").toString().trim();
          const link = (row[CONFIG.COLUMNS.link] || "").toString().trim();
          const description = (row[CONFIG.COLUMNS.description] || "").toString().trim();
          const categories = parseList(row[CONFIG.COLUMNS.categories]);
          const image = (row[CONFIG.COLUMNS.image] || "").toString().trim();
          return { key: `${slug(title)}-${i}`, title, link, description, categories, image, date: null };
        });
        setRows(data);
        setLoading(false);
      },
      error: () => setLoading(false),
    });
  }, []);

  const allCategories = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => r.categories.forEach((c) => set.add(c)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const filtered = useMemo(() => {
    let out = rows;
    if (selectedCats.length) {
      const wanted = new Set(selectedCats.map((c) => slug(c)));
      out = out.filter((r) => r.categories.some((c) => wanted.has(slug(c))));
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.categories.join(", ").toLowerCase().includes(q)
      );
    }
    if (sort === "az") {
      out = [...out].sort((a, b) => a.title.localeCompare(b.title));
    }
    return out;
  }, [rows, selectedCats, query, sort]);

  const toggleCat = (cat) => {
    const sl = slug(cat);
    setSelectedCats((prev) =>
      prev.some((c) => slug(c) === sl) ? prev.filter((c) => slug(c) !== sl) : [...prev, cat]
    );
  };

  const clearFilters = () => setSelectedCats([]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24">
      <div className="sticky top-0 z-10 -mx-4 border-b bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Explore Nounish Projects</h1>
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
              {filtered.length} shown
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-64 max-w-[70vw] rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
              aria-label="Search"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              aria-label="Sort"
            >
              <option value="az">A–Z</option>
            </select>
            {selectedCats.length > 0 && (
              <button
                onClick={clearFilters}
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Category bubbles */}
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto py-1">
            {allCategories.map((c) => (
              <Pill
                key={c}
                selected={selectedCats.some((x) => slug(x) === slug(c))}
                onClick={() => toggleCat(c)}
              >
                {c}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="mt-6 text-sm text-neutral-600">Loading…</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <article key={r.key} className="group rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              {/* 30×30 placeholder (or future image) */}
              <div className="flex items-center gap-3">
                <div className="h-[30px] w-[30px] shrink-0 overflow-hidden rounded bg-neutral-100">
                  {r.image ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img src={r.image} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <h3 className="min-w-0 truncate text-lg font-semibold leading-snug">
                  {r.link ? (
                    <a
                      href={r.link}
                      target={CONFIG.site.openLinksInNewTab ? "_blank" : undefined}
                      rel="noreferrer noopener"
                      className="hover:underline"
                    >
                      {r.title}
                    </a>
                  ) : (
                    r.title
                  )}
                </h3>
              </div>

              <p className="mt-3 text-sm text-neutral-700">{r.description}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {r.categories.map((c) => (
                  <span
                    key={`${r.key}-${c}`}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-700"
                  >
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