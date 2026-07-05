# Onboarding

## What is Onboarding?
Onboarding in InAppStory is a guided introduction to an application or service through a series of interactive stories. These stories help users familiarize themselves with key features, best practices, or important updates. Onboarding stories enhance user engagement and ensure a smoother learning curve for new users.

## How Onboarding Works
When `showOnboardingStories()` is called, a [`StoryReader`](./story-view.md) opens, displaying a feed of onboarding stories. The behavior of onboarding stories is as follows:
- Each viewed story is removed from the feed.
- Subsequent calls to `showOnboardingStories()` will only show stories that have not been viewed by the user.
- If no onboarding stories are left for the current user, [`StoryReader`](./story-view.md) will not open.
- If the `userId` is changed, the onboarding feed is reset, meaning a new user will see a fresh list of onboarding stories.

## Calling Onboarding Stories

### Example:
```javascript
import { StoryManagerConfig, IASContainer, storyManager } from "@inappstory/react-sdk";
import { useEffect } from "react";

export const App = () => {
    useEffect(() => {
        storyManager.showOnboardingStories().then((result) => {
            console.log("Onboarding stories displayed:", result.stories);
        }).catch((error) => {
            console.error("Error displaying onboarding stories:", error);
        });
    }, []);

    const storyManagerConfig: StoryManagerConfig = {
        apiKey: "{projectToken}",
        userId,
    };

    return <IASContainer config={storyManagerConfig} />;
};
```

## Method Signature
The `showOnboardingStories()` method is **asynchronous** and supports optional parameters:
```typescript
async showOnboardingStories(options?: {
    feed?: string;          // Identifier (slug) of the onboarding feed
    customTags?: string[];  // List of custom tags
    limit?: number;         // Number of unseen onboarding stories to return per call
    signal?: AbortSignal; // Abort signal to cancel the operation. Since 1.9.4
}): Promise<{ stories: { id: number; title: string }[] }>;
```

### Parameters:
- `feed` (optional): Defines which onboarding story feed to use. If not specified, the default feed (`onboarding`) is used.
- `customTags` (optional): Allows filtering stories by specific tags.
- `limit` (optional): Specifies how many unseen onboarding stories should be returned in a single call.

### Example Usage:
```javascript
storyManager.showOnboardingStories({ feed: "new-user" }).then((result) => {
    console.log("Displayed stories:", result.stories);
});
```

## Method Behavior
- Returns a **Promise** resolving to an object with an array of currently displayed stories.
- Each story in the array contains an `id` and a `title`.
- If no stories remain for the user, an empty array is returned, and `StoryReader` does not open.

### Example Response:
```json
{
  "stories": [
    { "id": 1, "title": "Welcome to Our App" },
    { "id": 2, "title": "How to Use Features" }
  ]
}
```

If all onboarding stories have been viewed:
```json
{
  "stories": []
}
```

By leveraging onboarding stories, you can create a dynamic and personalized user journey that improves engagement and retention within your application.

