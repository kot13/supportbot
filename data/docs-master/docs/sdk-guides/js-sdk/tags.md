# Tags
Use the `setTags()` method to change the set of tags.

> **Note:** Tags max length is 4000 (in bytes, for comma concatenated string).

## Example

```html
<div id="stories_widget"></div>
```

```ts
import { AppearanceManager, InAppStoryManager } from "@inappstory/js-sdk";

const inAppStoryManager = new InAppStoryManager({ apiKey: "{projectToken}" });
const appearanceManager = new AppearanceManager();
const storiesList = new inAppStoryManager.StoriesList(
  "#stories_widget",
  appearanceManager
);

inAppStoryManager.setTags(["tag1", "tag2", "tagN"]);

// Reload stories after tags changed (Optional)
storiesList.reload();
```

