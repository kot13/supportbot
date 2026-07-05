# Research: Bot Q&A with RAG

**Branch**: `009-bot-qa-rag`  
**Date**: 2026-07-05  

## Decision 1 — Обработка входящих сообщений Telegram

**Контекст**: Сейчас `handleTelegramUpdate` только upsert'ит чат; текстовые `message` не разбираются.

**Решение**:

- Добавить `normalizeIncomingMessage(update)` в `src/telegram/updates.ts`: извлекать `message` / `edited_message` (v1: **только `message`**, `edited_message` не переобрабатываем).
- Поддерживать только `text`; медиа/стикеры/голос — **не сохраняем и не отвечаем** (спека v1).
- Правила обращения (`isAddressedToBot`):
  - `private` — любое текстовое сообщение;
  - `group` / `supergroup` — entity `mention` / `text_mention` / `bot_command` на username бота, **или** подстрока `@username` в тексте, **или** `reply_to_message` от нашего бота.
- Перед RAG: `stripBotMentionFromText` удаляет `@botusername` из текста вопроса (одинаковый embedding в личке и группе).
- Username бота: кэш из `getMe`; опционально `TELEGRAM_BOT_USERNAME` в env.
- Dev long polling: `npm run telegram:poll`; лог `telegram_poll_started`; при конфликте `getUpdates` — `telegram_poll_conflict` (только один poller на токен).

**Альтернативы**: Отвечать на все сообщения в группе — отвергнута спекой.

## Decision 2 — Webhook: быстрый 200 и фоновая обработка

**Контекст**: RAG + GPT может занять до ~30 с (SC-001); Telegram ждёт быстрый ответ webhook.

**Решение**: `POST /api/telegram/webhook` после валидации секрета **сразу** возвращает `200`, а цепочку «сохранить сообщение → RAG → ответ → sendMessage» запускает **асинхронно** (`void processIncomingMessage(...).catch(log)`). Ошибки — в структурированные логи; пользователю при сбое — fallback-сообщение в чат (FR-010).

**Альтернатива**: Синхронная обработка в webhook — риск таймаута Telegram и повторных доставок.

## Decision 3 — OpenAI SDK и модели

**Контекст**: Спека задаёт GPT-4.1 и text-embedding-3-small.

**Решение**:

