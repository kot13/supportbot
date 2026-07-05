# Tags

All tags can be set in `InAppStoryManager` initialization process through `InAppStoryManager.Builder()`

```kotlin
fun createInAppStoryManagerWithTags(
    apiKey: String,
    context: Context,
    userId: String,
    tags: ArrayList<String>
): InAppStoryManager {
    return InAppStoryManager.Builder()
        .apiKey(apiKey)
        .context(context)
        .userId(userId)
        .tags(tags)
        .create()
}
```

Besides that tags can be changed in runtime after `InAppStoryManager` initialization.

```kotlin
fun tagsAction(tags: ArrayList<String>) {
    InAppStoryManager.getInstance().addTags(tags) // Add tags to current tags list
    InAppStoryManager.getInstance().removeTags(tags) // Remove passed tags from current tags list
    InAppStoryManager.getInstance().setTags(tags) // Set new or completely replace current tags list
}
```

In that case you may need to reload `StoriesList` through `storiesList.loadStories()` if data was already loaded before.

```kotlin
fun setTagsAndReloadList(tags: ArrayList<String>, storiesList: StoriesList) {
    InAppStoryManager.getInstance().setTags(tags)
    storiesList.loadStories()
}
```
