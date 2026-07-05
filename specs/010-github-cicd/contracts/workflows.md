# Contracts: GitHub CI/CD workflows

**Branch**: `010-github-cicd`  
**Date**: 2026-07-05  

## File: `.github/workflows/ci.yml`

**Purpose**: Единый workflow проверки качества и деплоя (FR-001–FR-007, FR-009).

### Triggers

| Event | Branches | Jobs |
|-------|----------|------|
| `pull_request` | all | `quality` only |
| `push` | `main` | `quality` → `deploy` |

### Top-level settings

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

### Job: `quality`

**Runner**: `ubuntu-latest`  
**Published check name in PR**: `CI / quality`

**Service**: `postgres` — image `pgvector/pgvector:pg16` (see [research.md](../research.md#decision-3--postgresql--pgvector-в-ci)).

**Environment variables**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://supportbot:supportbot@localhost:5432/supportbot` |
| `ADMIN_LOGIN` | `ci-admin` |
| `ADMIN_PASSWORD` | `ci-password` |
| `OPENAI_API_KEY` | `sk-ci-placeholder` |

**Steps (order fixed)**:

1. `actions/checkout@v4`
2. `actions/setup-node@v4` — `node-version: 20`, `cache: npm`
3. `npm ci`
4. `npm run lint`
5. `npm run db:migrate`
6. `npm test`
7. `npm run build`

**Failure contract**: любой шаг с ненулевым exit code → job `failure` → workflow `failure`.

### Job: `deploy`

**Condition**:

```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/main'
needs: quality
```

**Runner**: `ubuntu-latest`  
**Concurrency** (job-level):

```yaml
concurrency:
  group: deploy-production
  cancel-in-progress: false
```

**Secrets** (repository):

| Secret | Required |
|--------|----------|
| `DEPLOY_SSH_KEY` | yes |
| `DEPLOY_HOST` | yes |
| `DEPLOY_USER` | yes |
| `DEPLOY_PATH` | yes |

**Steps**:

1. `actions/checkout@v4` (optional — deploy uses server-side git)
2. SSH to `$DEPLOY_USER@$DEPLOY_HOST` — execute `$DEPLOY_PATH/scripts/deploy.sh`

**Success contract**: exit 0 from remote script → job `success`.  
**Skip contract**: on PR or failed `quality` → job not run (`skipped`).

---

## File: `scripts/deploy.sh`

**Purpose**: Идемпотентный деплой на production-сервере (вызывается по SSH из job `deploy`).

**Preconditions**:

- Server has Node.js 20+, git, production `.env` with real `DATABASE_URL`, `OPENAI_API_KEY`, etc.
- Process manager configured (`systemd` / `pm2`) for `next start` and optionally `telegram:poll`.

**Steps (contract)**:

1. `set -euo pipefail`
2. `cd "$DEPLOY_PATH"` (or fixed path in script)
3. `git fetch origin main && git reset --hard origin/main`
4. `npm ci`
5. `npm run build`
6. `npm run db:migrate`
7. Restart application service(s)

**Exit codes**:

| Code | Meaning |
|------|---------|
| `0` | Deploy succeeded |
| non-zero | Deploy failed; GitHub job shows failure with remote log |

**Security**: script MUST NOT print secrets; load `.env` from server only.

---

## Repository secrets contract

| Secret | Consumer | Description |
|--------|----------|-------------|
| `DEPLOY_SSH_KEY` | `deploy` job | PEM private key for SSH |
| `DEPLOY_HOST` | `deploy` job | Server hostname or IP |
| `DEPLOY_USER` | `deploy` job | SSH user (e.g. `deploy`) |
| `DEPLOY_PATH` | `deploy` job | Absolute path to app clone |

No application secrets (`OPENAI_API_KEY`, `DATABASE_URL` prod) in GitHub — only on server.

---

## Branch protection contract (manual setup)

After first green `CI / quality` on `main`:

| Setting | Value |
|---------|-------|
| Branch | `main` |
| Require status checks | enabled |
| Required check | `CI / quality` |
| Require branches up to date | recommended |

Documented in [quickstart.md](../quickstart.md); not enforced by workflow file.

---

## Out of scope (v1)

| Item | Reason |
|------|--------|
| `npm run test:e2e` | Spec assumption — complex stack |
| Staging environment | Spec assumption — single target |
| GitHub Environments with approval | Optional v2 |
| Docker registry deploy | research Decision 6 — deferred |
