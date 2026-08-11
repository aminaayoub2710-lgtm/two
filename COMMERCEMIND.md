# CommerceMind AI

CommerceMind AI is an enterprise-oriented commerce workspace built on the Medusa DTC Starter. It keeps Medusa as an external commerce dependency and adds custom behavior exclusively through supported extension points: a custom module, workflows, admin API routes, an admin UI route, configuration, and storefront components.

> **Upgrade-safety rule:** No file inside the Medusa package or the official `medusajs/medusa` source tree is modified. The custom implementation lives under `apps/backend/src` and `apps/storefront/src`.

## Current implementation

| Area | Implementation | Location |
|---|---|---|
| Commerce core | Medusa v2.18.0 dependency from the starter | `apps/backend/package.json` |
| AI provider routing | Ollama-first fallback chain with OpenAI-compatible, Gemini, Anthropic, DeepSeek, and OpenRouter adapters | `apps/backend/src/modules/ai-gateway` |
| Business intelligence | Period-based order metrics, revenue trend, AOV, fulfillment and cancellation metrics | `apps/backend/src/api/admin/ai/business-intelligence` |
| AI executive analysis | Medusa workflow that sends aggregate commerce metrics to the configured provider | `apps/backend/src/workflows/generate-business-intelligence.ts` |
| AI analysts | Sales, inventory, and customer-intelligence workflows using commerce-only input | `apps/backend/src/workflows/run-ai-analyst.ts` |
| Admin experience | Upgrade-safe dashboard page at `/app/ai` with KPI cards, revenue chart, and AI analysis action | `apps/backend/src/admin/routes/ai/page.tsx` |
| Storefront | Branded CommerceMind landing experience, premium hero, navigation, responsive layout, and SEO metadata | `apps/storefront/src` |
| Infrastructure | PostgreSQL, Redis, Ollama, backend, and storefront Compose services | `docker-compose.yml` |
| CI | Backend build and storefront TypeScript validation | `.github/workflows/ci.yml` |

## Local setup

The repository requires Node.js 20 or newer, pnpm 10, and a PostgreSQL instance for the Medusa backend. Redis is optional during the first local run because Medusa can use its development fallback, but it is included in the Compose stack.

```bash
cp .env.example .env
pnpm install
```

Copy the backend template and configure the database and secrets:

```bash
cp apps/backend/.env.template apps/backend/.env
```

Set `DATABASE_URL`, `JWT_SECRET`, `COOKIE_SECRET`, and at least one AI provider credential. Ollama is attempted first by default and does not require a cloud API key when it is available at `OLLAMA_BASE_URL`.

Run the backend and storefront in separate terminals:

```bash
pnpm --filter @dtc/backend dev
pnpm --filter @dtc/storefront dev
```

The backend is available at `http://localhost:9000`, the Medusa Admin at `http://localhost:9000/app`, and the storefront at `http://localhost:8000`. The admin AI dashboard is available at `http://localhost:9000/app/ai` after creating an admin user.

## Docker Compose

The Compose stack provides PostgreSQL, Redis, Ollama, the Medusa backend, and the Next.js storefront:

```bash
docker compose up --build
```

For a local Ollama model, install a model after the services start:

```bash
docker compose exec ollama ollama pull llama3.2
```

Production secrets must be supplied through an external secret manager or deployment environment. The example values in `.env.example` are development placeholders and must not be used in production.

## AI provider order

The gateway reads `AI_PROVIDER_ORDER` and tries providers in the configured order. The default order is `ollama,openai,gemini,anthropic,deepseek,openrouter`. Provider credentials remain server-side; the storefront never receives them.

The Business Intelligence prompt is intentionally limited to aggregate commerce metrics. The implementation does not send customer names, email addresses, postal addresses, payment data, or other personal data to an AI provider.

## Medusa extension policy

The project follows the official Medusa customization model described in the [Medusa modules documentation](https://docs.medusajs.com/learn/fundamentals/modules), the [API routes documentation](https://docs.medusajs.com/learn/fundamentals/api-routes), and the [Admin UI routes documentation](https://docs.medusajs.com/learn/fundamentals/admin/ui-routes). When new functionality is needed, it must be introduced as one of the following:

| Allowed extension | Intended use |
|---|---|
| Custom module | New domain logic or third-party integration |
| Workflow | Multi-step business operation, rollback boundary, or AI mutation |
| API route | Store or Admin HTTP interface |
| Subscriber | Event-driven side effect |
| Middleware | Request policy, validation, or cross-cutting behavior |
| Admin extension | New dashboard page or widget |
| Plugin | Reusable package of the extensions above |

Direct edits to Medusa internals, package files, generated server files, or the official upstream repository are prohibited.

## Validation

The backend has been validated with:

```bash
pnpm --filter @dtc/backend build
```

The storefront source has been validated with:

```bash
pnpm --filter @dtc/storefront exec tsc --noEmit
```

A full Next.js production build also requires a reachable Medusa backend during static page-data collection. The compile phase succeeds; run the backend first when performing a production build of all storefront routes.
