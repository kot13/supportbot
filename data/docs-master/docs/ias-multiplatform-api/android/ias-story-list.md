# IASStoryList

Class is used for communication between list widgets and `IAS Android SDK`. Can be called from
InAppStoryAPI:

```kotlin
val storyListApi = inAppStoryApi.storyList
```

## Methods

To load data for any feed:

```kotlin
fun load(
    feed: String?, //can be skipped if isFavorite == true
    uniqueId: String?, //can be skipped, but it's better to pass ID (for favorites it has to be passed), equals to feed by default
    hasFavorite: Boolean, //load favorite item for list or not
    isFavorite: Boolean, //load common feed or user's favorites
    tags: List<String>?
) 
```

To open story reader for concrete list/feed

```kotlin
fun openStoryReader(
    context: Context,
    uniqueId: String, //feed or uniqueId 
    storyId: Int, //on which story from start reader should be opened
    appearanceManager: AppearanceManager
)
```

To notify SDK about list items was shown on a screen (to start image caching and gather statistic):

```kotlin
fun updateVisiblePreviews(
    storyIds: List<Integer>, //shown ids. Can be sent one by one but it's better to pass multiple items simultaneously after widget is loaded
    uniqueId: String //feed or uniqueId 
)
```

To notify SDK about list favorite item was shown on a screen (to start image caching):

```kotlin
fun showFavoriteItem(
    uniqueId: String //feed or uniqueId 
)
```