<!-- /js/lang-switcher.js -->
<script>
(() => {
  const PAGES = ["index", "placanje", "galerija", "odlomak"]; // proširi po potrebi
  const LOCALES = ["sr","en","cz"];
  const LABELS  = { sr:"SR", en:"EN", cz:"CZ" };

  function parsePath() {
    const fn = (location.pathname.split("/").pop() || "index.html");
    const m = fn.match(/^(.+?)(?:_(en|cz))?\.html?$/i);
    let stem = "index", lang = "sr";
    if (m) {
      stem = m[1];
      lang = m[2] ? m[2].toLowerCase() : "sr";
    }
    if (!PAGES.includes(stem)) stem = "index"; // fallback
    return { stem, lang, filename: fn };
  }

  async function checkExists(url) {
    try {
      const r = await fetch(url, { method: "HEAD", cache: "no-cache" });
      return r.ok;
    } catch { return false; }
  }

  function buildUrl(stem, locale) {
    return locale === "sr" ? `./${stem}.html` : `./${stem}_${locale}.html`;
  }

  function injectStyle() {
    const css = `
      .lang-switcher{position:fixed;top:12px;right:12px;z-index:9999;
        display:flex;gap:6px;background:rgba(15,20,25,.85);backdrop-filter:blur(6px);
        border:1px solid #1f2a33;border-radius:999px;padding:6px 8px}
      .lang-switcher a,.lang-switcher button{
        font:600 13px/1 system-ui,Segoe UI,Roboto,Arial,sans-serif;
        color:#e8e8e8;text-decoration:none;border:0;background:transparent;
        padding:6px 10px;border-radius:999px;opacity:.9;cursor:pointer
      }
      .lang-switcher a:hover,.lang-switcher button:hover{opacity:1}
      .lang-switcher .active{background:#26313b}
      .lang-switcher .disabled{opacity:.35;cursor:not-allowed}
      @media (max-width:480px){.lang-switcher{top:8px;right:8px}}
    `;
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
  }

  function addHreflangLinks(available, stem) {
    // ukloni prethodne alternate ako ih ima (da ne dupliramo)
    [...document.querySelectorAll('link[rel="alternate"][hreflang]')].forEach(el => el.remove());
    for (const [loc, href] of Object.entries(available)) {
      const l = document.createElement("link");
      l.setAttribute("rel", "alternate");
      l.setAttribute("hreflang", loc === "sr" ? "sr" : loc);
      l.setAttribute("href", href);
      document.head.appendChild(l);
    }
    // x-default → sr
    const x = document.createElement("link");
    x.setAttribute("rel", "alternate");
    x.setAttribute("hreflang", "x-default");
    x.setAttribute("href", available.sr || buildUrl(stem,"sr"));
    document.head.appendChild(x);
  }

  async function init() {
    const { stem, lang } = parsePath();
    injectStyle();

    // izračunaj URL-ove za sve jezike i proveri postoje li
    const urls = Object.fromEntries(LOCALES.map(loc => [loc, buildUrl(stem, loc)]));
    const existence = Object.fromEntries(await Promise.all(
      LOCALES.map(async loc => [loc, await checkExists(urls[loc])])
    ));

    // izgradi mapu dostupnih za hreflang
    const available = {};
    for (const loc of LOCALES) if (existence[loc]) available[loc] = urls[loc];
    addHreflangLinks(available, stem);

    // UI
    const wrap = document.createElement("div");
    wrap.className = "lang-switcher";
    LOCALES.forEach(loc => {
      const exists = existence[loc];
      const isActive = (loc === lang);
      const el = exists ? document.createElement("a") : document.createElement("button");
      el.textContent = LABELS[loc];
      if (exists) el.href = urls[loc];
      if (isActive) el.classList.add("active");
      if (!exists && !isActive) el.classList.add("disabled");
      el.setAttribute("aria-label", `Promeni jezik na ${LABELS[loc]}`);
      wrap.appendChild(el);
    });
    document.body.appendChild(wrap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
</script>
