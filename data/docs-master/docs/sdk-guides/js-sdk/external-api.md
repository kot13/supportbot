# External API

You can use the `InAppStoryManager` instance to consume the external API

```ts
import { InAppStoryManager } from "@inappstory/js-sdk"

const inAppStoryManagerConfig = {
  apiKey: "{project-integration-key}",
};

const appearanceManager = new AppearanceManager();
const inAppStoryManager = new InAppStoryManager(inAppStoryManagerConfig)
```

### Properties

| Property                | Type                  | Description                                                        |
| ----------------------- | --------------------- | ------------------------------------------------------------------ |
| `sdkVersionName`        | string                | SDK version name (e.g., `3.7.0`).                                  |
| `sdkVersionCode`        | number                | Numeric SDK version code (e.g., `30700`).                          |
| `inAppMessaging`        | InAppMessaging        | Module for displaying [in-app messages](./in-app-messaging.md).    |
| `storyLinkClickHandler` | StoryLinkClickHandler | Handler for story link clicks. [More details](./link-handling.md). |

---

### `showOnboardingStories(appearanceManager, options?)`

Displays [onboarding stories](./onboardings.md).

```ts
inAppStoryManager.showOnboardingStories(appearanceManager, { feed: "main" })
  .then(result => console.log(result.stories))
  .catch(console.error);
```

* **Parameters**:
  * `options?: { feed?: string; customTags?: string[]; limit?: number }`
  * `appearanceManager: AppearanceManager`
* **Returns**:
  `Promise<{ stories: { id: number; title: string }[] }>`

---

### `showSharePage(storyId, appearanceManager)`

Displays the share page for a specific story.

```ts
inAppStoryManager.showSharePage(123, appearanceManager).catch(console.error);
```

* **Parameters**:
  * `storyId: number | string`
  * `appearanceManager: AppearanceManager`
* **Returns**:
  `Promise<void>`

---

### `showStory(id, appearanceManager)`

Displays a specific [story](./story-view.md).

```ts
inAppStoryManager.showStory(123, appearanceManager).catch(console.error);;
```

* **Parameters**:
  * `id: number | string`
  * `appearanceManager: AppearanceManager`
* **Returns**:
  `Promise<void>`

---

### `showStoryOnce(id, appearanceManager)`

Displays a [story](./story-view.md) only once.

```ts
inAppStoryManager.showStoryOnce(123, appearanceManager).catch(console.error);;
```

* **Parameters**:
  * `id: number | string`
  * `appearanceManager: AppearanceManager`
* **Returns**:
  `Promise<void>`

---

### `openGame(gameInstanceId, appearanceManager)`

Opens a [game](./games.md) by its instance ID.

```ts
inAppStoryManager.openGame("game-123", appearanceManager).catch(console.error);;
```

* **Parameters**:
  * `gameInstanceId: string | number`
  * `appearanceManager: AppearanceManager`
* **Returns**:
  `Promise<void>`

---

### `closeGame()`

Closes the currently active [game](./games.md).

```ts
inAppStoryManager.closeGame().catch(console.error);
```

* **Returns**:
  `Promise<boolean>`

---

### `closeStoryReader()`

Closes the [story view](./story-view.md).

```ts
inAppStoryManager.closeStoryReader().catch(console.error);
```

* **Returns**:
  `Promise<boolean | undefined>`

---

### `closeGoodsWidget()`

Closes the goods widget V1.

```ts
inAppStoryManager.closeGoodsWidget();
```

* **Returns**:
  `void`

---

### `setUserId(userId, sign?)`

Set the user ID

```ts
inAppStoryManager.setUserId("new-user-id");
```
* **Parameters**:
  * `userId: string | number`
  * `sign?: string`
* **Returns**:
  `void`
---

### `userLogout()`

Logs out the current user.

```ts
inAppStoryManager.userLogout().catch(console.error);
```

* **Returns**:
  `Promise<void>`
---

### `setLang(lang)`

Set the content language.

```ts
inAppStoryManager.setLang("en-US")
```
* **Parameters**:
  `lang: string`
* **Returns**:
  `void`
---

### `setTags(tags)`

Set tags for filtering stories.

```ts
inAppStoryManager.setTags(["tag1", "tag2", "tagN"])
```
* **Parameters**:
  `tags: string[]`
* **Returns**:
  `void`
---

### `setPlaceholders(placeholders)`

Set text placeholders.

```ts
inAppStoryManager.setPlaceholders({
      "user-name": "Alex"
    })
```
* **Parameters**:
  `placeholders: Record<string, string>`
* **Returns**:
  `void`
---

### `setPlaceholders(placeholders)`

Set image placeholders.

```ts
inAppStoryManager.setImagePlaceholders({
    "profile-photo": "https://example.com/images/user123.png"
    })
```
* **Parameters**:
  `imagePlaceholders: Record<string, string>`
  
* **Returns**:
  `void`

---

### `on(eventName, listener)`

Subscribes to an SDK [events](./events.md).

```ts
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