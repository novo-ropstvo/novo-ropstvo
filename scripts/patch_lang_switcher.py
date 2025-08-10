#!/usr/bin/env python3
"""Patches HTML files to add language switcher <nav> and <script src="./js/lang-switcher.js?v=3" defer> inside <header>.

Safety:
- Creates .bak backup next to each file before writing.
- Idempotent: if switcher already exists (looks for data-lang="sr"), it skips injection.
- Only modifies files that contain <header> and <nav class="nav"> to anchor.
"""
import sys, re, pathlib

SWITCHER_HTML = '''\
  <!-- Jezički preklopnik -->
  <nav style="position:fixed;top:12px;right:16px;display:flex;gap:10px;font-size:14px">
    <a href="#" data-lang="sr" title="Srpski">SR</a>
    <a href="#" data-lang="en" title="English">EN</a>
    <a href="#" data-lang="cz" title="Česky">CZ</a>
  </nav>
  <script src="./js/lang-switcher.js?v=3" defer></script>
'''.rstrip()

def patch_html(path: pathlib.Path) -> bool:
    html = path.read_text(encoding="utf-8", errors="ignore")
    if 'data-lang="sr"' in html or "data-lang='sr'" in html:
        return False  # already has switcher

    header_start = re.search(r"<header[^>]*>", html, re.IGNORECASE)
    if not header_start:
        return False
    nav_match = re.search(r"<nav\s+class=[\"']nav[\"'][\s\S]*?</nav>", html[header_start.end():], re.IGNORECASE)
    if not nav_match:
        return False
    insert_pos = header_start.end() + nav_match.end()

    new_html = html[:insert_pos] + "\n\n" + SWITCHER_HTML + "\n" + html[insert_pos:]

    bak = path.with_suffix(path.suffix + ".bak")
    bak.write_text(html, encoding="utf-8", errors="ignore")
    path.write_text(new_html, encoding="utf-8")
    return True

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/patch_lang_switcher.py <file1.html> [file2.html ...]")
        print("Tip: python3 scripts/patch_lang_switcher.py index.html index_en.html index_cz.html "
              "galerija.html galerija_en.html galerija_cz.html "
              "placanje.html placanje_en.html placanje_cz.html "
              "kontakt.html kontakt_en.html kontakt_cz.html")
        sys.exit(1)

    changed = 0
    for arg in sys.argv[1:]:
        p = pathlib.Path(arg)
        if not p.exists():
            print(f"[skip] not found: {p}")
            continue
        if p.suffix.lower() != ".html":
            print(f"[skip] not html: {p}")
            continue
        ok = patch_html(p)
        if ok:
            changed += 1
            print(f"[ok]  patched: {p}")
        else:
            print(f"[skip] unchanged (already has switcher or missing anchors): {p}")
    print(f"Done. Modified files: {changed}")

if __name__ == "__main__":
    main()
