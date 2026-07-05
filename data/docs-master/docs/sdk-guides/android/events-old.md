---
title: Events (<1.17.0)
---

## InAppStory Manager Callbacks

### Enums used in methods

```kotlin
enum class SourceType {
    SINGLE,
    ONBOARDING,
    LIST,
    FAVORITE
}

enum class CloseReader {
    AUTO,
    CLICK,
    SWIPE,
    CUSTOM
}

enum class ClickAction {
    BUTTON,
    SWIPE,
    GAME,
    DEEPLINK
}

enum class ShowStoryAction {
    OPEN,
    TAP,
    SWIPE,
    AUTO,
    CUSTOM
}
```

### Handlers that override default behaviour

When you click on the `Share` button in the stories reader, or on the `Share widget` in the story or in the game.

```kotlin
fun setIASShareCallback() {
    InAppStoryManager.getInstance().setShareCallback(
        object : ShareCallback {
            override fun onShare(
                url: String?,
                title: String?,
                description: String?,
                shareId: String?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### Notifications from stories reader

1. When you open a story in the reader (open Stories reader or swipe between it's pages):

```kotlin
fun setIASShowStoryCallback() {
    InAppStoryManager.getInstance().setShowStoryCallback(
        object : ShowStoryCallback {
            override fun showStory(
                id: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                source: SourceType?,
                action: ShowStoryAction?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

2. When you close the stories reader:

```kotlin
fun setIASCloseStoryCallback() {
    InAppStoryManager.getInstance().setCloseStoryCallback(
        object : CloseStoryCallback {
            override fun closeStory(
                id: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                index: Int,
                action: CloseReader?,
                source: SourceType?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}

```

3. When you click on a button in a story, or on story with a deeplink in storiesList. Same
   as `setUrlClickCallback` but with additional story information:

```kotlin
fun setIASCallToActionCallback() {
    InAppStoryManager.getInstance().setCallToActionCallback(
        object : CallToActionCallback {
            override fun callToAction(
                id: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                index: Int,
                link: String?,
                action: ClickAction?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

4. When current visible slide loaded in reader

```kotlin
fun setIASShowSlideCallback() {
    InAppStoryManager.getInstance().setShowSlideCallback(
        object : ShowSlideCallback {
            override fun showSlide(
                id: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                index: Int,
                payload: String?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

5. When you click on `Share` button in the stories reader. Does not override default share behaviour.

```kotlin
fun setIASClickOnShareStoryCallback() {
    InAppStoryManager.getInstance().setClickOnShareStoryCallback(
        object : ClickOnShareStoryCallback {
            override fun shareClick(
                id: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                index: Int
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

6. When you click on `Like` or `Dislike` buttons in the stories reader:

```kotlin
fun setIASLikeDislikeStoryCallback() {
    InAppStoryManager.getInstance().setLikeDislikeStoryCallback(
        object : LikeDislikeStoryCallback {
            override fun likeStory(
                id: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                index: Int,
                value: Boolean
            ) {
                TODO("Not yet implemented")
            }

            override fun dislikeStory(
                id: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                index: Int,
                value: Boolean
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

7. When you click on `Favorite` button in the stories reader:

```kotlin
fun setIASFavoriteStoryCallback() {
    InAppStoryManager.getInstance().setFavoriteStoryCallback(
        object : FavoriteStoryCallback {
            override fun favoriteStory(
                id: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                index: Int,
                value: Boolean
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### Notifications from InAppStoryManager methods calls

1. When you call `showStory` and successfully load single story info from the server:

```kotlin
fun setIASSingleLoadCallback() {
    InAppStoryManager.getInstance().setSingleLoadCallback(
        object : SingleLoadCallback {
            override fun singleLoad(storyId: String?) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

2. When you call `showOnboardingStories` and successfully load stories info from the server:

```kotlin
fun setIASOnboardingLoadCallback() {
    InAppStoryManager.getInstance().setOnboardingLoadCallback(
        object : OnboardingLoadCallback {
            override fun onboardingLoad(count: Int, feed: String?) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### Catching load errors in SDK

```kotlin
fun setIASErrorCallback() {
    //can be set with custom implementation or with ErrorCallbackAdapter class
    InAppStoryManager.getInstance().setErrorCallback(
        object : ErrorCallback() {
            override fun loadListError(feed: String?) {
                TODO("Not yet implemented")
            }

            override fun loadOnboardingError(feed: String?) {
                TODO("Not yet implemented")
            }

            override fun loadSingleError() {
                TODO("Not yet implemented")
            }

            override fun cacheError() {
                TODO("Not yet implemented")
            }

            override fun readerError() {
                TODO("Not yet implemented")
            }

            override fun emptyLinkError() {
                TODO("Not yet implemented")
            }

            override fun sessionError() {
                TODO("Not yet implemented")
            }

            override fun noConnection() {
                TODO("Not yet implemented")
            }

        }
    )
}
```

### Notifications from Game reader

Starting from v1.15.0 the new `GameReaderCallback` **was added**. The old `GameCallback` still works for
games in stories, but marked as **deprecated** and will be removed in future versions

#### Example

```kotlin
fun setIASGameCallback() {
    InAppStoryManager.getInstance().setGameReaderCallback(
        object : GameReaderCallback {
            override fun startGame(
                gameStoryData: GameStoryData?,
                id: String?
            ) {
                TODO("Not yet implemented")
            }

            override fun closeGame(
                gameStoryData: GameStoryData?,
                id: String?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

Here `GameStoryData` is the next class:

```kotlin
enum class StoryType {
    COMMON,
    UGC
}

data class GameStoryData(
    var storyId: Int,
    var feedId: String?,
    var slideIndex: Int,
    var slidesCount: Int,
    var title: String?,
    var tags: String,
    var type: StoryType
)
```

Before v1.14.x and lower versions you can use the old callback:

```kotlin
fun setIASGameCallbackOld() {
    InAppStoryManager.getInstance().setGameCallback(
        object : GameCallback {
            override fun startGame(
                id: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                index: Int
            ) {
                TODO("Not yet implemented")
            }

            override fun closeGame(
                id: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                index: Int
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### Notifications from widgets in Stories reader

```kotlin
fun setIASStoryWidgetCallback() {
    InAppStoryManager.getInstance().setStoryWidgetCallback(
        object : StoryWidgetCallback {
            override fun widgetEvent(
                widgetName: String?,
                widgetData: Map<String, String?>?,
                id: Int,
                title: String?,
                feed: String?,
                slidesCount: Int,
                slideIndex: Int,
                tags: String?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

[Here](/glossarium/statistics/stories-widget-events.md) you can find full information about these events for each widget.

## Stories List Callbacks

`StoriesList` actions (loading and clicks) can be obtained with `ListCallback`. It can be set with
custom implementation or with `ListCallbackAdapter` (default implementation for `ListCallback` with
empty methods) class.

```kotlin
fun setIASStoriesListCallback(storiesList: StoriesList) {
    storiesList.setCallback(
        object : ListCallback {
            override fun storiesLoaded(size: Int, feed: String?) {
                TODO("Not yet implemented")
            }

            override fun storiesUpdated(size: Int, feed: String?) {
                TODO("Not yet implemented")
            }

            override fun loadError(feed: String?) {
                TODO("Not yet implemented")
            }

            override fun itemClick(
                storyId: Int,
                listIndex: Int,
                title: String?,
                tags: String?,
                slidesCount: Int,
                isFavoriteList: Boolean,
                feed: String?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

Starting from v1.11.1 a callback to **handle list scroll events** (start and stop) was added:

```kotlin
fun setIASStoriesListCallback(storiesList: StoriesList) {
    storiesList.setScrollCallback(
        object : ListScrollCallback {
            override fun scrollStart() {
                TODO("Not yet implemented")
            }

            override fun scrollEnd() {
                TODO("Not yet implemented")
            }
        }
    )
}
```

For example it can be used to prevent touch events from parent containers during scroll.
