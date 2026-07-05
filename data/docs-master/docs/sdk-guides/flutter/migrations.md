import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Migrations

## From 0.7.2-0.7.5 to 0.7.6

### BannerPlace callbacks

In version `0.7.6`, the `IASbannerPlaceCallback` mixin was removed from the SDK. All widget events can be listened with
callbacks in the `BannerPlace` widget. Check out [new implementation](banners.md#events).

```dart
// New implementation

class BannersPage extends StatefulWidget {
  const BannersPage({super.key});

  @override
  State<BannersPage> createState() => _BannersPageState();
}

class _BannersPageState extends State<BannersPage> {
  final _placeId = "placeId";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Column(
        children: [
          BannerPlace(
              placeId: _placeId,
              height: 120,
              // Add callback
              onBannerScroll: (index) {
                // Do anything related
              }
          ),
        ],
      ),
    );
  }
}
```

## From 0.7.0 to 0.7.1

In the `0.7.1` release of the library Android SDK initialization part has changed. Instead of extending `MainActivity`
from
`FlutterFragmentActivity` you need to extend it from `InAppStoryActivity`:

<Tabs>
<TabItem value="kotlin" label="Kotlin">

```kotlin
package com.example.yourapp;

import com.inappstory.inappstory_plugin.activity.InAppStoryActivity

class MainActivity : InAppStoryActivity();
```

</TabItem>
<TabItem value="java" label="Java">

```java
package com.example.yourapp;

import com.inappstory.inappstory_plugin.activity.InAppStoryActivity;

class MainActivity extends InAppStoryActivity {
}
```

</TabItem>
</Tabs>

## From 0.6.1 to 0.7.0

### Gamer reader callbacks

In the `0.7.0`release the `GameReaderCallbackFlutterApi` was changed to `IASGameReaderCallback` mixin. To use
`IASGameReaderCallback` correctly, follow the [documentation](games.md#callbacks).

### Banner place callbacks

`IASBannerPlaceCallback` mixin was updated and now supports placing multiple banner places on one screen. Please update
integration with new [instructions](banners.md#events).

## From 0.3.4–0.3.6 to 0.4.0

### AppearanceManager

In version `0.4.0` `AppearanceManagerHostApi` class is a singleton. To
access [AppearanceManager](appearance-manager.md#appearancemanager) you need to call `AppearanceManager.instance`
instance of class.

Below is an example of enabling `like` functionality:

```dart

// old
Future<void> changeHasLikeOld(bool enabled) async {
  await AppearanceManagerHostApi().setHasLike(enabled);
}

// new
Future<void> changeHasLike(bool enabled) async {
  await AppearanceManager.instance.changeUser(enabled);
}
```

### CallToAction

`CallToActionCallbackFlutterApi` callback is now a mixin class - `IASCallToActionCallback`. You can find the new class
implementation [here](call-to-action.md).

## From 0.3.3 to 0.3.4

### InAppStoryManager

`InAppStoryManager` class is now a singleton. To access `InAppStoryManager` you need to call
`InAppStoryManager.instance` instance of class.

Below is an example of changing the user:

```dart
// old
Future<void> changeUserOld(String newUserId) async {
  await InAppStoryManagerHostApi().changeUser(newUserId);
}

// new
Future<void> changeUser(String newUserId) async {
  await InAppStoryManager.instance.changeUser(newUserId);
}
```

## From 0.2.x to 0.3.x

:::warning
### Deprecated
In this version, a new `FeedStoriesWidget` widget replaced `InAppStoryPlugin().getStoriesWidgets()` method that allows
you to customize the appearance of the story content.
<br/>For more information read [here](feed-stories-widget.md);

Methods `InAppStoryPlugin().getStoriesWidgets()` and `InAppStoryPlugin().getFavoritesStoriesWidgets()` are now
deprecated and will be removed in future releases.

:::

### Android initialization

By default, Android `MainActivity` class is extended by `FlutterActivity`. To use In-App-Messaging feature, you need to
extend `MainActivity` class from `FlutterFragmentActivity`. Below you can find an example of implementation:

```kotlin
package com.example.app

import io.flutter.embedding.android.FlutterFragmentActivity

class MainActivity : FlutterFragmentActivity()
```