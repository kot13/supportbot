# Anonymous mode

Starting from 0.5.0 anonymous mode was added to SDK.

## Mode restrictions

Features below won't work in anonymous mode:

* Stories with any user-target widget, game links, etc
* Games
* In-App Messages
* Onboarding stories
* Favorites
* Banners

## Setup anonymous mode

Anonymous setting can be set through `initWith()` method in initialization process. 
The `userID` parameter will be ignored in that case.

```dart
Future<void> initSDK() async {
  await InAppStoryPlugin().initWith(apiKey, userID, anonymous: true);
}
```

## Change anonymous settings in runtime

Also, anonymous setting can be set through method `setUserSettings` in `InAppStoryManager`: 

```dart
Future<void> changeUserSettings(bool anonymous) async {
  await InAppStoryManager.instance.setUserSettings(anonymous: anonymous);
}
```

You can pass it with other parameters (but userId will be ignored)

```dart
 Future<void> changeUserSettings(
    bool anonymous,
    String newUserId,
    String newSign,
    Locale newLocale,
    List<String> newTags,
    Map<String, String> newPlaceholders) async {
  await InAppStoryManager.instance.setUserSettings(
      anonymous: anonymous,
      userId: newUserId,
      userSign: newSign,
      locale: newLocale,
      tags: newTags,
      placeholders: newPlaceholders);
}
```

