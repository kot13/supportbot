# Refresh

Sometimes you may want to reload stories list after all data already loaded. For example if you've
changed tags or user called pull-to-refresh scenario In this case you can use next method:

```kotlin
fun reloadStoriesList(storiesList: StoriesList) {
    storiesList.loadStories()
}
```

:::tip
If you've changed `userId` - you don't need to call `loadStories` again after that. All
attached `StoriesList`'s' will be reloaded automatically.
:::

## Cache

In case if you use method `setCacheId` for the list, every `storiesList.loadStories()` call will getlist data from local cache. 
If you want to get new data - use the method `InAppStoryManager.getInstance()?.clearCachedList(cacheId)` or `InAppStoryManager.getInstance()?.clearCachedLists()` before `storiesList.loadStories()` call.



