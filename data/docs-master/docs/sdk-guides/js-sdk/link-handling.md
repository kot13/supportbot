# Link Handling

The SDK provides **two ways** to handle link clicks in stories:

1. **Using `storyLinkClickHandler` override** — for handling deeplinks and links embedded in the story content.
2. **Using `w-link` event from `widgetEvent`** — for handling clicks on interactive elements (buttons) inside widgets.

---

## 1. Handling via `storyLinkClickHandler`

This method is triggered when the user clicks a link inside a story (deeplink or button).  
To use it, you **must override** the `storyLinkClickHandler` property:

```js
inAppStoryManager.storyLinkClickHandler = (payload) => {
    console.log(payload.data.url);
    inAppStoryManager.closeStoryReader(); // Close the reader if needed
};
```

**Data types:**
```ts
interface StoryLinkClickEvent {
    src: string;
    data: StoryLinkClickEventData;
}

interface StoryLinkClickEventData {
    id: number;          // Story ID
    index: number;       // Slide index
    url: string;         // Link URL
    elementId: string;   // Element ID in the story
}
```

**Notes:**
- The `payload` parameter matches the `StoryLinkClickEvent` interface.
- If you want to close the reader after handling the link, call `closeStoryReader()`.

### Default link handler
By default, the SDK opens the link in the current browser tab:
```js
function defaultLinkHandler({ data }) {
    window.open(data.url, "_self");
}
```
If you override the handler but still want to keep the default behavior for some links, you should call this function manually.

---

## 2. Handling via `w-link` (`widgetEvent`)

When the user clicks a button or another interactive element inside a **widget** in the story,  
the SDK sends a `widgetEvent` with the name `"w-link"`.

**Example:**
```ts
inAppStoryManager.on("widgetEvent", (payload: { name: string, data: any }) => {
    if (payload.name === "w-link") {
        const url = payload.data.widget_value;
        console.log(url);
        // Open the link or perform another action here
    }
});
```

**`w-link` event `data` structure:**

| Key          | Type    | Description                                         |
| ------------ | ------- | --------------------------------------------------- |
| story_id     | number  | Unique story ID                                     |
| feed_id      | number? | ID of the feed the story was opened from, or `null` |
| slide_index  | number  | Index of the slide where the callback was triggered |
| widget_id    | string  | Unique widget ID                                    |
| widget_label | string  | Button text                                         |
| widget_value | string  | Button URL                                          |

---

**When to use which:**
- If you are handling a **deeplink** or a link inside the story content → use `storyLinkClickHandler`.
- If you are handling a **button inside a widget** → use the `w-link` event (common case).
