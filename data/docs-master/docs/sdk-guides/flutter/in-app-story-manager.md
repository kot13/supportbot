# InAppStoryManager

This singleton class is used to manage placeholders, tags, etc.

To call any method, you need to get an instance of this class:

```dart
  await InAppStoryManager.instance.methodName();
```

## Methods

| Method                                              | Description                                                                                        |
|-----------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `setPlaceholders(Map<String, String> placeholders)` | change Placeholders                                                                                |
| `setTags(List<String> tags)`                        | replacing all tags                                                                                 |
| `changeUser(String userId, {String? userSign})`     | replace the user in the application                                                                |
| `userLogout()`                                      | logout current user                                                                                |
| `closeReaders()`                                    | closing any story reader that showing                                                              |
| `setTransparentStatusBar()`                         | sets a transparent status bar for story reader in Android.                                         |
| `setLocale(Locale locale)`                          | sets a locale of story reader, must be created <br/>with region subtag (like `Locale('en', 'US')`) |
| `changeSound(bool enabled)`                         | changing sound control in story reader                                                             |
| `clearCache()`                                      | clears cached stories, games, in-app-messages                                                      |
| `setUserSettings(...)`                              | replace the user with [params](user-settings.md#change-user-settings)                              |
| `setGetSkusCallback()`                              | callback that used in [Goods](goods.md)                                                            |
| `setOnProductCartUpdate()`                          | used in [Checkout](checkout.md) to listen product cart updates                                     |
| `setGetProductCartState()`                          | used in [Checkout](checkout.md) to listen product cart current state                               |
| `setOptions(Map<String, String> options)`           | change [Options](options.md)                                                                       |