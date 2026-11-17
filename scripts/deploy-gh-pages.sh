#!/usr/bin/env bash
set -euo pipefail

# Build production site into ./public (includes .nojekyll and /vikingo-v2/ subpath)
rm -rf public
hugo --gc --minify

# Push ./public to the gh-pages branch using a temporary git worktree/repo
cd public
git init -b gh-pages
git add -A
git commit -m "Deploy Hugo site to gh-pages"
git push -f git@github.com:ryan258/vikingo-v2.git gh-pages:gh-pages || \
  git push -f https://github.com/ryan258/vikingo-v2.git gh-pages:gh-pages
cd ..
rm -rf public
