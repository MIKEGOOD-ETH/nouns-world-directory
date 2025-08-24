# nouns-world-directory

Filterable directory pulling live data from a published Google Sheet.

## v14
- **Static scattered background logos** (no animation), spaced using jittered grid + min-distance checks for an aesthetic layout similar in spirit to Uniswap's token background.
- Sits *behind* opaque UI so logos only show in the whitespace.
- Keeps: full-width black header, border-2 chips, black logo fallback, mobile dropdown filters, tags under description, disclaimer.

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
Update `CONFIG.site.scatter` in `src/NounsDirectory.jsx`:
- `baseCell`: spacing scale (bigger = fewer items)
- `sizeMin` / `sizeMax`: logo size range
- `minGap`: minimum distance between centers
- `chancePerCell`: probability per grid cell
- `minCount` / `maxCount`: clamp the total
- `opacity`: logo opacity
- `seed`: deterministic layout

## Deploy
- Build: `npm run build`
- Output: `dist`
