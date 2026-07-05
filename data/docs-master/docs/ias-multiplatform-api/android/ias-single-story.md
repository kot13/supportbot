# IASSingleStory

Class is used to show story reader with a [single story](/sdk-guides/android/single-story.md)
called by id. Can be called from InAppStoryAPI:

```kotlin
val singleStoryAPI = inAppStoryApi.singleStory
```

## Methods

To show single story in reader by id

```kotlin
fun show(
    context: Context,
    storyId: String,
    appearanceManager: AppearanceManager,
    callback: IShowStoryCallback,
    slide: Int?
)
```

To show single story in reader by id if wasn't show already for current user

```kotlin
fun showOnce(
    context: Context,
    storyId: String,
    appearanceManager: AppearanceManager,
    callback: IShowStoryCallback
)
```

To set `SingleLoadCallback`

```kotlin
fun loadCallback(callback: SingleLoadCallback)
```