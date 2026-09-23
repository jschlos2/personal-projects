/* =====================================================================
   BEYOND THE PRODUCT — gallery renderer, detail view, iframe helpers
   You shouldn't need to edit this file to add work — edit projects.js.
   ===================================================================== */
(function () {
  "use strict";

  const allProjects = Array.isArray(window.projects) ? window.projects : (typeof projects !== "undefined" ? projects : []);
  // Pieces marked `hidden: true` in projects.js stay in the file but don't appear on the page.
  const data = allProjects.filter((p) => !p.hidden);
  const root = document.documentElement;
  const gallery = document.getElementById("gallery");
  const dialog = document.getElementById("detail");

  /* ---------------------------------------------------------------
     1. EMBED DETECTION
     Inside an iframe → hide rails and start reporting height to the parent.
     Override with ?embed=1 or ?embed=0 in the URL.
     --------------------------------------------------------------- */
  const params = new URLSearchParams(location.search);
  let embedded;
  try { embedded = window.self !== window.top; } catch (e) { embedded = true; }
  if (params.get("embed") === "1") embedded = true;
  if (params.get("embed") === "0") embedded = false;
  if (embedded) root.classList.add("is-embedded");

  /* Keep the footer year current */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------------------------------------------------------------
     2. HELPERS
     --------------------------------------------------------------- */
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false || v === "") continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "style") node.setAttribute("style", v);
      else node.setAttribute(k, v === true ? "" : v);
    }
    (Array.isArray(children) ? children : [children]).forEach((c) => c && node.append(c));
    return node;
  };

  const DEFAULT_RATIO = { portrait: "4 / 5", landscape: "4 / 3", square: "1 / 1" };

  const ratioOf = (item) => item.aspectRatio || DEFAULT_RATIO[item.orientation] || "4 / 5";

  const ratioNumber = (r) => {
    const [w, h] = String(r).split("/").map((n) => parseFloat(n));
    return w && h ? w / h : 0.8;
  };

  // Orientation drives feature width. Very tall pieces get a narrower column.
  const orientationOf = (item) => {
    const n = ratioNumber(ratioOf(item));
    if (n < 0.68) return "tall";
    if (n < 0.95) return "portrait";
    if (n <= 1.05) return "square";
    return "landscape";
  };

  const metaLine = (item) => [item.category, item.year].filter(Boolean).join(" • ");

  const hasDetail = (item) => item.detail !== false;

  const markLoaded = (img) => {
    const done = () => img.classList.add("is-loaded");
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  };

  /* ---------------------------------------------------------------
     3. BUILD ONE PIECE
     --------------------------------------------------------------- */
  function buildWork(item, index, sizes) {
    const orientation = orientationOf(item);
    const interactive = hasDetail(item) || !!item.url;

    const img = el("img", {
      src: item.coverImage,
      srcset: item.coverSrcset,
      sizes: item.coverSrcset ? sizes : undefined,
      alt: item.alt || item.title,
      loading: index < 2 ? "eager" : "lazy",
      decoding: "async",
      fetchpriority: index === 0 ? "high" : undefined,
    });
    markLoaded(img);

    const media = el("div", { class: "work__media", style: `--ar: ${ratioOf(item)}` }, img);

    // The title holds the single interactive control; its ::after covers the whole piece.
    let titleInner = document.createTextNode(item.title);
    let moreLabel = null;
    if (hasDetail(item)) {
      titleInner = el("button", {
        type: "button",
        class: "work__open",
        "data-open": item.id,
        "aria-haspopup": "dialog",
        text: item.title,
      });
      moreLabel = el("span", { class: "work__more", "aria-hidden": "true", text: "View piece +" });
    } else if (item.url) {
      titleInner = el("a", { class: "work__open", href: item.url, target: "_blank", rel: "noopener noreferrer" }, [
        document.createTextNode(item.title),
        el("span", { class: "visually-hidden", text: " (opens in a new tab)" }),
      ]);
      moreLabel = el("span", { class: "work__more", "aria-hidden": "true", text: "Visit ↗" });
    }

    const caption = el("div", { class: "work__caption" }, [
      metaLine(item) ? el("p", { class: "work__meta", text: metaLine(item) }) : null,
      el("h3", { class: "work__title" }, titleInner),
      item.description ? el("p", { class: "work__desc", text: item.description }) : null,
      moreLabel,
    ]);

    return el(
      "article",
      {
        class: "work" + (interactive ? " is-interactive" : ""),
        id: `work-${item.id}`,
        "data-orientation": orientation,
      },
      [media, caption]
    );
  }

  /* ---------------------------------------------------------------
     4. COMPOSE EDITORIAL ROWS
     Default rhythm: feature → pair → feature (mirrored) → pair (inset) → …
     A project's `layout` field ("feature" | "pair" | "full") overrides the rhythm.
     --------------------------------------------------------------- */
  function renderGallery() {
    if (!gallery) return;
    gallery.querySelectorAll(".row").forEach((r) => r.remove());

    let i = 0;
    let beat = 0;        // position in the rhythm
    let featureCount = 0;
    let pairCount = 0;

    while (i < data.length) {
      const item = data[i];
      const next = data[i + 1];
      const wantsPair =
        item.layout === "pair" ||
        (!item.layout && beat % 2 === 1);
      const canPair = next && next.layout !== "feature" && next.layout !== "full";

      if (item.layout === "full") {
        const row = el("div", { class: "row row--full" }, buildWork(item, i, "(min-width: 1240px) 1088px, 92vw"));
        gallery.append(row);
        i += 1;
      } else if (wantsPair && canPair) {
        const a = ratioNumber(ratioOf(item));
        const b = ratioNumber(ratioOf(next));
        // Column widths proportional to aspect ratio → both pieces share a height,
        // and when their shapes differ a lot the second one drops by --stagger.
        const row = el("div", {
          class: "row row--pair" + (pairCount % 2 === 1 ? " is-inset" : "") +
            (Math.max(a, b) / Math.min(a, b) > 1.35 ? " is-staggered" : ""),
          style: `--cols: ${a.toFixed(3)}fr ${b.toFixed(3)}fr`,
        }, [
          buildWork(item, i, "(min-width: 810px) 50vw, 100vw"),
          buildWork(next, i + 1, "(min-width: 810px) 50vw, 100vw"),
        ]);
        gallery.append(row);
        pairCount += 1;
        i += 2;
      } else {
        const row = el("div", {
          class: "row row--feature" + (featureCount % 2 === 1 ? " is-flipped" : ""),
        }, buildWork(item, i, "(min-width: 1240px) 700px, (min-width: 810px) 60vw, 100vw"));
        gallery.append(row);
        featureCount += 1;
        i += 1;
      }
      beat += 1;
    }
  }

  /* ---------------------------------------------------------------
     5. DETAIL VIEW
     --------------------------------------------------------------- */
  const $ = (id) => document.getElementById(id);
  const detailKicker = $("detail-kicker");
  const detailTitle = $("detail-title");
  const detailDesc = $("detail-desc");
  const detailMeta = $("detail-meta");
  const detailMedia = $("detail-media");
  const detailLink = $("detail-link");
  const prevBtn = dialog && dialog.querySelector("[data-prev]");
  const nextBtn = dialog && dialog.querySelector("[data-next]");

  const openable = () => data.filter(hasDetail);
  let current = -1;
  let lastTrigger = null;

  function fillDetail(item) {
    const list = openable();
    const pos = list.indexOf(item);
    detailKicker.textContent = "Beyond the Product";
    detailTitle.textContent = item.title;
    detailDesc.textContent = item.description || "";

    // meta list
    detailMeta.replaceChildren();
    [["Category", item.category], ["Year", item.year]].forEach(([k, v]) => {
      if (!v) return;
      detailMeta.append(el("dt", { text: k }), el("dd", { text: v }));
    });
    detailMeta.hidden = !detailMeta.children.length;

    // external link
    detailLink.replaceChildren();
    detailLink.hidden = !item.url;
    if (item.url) {
      detailLink.append(
        el("a", { href: item.url, target: "_blank", rel: "noopener noreferrer" }, [
          document.createTextNode((item.urlLabel || "View project") + " ↗"),
          el("span", { class: "visually-hidden", text: " (opens in a new tab)" }),
        ])
      );
    }

    // images
    detailMedia.replaceChildren();
    const hero = el("figure", { class: "detail__hero", style: `--ar: ${ratioOf(item)}` },
      el("img", {
        src: item.coverImage,
        srcset: item.coverSrcset,
        sizes: item.coverSrcset ? "(min-width: 1200px) 800px, 100vw" : undefined,
        alt: item.alt || item.title,
        decoding: "async",
      })
    );
    detailMedia.append(hero);

    const extras = (item.images || []).slice(0, 4);
    if (extras.length) {
      const wrap = el("div", { class: "detail__supporting" + (extras.length === 1 ? " is-single" : "") });
      extras.forEach((img) => {
        wrap.append(
          el("figure", { class: "detail__thumb", style: img.aspectRatio ? `--ar: ${img.aspectRatio}` : "" }, [
            el("img", { src: img.src, srcset: img.srcset, sizes: img.srcset ? "(min-width: 810px) 40vw, 100vw" : undefined, alt: img.alt || "", loading: "lazy", decoding: "async" }),
            img.caption ? el("figcaption", { text: img.caption }) : null,
          ])
        );
      });
      detailMedia.append(wrap);
    }

    // pager
    const prev = list[pos - 1];
    const next = list[pos + 1];
    prevBtn.hidden = !prev;
    nextBtn.hidden = !next;
    if (prev) prevBtn.setAttribute("aria-label", `Previous: ${prev.title}`);
    if (next) nextBtn.setAttribute("aria-label", `Next: ${next.title}`);
    current = data.indexOf(item);
    dialog.scrollTop = 0;
  }

  // When the iframe is sized to its full content (no internal scroll), the dialog's
  // "viewport" is the entire page — so anchor the panel beside the clicked piece.
  function anchorIfTall(trigger) {
    const tallFrame = embedded && document.documentElement.scrollHeight <= window.innerHeight + 4;
    dialog.classList.toggle("is-anchored", tallFrame);
    if (tallFrame && trigger) {
      const article = trigger.closest(".work") || trigger;
      const top = Math.max(16, article.getBoundingClientRect().top - 24);
      dialog.style.setProperty("--anchor-top", `${Math.round(top)}px`);
      dialog.style.setProperty("--media-max-h", "860px");
    } else {
      dialog.style.removeProperty("--anchor-top");
      dialog.style.removeProperty("--media-max-h");
    }
    return tallFrame;
  }

  function openDetail(id, trigger) {
    const item = data.find((p) => p.id === id);
    if (!item || !dialog) return;
    lastTrigger = trigger || document.activeElement;
    fillDetail(item);
    const tall = anchorIfTall(lastTrigger);

    if (!dialog.open) {
      if (!tall) {
        // compensate for the scrollbar so the page doesn't jump
        const sw = window.innerWidth - document.documentElement.clientWidth;
        if (sw > 0) document.body.style.paddingRight = sw + "px";
        root.classList.add("is-locked");
      }
      dialog.showModal();
    }
    dialog.querySelector("[data-close]").focus({ preventScroll: tall });

    if (!embedded && history.replaceState) history.replaceState(null, "", "#" + id);
  }

  function closeDetail() {
    if (dialog && dialog.open) dialog.close();
  }

  function step(dir) {
    const list = openable();
    const pos = list.indexOf(data[current]);
    const target = list[pos + dir];
    if (!target) return;
    fillDetail(target);
    // keep focus on the pager button that was used (or the close button if it disappeared)
    const btn = dir < 0 ? prevBtn : nextBtn;
    (btn.hidden ? dialog.querySelector("[data-close]") : btn).focus({ preventScroll: true });
    lastTrigger = document.querySelector(`[data-open="${target.id}"]`) || lastTrigger;
    if (!embedded && history.replaceState) history.replaceState(null, "", "#" + target.id);
  }

  if (dialog) {
    // Clean up after ANY close (button, Escape, backdrop)
    dialog.addEventListener("close", () => {
      root.classList.remove("is-locked");
      document.body.style.paddingRight = "";
      if (!embedded && history.replaceState) history.replaceState(null, "", location.pathname + location.search);
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus({ preventScroll: embedded });
    });

    // Click outside the panel closes
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) closeDetail();
    });

    dialog.querySelector("[data-close]").addEventListener("click", closeDetail);
    prevBtn.addEventListener("click", () => step(-1));
    nextBtn.addEventListener("click", () => step(1));

    dialog.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    });
  }

  // Event delegation for gallery triggers
  if (gallery) {
    gallery.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-open]");
      if (btn) openDetail(btn.getAttribute("data-open"), btn);
    });
  }

  /* ---------------------------------------------------------------
     6. IFRAME HEIGHT REPORTING
     Posts { type: "beyond-the-product:height", height } to the parent
     whenever the page height changes. The Framer code component in
     /framer listens for this and resizes itself — no nested scrollbar.
     Harmless when the page is opened directly.
     --------------------------------------------------------------- */
  function setupHeightReporting() {
    if (!embedded || window.parent === window) return;
    const page = document.getElementById("page");
    let last = 0;
    let raf = 0;
    const post = () => {
      raf = 0;
      // Measure content, not the viewport, so the iframe can also shrink.
      const h = Math.ceil(page.getBoundingClientRect().height);
      if (Math.abs(h - last) < 2) return;
      last = h;
      window.parent.postMessage({ type: "beyond-the-product:height", height: h }, "*");
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(post); };

    if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(page);
    window.addEventListener("load", schedule);
    window.addEventListener("resize", schedule);
    document.fonts && document.fonts.ready.then(schedule);
    gallery.addEventListener("load", schedule, true); // image loads bubble in capture phase
    schedule();

    // Parent can ask for the current height (e.g. after it mounts)
    window.addEventListener("message", (e) => {
      if (e.data && e.data.type === "beyond-the-product:request-height") { last = 0; schedule(); }
    });
  }

  /* ---------------------------------------------------------------
     6b. LINKS BACK TO THE PORTFOLIO FROM INSIDE AN IFRAME
     target="_top" works in a normal iframe, but Framer (and its preview)
     can sandbox embeds so the iframe isn't allowed to navigate the page.
     When the Framer code component is hosting us, it says hello; after that
     we ask IT to navigate (it lives on the Framer page, so it's allowed).
     --------------------------------------------------------------- */
  function setupPortfolioLinks() {
    if (!embedded || window.parent === window) return;
    let hostCanNavigate = false;

    window.addEventListener("message", (e) => {
      if (e.source !== window.parent || !e.data) return;
      const t = e.data.type;
      if (t === "beyond-the-product:hello" || t === "beyond-the-product:request-height") hostCanNavigate = true;
    });

    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest('a[target="_top"]');
      if (!a || !hostCanNavigate) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const href = a.href;
      if (!/^https?:/i.test(href)) return; // leave mailto: etc. alone
      e.preventDefault();
      window.parent.postMessage({ type: "beyond-the-product:navigate", url: href }, "*");
    });
  }

  /* ---------------------------------------------------------------
     7. INIT
     --------------------------------------------------------------- */
  renderGallery();
  setupHeightReporting();
  setupPortfolioLinks();

  // Deep link: /#neon-tetra opens that piece (standalone only)
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash && data.some((p) => p.id === hash && hasDetail(p))) {
    const trigger = document.querySelector(`[data-open="${CSS.escape(hash)}"]`);
    requestAnimationFrame(() => openDetail(hash, trigger));
  }
})();
