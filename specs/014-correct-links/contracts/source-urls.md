# Contracts: Формирование правильных ссылок

**Branch**: `014-correct-links`  
**Date**: 2026-07-07

## Обзор

Фича **не добавляет** новых HTTP API. Контракты описывают внутренние модули, переменные окружения и правила RAG-промпта.

---

## Модуль `src/rag/sourceUrls.ts`

### `buildSdkDocUrl(sourcePath: string): string`

**Вход**: относительный путь к markdown-файлу (например `sdk-guides/android/how-to-get-started.md`).

**Выход**: абсолютный URL на `docs.inappstory.ru`.

**Правила**:

1. Убрать префикс `docs/` (если есть).
2. Убрать суффикс `.md` / `.MD`.
3. Вернуть `https://docs.inappstory.ru/{path}` без trailing slash.

**Примеры**:

| `sourcePath` | Результат |
|--------------|-----------|
| `sdk-guides/android/how-to-get-started.md` | `https://docs.inappstory.ru/sdk-guides/android/how-to-get-started` |
| `glossarium/statistics/stories-widget-events.md` | `https://docs.inappstory.ru/glossarium/statistics/stories-widget-events` |

---

### `buildConsoleArticleUrl(slug: string | null | undefined): string | null`

**Вход**: значение колонки `slug` из CSV.

**Выход**: `https://console.inappstory.ru/docs/{slug}` или `null` если slug пустой.

**Пример**: `roles-management` → `https://console.inappstory.ru/docs/roles-management`

---

### `buildApiSpecUrl(input?: { method?: string; path?: string }): string`

**Вход**: опционально метод и путь операции из OpenAPI.

**Выход (v1)**: `https://api.inappstory.ru/pub/v1#/`

**Расширение (опционально)**: `https://api.inappstory.ru/pub/v1#/paths/{encodedPath}/{method}` где `encodedPath` = path с `/` → `~1`.

---

### `buildSourceUrl(sourceType, sourcePath, metadata?): string | null`

Диспетчер по `sourceType`; для `console_article` читает `metadata.slug`.

---

## Модуль `src/rag/chunkers/csvResources.ts`

**Изменение контракта**: парсер MUST читать колонку `slug` из заголовка CSV.

**Выходной `metadata`**:

```json
{
  "id": "12",
  "category": "Управление проектом",
  "slug": "roles-management",
  "sourceUrl": "https://console.inappstory.ru/docs/roles-management"
}
```

Если `slug` пуст — поле `sourceUrl` отсутствует.

---

## Модуль `src/rag/prompts.ts`

### `SYSTEM_PROMPT` (фрагмент — ссылки)

Модель MUST формировать ссылки по правилам:

| Тип материала | Шаблон ссылки |
|---------------|---------------|
| Документация SDK | `[текст](https://docs.inappstory.ru/{path})` |
| Статья консоли | `[текст](https://console.inappstory.ru/docs/{slug})` |
| REST API | `[текст](https://api.inappstory.ru/pub/v1#/)` |

Запрещено: ссылки вида `resources.csv#`, внутренние id, домен `docs.inappstory.com`.

### `buildUserPrompt` — формат блока источника

```
[Источник N: {sourceType} / {label}]
URL: {metadata.sourceUrl или «—»}
{content}
```

---

## Модуль `src/telegram/markdownToTelegramHtml.ts`

### `resolveDocUrl(href: string): string`

**Поведение (расширенное)**:

| Вход | Выход |
|------|-------|
| `/sdk-guides/...` | `DOCS_BASE_URL` + path (default `https://docs.inappstory.ru`) |
| `https://docs.inappstory.com/...` | тот же path на `docs.inappstory.ru` |
| `https://console.inappstory.com/console/docs/{slug}` | `https://console.inappstory.ru/docs/{slug}` |
| `https://api.inappstory.ru/...` | без изменений |
| Уже корректный абсолютный URL | без изменений |

---

## Переменные окружения

| Переменная | Обязательность | Default (после фичи) | Описание |
|------------|----------------|----------------------|----------|
| `DOCS_BASE_URL` | Нет | `https://docs.inappstory.ru` | База для относительных путей SDK в ответах бота |

Константы `console.inappstory.ru` и `api.inappstory.ru` — захардкожены в `sourceUrls.ts` (заданы спецификацией).

---

## CLI / переиндексация

После деплоя:

```bash
npm run rag:index
```

MUST пересчитать `metadata.sourceUrl` и `metadata.slug` для всех чанков.

---

## Тестовый контракт (Vitest)

Файлы:

- `tests/unit/rag/sourceUrls.test.ts` — все три билдера + edge cases
- `tests/unit/telegram/markdownToTelegramHtml.test.ts` — обновить ожидания на `.ru`, добавить нормализацию `.com`

Минимальные кейсы:

1. SDK path → URL без `.md`
2. Console slug → URL с `/docs/`
3. Пустой slug → `null`
4. API → базовый портал
5. `resolveDocUrl("/sdk-guides/...")` → `docs.inappstory.ru`
6. `resolveDocUrl("https://docs.inappstory.com/...")` → `docs.inappstory.ru`
