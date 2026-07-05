# Quickstart: GitHub CI/CD

**Branch**: `010-github-cicd`

## Prerequisites

- Репозиторий на GitHub с веткой `main`.
- Права **admin** на репозитории (secrets, branch protection).
- Production-сервер (Ubuntu/Debian):
  - Node.js **20+**
  - **pm2** (`npm install -g pm2`)
  - **nginx**
  - **certbot** (`certbot` + `python3-certbot-nginx`)
  - PostgreSQL с **pgvector** (локально на сервере или отдельный хост)
  - git, SSH-доступ пользователя `deploy`

## 1. Workflow в репозитории

- `.github/workflows/ci.yml` — CI + CD
- `scripts/deploy.sh` — деплой на сервере (pm2 reload)
- `deploy/ecosystem.config.cjs` — конфиг pm2
- `deploy/nginx-supportbot.conf.example` — пример nginx

Откройте PR → job **CI / quality** запустится автоматически.

## 2. Проверить CI локально (до push)

```bash
npm ci
npm run lint
docker compose up -d
export DATABASE_URL="postgresql://supportbot:supportbot@localhost:5433/supportbot"
npm run db:migrate
npm test
npm run build
```

## 3. Первый прогон CI на GitHub

1. Push ветку и создайте PR в `main`.
2. Во вкладке **Checks** дождитесь **CI / quality** (< 15 мин).
3. Шаги lint → migrate → test → build должны быть зелёными.

## 4. Branch protection

После первого успешного **CI / quality** на `main`:

1. GitHub → **Settings** → **Branches** → правило для `main`.
2. **Require status checks** → **CI / quality**.
3. (Рекомендуется) **Require branches to be up to date before merging**.

## 5. Подготовка сервера

### 5.1. Пакеты

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 5.2. Пользователь и клон

```bash
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /var/www/supportbot
sudo chown deploy:deploy /var/www/supportbot

sudo -u deploy git clone https://github.com/kot13/supportbot.git /var/www/supportbot
cd /var/www/supportbot
sudo -u deploy cp .env.example .env
# Отредактировать .env (см. ниже)
sudo -u deploy npm ci && npm run build && npm run db:migrate
```

Минимум в `.env` на сервере:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/supportbot"
OPENAI_API_KEY="sk-..."
ADMIN_LOGIN="admin"
ADMIN_PASSWORD="strong-password"
PUBLIC_BASE_URL="https://app.example.com"
```

`PUBLIC_BASE_URL` — публичный HTTPS-URL для webhook Telegram.

### 5.3. pm2

Конфиг в репозитории: `deploy/ecosystem.config.cjs`.

```bash
cd /var/www/supportbot
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup   # выполнить выведенную sudo-команду
```

Проверка:

```bash
pm2 status
pm2 logs supportbot-web --lines 50
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/login
```

**Long polling** (только если **не** используете webhook — один poller на токен):

```bash
# В .env или перед запуском:
export SUPPORTBOT_ENABLE_POLL=1
pm2 delete supportbot-poll 2>/dev/null || true
pm2 start deploy/ecosystem.config.cjs
pm2 save
```

При webhook через `/api/telegram/webhook` процесс `supportbot-poll` **не** запускайте.

`scripts/deploy.sh` после каждого merge в `main` делает `pm2 reload deploy/ecosystem.config.cjs --update-env`.

### 5.4. nginx

Скопируйте пример и подставьте домен:

```bash
sudo cp /var/www/supportbot/deploy/nginx-supportbot.conf.example \
  /etc/nginx/sites-available/supportbot
sudo sed -i 's/app.example.com/YOUR_DOMAIN/' /etc/nginx/sites-available/supportbot
sudo ln -sf /etc/nginx/sites-available/supportbot /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Пример конфига (`/etc/nginx/sites-available/supportbot`):

```nginx
upstream supportbot_app {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name app.example.com;

    location / {
        proxy_pass http://supportbot_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }
}
```

Next.js слушает `127.0.0.1:3000` через pm2; nginx — единственная публичная точка входа.

### 5.5. certbot (HTTPS)

DNS A-запись домена должна указывать на сервер **до** выпуска сертификата.

```bash
sudo certbot --nginx -d app.example.com
```

Certbot добавит SSL-блок и редирект HTTP → HTTPS. Автопродление:

```bash
sudo certbot renew --dry-run
```

После HTTPS обновите `.env`:

```env
PUBLIC_BASE_URL="https://app.example.com"
```

И перезагрузите приложение:

```bash
pm2 reload deploy/ecosystem.config.cjs --update-env
```

Webhook Telegram: в панели `/bot` зарегистрируйте  
`https://app.example.com/api/telegram/webhook`.

### 5.6. Secrets для GitHub Actions CD

**Settings** → **Secrets and variables** → **Actions**:

| Secret | Пример |
|--------|--------|
| `DEPLOY_SSH_KEY` | Приватный ключ (`-----BEGIN OPENSSH PRIVATE KEY-----`) |
| `DEPLOY_HOST` | `app.example.com` или IP |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_PATH` | `/var/www/supportbot` |

Публичный ключ в `~deploy/.ssh/authorized_keys`. Пользователь `deploy` должен владеть `/var/www/supportbot` и иметь `pm2` в PATH (глобально или через `nvm` — тот же путь, что при ручном деплое).

## 6. Проверить CD

1. Merge PR в `main` с зелёным CI.
2. **Actions** → job **deploy** → success.
3. На сервере: `pm2 status`, сайт открывается по HTTPS.

При failed CI job `deploy` не запускается.

## 7. Диагностика

| Симптом | Действие |
|---------|----------|
| 502 Bad Gateway | `pm2 status`, `pm2 logs supportbot-web`; порт 3000 слушается? |
| Webhook не работает | `PUBLIC_BASE_URL` с `https://`, сертификат валиден, URL в `/bot` |
| Deploy: pm2 not found | Установить pm2 для пользователя `deploy`, проверить PATH в SSH-сессии |
| Deploy: permission denied | Права на `DEPLOY_PATH`, SSH-ключ в secrets |
| CI: migrate vector | В CI образ `pgvector/pgvector:pg16` (уже в workflow) |
| Два poller конфликтуют | Остановить `supportbot-poll`, использовать только webhook |

Логи: `pm2 logs`, nginx — `/var/log/nginx/error.log`, GitHub Actions — шаг **SSH deploy**.

## 8. Fork PR

**CI / quality** выполняется; **deploy** и secrets недоступны.

## Troubleshooting (CI)

| Symptom | Fix |
|---------|-----|
| Integration tests skipped | `DATABASE_URL` в workflow env |
| Check missing in branch protection | Дождаться первого green run на `main` |
| Deploy SSH failed | `DEPLOY_SSH_KEY`, `authorized_keys`, `DEPLOY_USER` |
