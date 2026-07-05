# Games
## Usage
### Open game

You can open a game using the method `storyManager.openGame(gameInstanceId)`.

**Parameters:**

| Parameter        | Type             | Description                   |
| ---------------- | ---------------- | ----------------------------- |
| `gameInstanceId` | string \| number | Unique identifier of the game |

```ts
storyManager.openGame("gameId");
```

---

### Close game

You can close the currently active game using the method `storyManager.closeGame()`.

```ts
storyManager.closeGame();
```

---

## Example

```tsx
import { StoryManagerConfig, IASContainer, storyManager } from "@inappstory/react-sdk";
import { useEffect } from "react";

export const App = () => {
   const openMyGame = async () => {
        try {
            await storyManager.openGame("{game-id}");
        } catch(error: unknown) {
            console.error(error)
        }
   }

   useEffect(() => {
      openMyGame()
   }, []);

   const storyManagerConfig: StoryManagerConfig = {
       apiKey: "{projectToken}"
   };

   return (
       <IASContainer
           config={storyManagerConfig}
           gameReaderOptions={{ /* yout appearance options */}}
       />
   );
}
```

## Customization

| Property                       | Type               | Description                                    | Default Value       |
| ------------------------------ | ------------------ | ---------------------------------------------- | ------------------- |
| `loader.default.color`         | string             | Main loader color                              | `"white"`           |
| `loader.default.accentColor`   | tring              | Accent color of the loader                     | `"transparent"`     |
| `loader.custom`                | string?            | Custom loader SVG or component as a string     | `null`              |
| `closeButtonPosition`          | "start"   \| "end" | Position of the close button                   | `"end"`             |
| `closeButton.svgSrc.baseState` | string             | SVG icon for the close button                  | -                   |
| `game.backdropColor`           | tring              | Background color of the game container         | `"rgb(51, 51, 51)"` |
| `borderRadius`                 | number             | Border radius of the main container            | `5`                 |
| `backdrop.opacity`             | number             | Opacity of the backdrop while loading the game | `1`                 |
| `backdrop.background`          | string             | Background color of the backdrop               | `"#1a1a1a"`         |

## Events

```ts
import { storyManager } from "@inappstory/react-sdk"

storyManager.on("startGame", (payload) => console.log(payload));
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