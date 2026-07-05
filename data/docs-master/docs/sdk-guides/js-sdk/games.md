# Games

## Usage

### Open game

You can open a game using the method `inAppStoryManager.openGame(gameId, appearanceManager)`.

**Parameters:**

| Parameter           | Type                | Description                   |
| ------------------- | ------------------- | ----------------------------- |
| `gameInstanceId`    | string \| number    | Unique identifier of the game |
| `appearanceManager` | `AppearanceManager` | Appearance configuration      |

```ts
import { InAppStoryManager, AppearanceManager } from "@inappstory/js-sdk";

const openMyGame = async (gameId) => {
  try {
    const inAppStoryManager = new InAppStoryManager.getInstance();
    const appearanceManager = new AppearanceManager();
    await inAppStoryManager.openGame(gameId, appearanceManager);
  } catch (error) {
    console.error(error);
  }
};

openMyGame("game-id");
```

### Close game

You can close an opened game reader with the method:

```ts
inAppStoryManager.closeGame();
```

## Example

For configuring game reader options, see [`<GameReaderOptions>`](#appearance).

```html
<!DOCTYPE html>
<head>
  <meta charset="utf-8" />
</head>
<html>
  <body>
    <script
      defer
      src="https://cdn.domain-placeholder/sdk/js-sdk-version-placeholder/dist/js/IAS.js"
    ></script>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const inAppStoryManagerConfig = {
          apiKey: "{project-integration-key}",
        };

        const inAppStoryManager = new window.IAS.InAppStoryManager(
          inAppStoryManagerConfig,
        );
        const appearanceManager = new window.IAS.AppearanceManager();
        appearanceManager.setGameReaderOptions({
          /* your appearance options*/
        });
        inAppStoryManager
          .openGame("{game-id}", appearanceManager)
          .catch(console.error)

          [("startGame", "closeGame")].forEach((eventName) =>
            inAppStoryManager.on(eventName, (payload) =>
              console.log("event", eventName, payload),
            ),
          );
      });
    </script>
  </body>
</html>
```

## Appearance

| Property                       | Type             | Description                                    | Default Value       |
| ------------------------------ | ---------------- | ---------------------------------------------- | ------------------- |
| `loader.default.color`         | string           | Main loader color                              | `"white"`           |
| `loader.default.accentColor`   | tring            | Accent color of the loader                     | `"transparent"`     |
| `loader.custom`                | string?          | Custom loader SVG or component as a string     | `null`              |
| `closeButtonPosition`          | "start" \| "end" | Position of the close button                   | `"end"`             |
| `closeButton.svgSrc.baseState` | string           | SVG icon for the close button                  | -                   |
| `game.backdropColor`           | tring            | Background color of the game container         | `"rgb(51, 51, 51)"` |
| `borderRadius`                 | number           | Border radius of the main container            | `5`                 |
| `backdrop.opacity`             | number           | Opacity of the backdrop while loading the game | `1`                 |
| `backdrop.background`          | string           | Background color of the backdrop               | `"#1a1a1a"`         |

## Events

```ts
import { InAppStoryManager } from "@inappstory/js-sdk";

const inAppStoryManager = new InAppStoryManager({ apiKey: "{projectToken}" });
inAppStoryManager.on("startGame", (payload) => console.log(payload));
```

---

- [`startGame`](#startgame)
- [`closeGame`](#closegame)
- [`eventGame`](#eventgame)

---

### `startGame`

**Description:** Fired when a game starts.

**Payload:**

| Field | Type   | Description    |
| ----- | ------ | -------------- |
| `id`  | string | Unique game ID |

---

### `closeGame`

**Description:** Fired when a game is closed.

---

### `eventGame`

**Description:** Fired when a custom game event occurs.

**Payload:**

| Field     | Type   | Description            |
| --------- | ------ | ---------------------- |
| `name`    | string | Name of the event      |
| `payload` | any    | Event-specific payload |

---
