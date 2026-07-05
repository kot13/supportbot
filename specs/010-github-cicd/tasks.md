# Tasks: Автоматизация CI/CD через GitHub

**Input**: Design documents from `/specs/010-github-cicd/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/workflows.md](./contracts/workflows.md)

**Tests**: Not requested as new test files — verification via GitHub Actions runs and local commands from [quickstart.md](./quickstart.md).

**Organization**: Tasks grouped by user story (US1–US4) for independent delivery.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Maps to user stories in [spec.md](./spec.md)

## Path Conventions

- Workflow: `.github/workflows/ci.yml`
- Deploy script: `scripts/deploy.sh`
- Docs: `README.md`, `specs/010-github-cicd/quickstart.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare repository layout for CI/CD artifacts

- [x] T001 Create `.github/workflows/` directory at repository root
- [x] T002 [P] Confirm `package.json` scripts (`lint`, `test`, `build`, `db:migrate`) match workflow contract in `specs/010-github-cicd/contracts/workflows.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Workflow skeleton with triggers, Postgres service, and bootstrap steps — **blocks all user stories**

**⚠️ CRITICAL**: No user story work until this phase is complete

- [x] T003 Create `.github/workflows/ci.yml` with workflow `name: CI`, triggers (`pull_request`, `push` to `main`), and top-level `concurrency` group `ci-${{ github.ref }}` per `specs/010-github-cicd/contracts/workflows.md`
- [x] T004 Add `quality` job on `ubuntu-latest` with `pgvector/pgvector:pg16` postgres service (healthcheck, port 5432) and job env vars `DATABASE_URL`, `ADMIN_LOGIN`, `ADMIN_PASSWORD`, `OPENAI_API_KEY` in `.github/workflows/ci.yml`
- [x] T005 Add `actions/checkout@v4`, `actions/setup-node@v4` (Node 20, npm cache), and `npm ci` steps to `quality` job in `.github/workflows/ci.yml`

**Checkpoint**: Workflow file exists and installs dependencies; jobs not yet running full checks

---

## Phase 3: User Story 1 — Автоматическая проверка качества (Priority: P1) 🎯 MVP

**Goal**: На каждый PR и push в `main` автоматически запускаются lint, миграции и тесты; статус виден в PR как **CI / quality**

**Independent Test**: Открыть PR с падающим тестом → check **CI / quality** красный; исправить → зелёный. См. [spec.md](./spec.md) US1.

### Implementation for User Story 1

- [x] T006 [US1] Add `npm run lint` step to `quality` job in `.github/workflows/ci.yml`
- [x] T007 [US1] Add `npm run db:migrate` step (after service healthy) to `quality` job in `.github/workflows/ci.yml`
- [x] T008 [US1] Add `npm test` step to `quality` job in `.github/workflows/ci.yml`

**Checkpoint**: PR получает автоматический check **CI / quality** с lint + migrate + test (без build)

---

## Phase 4: User Story 2 — Проверка собираемости (Priority: P1)

**Goal**: CI подтверждает, что приложение собирается; сломанная сборка блокирует merge

**Independent Test**: PR с ошибкой `npm run build` → **CI / quality** failed на шаге build. См. [spec.md](./spec.md) US2.

### Implementation for User Story 2

- [x] T009 [US2] Add `npm run build` as final step of `quality` job in `.github/workflows/ci.yml`

**Checkpoint**: Полный quality pipeline: lint → migrate → test → build

---

## Phase 5: User Story 3 — Автоматический деплой (Priority: P2)

**Goal**: После успешного push в `main` приложение деплоится на production VPS по SSH

**Independent Test**: Merge в `main` с зелёным CI → job `deploy` success; при failed `quality` → `deploy` skipped. См. [spec.md](./spec.md) US3.

**Depends on**: Phase 3–4 (working `quality` job)

### Implementation for User Story 3

- [x] T010 [US3] Create `scripts/deploy.sh` with `set -euo pipefail`, `git fetch`/`reset` to `origin/main`, `npm ci`, `npm run build`, `npm run db:migrate`, and application service restart per `specs/010-github-cicd/contracts/workflows.md`
- [x] T011 [US3] Set executable bit on `scripts/deploy.sh` (`chmod +x scripts/deploy.sh`)
- [x] T012 [US3] Add `deploy` job with `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`, `needs: quality`, and concurrency `deploy-production` (`cancel-in-progress: false`) in `.github/workflows/ci.yml`
- [x] T013 [US3] Add SSH deploy step in `deploy` job using `appleboy/ssh-action@v1` (or equivalent) with secrets `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH` to execute `$DEPLOY_PATH/scripts/deploy.sh` in `.github/workflows/ci.yml`

**Checkpoint**: Push to `main` triggers deploy after green quality; secrets configured per quickstart

---

## Phase 6: User Story 4 — Прозрачность для команды (Priority: P3)

**Goal**: Документация и понятные имена workflow/job для диагностики в GitHub Actions UI

**Independent Test**: Открыть **Actions** → видны runs с веткой, коммитом, шагами lint/migrate/test/build/deploy и логами. См. [spec.md](./spec.md) US4.

### Implementation for User Story 4

- [x] T014 [P] [US4] Ensure workflow uses descriptive job names `quality` and `deploy` and step names (`Lint`, `Migrate`, `Test`, `Build`, `SSH deploy`) in `.github/workflows/ci.yml`
- [x] T015 [P] [US4] Add **CI/CD** section to `README.md`: triggers, check list, required secrets table, branch protection note, link to `specs/010-github-cicd/quickstart.md`
- [x] T016 [US4] Verify `specs/010-github-cicd/quickstart.md` documents secrets, branch protection (`CI / quality`), and troubleshooting — update if gaps found

**Checkpoint**: Новый разработчик может настроить CI/CD по README + quickstart

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Локальная и удалённая валидация; финальная проверка по quickstart

- [x] T017 Run local CI validation sequence from `specs/010-github-cicd/quickstart.md` section 2 (`npm ci`, `lint`, `db:migrate`, `test`, `build` with Docker Postgres)
- [ ] T018 Push branch and confirm **CI / quality** runs on GitHub for the feature PR
- [x] T019 [P] Document optional `deploy/supportbot-web.service` systemd example in `specs/010-github-cicd/quickstart.md` (if server setup needs it)

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) — BLOCKS all user stories
    ↓
Phase 3 (US1: lint/test) ──┐
    ↓                      │
Phase 4 (US2: build)       │
    ↓                      │
Phase 5 (US3: deploy) ←────┘
    ↓
Phase 6 (US4: docs) — can start after T009 (US1+US2 complete) for workflow naming
    ↓
Phase 7 (Polish)
```

