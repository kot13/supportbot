# Research: GitHub CI/CD

**Branch**: `010-github-cicd`  
**Date**: 2026-07-05  

## Decision 1 — Платформа CI: GitHub Actions

**Контекст**: Спека требует автоматизацию через GitHub; репозиторий уже на `github.com/kot13/supportbot`, основная ветка — `main`.

**Решение**:

- Два workflow-файла в `.github/workflows/`:
  - **`ci.yml`** — lint, тесты, сборка; триггеры: `pull_request`, `push` на `main`.
  - **`deploy.yml`** — деплой на production; триггер: `workflow_run` после успешного `ci.yml` на ветке `main` **или** `push` на `main` с отдельным job `deploy` (предпочтительно **один workflow** `ci.yml` с job `deploy`, зависящим от `quality`, только на `push` → `main` — проще отладка и единая история).
- **Итоговая структура**: один файл `ci.yml` с jobs `quality` и `deploy`; `deploy` имеет `if: github.ref == 'refs/heads/main' && github.event_name == 'push'` и `needs: quality`.
- `concurrency`: группа `ci-${{ github.ref }}`, `cancel-in-progress: true` — устаревшие запуски на той же ветке отменяются (edge case из спеки).

**Альтернативы**:

- Отдельный `deploy.yml` + `workflow_run` — сложнее трассировка, два места настройки.
- Jenkins / CircleCI — лишняя инфраструктура при уже используемом GitHub.

## Decision 2 — Node.js и кэширование зависимостей

**Контекст**: Проект на TypeScript, Node.js 20+ (конституция и workspace rules).

**Решение**:

- `actions/setup-node@v4` с `node-version: '20'` и `cache: 'npm'`.
- Установка: `npm ci` (детерминированно по `package-lock.json`).
- Переменная `NODE_ENV=test` для job `quality`.

**Альтернатива**: `npm install` — недетерминированные сборки в CI.

## Decision 3 — PostgreSQL + pgvector в CI

**Контекст**: Интеграционные тесты (`tests/integration/*`) требуют `DATABASE_URL`; миграция `003` требует extension `vector`. Локально используется `pgvector/pgvector:pg16` в `docker-compose.yml`.

**Решение**:

- GitHub Actions **service container**:
  ```yaml
  services:
    postgres:
      image: pgvector/pgvector:pg16
      env:
        POSTGRES_USER: supportbot
        POSTGRES_PASSWORD: supportbot
        POSTGRES_DB: supportbot
      ports:
        - 5432:5432
      options: >-
        --health-cmd "pg_isready -U supportbot -d supportbot"
        --health-interval 5s
        --health-timeout 5s
        --health-retries 5
  ```
- `DATABASE_URL=postgresql://supportbot:supportbot@localhost:5432/supportbot`
- Перед тестами: `npm run db:migrate`
- Интеграционные тесты уже используют `describe.runIf(hasDb)` — при заданном `DATABASE_URL` все 4 файла выполняются.

**Альтернативы**:

- Пропуск integration в CI — нарушает FR-003 и конституцию (Gate D).
- `ankane/setup-postgres` без pgvector — миграция `003` упадёт.

## Decision 4 — Состав обязательных проверок (quality job)

**Контекст**: FR-003: lint, тесты, сборка. E2E вне scope v1.

**Решение** — последовательность шагов в job `quality`:

| Шаг | Команда | Примечание |
|-----|---------|------------|
| Lint | `npm run lint` | ESLint 9 + next config |
| Migrate | `npm run db:migrate` | после поднятия Postgres service |
| Test | `npm test` | `vitest run --exclude tests/e2e` (unit + integration) |
| Build | `npm run build` | Next.js 16 production build |

**Env для build/test** (не-секретные заглушки, только чтобы не падали runtime-проверки при импорте):

```env
DATABASE_URL=postgresql://supportbot:supportbot@localhost:5432/supportbot
ADMIN_LOGIN=ci-admin
ADMIN_PASSWORD=ci-password
OPENAI_API_KEY=sk-ci-placeholder-not-used-in-unit-tests
```

Реальный `OPENAI_API_KEY` в CI **не нужен**: unit-тесты мокают OpenAI; integration не вызывает OpenAI.

