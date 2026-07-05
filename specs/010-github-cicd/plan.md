# Implementation Plan: Автоматизация CI/CD через GitHub

**Branch**: `010-github-cicd` | **Date**: 2026-07-05 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/010-github-cicd/spec.md`

**Note**: Filled by `/speckit.plan`.

## Summary

Фича **010** добавляет **GitHub Actions CI/CD** для supportbot:

1. **CI**: на каждый PR и push в `main` — `lint`, `db:migrate`, `npm test` (unit + integration), `npm run build`; Postgres **pgvector** как service container.
2. **CD**: после успешного CI на push в `main` — SSH-деплой на production VPS через `scripts/deploy.sh`.
3. **Документация**: README секция CI/CD, quickstart для мейнтейнеров, branch protection.

**E2E (Playwright) вне scope v1** — по спеке.

## Technical Context

**Language/Version**: TypeScript (Node.js 20+), Next.js 16 App Router  
**Primary Dependencies**: GitHub Actions, `actions/checkout`, `actions/setup-node`, SSH deploy (`appleboy/ssh-action` или native ssh)  
**Storage**: PostgreSQL + pgvector в CI (service container `pgvector/pgvector:pg16`); production DB на сервере  
**Testing**: Vitest — `npm test` (excludes e2e); integration tests require `DATABASE_URL`  
**Target Platform**: GitHub-hosted runners (`ubuntu-latest`); production — Linux VPS  
**Project Type**: Next.js monolith; CI config in `.github/workflows/`  
**Performance Goals**: CI feedback < 15 min (SC-002); deploy < 20 min after merge (SC-004)  
**Constraints**: No secrets in repo; fork PRs без deploy; OpenAI key не нужен в CI  
**Scale/Scope**: Один workflow, два job (`quality`, `deploy`); один production target

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Gate A (App Router)**: N/A — инфраструктурная фича, не меняет routing.
- **Gate B (TypeScript)**: CI запускает `npm run lint`; workflow YAML валидируется при review.
- **Gate C (Security)**: Секреты только в GitHub Secrets и server `.env`; deploy job только на `push` → `main`; логи без секретов (FR-008).
- **Gate D (Testing)**: CI обязан запускать `npm test` включая integration с миграциями — соответствует «тесты по критичности».
- **Gate E (UX)**: N/A для CI/CD; документация с понятными шагами для мейнтейнеров.

**Post-design**: Нарушений нет. SSH deploy — минимальный CD без новых runtime-зависимостей в приложении.

## Project Structure

### Documentation (this feature)

```text
specs/010-github-cicd/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── workflows.md     # Phase 1
└── tasks.md             # /speckit.tasks
```

### Source Code (repository root)

```text
.github/workflows/
└── ci.yml               # NEW — jobs: quality, deploy

scripts/
└── deploy.sh            # NEW — server-side deploy script (invoked via SSH)

README.md                # UPDATE — CI/CD section

# Unchanged application code; existing commands reused:
# npm run lint | test | build | db:migrate
```

**Structure Decision**: Вся автоматизация в `.github/workflows/ci.yml` + один deploy-скрипт; без изменений `src/`.

## Phase 0: Research

См. [research.md](./research.md) — решения по Actions, pgvector service, составу checks, SSH CD, секретам, исключению E2E.

Все пункты Technical Context заполнены; **NEEDS CLARIFICATION** нет.

## Phase 1: Design

| Artifact | Path | Content |
|----------|------|---------|
| Data model | [data-model.md](./data-model.md) | Workflow Run, Job, Check Step, PR Status, Deployment Target, Secrets |
| Contracts | [contracts/workflows.md](./contracts/workflows.md) | `ci.yml` jobs/steps, `deploy.sh`, secrets, branch protection |
| Quickstart | [quickstart.md](./quickstart.md) | Настройка secrets, branch protection, verify CI/CD |

## Implementation Notes (for /speckit.tasks)

1. **Создать** `.github/workflows/ci.yml` по контракту [workflows.md](./contracts/workflows.md).
2. **Создать** `scripts/deploy.sh` (executable `chmod +x`); путь на сервере из `DEPLOY_PATH`.
3. **Обновить** `README.md` — секция CI/CD со ссылкой на quickstart.
4. **Опционально**: пример `deploy/supportbot-web.service` в docs (не обязателен для v1).
5. **Не делать**: E2E в CI, staging env, Docker registry deploy.
6. **Верификация**: PR с зелёным CI; тестовый merge → deploy (если secrets настроены).

## Complexity Tracking

> No constitution violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

## Post-Phase 1 Constitution Re-check

- Security: deploy isolated to main push; production env on server only — **PASS**
- Testing: integration tests in CI with real Postgres+pgvector — **PASS**
- No new app dependencies — **PASS**

**Ready for**: `/speckit.tasks`
