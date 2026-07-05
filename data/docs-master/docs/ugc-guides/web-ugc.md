# Web-UGC

# Version compatibility

| UGC SDK version | InAppStory SDK version |
| --------------- | ---------------------- |
| 1.1.0           | 2.9.0+                 |
| 1.0.0           | 2.6.0 - 2.8.10         |

# Migrations

## Migration guide from 1.0.0 to 1.1.0

Prior to version 1.1.0, you had to pass the UgcSdk constructor when instantiating the StoryManager.\
Thus, when you click on ugcCard, the editor opens automatically.\
Now you need to explicitly open the editor by clicking on ugcCard - [example](#react-ugcsdk-example).

## UGCStoriesList public methods

```ts
interface UGCStoriesList {
  (
    mountSelector: string,
    appearanceManager: AppearanceManager,
    options: {
      filter?: Record<string, unknown>;
      useUgcCard?: boolean;
    }
  ): UGCStoriesList;

  /**
   * @since v2.9.0
   * @param filter
   */
  setFilter(filter: Record<string, unknown>);
  reload(
    options: { needLoader: boolean } = { needLoader: true }
  ): Promise<boolean>;
  /**
   * Handle ugc card click
   * @param callback
   * @since v2.9.0
   */
  set ugcCardClickHandler(callback: () => void);
  destroy(): void;
}
```

## UGCStoriesList example

```ts
// StoryManager singleton instance
const inAppStoryManager = new window.IAS.InAppStoryManager(storyManagerConfig);

// or get previously created (from page layout for example)
// const inAppStoryManager = window.IAS.InAppStoryManager.getInstance();

// AppearanceManager instance
const appearanceManager = new window.IAS.AppearanceManager();

// List instance
const storiesList = new storyManager.UGCStoriesList(
  "#stories_widget",
  appearanceManager,
  { filter: { prop1: "a", prop2: "b" } }
);

// subscribe on events
const publicEvents = [
  "feedLoad",
  "feedImpression",
  "visibleAreaUpdated",
  "clickOnStory",
  "showSlide",
  "showStory",
  "closeStory",
  "likeStory",
  "dislikeStory",
  "favoriteStory",
  "shareStory",
  "shareStoryWithPath",
  "clickOnFavoriteCell",
];
publicEvents.forEach((eventName) =>
  storyManager.on(eventName, (payload) =>
    console.log("event", eventName, payload)
  )
);

// payload for all events from UGCStoiesList and StoryReader (for stories from UGCStoiesList)
type Payload = {
  id: number;
  index: number;
  isDeeplink: boolean;
  title: string;
  slidesCount: number;
  feed: null;
  filter: Record<string, unknown>;
  source: "list";
  ugcPayload: Record<string, unknown>;
};
```

## UGCStoriesList reload example

```js
const storiesList = new storyManager.UGCStoriesList(
  "#stories_widget",
  appearanceManager,
  { filter: { prop1: "a", prop2: "b" } }
);

storiesList.setFilter({ prop1: "c", prop2: "d" });

storiesList.reload();
// or without loader animation
// storiesList.reload({needLoader: false});
```

## React UgcSdk

### Installation

### Package manager

Using **npm**:

```bash
$ npm install @inappstory/react-ugc-sdk
```

Using **yarn**:

```bash
$ yarn add @inappstory/react-ugc-sdk
```

Using pnpm:

```bash
$ pnpm add @inappstory/react-ugc-sdk
```

Once the package is installed, you can import the library using `import` approach:

```ts
import { UgcEditor, UgcSdk } from "@inappstory/react-ugc-sdk";
```

### React UgcSdk example

You can find a complete example [in the project repository](https://github.com/inappstory/ugc-web-sdk/blob/main/packages/app/src/App.tsx).

```tsx
import { UgcEditor, UgcSdk } from "@inappstory/react-ugc-sdk";

const storyManagerConfig = {
  apiKey: "{project-integration-key}",
  userId: "{user-identifier}", // usually - hash from real user identifier
};

// StoryManager singleton instance
const inAppStoryManager = new window.IAS.InAppStoryManager(storyManagerConfig);

// AppearanceManager instance
const appearanceManager = new window.IAS.AppearanceManager();

const storiesList = new storyManager.UGCStoriesList(
  "#stories_widget",
  appearanceManager,
  {
    filter: {},
    useUgcCard: true,
  }
);

// payload for ugc editor (pass to created story)
const ugcPayload = { prop1: "test", prop2: "test2" };
// available since ugc-sdk v1.1.0
const ugcCardClickHandler = () => UgcSdk.showEditor(storyManager, ugcPayload);

// set ugc card click handler
// available since js-sdk v2.9.0
storyList.ugcCardClickHandler = ugcCardClickHandler;

function App() {
  return (
    <div className="App">
      // Container for UgcSdk screen
      <UgcEditor safeAreaInsets={{ top: 0, bottom: 0 }} />
    </div>
  );
}
```
