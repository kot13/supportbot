# Data model: Формирование правильных ссылок

**Branch**: `014-correct-links`  
**Date**: 2026-07-07

## Изменения схемы БД

**Миграции не требуются.** Используется существующее поле `knowledge_chunks.metadata` (JSONB).

## Расширение `knowledge_chunks.metadata`

### Общее поле (все типы)

| Поле | Тип | Обязательность | Описание |
|------|-----|----------------|----------|
| `sourceUrl` | `string` \| отсутствует | Рекомендуется после reindex | Канонический публичный URL материала; `null`/отсутствует — ссылку не строить |

### По типу `sdk_doc`

| Поле | Тип | Источник | Пример |
|------|-----|----------|--------|
| `sourceUrl` | string | Вычисляется из `source_path` | `https://docs.inappstory.ru/sdk-guides/android/how-to-get-started` |
| `section` | string | Уже есть | Заголовок секции внутри файла |

`source_path` без изменений: относительный путь к `.md` от корня `data/docs-master/docs/`, например `sdk-guides/android/how-to-get-started.md`.

### По типу `console_article`

| Поле | Тип | Источник | Пример |
|------|-----|----------|--------|
| `sourceUrl` | string \| отсутствует | `https://console.inappstory.ru/docs/` + `slug` | `https://console.inappstory.ru/docs/roles-management` |
| `slug` | string | Колонка `slug` в `resources.csv` | `roles-management` |
| `id` | string | Колонка `id` | `12` (только внутренний ключ, не для URL) |
| `category` | string | Колонка `category` | `Управление проектом` |

Правило: если `slug` пустой — `sourceUrl` не записывается.

### По типу `api_spec`

| Поле | Тип | Источник | Пример |
|------|-----|----------|--------|
| `sourceUrl` | string | Базовый портал API | `https://api.inappstory.ru/pub/v1#/` |
| `operationId` | string \| null | OpenAPI | `listStories` |
| `path` | string | OpenAPI | `/v1/stories` |
| `method` | string | OpenAPI | `get` |

Опционально в metadata: `apiDocHash` — deep-link в Swagger UI, если реализован (см. `research.md` R3).

## Входные данные `resources.csv`

Новая колонка (уже в файле):

```text
id,type,status,slug,category,title,content,created_at,updated_at
```

Чанкер MUST читать `slug` по имени колонки в заголовке.

## `chat_messages` — без изменений

| Поле | Поведение |
|------|-----------|
| `content` | Markdown-текст ответа бота **до** HTML-конвертации; ссылки уже в финальном виде (`https://…`) |

## `unanswered_context_snapshots.retrieved_chunks[]`

Существующая форма сохраняется; поле `metadata` прокидывает `sourceUrl` и `slug` после reindex:

```typescript
type UnansweredRetrievedChunkSnapshot = {
  chunkId: number;
  sourceType: "sdk_doc" | "console_article" | "api_spec";
  sourcePath: string;
  title: string | null;
  content: string;
  metadata: {
    sourceUrl?: string;
    slug?: string;
    // …прочие поля
  } | null;
  distance: number;
};
```

## TypeScript: модуль `sourceUrls`

```typescript
export type KnowledgeSourceType = "sdk_doc" | "console_article" | "api_spec";

export function buildSdkDocUrl(sourcePath: string): string;

export function buildConsoleArticleUrl(slug: string | null | undefined): string | null;

export function buildApiSpecUrl(input?: {
  method?: string;
  path?: string;
}): string;

export function buildSourceUrl(
  sourceType: KnowledgeSourceType,
  sourcePath: string,
  metadata?: Record<string, unknown> | null,
): string | null;
```

## Поток данных

```text
resources.csv (slug) ──┐
docs/**/*.md ──────────┼──► chunkers ──► knowledge_chunks.metadata.sourceUrl
openapi.yaml ──────────┘         │
                                 ▼
                          retrieveContext()
                                 │
                                 ▼
                    buildUserPrompt (+ sourceUrl в блоках)
                                 │
                                 ▼
                         answer (Markdown)
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
         chat_messages.content      markdownToTelegramHtml
         (Markdown, те же URL)       (нормализация + HTML)
```

## Валидация

| Правило | Проверка |
|---------|----------|
| SDK URL | Начинается с `https://docs.inappstory.ru/`, без `.md` |
| Console URL | `https://console.inappstory.ru/docs/{slug}`, slug без `/` |
| API URL | Начинается с `https://api.inappstory.ru/pub/v1` |
| Пустой slug | `buildConsoleArticleUrl` → `null` |
| Устаревший домен в href | Нормализатор при доставке → `.ru` |
