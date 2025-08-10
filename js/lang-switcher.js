// js/lang-switcher.js  (v3)
// Keeps user on the same page while switching SR/EN/CZ
(function () {
  // Map equivalent files per language
  const MAP = {
    "index.html":     { sr:"index.html",      en:"index_en.html",     cz:"index_cz.html" },
    "galerija.html":  { sr:"galerija.html",   en:"galerija_en.html",  cz:"galerija_cz.html" },
    "placanje.html":  { sr:"placanje.html",   en:"placanje_en.html",  cz:"placanje_cz.html" },
    "kontakt.html":   { sr:"kontakt.html",    en:"kontakt_en.html",   cz:"kontakt_cz.html" },
    "kod.html":       { sr:"kod.html",        en:"kod.html",          cz:"kod.html" }
  };

  const current = window.location.pathname.split("/").pop() || "index.html";

  function resolveKey(file) {
    if (MAP[file]) return file;
    if (file.endsWith("_en.html")) {
      const base = file.replace("_en.html", ".html");
      if (MAP[base]) return base;
    }
    if (file.endsWith("_cz.html")) {
      const base = file.replace("_cz.html", ".html");
      if (MAP[base]) return base;
    }
    return "index.html";
  }

  const key = resolveKey(current);

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-lang]");
    if (!a) return;
    e.preventDefault();
    const lang = a.getAttribute("data-lang"); // "sr" | "en" | "cz"
    const entry = MAP[key] || MAP["index.html"];
    const target = entry[lang] || entry.sr;
    const parts = window.location.pathname.split("/");
    parts[parts.length - 1] = target;
    const url = parts.join("/") + window.location.search + window.location.hash;
    window.location.href = url;
  });
})();