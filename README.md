# nouns-world-directory

Filterable directory pulling live data from a published Google Sheet.

## v15
- **Static repeating gutters** (md+): Left uses a 2-image sequence, right uses a 3-image sequence.
- Semi-random positions: vertical steps between 360–480px with slight horizontal jitter; sizes 88–132px.
- No animation; sits behind the UI. If overlap occurs on smaller displays, cards/chips render above.
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
Edit `CONFIG.site.gutters` in `src/NounsDirectory.jsx`:
- `stepMin/stepMax` (vertical spacing), `sizeMin/sizeMax`, `jitterX`, `opacity`
- `gutterMinPx` (hide if too narrow), `showBreakpointPx` (md breakpoint)
- `seed` (deterministic layout)

## Deploy
- Build: `npm run build`
- Output: `dist`
