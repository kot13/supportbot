# External API

You can use the exported `StoryManager` instance to consume the external API

```ts
import { storyManager } from "@inappstory/react-sdk"
```

### Properties

| Property                | Type                  | Description                                                        |
| ----------------------- | --------------------- | ------------------------------------------------------------------ |
| `sdkVersionName`        | string                | SDK version name (e.g., `3.7.0`).                                  |
| `sdkVersionCode`        | number                | Numeric SDK version code (e.g., `30700`).                          |
| `inAppMessaging`        | InAppMessaging        | Module for displaying [in-app messages](./in-app-messaging.md).    |
| `storyLinkClickHandler` | StoryLinkClickHandler | Handler for story link clicks. [More details](./link-handling.md). |

---

### `showOnboardingStories(options?)`

Displays [onboarding stories](./onboardings.md).

```tsx
storyManager.showOnboardingStories({ feed: "main" })
  .then(result => console.log(result.stories))
  .catch(console.error);
```

* **Parameters**:
  `options?: { feed?: string; customTags?: string[]; limit?: number }`
* **Returns**:
  `Promise<{ stories: { id: number; title: string }[] }>`

---

### `showSharePage(storyId)`

Displays the share page for a specific story.

```tsx
storyManager.showSharePage(123).catch(console.error).catch(console.error);;
```

* **Parameters**:
  `storyId: number | string`
* **Returns**:
  `Promise<void>`

---

### `showStory(id)`

Displays a specific [story](./story-view.md).

```tsx
storyManager.showStory("456").catch(console.error);;
```

* **Parameters**:
  `id: number | string`
* **Returns**:
  `Promise<void>`

---

### `showStoryOnce(id)`

Displays a [story](./story-view.md) only once.

```tsx
storyManager.showStoryOnce(789).catch(console.error);;
```

* **Parameters**:
  `id: number | string`
* **Returns**:
  `Promise<void>`

---

### `openGame(gameInstanceId)`

Opens a [game](./games.md) by its instance ID.

```tsx
storyManager.openGame("game-123").catch(console.error);;
```

* **Parameters**:
  `gameInstanceId: string | number`
* **Returns**:
  `Promise<void>`

---

### `closeGame()`

Closes the currently active [game](./games.md).

```tsx
storyManager.closeGame().catch(console.error);
```

* **Returns**:
  `Promise<boolean>`

---

### `closeStoryReader()`

Closes the [story view](./story-view.md).

```tsx
storyManager.closeStoryReader().catch(console.error);
```

* **Returns**:
  `Promise<boolean | undefined>`

---

### `closeGoodsWidget()`

Closes the goods widget.

```tsx
storyManager.closeGoodsWidget();
```

* **Returns**:
  `void`

---

### `on(eventName, listener)`

Subscribes to an SDK [events](./events.md).

```tsx
inAppStoryManager.on("showStory", (event) => {
  console.log("Story opened:", event);
});
```

* **Parameters**:

  * `eventName: string`
  * `listener: (...args: any[]) => void`
* **Returns**:
  `this`

---