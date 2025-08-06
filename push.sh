#!/bin/bash
cd /home/marjan/novo-ropstvo-sajt || exit

# Inicijalizacija i povezivanje
git init
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/novo-ropstvo/novo-ropstvo.git

# Povuci poslednje izmene sa GitHub-a
git pull origin main --rebase 2>/dev/null || true

# Dodaj i pošalji izmene
git add .
git commit -m "Ažuriranje sajta $(date '+%Y-%m-%d %H:%M:%S')"
git branch -M main
git push -u origin main
#!/bin/bash
cd /home/marjan/novo-ropstvo-sajt || exit

git init
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/novo-ropstvo/novo-ropstvo.git

git add .
git commit -m "Ažuriranje sajta $(date '+%Y-%m-%d %H:%M:%S')"

git branch -M main
git push -u origin main
