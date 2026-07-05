# Data model: GitHub CI/CD

**Branch**: `010-github-cicd`  
**Date**: 2026-07-05  

Фича не добавляет таблиц в PostgreSQL. Ниже — логические сущности автоматизации (GitHub Actions + репозиторий).

## Entity: Workflow Run (Запуск пайплайна)

Единичное выполнение workflow на GitHub Actions.

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | GitHub run id |
| `workflow_name` | string | e.g. `CI` |
| `event` | enum | `pull_request` \| `push` \| `workflow_dispatch` |
| `ref` | string | Branch or tag ref, e.g. `refs/heads/main` |
| `sha` | string | Commit SHA |
| `status` | enum | `queued` \| `in_progress` \| `completed` |
| `conclusion` | enum \| null | `success` \| `failure` \| `cancelled` \| `skipped` |
| `created_at` | timestamp | Run start |
| `updated_at` | timestamp | Last status change |

**Relationships**:

- One Workflow Run → many Job Runs
- Tied to one commit SHA (PR head or push commit)

**State transitions**:

```text
queued → in_progress → completed (conclusion: success | failure | cancelled)
```

## Entity: Job Run (Job внутри workflow)

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Job id within run |
| `workflow_run_id` | number | Parent run |
| `name` | string | `quality` \| `deploy` |
| `status` | enum | Same as workflow |
| `conclusion` | enum \| null | Same as workflow |
| `started_at` | timestamp | |
| `completed_at` | timestamp | |

**Rules**:

- `deploy` MUST NOT start unless `quality.conclusion === success` (`needs: quality`).
- `deploy` MUST be skipped on `pull_request` events.

## Entity: Check Step (Шаг внутри job)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | `lint` \| `migrate` \| `test` \| `build` \| `ssh-deploy` |
| `job_name` | string | Parent job |
| `status` | enum | Step status from Actions log |
| `duration_seconds` | number | |
| `log_url` | url | Link to step log in Actions UI |

**Validation (FR-006)**:

- If any mandatory step in `quality` fails → job `quality` conclusion = `failure`.
- If `quality` fails → `deploy` is skipped (not run).

## Entity: PR Check Status

Агрегированный статус для коммита в pull request.

| Field | Type | Description |
|-------|------|-------------|
| `commit_sha` | string | PR head commit |
| `check_name` | string | `CI / quality` |
| `state` | enum | `pending` \| `success` \| `failure` |
| `details_url` | url | Actions run URL |

**Rules**:

- Required for merge when branch protection enabled (Assumptions).
- Fork PRs receive check status without access to deploy secrets.

## Entity: Deployment Target (Целевое окружение)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | `production` |
| `host` | string | From `DEPLOY_HOST` secret |
| `deploy_path` | string | From `DEPLOY_PATH` secret |
| `last_deployed_sha` | string | Commit SHA last successfully deployed |
| `last_deployed_at` | timestamp | |
| `last_deploy_conclusion` | enum | `success` \| `failure` |

**State transitions** (deploy job):

```text
idle → deploying (workflow running) → success | failure
```

**Rules (FR-007)**:

- Deploy only from `main` after successful `quality` on same commit.
- Production env vars live on server filesystem (`.env`), not in workflow YAML.

## Entity: Repository Secret

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, … |
| `scope` | enum | `repository` |
| `used_by` | string[] | Jobs that reference the secret |

**Rules (FR-008)**:

- Never written to logs, artifacts, or committed files.
- Not exposed to workflows triggered from untrusted forks.

## No database migrations

Эта фича не требует SQL-миграций. Состояние хранится в GitHub Actions API / UI.
