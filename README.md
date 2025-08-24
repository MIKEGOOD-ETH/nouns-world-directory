# nouns-world-directory

Filterable directory pulling live data from a published Google Sheet.

## v11
- Replaced floating doodles with **static side art**: 2 on the left, 3 on the right (visible on lg+). Put files in `public/images/` as `resource-gif-1.gif` … `resource-gif-5.gif`.
- Chips now have **black text** with a **thick black border**; selected chips are **solid black** with white text.
- Card logo gracefully falls back to a **solid black** square if the image is missing or fails to load.
- Intro paragraph is **larger**, **centered**, and uses **bold** for key phrases.

## Deploy
- Build: `npm run build`
- Output: `dist`
