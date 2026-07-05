# Cancellation of actions

Starting from `0.27.0` background long-running actions, such as loading onboardings, single stories and in-app messages can be canceled.

To do this you can use `AbortController` object, that used in methods of the actions listed above.

```ts
import { appearanceManager, storyManager } from "../services/StoryService";

var abortController = new AbortController();

function runExamples() {
  storyManager.showStory(
    "<storyId>",
    abortController.signal,
    appearanceManager,
  );

  storyManager.showOnboardingStories(
    appearanceManager,
    abortController.signal,
    {
      feed: "<feedID>",
      limit: 10,
      customTags: [],
    },
  );

  storyManager.showIAMById("<iamId>", false, abortController.signal);

  storyManager.showIAMByEvent("<iamEvent>", false, abortController.signal);
}
```

To cancel action just call `abortController.abort()`.
