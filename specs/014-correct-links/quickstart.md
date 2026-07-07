# Quickstart: Формирование правильных ссылок

**Branch**: `014-correct-links`  
**Date**: 2026-07-07

## Предусловия

- Развёрнут supportbot с RAG (фича `009-bot-qa-rag`)
- PostgreSQL с проиндексированной базой знаний
- `data/resources.csv` содержит колонку `slug`
- OpenAI API key настроен

## 1. Переменные окружения

В `.env` (опционально):

```bash
# По умолчанию после фичи — https://docs.inappstory.ru
# DOCS_BASE_URL="https://docs.inappstory.ru"
```

## 2. Реализация (для разработчика)

Основные файлы:

```text
src/rag/sourceUrls.ts              # NEW — билдеры URL
src/rag/chunkers/csvResources.ts   # читать slug, писать sourceUrl
src/rag/chunkers/markdown.ts       # sourceUrl в metadata (опционально в chunker или indexKnowledge)
src/rag/chunkers/openApiYaml.ts    # sourceUrl в metadata
src/rag/indexKnowledge.ts          # enrich metadata при upsert
src/rag/prompts.ts                 # SYSTEM_PROMPT + URL в блоках контекста
src/telegram/markdownToTelegramHtml.ts  # default .ru, нормализация доменов
```

## 3. Переиндексация после деплоя

```bash
npm run rag:index
```

Дождаться `status: completed` в логах или на экране настроек бота.

## 4. Проверка unit-тестов

```bash
npm test -- tests/unit/rag/sourceUrls.test.ts tests/unit/telegram/markdownToTelegramHtml.test.ts
```

## 5. Ручная проверка в Telegram

### SDK-документация

1. Задать боту: «Как подключить Android SDK?»
2. В ответе найти ссылку на документацию.
3. **Ожидание**: URL вида `https://docs.inappstory.ru/sdk-guides/android/...`, без `.md`.

### Статья консоли

1. Задать: «Как управлять ролями в консоли?»
2. **Ожидание**: ссылка `https://console.inappstory.ru/docs/roles-management` (или другой релевантный slug).

### REST API

1. Задать: «Как получить список сторис через API?»
2. **Ожидание**: ссылка на `https://api.inappstory.ru/pub/v1#/`.

## 6. Проверка истории чата

1. Открыть `/chats/{id}` для чата с ответами бота.
2. **Ожидание**: в тексте сообщения бота те же URL, что в Telegram (Markdown plain text).

## 7. Откат

- Откатить код на предыдущий релиз.
- При необходимости выполнить `rag:index` снова (метаданные перезапишутся при следующем деплое фичи).

## Частые проблемы

| Симптом | Причина | Решение |
|---------|---------|---------|
| Ссылки ведут на `docs.inappstory.com` | Старый код или `DOCS_BASE_URL` в env | Обновить код / env, переиндексировать |
| Ссылка `resources.csv#11` | Не переиндексировали после деплоя | `npm run rag:index` |
| Нет ссылки на статью консоли | Пустой `slug` в CSV | Заполнить slug в данных или принять отсутствие ссылки |
| Бот не отвечает | База не проиндексирована | `npm run rag:index` |
