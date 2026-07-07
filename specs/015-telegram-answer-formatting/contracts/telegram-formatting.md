# Contracts: Оформление ответов бота для Telegram

**Branch**: `015-telegram-answer-formatting`  
**Date**: 2026-07-07

## Обзор

Фича **не добавляет** новых HTTP API. Контракты описывают внутренние модули Telegram-слоя, правила RAG-промпта и поведение доставки сообщений.

---

## Модуль `src/telegram/markdownToTelegramHtml.ts` (и/или `telegramMarkdown.ts`)

### `sanitizeMarkdownForTelegram(markdown: string): string`

**Назначение**: Удалить или преобразовать неподдерживаемую разметку до конвертации в HTML.

**Вход**: произвольная строка Markdown (вывод модели).

**Выход**: Markdown, совместимый с последующей конвертацией в Telegram HTML.

**Правила преобразования** (порядок важен):

| Вход | Выход |
|------|-------|
| `## Заголовок` | `**Заголовок**` (на той же или новой строке) |
| `### Подраздел` | `**Подраздел**` |
| Строка GFM-таблицы `\| A \| B \|` | Текстовое представление (например `A — B` или `- A: B`) |
| Строка-разделитель таблицы `\|---\|` | Удалить |
| `---`, `***`, `___` (целая строка) | Пустая строка |
| `[^1]`, `[^ref]: ...` | Удалить |
| `![alt](url)` | `alt` или удалить |
| Fenced code ` ```...``` ` | Без изменений |

**Инварианты**:

- Смысл текста сохраняется (FR-003).
- Fenced code blocks не повреждаются.
- Результат идемпотентен: повторный вызов не ухудшает текст.

**Примеры**:

```text
Вход:
## Шаги
| Параметр | Значение |
|----------|----------|
| apiKey | string |

Выход:
**Шаги**

- Параметр — Значение
- apiKey — string
```

---

### `markdownToTelegramHtml(markdown: string): string`

**Назначение**: Конвертация поддерживаемого Markdown в Telegram HTML.

**Вход**: санитизированный Markdown.

**Выход**: HTML-строка для `parse_mode: HTML`.

**Поддерживаемые конструкции**:

| Markdown | HTML |
|----------|------|
| ` ```lang\n...\n``` ` | `<pre><code>...</code></pre>` |
| `` `code` `` | `<code>...</code>` |
| `[label](href)` | `<a href="...">label</a>` (с `resolveDocUrl`) |
| `**bold**` | `<b>bold</b>` |
| `*italic*` | `<i>italic</i>` |
| `~~strike~~` | `<s>strike</s>` |

**Экранирование**: символы `<`, `>`, `&` вне сгенерированных тегов MUST быть экранированы.

**Ссылки**: поведение `resolveDocUrl` и нормализация доменов — без изменений (контракт `014-correct-links`).

---

## Модуль `src/telegram/send.ts`

### `splitLongTelegramText(text: string, maxLen?: number): string[]`

**Изменение контракта**: при разбиении MUST NOT разрезать внутри fenced code block.

**Вход**: санитизированный Markdown.

**Выход**: массив частей, каждая ≤ `maxLen` (по умолчанию 4096).

**Приоритет точек разреза**:

1. `\n\n` вне code block
2. `\n` вне code block
3. `maxLen` (крайний случай)

---

## Модуль `src/telegram/processMessage.ts`

### `sendBotReply(internalChatId, telegramChatId, text, replyToMessageId?)`

**Обновлённый пайплайн**:

```text
text (raw от модели)
  → sanitized = sanitizeMarkdownForTelegram(text)
  → parts = splitLongTelegramText(sanitized)
  → для каждой part: sendTelegramMessage({ text: markdownToTelegramHtml(part), parseMode: "HTML" })
  → insertChatMessage({ content: sanitized })  // полный текст, не по частям
```

**Fallback** (без изменений): при ошибке HTML — отправка `part` без `parse_mode`.

---

## Модуль `src/rag/prompts.ts`

### `SYSTEM_PROMPT` — секция форматирования

**MUST содержать**:

- Явный запрет: таблицы, заголовки `#`, горизонтальные линии `---`, изображения, сноски.
- Явное разрешение: `**жирный**`, `*курсив*`, `` `код` ``, блоки кода, ссылки, нумерованные и маркированные списки.
- Инструкция: подзаголовки — **жирным** на отдельной строке; сравнения — списком.

**MUST сохранить**: блок «Правила ссылок в ответе» из фичи `014-correct-links`.

**MUST NOT**: инструктировать «Форматируй ответ в Markdown» без уточнения ограничений Telegram.

---

## Telegram Bot API (внешний контракт)

Без изменений:

- Метод: `sendMessage`
- `parse_mode`: `HTML`
- `disable_web_page_preview`: `true`
- Лимит текста: 4096 символов на сообщение

**Разрешённые HTML-теги** (Bot API): `b`, `strong`, `i`, `em`, `u`, `ins`, `s`, `strike`, `del`, `a`, `code`, `pre`, `blockquote`, `tg-spoiler`.

---

## Тестовые контракты (Vitest)

| Файл | Покрытие |
|------|----------|
| `tests/unit/telegram/markdownToTelegramHtml.test.ts` | санитизация, конвертация, экранирование, strikethrough |
| `tests/unit/telegram/splitLongTelegramText.test.ts` | разбиение без разреза code block (новый или расширение) |
| `tests/unit/rag/prompts.test.ts` | наличие правил Telegram-форматирования в `SYSTEM_PROMPT` |

**Минимальные тест-кейсы санитизации**:

1. `## Title` → `**Title**`
2. Таблица 2×2 → список/строки без `|`
3. `---` между абзацами → пустая строка
4. Code block с `# not a header` внутри — без изменений
5. Смешанный ответ: bold + link + code — HTML валиден для Telegram
