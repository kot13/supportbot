# User Settings

## Change userId

It may be necessary to replace the user in the application. For example - during registration or re-authorization.

To get this—you can use the `InAppStoryManager.instance.changeUser(<your new user>)` method.

:::warning[Please note]
Do not use personal data (phones, emails, passport data) as a user identifier.
userID must be a string not longer than 255 bytes.
:::

Get stories for new user `await FeedStoriesController().fetchFeedStories()`.

## User sign

If the app needs to sign a user (console security setting), then the parameter userSign needs to be passed with userId:

```dart
Future<void> changeUser(String id, sign) async {
  await InAppStoryManager.instance.changeUser(id, userSign: sign);
}
```

Or sign can be passed in initialization method:

```dart
Future<void> initSdk(String apiKey, String userId, String sign) async {
  await InAppStoryPlugin().initWith(apiKey, userId, userSign: sign);
}
```

## Change user settings

Another way to change user settings is to use `setUserSettings` method from `InAppStoryManager`

```dart
Future<void> changeUserSettings(
    String newUserId,
    String newSign,
    Locale newLocale,
    List<String> newTags,
    Map<String, String> newPlaceholders,
    ) async {
  await InAppStoryManager.instance.setUserSettings(
    userId: newUserId,
    userSign: newSign,
    locale: newLocale,
    tags: newTags,
    placeholders: newPlaceholders,
  );
}
```
