# Data Model: 007-send-confirmation

## Persisted data

**Изменений нет.** Фича не добавляет таблиц, полей и миграций. Записи `broadcast_messages`, получатели и результаты доставки создаются тем же серверным кодом, что и до фичи, после вызова `POST /api/broadcasts`.

## Transient client state (conceptual)

| Concept | Description |
|--------|-------------|
| **Confirmation open** | Флаг, что показан второй шаг; пока открыт, основной запрос рассылки не выполняется. |
| **Form draft** | Существующее состояние `BroadcastClient`: `content`, `mode`, `selectedIds`, `images` — не сбрасываются при отмене подтверждения. |
| **In-flight send** | `pending` — блокирует повторную отправку до ответа сервера. |

## Relationships

- Нет новых сущностей и связей с БД.
- Логическая связь: «черновик формы» → по подтверждению → тот же JSON/FormData, что и сегодня, на `POST /api/broadcasts`.
