# nouns-world-directory

Filterable directory pulling live data from a published Google Sheet.

## v19
- **Home link** now points to `https://nouns.world` (no `www`).
- **Favicon** uses your site header gif: `/nouns-world-globe.gif`.
- **Share image** added at `/resource-share.png` and Open Graph + Twitter tags included.
- **Share button** in the header uses the Web Share API (falls back to copying the URL).

### Where to put assets
- Put your GIF favicon at the project root `public/nouns-world-globe.gif` (same file you use in the header).
- The share image is already provided at `public/resource-share.png`. Replace it with your own if desired.

### Deploy
- Build: `npm run build`
- Output: `dist`
