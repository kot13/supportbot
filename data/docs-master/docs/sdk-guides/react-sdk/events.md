# Events

You can subscribe to events in two ways:

- [Using `<IASContainer>` props](#using-iascontainer-props)
- [Using `StoryManager` instance](#using-storymanager-instance)

---

### Using `<IASContainer>` props

```tsx
import { IASContainer } from "@inappstory/react-sdk"

<IASContainer 
  config={storyManagerConfig} 
  onClickOnStory={(event) => console.log("Click on story", event)}
  onShowStory={(event) => console.log("Show story", event)}
  onCloseStory={(event) => console.log("Close story", event)}
  onShowSlide={(event) => console.log("Show slide", event)}
  onLikeStory={(event) => console.log("Like story", event)}
  onDislikeStory={(event) => console.log("Dislike story", event)}
  onFavoriteStory={(event) => console.log("Favorite story", event)}
  onShareStory={(event) => console.log("Share story", event)}
  onFeedImpression={(event) => console.log("Feed impression", event)}
  onVisibleAreaUpdated={(event) => console.log("Visible area updated", event)}
  onWidgetEvent={(event) => console.log("Widget event", event)}
/>
```

---

### Using `StoryManager` instance

```tsx
import { storyManager } from "@inappstory/react-sdk"

useEffect(() => {
  const handleClickOnStory = (payload: ClickOnStoryEvent) => {
    console.log("Click on story", payload);
  };

  storyManager.on("clickOnStory", handleClickOnStory);

  return () => {
    storyManager.off("clickOnStory", handleClickOnStory);
  };
}, []);
```

---

- [`clickOnStory`](#clickonstory)
- [`showStory`](#showstory)
- [`closeStory`](#closestory)
- [`showSlide`](#showslide)
- [`likeStory`](#likestory)
- [`dislikeStory`](#dislikestory)
- [`favoriteStory`](#favoritestory)
- [`shareStory`](#sharestory)
- [`shareStoryWithPath`](#sharestorywithpath)
- [`feedImpression`](#feedimpression)
- [`visibleAreaUpdated`](#visibleareaupdated)
- [`widgetEvent`](#widgetevent)
- [`startGame`](#startgame)
- [`closeGame`](#closegame)
- [`eventGame`](#eventgame)

---

### `clickOnStory`
**Description:** Triggered when a user clicks on a story card in the slider list.

**Payload:**

| Field                | Type    | Description                                |
| -------------------- | ------- | ------------------------------------------ |
| `id`                 | number  | Story ID.                                  |
| `title`              | string? | Story title.                               |
| `slidesCount`        | number? | Number of slides in the story.             |
| `feed`               | string? | Feed name where the story belongs.         |
| `source`             | string? | Story source.                              |
| `filter`             | object  | Applied filters.                           |
| `ugcPayload`         | object  | UGC-related payload.                       |
| `defaultListLength`  | number  | Default list length.                       |
| `favoriteListLength` | number  | Favorite list length.                      |
| `index`              | number  | Index of the story in the list.            |
| `isDeeplink`         | boolean | Whether the story was opened via deeplink. |
| `url`                | string? | Deeplink URL.                              |

---

### `showStory`
**Description:** Triggered when a story is opened (from slider or reader).

**Payload:**

| Field                | Type    | Description                        |
| -------------------- | ------- | ---------------------------------- |
| `id`                 | number  | Story ID.                          |
| `title`              | string? | Story title.                       |
| `slidesCount`        | number? | Number of slides in the story.     |
| `feed`               | string? | Feed name where the story belongs. |
| `source`             | string? | Story source.                      |
| `filter`             | object  | Applied filters.                   |
| `ugcPayload`         | object  | UGC-related payload.               |
| `defaultListLength`  | number  | Default list length.               |
| `favoriteListLength` | number  | Favorite list length.              |

---

### `closeStory`
**Description:** Triggered when a story is closed.

**Payload:**

| Field                | Type    | Description                                                                                                                           |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | number  | Story ID.                                                                                                                             |
| `title`              | string? | Story title.                                                                                                                          |
| `slidesCount`        | number? | Number of slides in the story.                                                                                                        |
| `feed`               | string? | Feed name where the story belongs.                                                                                                    |
| `source`             | string? | Story source.                                                                                                                         |
| `filter`             | object  | Applied filters.                                                                                                                      |
| `ugcPayload`         | object  | UGC-related payload.                                                                                                                  |
| `defaultListLength`  | number  | Default list length.                                                                                                                  |
| `favoriteListLength` | number  | Favorite list length.                                                                                                                 |
| `action`             | string  | Close action (`closeReaderByCloseBtn`, `closeReaderByEscBtn`, `swipeDown`, `swipe`, `lastSlideClick`, `auto`, `externalCloseReader`). |

---

### `showSlide`
**Description:** Triggered when a slide is shown.

**Payload:**

| Field                | Type    | Description                        |
| -------------------- | ------- | ---------------------------------- |
| `id`                 | number  | Story ID.                          |
| `title`              | string? | Story title.                       |
| `slidesCount`        | number? | Number of slides in the story.     |
| `feed`               | string? | Feed name where the story belongs. |
| `source`             | string? | Story source.                      |
| `filter`             | object  | Applied filters.                   |
| `ugcPayload`         | object  | UGC-related payload.               |
| `defaultListLength`  | number  | Default list length.               |
| `favoriteListLength` | number  | Favorite list length.              |
| `index`              | number  | Slide index.                       |
| `payload`            | string  | Slide payload.                     |

---

### `likeStory`
**Description:** Triggered when a user likes/unlikes a story.

**Payload:**

| Field                | Type    | Description                          |
| -------------------- | ------- | ------------------------------------ |
| `id`                 | number  | Story ID.                            |
| `title`              | string? | Story title.                         |
| `slidesCount`        | number? | Number of slides in the story.       |
| `feed`               | string? | Feed name where the story belongs.   |
| `source`             | string? | Story source.                        |
| `filter`             | object  | Applied filters.                     |
| `ugcPayload`         | object  | UGC-related payload.                 |
| `defaultListLength`  | number  | Default list length.                 |
| `favoriteListLength` | number  | Favorite list length.                |
| `value`              | boolean | `true` if liked, `false` if unliked. |

---

### `dislikeStory`
**Description:** Triggered when a user dislikes/undislikes a story.

**Payload:**

| Field                | Type    | Description                             |
| -------------------- | ------- | --------------------------------------- |
| `id`                 | number  | Story ID.                               |
| `title`              | string? | Story title.                            |
| `slidesCount`        | number? | Number of slides in the story.          |
| `feed`               | string? | Feed name where the story belongs.      |
| `source`             | string? | Story source.                           |
| `filter`             | object  | Applied filters.                        |
| `ugcPayload`         | object  | UGC-related payload.                    |
| `defaultListLength`  | number  | Default list length.                    |
| `favoriteListLength` | number  | Favorite list length.                   |
| `value`              | boolean | `true` if disliked, `false` if removed. |

---

### `favoriteStory`
**Description:** Triggered when a user adds/removes a story to favorites.

**Payload:**

| Field                | Type    | Description                              |
| -------------------- | ------- | ---------------------------------------- |
| `id`                 | number  | Story ID.                                |
| `title`              | string? | Story title.                             |
| `slidesCount`        | number? | Number of slides in the story.           |
| `feed`               | string? | Feed name where the story belongs.       |
| `source`             | string? | Story source.                            |
| `filter`             | object  | Applied filters.                         |
| `ugcPayload`         | object  | UGC-related payload.                     |
| `defaultListLength`  | number  | Default list length.                     |
| `favoriteListLength` | number  | Favorite list length.                    |
| `value`              | boolean | `true` if favorited, `false` if removed. |

---

### `shareStory`
**Description:** Triggered when a user clicks on story sharing.

**Payload:**

| Field                | Type    | Description                        |
| -------------------- | ------- | ---------------------------------- |
| `id`                 | number  | Story ID.                          |
| `title`              | string? | Story title.                       |
| `slidesCount`        | number? | Number of slides in the story.     |
| `feed`               | string? | Feed name where the story belongs. |
| `source`             | string? | Story source.                      |
| `filter`             | object  | Applied filters.                   |
| `ugcPayload`         | object  | UGC-related payload.               |
| `defaultListLength`  | number  | Default list length.               |
| `favoriteListLength` | number  | Favorite list length.              |

---

### `shareStoryWithPath`
**Description:** Triggered after successful creation of the sharing path.

**Payload:**

| Field                | Type    | Description                        |
| -------------------- | ------- | ---------------------------------- |
| `id`                 | number  | Story ID.                          |
| `title`              | string? | Story title.                       |
| `slidesCount`        | number? | Number of slides in the story.     |
| `feed`               | string? | Feed name where the story belongs. |
| `source`             | string? | Story source.                      |
| `filter`             | object  | Applied filters.                   |
| `ugcPayload`         | object  | UGC-related payload.               |
| `defaultListLength`  | number  | Default list length.               |
| `favoriteListLength` | number  | Favorite list length.              |
| `url`                | string  | Generated sharing URL.             |

---

### `feedImpression`
**Description:** Triggered after stories appear in the viewport.

**Payload:**

| Field     | Type   | Description                                                            |
| --------- | ------ | ---------------------------------------------------------------------- |
| `feed`    | string | Feed name.                                                             |
| `stories` | array  | Array of stories `{ id: number; title: string; slidesCount: number }`. |

---

### `visibleAreaUpdated`
**Description:** Triggered when the visible area of stories is updated in the viewport.

**Payload:**

| Field     | Type   | Description                                                            |
| --------- | ------ | ---------------------------------------------------------------------- |
| `feed`    | string | Feed name.                                                             |
| `stories` | array  | Array of stories `{ id: number; title: string; slidesCount: number }`. |

---

### `widgetEvent`
**Description:** Triggered by widgets inside a story.

**Payload:**

| Field  | Type   | Description           |
| ------ | ------ | --------------------- |
| `name` | string | Widget name.          |
| `data` | any    | Widget-specific data. |

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

**Payload:**

| Field | Type   | Description           |
| ----- | ------ | --------------------- |
| `id`  | string | ID of the closed game |

---

### `eventGame`

**Description:** Fired when a custom game event occurs.

**Payload:**

| Field     | Type   | Description            |
| --------- | ------ | ---------------------- |
| `name`    | string | Name of the event      |
| `payload` | any    | Event-specific payload |

---