### User Story Dependencies

| Story | Priority | Depends on | Can test independently |
|-------|----------|------------|------------------------|
| US1 | P1 | Phase 2 | Yes — PR + failing test |
| US2 | P1 | US1 (same job) | Yes — PR + broken build |
| US3 | P2 | US1 + US2 | Yes — merge to main + secrets |
| US4 | P3 | US1 (workflow exists) | Yes — Actions UI + docs |

### Within Each User Story

- Foundational workflow skeleton before check steps
- US1 steps before US2 build step (same file, sequential)
- US3 `deploy.sh` before deploy job SSH step
- US4 docs after workflow is stable

### Parallel Opportunities

- **Phase 1**: T002 ∥ T001
- **Phase 6**: T014 ∥ T015 (different files)
- **Phase 7**: T019 ∥ T017/T018

---

## Parallel Example: User Story 4

```bash
# After US1–US2 complete, run in parallel:
# T014 — refine step names in .github/workflows/ci.yml
# T015 — add CI/CD section to README.md
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: US1 (lint, migrate, test)  
4. Complete Phase 4: US2 (build)  
5. **STOP and VALIDATE**: Open PR → green **CI / quality**  
6. Enable branch protection on `main` (manual, per quickstart)

### Incremental Delivery

1. Setup + Foundational → workflow skeleton  
2. US1 + US2 → full CI on PR (**MVP**)  
3. US3 → CD on merge to `main`  
4. US4 → documentation and observability  
5. Polish → local + remote validation

### Suggested MVP Scope

**Phases 1–4** (T001–T009): CI on every PR without deploy. Delivers FR-001–FR-006, SC-001–SC-003, SC-006.

### Out of Scope (v1)

- `npm run test:e2e` in CI  
- Staging environment  
- GitHub Environments approval gate  
- Docker registry deploy  

---

## Task Summary

| Phase | Tasks | Story |
|-------|-------|-------|
| 1 Setup | T001–T002 | — |
| 2 Foundational | T003–T005 | — |
| 3 US1 | T006–T008 | P1 |
| 4 US2 | T009 | P1 |
| 5 US3 | T010–T013 | P2 |
| 6 US4 | T014–T016 | P3 |
| 7 Polish | T017–T019 | — |
| **Total** | **19 tasks** | |

### Independent Test Criteria

| Story | How to verify |
|-------|----------------|
| US1 | PR triggers CI; failing test → red check |
| US2 | Broken build → red check on build step |
| US3 | Merge to main → deploy job; failed CI → no deploy |
| US4 | Actions history shows runs, steps, logs; README documents setup |

---

## Notes

- Production `.env` stays on server only — never in workflow YAML  
- Fork PRs: `quality` runs, `deploy` skipped (no secrets)  
- Required status check name after first run: **CI / quality**  
- Commit after each phase checkpoint for easier review