- Зависимость: официальный пакет `openai` (Node).
- Chat: `gpt-4.1` через Chat Completions API.
- Embeddings: `text-embedding-3-small`, размерность **1536** (дефолт модели).
- Ключ: `OPENAI_API_KEY` в env; валидация при старте индексации/первом запросе.
- Вызовы **только на сервере** (`src/rag/`, route handlers, фоновые job'ы).

**Альтернатива**: `fetch` к REST — хуже типизация и retry-политика.

## Decision 4 — pgvector и схема RAG

**Контекст**: PostgreSQL уже используется; заказчик требует pgvector.

**Решение**:

- Миграция: `CREATE EXTENSION IF NOT EXISTS vector`.
- Таблица `knowledge_chunks`: `embedding vector(1536)`, метаданные источника, `content`, `content_hash` для идемпотентной переиндексации.
- Поиск: `ORDER BY embedding <=> $query_embedding LIMIT k` (cosine distance); **k = 6** по умолчанию (`RAG_TOP_K`).
- Индекс: **HNSW** (`vector_cosine_ops`) — приемлемый recall на ~сотнях–тысячах чанков без долгого IVFFlat train.
- Пакет `pg` + raw SQL; тип vector передаём как строку `'[...]'::vector`.

**Альтернатива**: Отдельный векторный движок (Qdrant) — лишняя инфраструктура.

## Decision 5 — Чанкинг источников знаний

**Контекст**: ~217 `.md`, 83 статьи CSV, OpenAPI YAML ~370 KB.

| Источник | Стратегия |
|----------|-----------|
| `data/docs-master/docs/**/*.md` | Разбивка по заголовкам `##` / `###`; если секция > ~2000 символов — дополнительный split по абзацам; overlap 100 символов между соседними чанками |
| `data/resources.csv` | Одна строка → один чанк: `title` + plain text из `content` (strip HTML) |
| `data/inappstory-pub-api-v1.yaml` | Парсинг OpenAPI 3: один чанк на `path` + `method` (summary, description, parameters, requestBody, responses) |

**Метаданные чанка**: `source_type`, `source_path`, `title`, `section` (опционально).

**Переиндексация**: CLI `npm run rag:index` (tsx script); полная пересборка: delete chunks с тем же `source_type`+`source_path` или truncate + reindex; хранить `knowledge_index_runs` с `started_at`, `finished_at`, `chunk_count`, `status`.

**Альтернатива**: Фиксированный split 512 токенов для всего — хуже для статей и API.

## Decision 6 — Промпт и контекст диалога

**Решение**:

- System prompt: отвечать **только** по предоставленному контексту; форматировать ответ в **Markdown** (код, ссылки, жирный).
- User prompt: вопрос (без `@bot`) + top-k чанков + последние **10** сообщений (`CHAT_CONTEXT_LIMIT`).
- Порог retrieval: `hasUsableContext` — лучший cosine distance **< `RAG_MAX_DISTANCE`** (default **0.62**); иначе `no_context` без вызова GPT.
- Длинный ответ: разбивка на части ≤ **4096** символов; каждая часть → `markdownToTelegramHtml` → `parse_mode: HTML`; fallback на plain text при ошибке parse.
- Относительные ссылки `[text](/path)` → `DOCS_BASE_URL` + path (default `https://docs.inappstory.com`).

## Decision 7 — История сообщений и UI

**Решение**:

- Таблица `chat_messages` (FK `chat_id` → `chats.id`).
- `GET /api/chats/[id]/messages?cursor=&limit=50` — keyset pagination по `id` / `created_at`.
- Страница `app/(panel)/chats/[id]/page.tsx` — Server Component + `ChatHistoryClient` («load more», якоря `#message-{id}`, имя пользователя со ссылкой на Telegram).
- Страница `app/(panel)/unanswered/page.tsx` — список вопросов с `unanswered_reason`.
- Ссылка из `ChatsTable`: Title → `/chats/[id]`; из `UnansweredTable` → `/chats/[id]#message-{id}`.
- Даты в UI: фиксированный формат `ru-RU` + `Europe/Moscow` (без hydration mismatch).

## Decision 8 — Идемпотентность апдейтов

**Контекст**: Telegram может повторно доставить `update_id`.

**Решение**: Уникальный индекс `(telegram_update_id)` в отдельной таблице `processed_telegram_updates` **или** `UNIQUE(telegram_message_id, chat_id)` на user-сообщениях; при дубликате — skip обработки ответа.

**Выбор v1**: `telegram_update_id bigint unique` в `processed_telegram_updates` — проще для всего update.

## Decision 9 — Фиксированные ответы без RAG

**Решение**:

- `/start` → приветствие (`START_GREETING`).
- `/help` и мета-вопросы (`isHelpIntent`) → список тем SDK / консоль / API (`HELP_TOPICS_REPLY`).
- Не записываются в `unanswered_reason`.

## Decision 10 — Учёт неотвеченных вопросов

**Решение**:

- Колонка `chat_messages.unanswered_reason` (`no_context`, `no_knowledge_index`, `openai_error`, `not_configured`).
- `markMessageUnanswered` после отправки fallback пользователю.
- Админ-раздел `/unanswered` (Server Component, без отдельного API в v1).

## Open points (не блокируют план)

- Точный `RAG_MAX_DISTANCE` — tune на пилоте; default 0.62.
- Streaming ответа в Telegram — вне v1.
- Отдельный API для `/unanswered` — вне v1 (Server Component достаточно).
