/* Portfolio app · Iben Guldbæk
   Router, i18n, theme handling, rendering and lightbox.
   No frameworks, no third-party requests. */
(() => {
  "use strict";

  const P = window.PORTFOLIO;
  const root = document.documentElement;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

  let lang = "da";
  let theme = "auto";
  let route = { name: "home", collection: null };

  /* ---------- i18n ---------- */

  function t(key, vars) {
    let s = (P.i18n[lang] && P.i18n[lang][key]) || P.i18n.da[key] || "";
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return s;
  }

  function applyI18n() {
    root.lang = lang;
    $$("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    $$("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    const lt = $("#lang-toggle");
    if (lt) { lt.textContent = lang === "da" ? "EN" : "DA"; }
    renderAboutPortrait();
    renderProjects();
    if (route.name === "collection" && route.collection) {
      renderCollection(route.collection);
    }
    updateTitle();
  }

  /* ---------- announcer ---------- */

  const announcer = $("#announcer");
  let announceTimer = null;

  function announceText(msg) {
    if (!announcer) { return; }
    announcer.textContent = "";
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(function () {
      announcer.textContent = msg;
    }, 80);
  }

  /* ---------- theme ---------- */

  const colorMQ = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(th, announce) {
    theme = th;
    const dark = th === "dark" || (th === "auto" && colorMQ.matches);
    root.setAttribute("data-theme", th);
    root.setAttribute("data-dark", dark ? "true" : "false");
    const toggle = $("#theme-toggle");
    if (toggle) {
      const sun = $(".icon-sun", toggle);
      const moon = $(".icon-moon", toggle);
      if (sun) { sun.hidden = !dark; }
      if (moon) { moon.hidden = dark; }
    }
    if (announce) { announceText(t("theme_now_" + th)); }
  }

  function onColorChange() {
    if (theme === "auto") { applyTheme("auto", false); }
  }

  if (colorMQ.addEventListener) { colorMQ.addEventListener("change", onColorChange); }

  /* ---------- placeholder art ---------- */

  function slotSVG(variant) {
    const v = ((variant % 6) + 6) % 6;
    const shapes = [
      '<circle class="ph-fill" cx="200" cy="140" r="52"></circle><path class="ph-line" d="M120 210 H280"></path>',
      '<rect class="ph-frame" x="110" y="70" width="180" height="140"></rect><rect class="ph-sq" x="248" y="162" width="30" height="30"></rect>',
      '<circle class="ph-ring" cx="170" cy="150" r="60"></circle><path class="ph-line" d="M90 90 Q200 60 310 100"></path>',
      '<path class="ph-line" d="M100 200 H300"></path><path class="ph-line" d="M100 90 H300"></path><circle class="ph-fill" cx="200" cy="145" r="30"></circle>',
      '<rect class="ph-sq" x="150" y="100" width="100" height="100"></rect><circle class="ph-ring" cx="200" cy="150" r="66"></circle>',
      '<path class="ph-line" d="M110 210 L290 90"></path><circle class="ph-fill" cx="150" cy="110" r="26"></circle>'
    ][v];
    return (
      '<svg class="ph" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect class="ph-bg" width="400" height="300"></rect>' +
      shapes +
      "</svg>"
    );
  }

  /* ---------- rendering ---------- */

  function renderAboutPortrait() {
    const host = $("#about-portrait");
    if (!host) { return; }
    const fig = document.createElement("figure");
    fig.className = "about-portrait";
    const holder = document.createElement("div");
    holder.className = "portrait-frame accent-0";
    holder.setAttribute("role", "img");
    holder.setAttribute("aria-label", t("portrait_alt"));
    holder.innerHTML = slotSVG(2);
    fig.appendChild(holder);
    host.innerHTML = "";
    host.appendChild(fig);
  }

  function renderProjects() {
    const grid = $("#projects-grid");
    if (!grid) { return; }
    grid.innerHTML = "";
    P.collections.forEach(function (c, i) {
      const card = document.createElement("article");
      card.className = "project-card accent-" + c.accent + " reveal";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "project-link";
      btn.setAttribute("aria-label", t("collection_aria", { title: c.title[lang] }));
      btn.innerHTML =
        '<span class="card-art">' + slotSVG(i + 1) + "</span>" +
        '<span class="card-body">' +
        '<span class="card-num">' + c.numeral + "</span>" +
        '<span class="card-title">' + c.title[lang] + "</span>" +
        '<span class="card-count">' + t("collection_count", { n: c.count }) + "</span>" +
        "</span>";
      btn.addEventListener("click", function () {
        window.location.hash = "#/collection/" + c.id;
      });
      card.appendChild(btn);
      grid.appendChild(card);
    });
    observeReveals();
  }

  function findCollection(id) {
    for (let i = 0; i < P.collections.length; i++) {
      if (P.collections[i].id === id) { return P.collections[i]; }
    }
    return null;
  }

  function renderCollection(id) {
    const c = findCollection(id);
    if (!c) {
      window.location.hash = "#/projects";
      return;
    }
    const body = $("#collection-body");
    body.classList.remove("accent-0", "accent-1", "accent-2", "accent-3");
    body.classList.add("accent-" + c.accent);
    body.innerHTML = "";

    const back = document.createElement("a");
    back.href = "#/projects";
    back.className = "back-link";
    back.textContent = t("back");

    const h1 = document.createElement("h1");
    h1.id = "collection-title";
    h1.textContent = c.title[lang];

    const lead = document.createElement("p");
    lead.className = "lead";
    lead.textContent = c.subtitle[lang];

    const grid = document.createElement("div");
    grid.className = "collection-grid";

    for (let i = 1; i <= c.count; i++) {
      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "slot reveal";
      slot.setAttribute("aria-label", t("slot_alt", { title: c.title[lang], i: i, n: c.count }));
      slot.innerHTML = slotSVG(i + c.accent);
      slot.addEventListener("click", function () {
        openLightbox(c, i);
      });
      grid.appendChild(slot);
    }

    body.appendChild(back);
    body.appendChild(h1);
    body.appendChild(lead);
    body.appendChild(grid);
    observeReveals();
  }

  /* ---------- lightbox ---------- */

  const lightbox = $("#lightbox");

  function openLightbox(c, index) {
    if (!lightbox) { return; }
    lightbox.className = "lightbox accent-" + c.accent;
    $("#lightbox-art").innerHTML = slotSVG(index + c.accent);
    $("#lightbox-caption").textContent = t("slot_alt", {
      title: c.title[lang], i: index, n: c.count
    });
    lightbox.showModal();
  }

  if (lightbox) {
    const closeBtn = $("#lightbox-close");
    if (closeBtn) { closeBtn.addEventListener("click", function () { lightbox.close(); }); }
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) { lightbox.close(); }
    });
  }

  /* ---------- reveal animations ---------- */

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let observer = null;

  function observeReveals() {
    const els = $$(".reveal:not(.revealed)");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("revealed"); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    }
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- router ---------- */

  function parseHash() {
    const h = window.location.hash.replace(/^#\/?/, "");
    const parts = h.split("/").filter(Boolean);
    if (parts.length === 0) { return { name: "home", collection: null }; }
    if (parts[0] === "about" || parts[0] === "projects" || parts[0] === "contact") {
      return { name: parts[0], collection: null };
    }
    if (parts[0] === "collection" && parts[1] && findCollection(parts[1])) {
      return { name: "collection", collection: parts[1] };
    }
    return { name: "projects", collection: null };
  }

  const ROUTE_PATH = {
    home: "/", about: "/about", projects: "/projects",
    contact: "/contact", collection: "/projects"
  };

  function routeLabel(r) {
    if (r.name === "collection") {
      const c = findCollection(r.collection);
      return c ? c.title[lang] : t("view_projects");
    }
    return t("view_" + r.name);
  }

  function updateTitle() {
    document.title = route.name === "home"
      ? t("doc_title")
      : t("doc_title") + " · " + routeLabel(route);
  }

  function router() {
    route = parseHash();
    $$(".view").forEach(function (v) {
      v.hidden = v.id !== "view-" + route.name;
    });
    $$(".site-nav a").forEach(function (a) {
      const p = a.getAttribute("data-route");
      if (p === ROUTE_PATH[route.name]) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
    if (route.name === "collection") {
      renderCollection(route.collection);
    }
    const view = $("#view-" + route.name);
    if (view) {
      view.setAttribute("tabindex", "-1");
      view.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
    announceText(routeLabel(route));
    updateTitle();
    closeMenu();
  }

  /* ---------- mobile menu ---------- */

  const menuBtn = $("#menu-toggle");
  const navWrap = $("#site-nav-wrap");

  function closeMenu() {
    if (!navWrap || !menuBtn) { return; }
    navWrap.classList.remove("nav-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  if (menuBtn && navWrap) {
    menuBtn.addEventListener("click", function () {
      const open = navWrap.classList.toggle("nav-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeMenu(); }
    });
    $$(".site-nav a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* ---------- init ---------- */

  function init() {
    try {
      lang = window.localStorage.getItem("ibg-lang") === "en" ? "en" : "da";
    } catch (e) { lang = "da"; }

    let stored = null;
    try { stored = window.localStorage.getItem("ibg-theme"); } catch (e) {}
    const th = stored === "light" || stored === "dark" ? stored : "auto";
    applyTheme(th, false);

    applyI18n();

    const lt = $("#lang-toggle");
    if (lt) {
      lt.addEventListener("click", function () {
        lang = lang === "da" ? "en" : "da";
        try { window.localStorage.setItem("ibg-lang", lang); } catch (e) {}
        applyI18n();
        announceText(t("lang_now"));
      });
    }

    const tt = $("#theme-toggle");
    if (tt) {
      tt.addEventListener("click", function () {
        const next = root.getAttribute("data-dark") === "true" ? "light" : "dark";
        try { window.localStorage.setItem("ibg-theme", next); } catch (e) {}
        applyTheme(next, true);
      });
    }

    window.addEventListener("hashchange", router);
    router();
    observeReveals();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
