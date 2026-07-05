# How to get started

:::warning
* Starting from `JS SDK 3` we have renamed `StoryManager` to `InAppStoryManager`
* Use `window.IAS.InAppStoryManager` and `window.IAS.AppearanceManager` for `CDN` version
:::

## Install from NPM

```bash
npm install @inappstory/js-sdk
```

```tsx
import { InAppStoryManager, AppearanceManager } from "@inappstory/js-sdk";
```

The first step in SDK setup is to create and place the `<div id="stories_widget">` container into your markup.<br/>
The `<div>` tag in this section identifies the location on the page where the js-sdk API will place the Stories
widget. The constructor for the widget object identifies

That is everything you need for Stories Widget to work. Additionally, you can visit the [appearance](feeds.md) section to learn more about widget customization.

## NPM integration example

```html
<div id="stories_widget"></div>
```

```ts
import { AppearanceManager, InAppStoryManager } from "@inappstory/js-sdk";

const inAppStoryManagerConfig = {
  apiKey: "{project-integration-key}",
  userId: "{user-identifier}",
};

const inAppStoryManager = new InAppStoryManager(inAppStoryManagerConfig);
const appearanceManager = new AppearanceManager();
const storiesList = new inAppStoryManager.StoriesList(
  "#stories_widget",
  appearanceManager,
  {
    feed: "default",
  }
);

```
## Use from CDN

The first step in SDK setup is to create and place the `<div id="stories_widget">` container in the body of your markup.<br/>
The `<div>` tag in this section identifies the location on the page where the js-sdk API will place the Stories widget. The constructor for the widget object identifies

That is everything you need for Stories Widget to work. Additionally, you can visit the [appearance](feeds.md) section to learn more about widget customization.

## CDN integration example

```html
<!DOCTYPE html>
<head>
  <meta charset="utf-8" />
</head>

<html>
  <body>
    <div id="stories_widget"></div>
    <script
      defer
      src="https://cdn.domain-placeholder/sdk/js-sdk-version-placeholder/dist/js/IAS.js"
    ></script>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const inAppStoryManagerConfig = {
          apiKey: "{project-integration-key}",
        };

        const inAppStoryManager = new window.IAS.InAppStoryManager(inAppStoryManagerConfig);
        const appearanceManager = new window.IAS.AppearanceManager();
        const storiesList = new inAppStoryManager.StoriesList(
          "#stories_widget",
          appearanceManager,
          { feed: "default" }
        );

        const events = [
          "clickOnStory",
          "showSlide",
          "showStory",
          "closeStory",
          "clickOnButton",
          "likeStory",
          "dislikeStory",
          "favoriteStory",
          "shareStory",
          "shareStoryWithPath",
          "feedLoad",
          "feedImpression",
        ];
        events.forEach((eventName) =>
          inAppStoryManager.on(eventName, (payload) =>
            console.log("event", eventName, payload)
          )
        );
      });
    </script>
  </body>
</html>
```

## Configuration

Configuration options for initializing the IAS SDK.

| Field               | Type                     | Description                                                                                                        |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `apiKey`            | string                   | **Required.** API integration key for initializing the SDK.                                                        |
| `userId`            | string \| number         | Unique user identifier. [More details](./user-settings.md).                                                        |
| `userIdSign`        | string                   | Signature for the userId for validation. [More details](./user-settings.md#).                                      |
| `tags`              | string[]                 | Tags used to filter stories. [More details](./tags.md).                                                            |
| `placeholders`      | `Record<string, string>` | Text placeholders in stories. [More details](./placeholders.md).                                                   |
| `imagePlaceholders` | `Record<string, string>` | Image placeholders in stories. [More details](./placeholders.md#image-placeholders).                               |
| `lang`              | string                   | Language code for content (e.g., `en-US`).                                                                         |
| `dir`               | "ltr" \| "rtl"           | Text direction.                                                                                                    |
| `disableDeviceId`   | boolean                  | Disables automatic `deviceId` generation. [More details](./user-settings.md#device-id-and-exception-handling).     |
| `options`           | object                   | User variables and slide widgets variables. Since v3.6.6. [More details](options.md);                              |
| `options.pos`       | string                   | Point of sale. Since v3.6.6                                                                                        |
| `anonymous`         | boolean                  | Use anonymous session. Warning: not all functionality will be available. Since v3.6.6                              |
| `cache`             | object                   | LRU cache for media and images resources. [More details](./cache.md)                                               |
| `hybridApp`         | object                   | An object with web view settings for a hybrid application for configuring the game reader viewport. Since v3.13.0. |

---

