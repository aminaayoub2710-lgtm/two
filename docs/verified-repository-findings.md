# Verified Repository Findings

The user's public repository `aminaayoub2710-lgtm/two` is on the `main` branch and currently contains a Medusa DTC Starter monorepo plus two custom root-level AI files from earlier commits. The repository is public and has two commits at the time of review.

The official upstream reference is `medusajs/medusa`, whose current GitHub repository exposes the upstream `develop` branch and a current v2.18.0 release. The project must continue to treat Medusa as an external dependency; no files in the upstream package or source tree will be changed.

The starter's actual backend lives in `apps/backend`, with Medusa configuration in `apps/backend/medusa-config.ts`, and custom extension points under `apps/backend/src/{modules,api,admin,subscribers,workflows}`. The root-level `src` directory is not part of the backend's Medusa runtime and should be removed or migrated into `apps/backend/src` during cleanup.

The backend currently depends on `@medusajs/framework`, `@medusajs/medusa`, `@medusajs/dashboard`, `@medusajs/ui`, and `@tanstack/react-query`, all pinned in the starter to 2.18.0-compatible versions. The admin extension should therefore be implemented inside `apps/backend/src/admin`, using Medusa's supported dashboard extension APIs rather than modifying dashboard or Medusa source code.
