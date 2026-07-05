import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to get started

## Installation

Add dependency via `npm` or `yarn` package managers:

<Tabs>
<TabItem value="npm" label="npm">

```shell
npm install @inappstory/react-native-sdk
```

</TabItem>
<TabItem value="yarn" label="yarn">

```shell
yarn add @inappstory/react-native-sdk
```

</TabItem>
</Tabs>

## Requirements

### iOS

Install pods with static frameworks, use `USE_FRAMEWORKS = 'static`' or have this in your Podfile:

```gemspec
use_frameworks! :linkage => :static
```

### Android

Make sure to update your Android SDK versions in `build.gradle`:

```gradle
minSdkVersion = 23
compileSdkVersion = 34
targetSdkVersion = 34
```

Import InAppStory SDK in MainApplication

```java
import com.inappstorysdk.InAppStory;
```

Add following code to `onCreate()` function:

```java
InAppStory.initSDK(getApplicationContext());
```

Update `MainActivity` class: 
```java
package com.example.yourapp;

import com.inappstorysdk.InAppStoryActivity;

class MainActivity extends InAppStoryActivity {
   /// ...
}

```

## AppVersion override

The app version is used by the platform to enable targeting of stories by app versions.
By default, IAS-SDK uses appVersion and appBundle from the native part of the application.
But you can override appVersion and appBundle via StoryManagerConfig.
This might be useful for CodePush users.

```ts
const storyManagerConfig: StoryManagerConfig = {
  apiKey,
  appVersion: {
    version: '3.0.0',
    build: 777,
  },
};
const storyManager = new StoryManager(storyManagerConfig);
```

## Migrating from the legacy React Native SDK

:::warning[Breaking changes]
1. Font settings are defined using separate variables (`fontSize`, `fontWeight`, `fontFamily`) instead of a String;
2. If you used `svgMask` in `appearanceManager`, try to use [custom cells](appearance.md#custom-story-cell) to achieve
   same results.
:::
