#!/bin/sh
set -eu

cd /workspace

if [ ! -f /workspace/apps/storefront/node_modules/next/dist/bin/next ]; then
  echo "[storefront] Installing workspace dependencies into the mounted volumes..."
  pnpm install --frozen-lockfile
fi

if [ ! -f /workspace/apps/storefront/node_modules/next/dist/bin/next ]; then
  echo "[storefront] next is still unavailable after pnpm install" >&2
  exit 1
fi

exec pnpm --filter @dtc/storefront dev
