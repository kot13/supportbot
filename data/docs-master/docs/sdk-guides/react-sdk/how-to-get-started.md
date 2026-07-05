# How to get started

This is a guide on implementing React InAppstory SDK into your app.

## Installation

```bash
npm install @inappstory/react-sdk
```

## Usage

1. Create file with SDK options:

```ts
// inAppStoryOptions.ts

import {
    StoriesListCardTitlePosition,
    StoriesListCardTitleTextAlign,
    StoriesListCardViewVariant,
} from "@inappstory/react-sdk";

export const commonOptions = {
   hasShare: true
   hasLike: true,
   hasFavorite: true,
}

export const storiesListOptions = {}     
           
export const storyReaderOptions = {}
```

2. Create a StoryList wrapper:

```tsx
// App.tsx

import React, { useRef, useState } from "react"
import { commonOptions, storiesListOptions, storyReaderOptions } from "./inAppStoryOptions"
import { StoryList, StoryManagerConfig, IASContainer, storyManager } from "@inappstory/react-sdk"

export const App = () => {
    const storyManagerConfig: StoryManagerConfig = {
      apiKey: "{projectToken}",
    };

   const onClickOnStory = (payload: any) => {
      console.log(`You can subscribe to events using a <StoryManager> instance or using <IASContainer> props starting with "on"`, payload)
   }

    return (
      <IASContainer config={storyManagerConfig} 
      commonOptions={commonOptions} 
      storyReaderOptions={storyReaderOptions} 
      onClickOnStory={onClickOnStory}>
            <StoryList
                options={storiesListOptions}
                feedSlug="default"
                hasFavorite={false} /*If you want a list of favorite stories, set it to `true` */
            />
      </IASContainer>
    )
}
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
| `options`           | object                   | User variables and slide widgets variables. Since v1.7.6. [More details](options.md);                              |
| `options.pos`       | string                   | Point of sale. Since v1.7.6                                                                                        |
| `anonymous`         | boolean                  | Use anonymous session. Warning: not all functionality will be available. Since v3.6.6.                             |
| `cache`             | object                   | LRU cache for media and images resources. [More details](./cache.md)                                               |
| `hybridApp`         | object                   | An object with web view settings for a hybrid application for configuring the game reader viewport. Since v1.14.0. |

---

