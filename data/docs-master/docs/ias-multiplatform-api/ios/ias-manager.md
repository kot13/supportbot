# IASManager

Class is used to build an instance
of [`InAppStoryManager`](/sdk-guides/android/inappstory-manager.md). Can be called from
InAppStoryAPI:

```kotlin
val iasManager = inAppStoryApi.inAppStoryManager
```

## Methods

To create instance use next method:

```kotlin
fun create(
    apiKey: String?,
    userId: String?,
    lang: Locale?,
    tags: ArrayList<String>?,
    placeholders: Map<String, String>?,
    imagePlaceholders: Map<String, ImagePlaceholderValue>?,
    testKey: String,
    gameDemoMode: Boolean?,
    deviceIdEnabled: Boolean?,
    cacheSize: Int?,
    sandbox: Boolean?
): InAppStoryManager
```
