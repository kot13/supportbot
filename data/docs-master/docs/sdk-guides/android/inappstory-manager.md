# InAppStoryManager

InAppStoryManager is the **main** InAppStory SDK class. It must be initialized before loading
stories from any point.

## Initialization

InAppStoryManager can be initialized from any point with `Context`
access (`Application`, `Activity`, `Fragment`, etc.) through `Builder` pattern.

```kotlin
fun createInAppStoryManager(
    apiKey: String,
    userId: String,
    userSign: String? = null,
    lang: Locale? = Locale.getDefault(),
    gamesInDemoMode: Boolean = false, //from 1.17.16 only
    isDeviceIdEnabled: Boolean = true, //from 1.17.16 only
    tags: ArrayList<String>,
    placeholders: Map<String, String>,
    imagePlaceholders: Map<String, ImagePlaceholderValue>,
    cacheSize: Int = CacheSize.MEDIUM,
    testKey: String
): InAppStoryManager? {
    return InAppStoryManager.Builder()
        .apiKey(apiKey)
        .userId(
            userId,
            userSign
        ) //from 1.20.8 only. In previous versions use .userId(userId) instead.
        .tags(tags)
        .gameDemoMode(gamesInDemoMode) //from 1.17.16 only, true by default
        .isDeviceIdEnabled(isDeviceIdEnabled) //from 1.17.16 only, true by default
        .placeholders(placeholders)
        .lang(lang)
        .imagePlaceholders(imagePlaceholders)
        .cacheSize(cacheSize)
        .testKey(testKey)
        .create();
}
```

:::warning
In SDK versions \<=1.17.x methods `context: Context` has to be passed in `Builder` object.
:::

:::warning
In SDK versions \<=1.13.2 methods `create()` and `userId()` may generate `DataException` if SDK
wasn't previously initialized. <br/>
It's strictly recommended to catch `DataException` for additional info.
:::

:::warning[1.14.0]
`DataException` was **removed** and all errors are now displayed in logs.
:::

- `userId` cannot be longer than 255 characters. Can be set in the start via `InAppStoryManager` or
  later with method `setUserId`.
  If `isDeviceIdEnabled` is set to false `userId` must be set to `non-empty string.
- `apiKey` is an SDK authorization key. It can be set through `Builder` or
  in `values/constants.xml`.
- `context` may be of any type (`Activity` or `Application`), but application context is preferred.

```xml

<string name="csApiKey">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</string>
```

- Parameters `userId`, `tags`, `placeholders`, `imagePlaceholders`, `cacheSize`, `testKey` are
  optional.

- If the project needs to sign a user (console security setting), then the parameter `userSign`
  needs to be passed with `userId`:

```kotlin
InAppStoryManager.Builder()
    .userId(
        userId,
        userSign
    )
```

- Besides `userId` you can specify tags and placeholders for the user. `tags` is used for targeting
  stories
  in `StoriesList` or onboardings, `Placeholders` and `imagePlaceholders` for replacing special
  variables in the story content.

- Started from SDK ver 1.21.0, if you want to `logout` current user from SDK, you can use method `userLogout`

```kotlin
InAppStoryManager.getInstance().userLogout()
```

- Also you can set tags and placeholders when you logout user:

```kotlin
fun logoutWithParameters(newTags: List<String>, newPlaceholders: Map<String, String?>) {
    InAppStoryManager.getInstance().userLogout(
        InAppStoryUserSettings().tags(newTags).placeholders(newPlaceholders)
    )
}
```

- If you want to set new user and other parameters like tags simultaneously, you can use method `userSettings`

```kotlin
fun setUserSettings(
    newUserId: String, 
    newUserSign: String? = null,
    newLang: Locale? = null,
    newTags: List<String>? = null, 
    newPlaceholders: Map<String, String?>? = null,
    newImagePlaceholders: Map<String, ImagePlaceholderValue?>? = null,
) {
    InAppStoryManager.getInstance().userSettings(
        InAppStoryUserSettings()
            .userId(newUserId, newUserSign)
            .lang(newLang)
            .tags(newTags)
            .placeholders(newPlaceholders)
            .imagePlaceholders(newImagePlaceholders)
    )
}
```


- You can also set an amount of space which SDK can use for caching stories files (images, videos)
  with `cacheSize` parameter. In can be set with one of constants below.

```kotlin
CacheSize.SMALL //equal to 15mb;
CacheSize.MEDIUM //equal to 110mb, uses by default;
CacheSize.LARGE //equal to 210mb;
```

- Parameter `testKey` allows you to test stories in moderation status.

After initialization you can use `InAppStoryManager` by store `create()` result in any variable or
via `InAppStoryManager.getInstance()`.

## Methods

`InAppStoryManager` class contains static and non-static methods.

### Static methods

| Method                                                                                | Return type             | Description                                                                                                                 |
|---------------------------------------------------------------------------------------|-------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| `closeStoryReader()`                                                                  | `void`                  | Used for closing stories reader (for example in button click callbacks)                                                     |
| `closeStoryReader(forceClose: Boolean, forceCloseCallback: ForceCloseReaderCallback)` | `void`                  | Used for force closing stories reader without animation                                                                     |
| `getLibraryVersion()`                                                                 | `Pair<String, Integer>` | Returns the version name and version code                                                                                   |
| `isInitialized()`                                                                     | `boolean`               | Used for checking if InAppStoryManager is not initialized                                                                   |
| `isInitializedOrInitProcess()`                                                        | `boolean`               | Used for checking if InAppStoryManager is not initialized or still in init process                                          |
| `isGameReaderOpened()`                                                                | `boolean`               | Used for checking if game reader is opened                                                                                  |
| `isStoryReaderOpened()`                                                               | `boolean`               | Used for checking if stories reader is opened                                                                               |
| `isInAppMessageReaderOpened()`                                                        | `boolean`               | Used for checking if in-app messages reader is opened                                                                       |

### Non-static methods

InAppStoryManager is a singleton. You can use it's non-static methods like this:

```kotlin
    InAppStoryManager.getInstance()?.methodName()
