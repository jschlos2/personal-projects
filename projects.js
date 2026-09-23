/* =====================================================================
   BEYOND THE PRODUCT — PROJECT DATA
   =====================================================================

   ➜ TO ADD NEW ARTWORK:
     1. Put the image(s) in a new folder:  assets/work/<your-project-slug>/
     2. Copy one of the objects below, paste it where you want it to
        appear in the gallery (order here = order on the page), and edit it.
     That's it. The layout, captions and detail view are generated for you.

   FIELDS
     id            (required) short unique slug, e.g. "neon-tetra". Also used for
                   share links: …/index.html#neon-tetra opens that piece.
     title         (required)
     category      (required) short label, e.g. "Illustration + editorial design"
     year          (optional) e.g. "2025"
     description   (required) one or two sentences.
     coverImage    (required) path to the main artwork, RELATIVE (no leading "/").
     coverSrcset   (optional) responsive versions, e.g.
                   "assets/work/x/cover-800.jpg 800w, assets/work/x/cover-1600.jpg 1600w"
     aspectRatio   (recommended) width / height of the cover, e.g. "5 / 7".
                   Prevents layout shift and drives the editorial layout.
                   If omitted, it is guessed from `orientation`.
     orientation   (optional) "portrait" | "landscape" | "square"
     alt           (required) describe what the artwork looks like.
     images        (optional) 0–4 supporting images for the detail view:
                   [{ src, alt, aspectRatio, srcset?, caption? }]
     url           (optional) external link (Dribbble, contest page, shop…)
     urlLabel      (optional) link text, defaults to "View project"
     layout        (optional) force a layout: "feature" (large, caption beside),
                   "pair" (sits next to the following piece) or "full" (full width).
                   Leave it out and the gallery alternates feature / pair rows.
     detail        (optional) set to false to disable the larger view for a piece.
     hidden        (optional) set to true to keep a piece off the page while it's in
                   progress. Delete the line (or set false) when it's ready to show.

   IMAGE TIPS
     • Export JPG/WebP around 1600px on the long edge for covers (~200–400 KB).
     • Optional smaller 800px version for coverSrcset keeps mobile fast.
     • ⚠ Lines marked PLACEHOLDER still point to stand-in .svg files — swap them for your real artwork.
   ===================================================================== */

const projects = [
  {
    id: "birthtoberfest",
    title: "Birthtoberfest",
    category: "Event identity + illustration",
    year: "2026",
    description:
      "A first-birthday invitation and digital event identity inspired by Oktoberfest graphics, vintage print ephemera and playful family event design.",
    coverImage: "assets/work/birthtoberfest/cover-1500.jpg",
    coverSrcset: "assets/work/birthtoberfest/cover-800.jpg 800w, assets/work/birthtoberfest/cover-1500.jpg 1500w",
    aspectRatio: "5 / 7",
    alt: "Cream Oktoberfest-style invitation framed by blue diamond borders. Arched blue and gold lettering reads “Birthtoberfest” over a gold ribbon saying “Prost to One Year!”, above an illustrated stein marked with a 1, a salted pretzel, green leaves and an edelweiss flower.",
    images: [],
    url: "",
  },

  {
    id: "graduation-invitation",
    title: "Graduation Invitation",
    category: "Invitation + graphic design",
    year: "",                                                         // ← add year
    description:
      "A graduation party invitation inspired by vintage travel postcards. Instead of caps and gowns, it leans into the feeling of a classic end-of-summer-camp party, with margaritas, walking tacos and a slip ’n slide to celebrate finishing my Human Systems Engineering degree.",
    coverImage: "assets/work/graduation-invitation/cover-1600.jpg",
    coverSrcset: "assets/work/graduation-invitation/cover-800.jpg 800w, assets/work/graduation-invitation/cover-1600.jpg 1600w",
    aspectRatio: "1600 / 1236",
    alt: "Postcard-style graduation invitation. Script lettering reads “Wish you were here! …because there’s margaritas, walking tacos, and a slip ’n slide” across a blue sky with puffy clouds, above a green hill with a long slip ’n slide, a garden hose and a flowering bush.",
    images: [],
    url: "",
  },

  {
    id: "neon-tetra",
    title: "Neon Tetra",
    category: "Illustration · Daedalus Studios fish design contest",
    year: "",
    description:
      "A fish illustration developed for a Daedalus Studios design contest. The concept plays with the name “neon tetra” by interpreting the fish through the visual language of actual neon signage.",
    coverImage: "assets/work/neon-tetra/cover-1600.jpg",
    coverSrcset: "assets/work/neon-tetra/cover-800.jpg 800w, assets/work/neon-tetra/cover-1600.jpg 1600w",
    aspectRatio: "4 / 3",
    alt: "A dark neon tetra fish swimming through deep teal water among bubbles and kelp, its blue, green and red stripes drawn as glowing neon sign tubing.",
    images: [],
    url: "",
  },

  {
    id: "crab-battle",
    title: "Crab Battle",
    category: "Poster + illustration",
    year: "",
    description:
      "A kaiju-inspired, fight-night style poster that pits the Chesapeake blue crab against Oregon’s Dungeness crab like two monsters squaring off. It pairs hand-drawn crab illustrations with bold promo typography and a tongue-in-cheek call to action.",
    coverImage: "assets/work/crab-battle/cover-1400.jpg",
    coverSrcset: "assets/work/crab-battle/cover-800.jpg 800w, assets/work/crab-battle/cover-1400.jpg 1400w",
    aspectRatio: "1400 / 2163",
    alt: "Fight-poster style illustration titled “Crab Battle.” A diagonal split divides a blue field holding a hand-drawn blue crab from a rust-brown field holding a purple Dungeness crab, each with its stats, and a “VS” between them. The bottom reads “Order blue crab tonight.”",
    images: [],
    url: "",
  },

  {
    id: "tamagoyaki-recipe",
    hidden: true,                                                     // ← work in progress — delete this line to publish
    title: "Tamagoyaki Recipe Illustration",
    category: "Illustration + editorial design",
    year: "",
    description:
      "A printable illustrated recipe influenced by 1980s home cooking books, Japanese food illustration and kitschy retro print design.",
    coverImage: "assets/work/tamagoyaki-recipe/cover.svg",            // ← PLACEHOLDER
    aspectRatio: "17 / 22",
    alt: "Printable illustrated tamagoyaki recipe page in a retro 1980s cookbook style. [Replace]",
    images: [
      {
        src: "assets/work/tamagoyaki-recipe/detail-01.svg",           // ← PLACEHOLDER
        alt: "Detail of the illustrated rolled omelet. [Replace]",
        aspectRatio: "1 / 1",
      },
      {
        src: "assets/work/tamagoyaki-recipe/detail-02.svg",           // ← PLACEHOLDER
        alt: "Step-by-step illustrations from the recipe. [Replace]",
        aspectRatio: "4 / 5",
      },
    ],
    url: "",
  },

  /* ─────────────────────────────────────────────────────────────
     ➜ ADD NEW WORK HERE (copy this template, remove the comment marks)

  {
    id: "my-new-piece",
    title: "My New Piece",
    category: "Typography study",
    year: "2026",
    description: "One or two sentences about what you explored.",
    coverImage: "assets/work/my-new-piece/cover.jpg",
    aspectRatio: "4 / 5",
    alt: "Describe what the artwork looks like.",
    images: [],
    url: "",
  },
  ───────────────────────────────────────────────────────────── */
];
