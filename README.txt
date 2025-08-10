Novo Ropstvo — Language Switcher Package
========================================

This package adds a language switcher to all your HTML pages and ships the JS file.

Files included:
- js/lang-switcher.js          (v3)
- scripts/patch_lang_switcher.py
- README.txt

How to use (safe patch):
1) Unzip into your project root (so that `js/` and `scripts/` land there).
2) Run the patcher from the project root:
   python3 scripts/patch_lang_switcher.py index.html index_en.html index_cz.html \
       galerija.html galerija_en.html galerija_cz.html \
       placanje.html placanje_en.html placanje_cz.html \
       kontakt.html kontakt_en.html kontakt_cz.html

   The script:
   - Creates .bak backups next to each file.
   - Inserts the language switcher <nav> and <script src="./js/lang-switcher.js?v=3" defer> 
     inside <header>, right after your main <nav class="nav">.
   - Skips files that already have the switcher or are missing anchors.

3) Commit & push.

Manual insertion (if you prefer):
---------------------------------
Paste this block inside <header>, right after your main <nav class="nav">…</nav>:
  
  <!-- Jezički preklopnik -->
  <nav style="position:fixed;top:12px;right:16px;display:flex;gap:10px;font-size:14px">
    <a href="#" data-lang="sr" title="Srpski">SR</a>
    <a href="#" data-lang="en" title="English">EN</a>
    <a href="#" data-lang="cz" title="Česky">CZ</a>
  </nav>
  <script src="./js/lang-switcher.js?v=3" defer></script>

Notes
-----
- Keep `lang-switcher.js` at `./js/lang-switcher.js` for the path in the block above to work.
- Because the script is `defer`, it's safe to place it inside <header>.
- If your project path differs, adjust relative paths accordingly.
