# IASStackFeed

Class is used for communication between [stack-feed](/sdk-guides/android/stack-feed.md) widgets
and `IAS Android SDK`; Can be called from InAppStoryAPI:

```kotlin
val stackFeedApi = inAppStoryApi.stackFeed
```

## Methods

To load data for stack feed:

```kotlin
fun get(
    feed: String,
    uniqueStackId: String,
    appearanceManager: AppearanceManager,
    tags: List<String>?,
    stackFeedResult: IStackFeedResult
)
```