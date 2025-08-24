# nouns-world-directory

Filterable directory pulling live data from a published Google Sheet.

## v13
- **Scatter background art**: resource GIFs are placed randomly **throughout** the centered content area (behind categories & cards). As the page narrows, images naturally hide under solid-white UI.
- Kept: full-width black header (v12), border-2 chips, black logo fallback, mobile dropdown filters.

### Add your GIFs
Put these in `public/images/`:
```
resource-gif-1.gif
resource-gif-2.gif
resource-gif-3.gif
resource-gif-4.gif
resource-gif-5.gif
```

### Tuning
- Density: tweak `CONFIG.site.scatterDensity` (default 0.000009). Higher = more images.
- Max/min count: inside `BackgroundScatterArt` (clamped 8–45).

## Deploy
- Build: `npm run build`
- Output: `dist`