**Альтернатива**: Отдельные jobs lint / test / build параллельно — быстрее, но дублирует `npm ci` и поднятие Postgres; для v1 достаточно одного job (цель SC-002: < 15 мин).

## Decision 5 — Статусы проверок в PR

**Контекст**: FR-004, FR-006 — видимые статусы в pull request.

**Решение**:

- Каждый job GitHub Actions автоматически публикует check run на коммит.
- Имя workflow: **«CI»** (отображается в PR checks).
- После первого успешного прогона мейнтейнер включает **branch protection** на `main`: required status check **«CI / quality»** (точное имя зависит от `jobs.quality` — задокументировать в quickstart).
- Fork PR: workflow runs без secrets deploy job; `deploy` job с `if` не выполняется на PR.

**Альтернатива**: Отдельные workflows на lint/test/build — три статуса вместо одного; избыточно для маленькой команды.

## Decision 6 — CD: SSH deploy на Linux VPS

**Контекст**: В репозитории нет существующего deploy-скрипта или PaaS-конфига. Спека: одно production-подобное окружение, секреты в GitHub Secrets, ручной деплой как fallback.

**Решение**:

- Job `deploy` (только `push` → `main`, после `quality`):
  1. `appleboy/ssh-action` или нативный `ssh` с ключом из `secrets.DEPLOY_SSH_KEY`.
  2. На сервере выполняется скрипт `scripts/deploy.sh` (создаётся в рамках реализации):
     - `cd $DEPLOY_PATH && git fetch && git reset --hard origin/main`
     - `npm ci`
     - `npm run build`
     - `npm run db:migrate` (prod `DATABASE_URL` уже на сервере в `.env`)
     - `systemctl restart supportbot-web` (или `pm2 reload`) — **имена сервисов документируются в quickstart**, не хардкодятся в спеке.
- Production `.env` **хранится только на сервере**, не в CI.
- Секреты GitHub (repository secrets):

| Secret | Назначение |
|--------|------------|
| `DEPLOY_SSH_KEY` | Приватный SSH-ключ |
| `DEPLOY_HOST` | Хост сервера |
| `DEPLOY_USER` | SSH-пользователь |
| `DEPLOY_PATH` | Путь к клону репозитория на сервере |

- `concurrency` для deploy: `deploy-production`, `cancel-in-progress: false` — не прерывать активный деплой; при быстрых merge очередь GitHub Actions обеспечит последовательность.

**Альтернативы**:

- **Vercel** — не покрывает `telegram:poll` long-running процесс и отдельный Postgres с pgvector на том же хосте.
- **Docker image + registry** — больше инфраструктуры; отложить на v2.
- **Только CI без CD** — противоречит P2 спеки; CD включаем с SSH как минимально инвазивный вариант.

## Decision 7 — Безопасность секретов и fork PR

**Контекст**: FR-008, конституция Gate C.

**Решение**:

- Job `deploy` — `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`; secrets недоступны в `pull_request` from fork по умолчанию.
- В логах: `set -e`, без `echo` секретов; SSH action с `envs` только для несекретных переменных.
- `.env` в `.gitignore` — без изменений.
- Документировать список secrets в `quickstart.md` и раздел README «CI/CD».

**Альтернатива**: `environment: production` с required reviewers — опционально для v2 (manual approval gate).

## Decision 8 — Документация и observability

**Контекст**: FR-009, FR-010, SC-005, SC-006.

**Решение**:

- README: секция «CI/CD» — триггеры, проверки, secrets, branch protection, deploy flow.
- `specs/010-github-cicd/quickstart.md` — пошаговая настройка для мейнтейнера.
- История запусков — нативно в GitHub Actions UI (US4); отдельная БД не нужна.
- При падении deploy — exit code ≠ 0, шаг виден в логе job.

## Decision 9 — E2E вне scope v1

**Контекст**: Спека Assumptions.

**Решение**: `npm run test:e2e` **не** вызывается в CI v1. Playwright требует running app + seeded DB + browsers — отдельная итерация (`010` follow-up или `011-e2e-ci`).

**Альтернатива**: E2E в CI с `docker compose` + `playwright install` — +5–10 мин и хрупкость; отложено.
