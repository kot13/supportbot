#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "Deploying supportbot at $(pwd) (commit: $(git rev-parse --short HEAD))"

git fetch origin main
git reset --hard origin/main

npm ci
npm run build
npm run db:migrate

if ! command -v pm2 >/dev/null 2>&1; then
  echo "ERROR: pm2 not found. Install: npm install -g pm2" >&2
  exit 1
fi

if pm2 describe supportbot-web >/dev/null 2>&1; then
  pm2 reload deploy/ecosystem.config.cjs --update-env
  echo "Reloaded pm2 apps from deploy/ecosystem.config.cjs"
else
  pm2 start deploy/ecosystem.config.cjs
  pm2 save
  echo "Started pm2 apps from deploy/ecosystem.config.cjs"
fi

echo "Deploy finished successfully."
