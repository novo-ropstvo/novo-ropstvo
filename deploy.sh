#!/bin/bash

# Promeni ove vrednosti:
GITHUB_USERNAME="novo-ropstvo"
REPO_NAME="novo-ropstvo"
COMMIT_MSG="Automatski deploy sajta Novo Ropstvo"

# Inicijalizuj git ako već nije
if [ ! -d ".git" ]; then
  git init
  echo "Git repozitorijum inicijalizovan."
fi

# Dodaj remote ako nije dodat
if ! git remote | grep origin > /dev/null; then
  git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git
  echo "Remote origin dodat."
fi

# Dodaj sve fajlove i commituj
git add .
git commit -m "$COMMIT_MSG"

# Postavi main granu ako nije
git branch -M main

# Pushuj na GitHub
git push -u origin main

echo "Deploy završen. Sada idi na GitHub repozitorijum, Settings -> Pages i aktiviraj GitHub Pages."
