// /api/sheet-proxy.js — tiny fetcher with CDN caching
export default async function handler(req, res) {
  try {
    const url = req.query.url;
    if (!url || typeof url !== "string") {
      res.status(400).send("Missing url");
      return;
    }
    const r = await fetch(url, { cache: "no-store" });
    const text = await r.text();
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).send(String(e || "proxy error"));
  }
}
