(function(){
  const map = {
    sr: { suffix: "",   sep: "",    },
    en: { suffix: "_en",sep: "_",   },
    cz: { suffix: "_cz",sep: "_",   }
  };

  function targetFor(lang, href){
    try{
      const url = new URL(href, location.href);
      const file = url.pathname.split("/").pop() || "index.html";
      const name = file.replace(/\.html?$/i, "");

      const base = name
        .replace(/_(en|cz)$/i, "")        // skini jezički sufiks ako postoji
        || "index";

      const tgt = base + (map[lang].suffix || "") + ".html";
      url.pathname = url.pathname.replace(/[^/]*$/,"") + tgt;
      return url.toString();
    }catch(_){ return href; }
  }

  function wire(){
    document.querySelectorAll('nav a[data-lang]').forEach(a=>{
      const lang = a.getAttribute('data-lang');
      a.setAttribute('href', targetFor(lang, location.href));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else wire();
})();
