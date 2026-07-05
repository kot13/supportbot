# Game events

GameCenter games have events that the app can subscribe to and collect information about the user's actions in the game.
You can receive all the events from this article by subscribing to the SDK `eventGame` event.

- [iOS](/sdk-guides/ios/events.md#games-events)
- [Android](/sdk-guides/android/events#notifications-from-game-reader)
- [JS](/sdk-guides/js-sdk/games#events)

## Generic events

#### customScreenElement

`payload`:

| Key            | Type   | Description                                 |
| -------------- | ------ | ------------------------------------------- |
| action         | String | Type of action. Options: `successRendered`  |
| element        | String | Type of element. Options: `barcode`, `copy` |
| gameInstanceId | Int    | Unique game instance id                     |
| userId         | String | Unique user id                              |
| value          | String | The value set in the widget                 |

## Game-specific events

### Wheel-of-fortune

#### spinStart

`payload`:

| Key        | Type | Description             |
| ---------- | ---- | ----------------------- |
| instanceId | Int  | Unique game instance id |

#### spinEnd

`payload`:

| Key         | Type | Description                        |
| ----------- | ---- | ---------------------------------- |
| instanceId  | Int  | Unique game instance id            |
| sectorIndex | Int  | Wheel sector index (starts from 0) |

### Slicer

#### gameStart

`payload`:

| Key        | Type | Description             |
| ---------- | ---- | ----------------------- |
| instanceId | Int  | Unique game instance id |

#### gameEnd

`payload`:

| Key        | Type | Description                               |
| ---------- | ---- | ----------------------------------------- |
| instanceId | Int  | Unique game instance id                   |
| duration   | Int  | Game duration                             |
| score      | Int  | Number of points scored                   |
| win        | Int  | Result: 1 - win, -1 - loss, 0 - no result |

### Sorting

#### gameStart

`payload`:

| Key        | Type | Description             |
| ---------- | ---- | ----------------------- |
| instanceId | Int  | Unique game instance id |

#### gameEnd

`payload`:

| Key        | Type | Description                               |
| ---------- | ---- | ----------------------------------------- |
| instanceId | Int  | Unique game instance id                   |
| duration   | Int  | Game duration                             |
| win        | Int  | Result: 1 - win, -1 - loss, 0 - no result |

### Match-3

#### gameStart

`payload`:

| Key        | Type | Description             |
| ---------- | ---- | ----------------------- |
| instanceId | Int  | Unique game instance id |

#### gameEnd

`payload`:

| Key        | Type | Description                               |
| ---------- | ---- | ----------------------------------------- |
| instanceId | Int  | Unique game instance id                   |
| duration   | Int  | Game duration                             |
| score      | Int  | Number of points scored                   |
| win        | Int  | Result: 1 - win, -1 - loss, 0 - no result |

### Memory

#### gameStart

`payload`:

| Key        | Type | Description             |
| ---------- | ---- | ----------------------- |
| instanceId | Int  | Unique game instance id |

#### gameEnd

`payload`:

| Key        | Type | Description                               |
| ---------- | ---- | ----------------------------------------- |
| instanceId | Int  | Unique game instance id                   |
| duration   | Int  | Game duration                             |
| win        | Int  | Result: 1 - win, -1 - loss, 0 - no result |

### 15-Puzzle

#### gameStart

`payload`:

| Key        | Type | Description             |
| ---------- | ---- | ----------------------- |
| instanceId | Int  | Unique game instance id |

#### gameEnd

`payload`:

| Key        | Type | Description                               |
| ---------- | ---- | ----------------------------------------- |
| instanceId | Int  | Unique game instance id                   |
| duration   | Int  | Game duration                             |
| win        | Int  | Result: 1 - win, -1 - loss, 0 - no result |

### Advent Calendar

#### flipCard

`payload`:

| Key        | Type | Description                |
| ---------- | ---- | -------------------------- |
| instanceId | Int  | Unique game instance id    |
| index      | Int  | Card index (starts from 0) |
