# Single story

This section describes two API methods of the story manager: **showStory** and **showStoryOnce**.  
They allow you to open individual stories by ID and control how often they are displayed.

## When to Use
These methods are useful when you need to:
- open a specific story by its ID;
- show a story only once (e.g., on the user's first visit);
- trigger a story from UI logic, events, or buttons.

---

## `showStory(id, appearanceManager, options?)`

Opens a story by its ID, regardless of whether the user has seen it before.

### Example 1: Show story
```tsx
inAppStoryManager.showStory("456", appearanceManager).catch(console.error);
```

### Example 2: Abort show story. Since 3.8.4

```tsx
const controller = new AbortController();
const signal = controller.signal;
inAppStoryManager.showStory("456", appearanceManager, { signal }).catch(console.error);
controller.abort();
```

### Parameters
- **id**: `number | string` — the story identifier.
- **appearanceManager**: `AppearanceManager` - [appearance manager](./story-view.md#customization)
- **options**: `{ signal?: AbortSignal } | undefined` - display options. Since 3.8.4.

### Returns
- `Promise<void>`

### When It’s Helpful
- Opening a story when the user clicks a "Learn more" button.
- Reopening a story the user has already viewed.
- Navigating directly to specific stories.

---

## `showStoryOnce(id, appearanceManager, options?)`

Opens a story **only once**. If the user has already seen it, the story will not be shown again.

### Example 1: Show story once
```tsx
inAppStoryManager.showStoryOnce(789, appearanceManager).catch(console.error);
```

### Example 2: Abort show story once. Since 3.8.4

```tsx
const controller = new AbortController();
const signal = controller.signal;
inAppStoryManager.showStoryOnce(789, appearanceManager, { signal }).catch(console.error);
controller.abort();
```

### Parameters
- **id**: `number | string` — the story identifier.
- **appearanceManager**: `AppearanceManager` - [appearance manager](./story-view.md#customization)
- **options**: `{ signal?: AbortSignal } | undefined` - display options. Since 3.8.4.

### Returns
- `Promise<void>`

### When It’s Helpful
- Displaying onboarding story on first launch.
- Showing instructional hints only once.
- Presenting unique messages that should not be repeated automatically.