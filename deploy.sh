#!/bin/bash
set -e
echo "Building..."
npm run build
echo "Deploying to gh-pages..."
TMPDIR=$(mktemp -d)
cp -r dist/* "$TMPDIR/"
cd "$TMPDIR"
touch .nojekyll
git init
git config user.email "dev@pet-adoption.local"
git config user.name "Developer"
git add -A
git commit -m "deploy: $(date +%Y-%m-%d_%H:%M:%S)"
git remote add origin https://github.com/ahuang-app/pet-adoption-platform.git
git push origin HEAD:gh-pages --force
rm -rf "$TMPDIR"
echo "Deployed! Visit https://ahuang-app.github.io/pet-adoption-platform/"
