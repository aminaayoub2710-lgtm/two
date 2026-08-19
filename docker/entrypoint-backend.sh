#!/bin/sh
set -eu

cd /workspace

if [ ! -f /workspace/apps/backend/node_modules/@medusajs/cli/cli.js ]; then
  echo "[backend] Installing workspace dependencies into the mounted volumes..."
  pnpm install --frozen-lockfile
fi

if [ ! -f /workspace/apps/backend/node_modules/@medusajs/cli/cli.js ]; then
  echo "[backend] @medusajs/cli is still unavailable after pnpm install" >&2
  exit 1
fi

exec pnpm --filter @dtc/backend dev
