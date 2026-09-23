# Beyond the Product

A curated gallery of personal, experimental and self-initiated visual work. It's another room in
[Jennifer Robertson's portfolio](https://jennifer-robertson-ux.framer.website). It runs as a static
GitHub Pages site and can be embedded in Framer.

```
beyond-the-product/
├── index.html                  ← header, intro, return panel, footer, detail dialog
├── styles.css                  ← the whole visual system (tokens at the top)
├── projects.js                 ← ★ YOUR ARTWORK LIST — the only file you edit to add work
├── script.js                   ← builds the gallery, detail view and iframe height sync
├── .nojekyll                   ← tells GitHub Pages to serve files as-is
├── assets/
│   └── work/
│       ├── graduation-invitation/  cover.svg, detail-01.svg         ← placeholders
│       ├── birthtoberfest/         cover.svg, detail-01/02.svg      ← placeholders
│       ├── neon-tetra/             cover.svg, detail-01.svg         ← placeholders
│       └── tamagoyaki-recipe/      cover.svg, detail-01/02.svg      ← placeholders
└── framer/
    └── BeyondTheProductEmbed.tsx   ← optional Framer code component (auto height)
```

---

## 1. Replace the placeholders

Every image in `assets/work/` is a labeled placeholder SVG. For each project:

1. Export the artwork as **JPG or WebP, about 1600px on the long edge** (aim for under ~400 KB).
2. Put it in the project's folder, e.g. `assets/work/neon-tetra/cover.jpg`.
3. In `projects.js`, change `coverImage` to the new file and set `aspectRatio` to the artwork's real
   width / height. For example, a 2400×3000 export is `"4 / 5"`, and so is `"2400 / 3000"`.
4. Rewrite the `alt` text to describe what the piece actually looks like.
5. Fill in `year` if you want it shown.

Optional: for faster mobile loading, also export an 800px version and add
`coverSrcset: "assets/work/neon-tetra/cover-800.jpg 800w, assets/work/neon-tetra/cover.jpg 1600w"`.

## 2. Add new artwork

1. Create `assets/work/<new-slug>/` and add the image(s).
2. Open `projects.js`, copy the template at the bottom of the array and fill it in.

The list order is the page order. The gallery alternates **feature** rows (one large piece with the
caption beside it, mirrored every other time) and **pair** rows (two pieces sized to share a height,
with the second offset lower). To control one piece's placement, add `layout: "feature"`,
`layout: "pair"` or `layout: "full"`.

The detail view shows up to 4 supporting images from `images: [...]`. A project with no extra images
works fine. Add `url` to show an external link. Add `detail: false` to turn off the larger view.

Share links work too: `…/beyond-the-product/#neon-tetra` opens that piece directly.

## 3. Deploy to GitHub Pages

1. Create a **public** repository on GitHub, for example `beyond-the-product`.
2. Upload everything in this folder to the repo root: on GitHub use **Add file → Upload files**,
   or run `git init && git add . && git commit -m "Beyond the Product" && git push`.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**,
   branch **main**, folder **/ (root)**, then **Save**.
4. After a minute or two the site is live at
   `https://<your-username>.github.io/beyond-the-product/`.

All asset paths are relative, so nothing breaks under the `/beyond-the-product/` sub-path.
To update the site, push a change (or upload the file again). Pages redeploys automatically.

## 4. Embed in Framer

### Option A (recommended): auto-height code component, no inner scrollbar

When the page runs inside an iframe, it posts its height to the parent. This component listens for
that message and resizes itself, so the gallery scrolls with the Framer page like native content.

1. In Framer, open **Assets → Code → + → New code file**, name it `BeyondTheProductEmbed`, and paste in
   `framer/BeyondTheProductEmbed.tsx`.
2. Create a new page in Framer, for example `/beyond-the-product`.
3. Drag the component onto the page. Set **Width: Fill** and **Height: Fit**.
4. In the component's properties, paste your GitHub Pages URL into **Page URL**.
5. Place it **full-bleed** as its own section, not inside a padded stack. The embed brings its own
   header, footer and side padding. It hides its checkerboard rails when embedded, because your
   Framer page already draws them.

To link to it from your Framer nav or footer, add a normal link to `/beyond-the-product`.

### Option B: Framer's built-in Embed (URL)

Insert **Embed**, choose **URL** and paste the GitHub Pages URL. Framer's Embed has a fixed height, so:

* Set the height to the page's full height so there is no inner scrollbar. Open the GitHub Pages URL,
  run `document.getElementById("page").offsetHeight` in the browser console, and add a little buffer.
  Do this for each breakpoint.
* You'll need to raise that number every time you add work. That's why Option A is recommended.
* If the height is too small, the iframe scrolls inside itself. It still works, but you get a nested
  scrollbar.

### How the page adapts inside an iframe

* It detects the iframe automatically. You can force the behavior with `?embed=1` or `?embed=0` on the URL.
* The checkerboard rails are hidden.
* Its height is posted as `{ type: "beyond-the-product:height", height }` after load, font load,
  image loads and resizes.
* The detail view is anchored next to the clicked piece. A full-height iframe has no viewport of its
  own, so a centered modal could otherwise open off-screen.

## 5. Links that leave the iframe

Every link back to the portfolio (wordmark, nav, breadcrumb, return buttons, footer) already has
`target="_top"`. That navigates the whole browser tab instead of loading Framer inside the iframe.
If you add a portfolio link later, include it the same way:

```html
<a href="https://jennifer-robertson-ux.framer.website/#work" target="_top">Work</a>
```

* External links (LinkedIn, project URLs) use `target="_blank" rel="noopener noreferrer"`.
* Email uses `mailto:` with `target="_top"` so it opens the mail app reliably from inside the iframe.
* Framer's own **Embed** sandbox allows top navigation. If you ever wrap the iframe in your own
  `sandbox` attribute, include `allow-top-navigation-by-user-activation allow-popups allow-scripts allow-same-origin`.

If your Framer nav changes (new page, renamed anchor), update both `<nav>` blocks in `index.html`.

## 6. Where to tune the visual system

Everything lives in the `:root` block at the top of `styles.css`. The values were measured from the
live Framer site at 1440px.

| Token | Value | Framer source |
|---|---|---|
| `--color-bg` | `#4E7FCB` | page blue |
| `--color-surface` | `rgba(35,70,125,.38)` | project card panel |
| `--color-surface-strong` | `#2B4F84` | "View work" button |
| `--color-text` | `#F5F0E8` | headings and links |
| `--color-text-muted` | `rgba(255,255,255,.86)` | body copy (Framer uses `.76`, see note) |
| `--color-accent` | `#D6FF3F` | lime project meta |
| `--color-accent-soft` | `#769BD2` | "Let's talk" button text and checker tiles |
| `--font-display` / `--font-text` | Teko / Inter | same fonts, via Google Fonts |
| `--frame-max` / `--frame-pad` | 1240 / 76px | 1088px content column |
| `--radius-media` / `-card` / `-shell` | 22 / 28 / 32px | artwork, cards, panels |

* **Fonts:** Teko and Inter are free Google Fonts, so they're loaded directly. No substitutes are
  needed. If you change fonts in Framer, update the `<link>` in `index.html` and `--font-display` /
  `--font-text`.
* **Contrast note:** light text on `#4E7FCB` is about 3.5:1. That passes WCAG AA for large text
  (all the Teko headings) but not for small body copy. That's why muted text is raised from `.76` to
  `.86`. For full AA on body text, a slightly deeper blue such as `#3F6DB8` would help across the
  whole portfolio.
* **Breakpoints:** tablet ≤1199px and mobile ≤809px, matching Framer's defaults. Each breakpoint
  overrides the tokens in its own `:root` block.
* **Rhythm:** `--row-gap` (space between gallery rows) and `--stagger` (offset in pair rows).

## 7. Accessibility and performance checklist

* Semantic landmarks, breadcrumb, one `h1`, and headings in order.
* Each piece has one tab stop. The native `<dialog>` handles Escape, keeps focus inside and makes the
  page behind it inert. Clicking outside closes it, ←/→ move between pieces, and focus returns to
  the piece you opened.
* Lime focus rings are visible on the blue background. `prefers-reduced-motion` turns off all motion.
* No frameworks and no dependencies. Images below the first two lazy-load, and every image reserves
  its space with `aspect-ratio`, so nothing shifts as they load.