```

| Method                                                                                                                                 | Description                                                                                                                                                                              |
|----------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `setTags(tags: ArrayList<String>)`                                                                                                     | Set or replace tags list                                                                                                                                                                 |
| `addTags(tags: ArrayList<String>)`                                                                                                     | Add tags to current tags list                                                                                                                                                            |
| `removeTags(tags: ArrayList<String>)`                                                                                                  | Remove passed tags from current tags list                                                                                                                                                |
| `setPlaceholders(placeholders: Map<String, String?>)`                                                                                  | Set or replace placeholders list                                                                                                                                                         |
| `setPlaceholder(key: String, value: String?)`                                                                                          | Set placeholder in the placeholders list. If you pass null, then the placeholder will be removed                                                                                         |
| `setImagePlaceholders(placeholders: Map<String, ImagePlaceholderValue?>)`                                                              | Set or replace image placeholders list                                                                                                                                                   |
| `setImagePlaceholder(key: String, value: ImagePlaceholderValue?)`                                                                      | Set image placeholder in the image placeholders list. If you pass null, then the placeholder will be removed                                                                             |
| `getPlaceholders(): Map<String, String>`                                                                                               | Returns current placeholder list                                                                                                                                                         |
| `setTestKey(testKey: String)`                                                                                                          | Set testKey to test stories in moderation status                                                                                                                                         |
| `setUserId(userId: String)`                                                                                                            | Change current userId. UserId can't be longer than 255 characters                                                                                                                        |
| `setUserId(userId: String, userSign: String?)`                                                                                         | Change current userId passing user sign parameter. UserId can't be longer than 255 characters                                                                                            |
| `setAppVersion(@NonNull String version, int build)`                                                                                    | Change app version and build instead of defaults (from BuildVersion).                                                                                                                    |
| `setLang(locale: Locale)`                                                                                                              | Change language for content if supports (instead of device's locale set value will be used)                                                                                              |
| `userLogout()`                                                                                                                         | Clears cached lists, background tasks, and closes current user session.                                                                                                                  |
| `userSettings(settings: InAppStoryUserSettings)`                                                                                       | Allows to rewrite all user settings (userId, tags, placeholders, etc.) in one method.                                                                                                    |
| `showOnboardingStories(context: Context, manager: AppearanceManager)`                                                                  | Load and show reader with onboarding stories. Pass context from screen where you want to show reader. AppearanceManager can be null (common AppearanceManager will be used in this case) |
| `showOnboardingStories(tags: List<String>, context: Context, manager: AppearanceManager)`                                              | Same as the previous parameter, but you can specify tags for onboardings list                                                                                                            |
| `showStory(storyId: String, context: Context, manager: AppearanceManager)`                                                             | Load and show story in stories reader by it's id.                                                                                                                                        |
| `getStackFeed(feed: String, uniqueStackId: String, tags: List<String>, manager: AppearanceManager, stackFeedResult: IStackFeedResult)` | Get data feed data to show it in a single list item.                                                                                                                                     |
| `closeGame()`                                                                                                                          | Used for closing game reader from external source                                                                                                                                        | 
| `clearCache()`                                                                                                                         | Use to check if InAppStoryManager is not created                                                                                                                                         |

:::tip
Method `setUserId(userId: String)` automatically refreshes all `storiesList` instances in the
application if `userId` has changed. It may lead to event generation or callback responses.
:::

Besides these methods there also exist [callback](events.md) setters.
