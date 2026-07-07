# Research: Формирование правильных ссылок в ответах бота

**Branch**: `014-correct-links`  
**Date**: 2026-07-07

## Контекст

Сейчас ссылки в ответах бота обрабатываются в `src/telegram/markdownToTelegramHtml.ts`:

- `DOCS_BASE_URL` по умолчанию — `https://docs.inappstory.com` (устаревший домен).
- `resolveDocUrl` разрешает только относительные пути в документацию SDK; ссылки на консоль и API не различаются.
- `SYSTEM_PROMPT` (`src/rag/prompts.ts`) инструктирует модель использовать `[текст](/путь-в-документации)` без указания доменов для трёх типов источников.
- Чанкеры (`csvResources.ts`, `markdown.ts`, `openApiYaml.ts`) не сохраняют `slug` и не вычисляют канонический URL; `metadata` JSONB уже есть в `knowledge_chunks` — миграция не требуется.

## R1: Стратегия формирования ссылок

**Decision**: Гибридный подход — **канонический URL при индексации** + **инструкции в промпте** + **нормализация при доставке в Telegram**.

**Rationale**:

1. **Индексация** — единственное место, где известны `slug`, путь к `.md` и тип `api_spec`; URL вычисляется один раз и сохраняется в `metadata.sourceUrl`.
2. **Промпт** — контекстные блоки включают `sourceUrl`, чтобы модель цитировала правильные адреса; `SYSTEM_PROMPT` описывает три шаблона доменов.
3. **Доставка** — `resolveDocUrl` (или преемник) нормализует относительные пути и устаревшие домены `.com` → `.ru`, если модель всё же сгенерировала неверный href.

**Alternatives considered**:

| Подход | Плюсы | Минусы | Вердикт |
|--------|-------|--------|---------|
| Только промпт | Минимальный diff | Модель часто ошибается в доменах | Отклонён |
| Только постобработка | Детерминизм | Сложно угадать intent ссылки без типа источника | Недостаточно |
| Программный блок «Источники» в конце ответа | 100% корректные URL | Меняет UX, дублирует текст модели | Отложен (v2) |
| **Гибрид (выбран)** | Баланс надёжности и UX | Требует переиндексации | Принят |

## R2: Правила URL по типу источника

**Decision**: Три детерминированные функции в модуле `src/rag/sourceUrls.ts`:

| `sourceType` | Вход | Выход |
|--------------|------|-------|
| `sdk_doc` | `sourcePath` вида `sdk-guides/android/how-to-get-started.md` | `https://docs.inappstory.ru/sdk-guides/android/how-to-get-started` |
| `console_article` | `metadata.slug` | `https://console.inappstory.ru/docs/{slug}` |
| `api_spec` | `sourcePath` вида `GET /v1/stories` | `https://api.inappstory.ru/pub/v1#/` (базовый портал; см. R3) |

Правила SDK-пути:

- Убрать ведущий `docs/` при наличии.
- Убрать расширение `.md` (и `.MD`).
- Не добавлять завершающий `/`.

Правила консоли:

- Если `slug` пустой или отсутствует — `sourceUrl` не вычисляется (`null`); ссылка в ответе не формируется (FR-010).

**Rationale**: Правила заданы в спецификации явно; чистые функции легко покрыть unit-тестами.

**Alternatives considered**: Хранить `sourceUrl` в отдельной колонке БД — избыточно при наличии `metadata` JSONB.

## R3: Deep-link на операцию API в Swagger UI

**Decision**: Для v1 — **только базовый URL** `https://api.inappstory.ru/pub/v1#/`. Опционально (если реализация тривиальна) — hash вида `#/paths/{encodedPath}/{method}` по RFC Swagger UI 3 (`/` → `~1`, например `GET /v1/stories` → `#/paths/~1v1~1stories/get`).

**Rationale**: Спецификация требует базовый портал как минимум; deep-link улучшает UX, но не блокирует MVP.

**Alternatives considered**: Построение ссылки только по `operationId` — нестабильно без проверки соответствия в YAML.

## R4: Изменение `DOCS_BASE_URL`

**Decision**: Дефолт `DOCS_BASE_URL` меняется с `https://docs.inappstory.com` на `https://docs.inappstory.ru`. Переменная остаётся для override в dev/staging.

**Rationale**: Соответствует FR-009; обратная совместимость через env для редких окружений.

## R5: Переиндексация

**Decision**: После деплоя — **обязательная переиндексация** (`rag:index` или UI), чтобы `metadata.slug` и `metadata.sourceUrl` попали в `knowledge_chunks`.

**Rationale**: `slug` уже в CSV, но не читается чанкером; без reindex промпт не получит канонические URL для статей консоли.

## R6: История чата и unanswered snapshots

**Decision**: В `chat_messages.content` сохраняется **Markdown** (как сейчас), до конвертации в HTML. Ссылки в панели `/chats` отображаются как plain text — отдельный рендер Markdown не входит в scope; FR-006 выполняется сохранением того же текста, что ушёл в Telegram (до HTML).

Для `unanswered_context_snapshots` — при наличии `metadata.sourceUrl` в новых снимках администратор видит корректный URL в JSON/UI (если UI отображает metadata).

**Rationale**: Минимальный scope; улучшение рендера Markdown в админке — отдельная фича.

## R7: Нормализация устаревших доменов

**Decision**: В слое разрешения ссылок при доставке заменять известные устаревшие хосты:

- `docs.inappstory.com` → `docs.inappstory.ru`
- `console.inappstory.com` → `console.inappstory.ru` (путь `/console/docs/{slug}` → `/docs/{slug}` при возможности)

**Rationale**: Edge case из спецификации; исходный HTML в `resources.csv` содержит ссылки на `.com`.

## Итог

Все технические неизвестности сняты. Миграции БД не требуются. Основные точки изменения: `src/rag/sourceUrls.ts` (новый), чанкеры, `prompts.ts`, `markdownToTelegramHtml.ts`, тесты, `.env.example`, переиндексация после деплоя.
