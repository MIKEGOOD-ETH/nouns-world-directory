# nouns-world-directory

Filterable directory pulling live data from a published Google Sheet.

## v18
- **Fixed, non-scrolling background art** placed at specific viewport positions. You can match your red marks exactly by tweaking the coordinates.
- Visible on mobile and desktop; always behind header and content; doesn't affect layout.
- Keeps: black header, border-2 chips, black logo fallback, mobile dropdown filters, tags under description, disclaimer.

### Where to edit the layout
Open `src/NounsDirectory.jsx` → `CONFIG.site.art`:

```js
art: {
  desktop: [
    { file: "/images/resource-gif-1.gif", leftVW: 3,  topVH: 18, size: 220 },
    { file: "/images/resource-gif-2.gif", rightVW: 4, topVH: 14, size: 170 },
    // ...
  ],
  mobile: [
    { file: "/images/resource-gif-1.gif", leftVW: 2, topVH: 22, size: 120 },
    // ...
  ],
  breakpoint: 1024
}
```

- Use `leftVW` or `rightVW` (in viewport-width %) and `topVH` (viewport-height %) plus `size` in px.
- Add/remove objects to change how many you want.
- Header stays on top thanks to a higher z-index; art sits in a `fixed` full-screen layer at `z-0`.

### Assets
Place in `public/images/`:
```
resource-gif-1.gif
resource-gif-2.gif
resource-gif-3.gif
resource-gif-4.gif
resource-gif-5.gif
```

## Deploy
- Build: `npm run build`
- Output: `dist`
