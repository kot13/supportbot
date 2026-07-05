# IASFavorites

Class is used to remove stories from favorites with external way (f.e. by a button on a list
widget's item). Can be called from InAppStoryAPI:

```kotlin
val favoritesApi = inAppStoryApi.favorites
```

## Methods

To remove single story from favorite by id:

```kotlin
fun removeByStoryId(storyId: Int)
```

To remove all stories from favorites:

```kotlin
fun removeAll()
```