# Events

## InAppStory Manager Callbacks

### Enums used in methods

```kotlin
enum class ContentType { 
    STORY,
    UGC,
    IN_APP_MESSAGE
}

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

### Method's objects

:::warning
Started from version 1.21.0 field `tags` was removed from `StoryData`
:::

```kotlin
class ContentData {
    fun contentType(): ContentType
    fun sourceType(): SourceType
}

class StoryData {
    fun id(): Int
    fun title(): String?
    fun slidesCount(): Int
    fun feed(): String
}

class SlideData : ContentData {
    fun storyData(): StoryData?
    fun index(): Int
    fun payload(): String?
}

class InAppMessageData : ContentData {
    fun id(): Int,
    fun title(): String?,
    fun event(): String?
}

data class ShownStoriesListItem(
    val slideData: StoryData?,
    val shownPercent: Float,
    val listIndex: Int
)
```

### Notifications from stories reader

:::warning
It is recommended not to keep context/views as strong references in any of the callbacks to prevent possible memory leaks.
:::

#### ShowStory

When you open story in reader (open Stories reader or swipe between its pages)

```kotlin
fun setIASShowStoryCallback() {
    InAppStoryManager.getInstance().setShowStoryCallback(
        object : ShowStoryCallback {
            override fun showStory(
                story: StoryData?,
                source: SourceType?,
                showStoryAction: ShowStoryAction?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

#### ShowSlide

When current visible slide loaded in reader

```kotlin
fun setIASShowSlideCallback() {
    InAppStoryManager.getInstance().setShowSlideCallback(
        object : ShowSlideCallback {
            override fun showSlide(
                slide: SlideData?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

#### CloseStory

When you close stories reader

```kotlin
fun setIASCloseStoryCallback() {
    InAppStoryManager.getInstance().setCloseStoryCallback(
        object : CloseStoryCallback {
            override fun closeStory(
                slide: SlideData?,
                action: CloseReader?,
                source: SourceType?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}

```

#### CallToAction

:::warning
Started from version 1.21.0 `SlideData` in callback was changed to `ContentData`
:::

When you click on a button in a story, or on story with a deeplink in storiesList. Same
as `setUrlClickCallback` but with additional story info.

```kotlin
fun setIASCallToActionCallback() {
    InAppStoryManager.getInstance().setCallToActionCallback(
        object : CallToActionCallback {
            override fun callToAction(
                context: Context?, //Here context of story reader or context of storiesList if it calls from it's deeplinks
                content: ContentData?,
                url: String?,
                action: ClickAction
            ) {
                if (content is SlideData) {
                    val storyData: StoryData = content.story
                    val slideIndex: Int = content.index
                    val storyId: Int = storyData.id
                    val storyTitle: String = storyData.title
                    val storySlidesCount: Int = storyData.slidesCount
                } else if (content is InAppMessageData) {
                    val inAppMessageId: Int = content.id
                    val title: String? = content.title
                    val event: String? = content.event
                }
                TODO("Not yet implemented")
            }
        }
    )
}
```

If you want to keep default link handling and add something in addition - you can use next example:

```kotlin
fun setCTACallbackWithDefaultLinkHandling() {
    InAppStoryManager.getInstance().setCallToActionCallback(
        object : CallToActionCallback {
            override fun callToAction(
                context: Context?, //Here context of story reader or context of storiesList if it calls from it's deeplinks
                contentData: ContentData?,
                url: String?,
                action: ClickAction
            ) {
                defaultLinkHandling(context)
                additionLinkHandling(context, contentData, url, action)
            }
        }
    )
}

fun defaultLinkHandling(context: Context?) {
    context?.let {
        val intent = Intent(Intent.ACTION_VIEW)
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        intent.setData(Uri.parse(url))
        it.startActivity(intent)
    }
}

fun additionLinkHandling(
    context: Context,
    contentData: ContentData?,
    url: String?,
    action: ClickAction
) {
    TODO("Not yet implemented")
}
```

#### FavoriteStory

When you click on `Favorite` button in stories reader.

```kotlin
fun setIASFavoriteStoryCallback() {
    InAppStoryManager.getInstance().setFavoriteStoryCallback(
        object : FavoriteStoryCallback {
            override fun favoriteStory(
                slide: SlideData?,
                value: Boolean
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

#### LikeDislikeStory

When you click on `Like` or `Dislike` buttons in stories reader.

```kotlin
fun setIASLikeDislikeStoryCallback() {
    InAppStoryManager.getInstance().setLikeDislikeStoryCallback(
        object : LikeDislikeStoryCallback {
            override fun likeStory(
                slide: SlideData?,
                value: Boolean
            ) {
                TODO("Not yet implemented")
            }

            override fun dislikeStory(
                slide: SlideData?,
                value: Boolean
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

#### ClickOnShareStory

When you click on `Share` button in stories reader. Does not override default share behaviour.

```kotlin
fun setIASClickOnShareStoryCallback() {
    InAppStoryManager.getInstance().setClickOnShareStoryCallback(
        object : ClickOnShareStoryCallback {
            override fun shareClick(
                slide: SlideData?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### Notifications from InAppStoryManager methods calls

#### OnboardingLoad

When you call `showOnboardingStories` and successfully load stories info from server.

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

#### SingleLoad

When you call `showStory` and successfully load single story info from server.

```kotlin
fun setIASSingleLoadCallback() {
    InAppStoryManager.getInstance().setSingleLoadCallback(
        object : SingleLoadCallback {
            override fun singleLoad(story: StoryData?) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### Notifications from widgets in Stories reader

Different widgets in stories reader can also trigger events. Look [here](/glossarium/statistics/stories-widget-events.md) for more information about possible widget events.

```kotlin
fun setIASStoryWidgetCallback() {
    InAppStoryManager.getInstance().setStoryWidgetCallback(
        object : StoryWidgetCallback {
            override fun widgetEvent(
                slideData: SlideData?,
                widgetEventName: String?,
                widgetData: Map<String, String?>?,
                feed: String?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### Notifications from Game reader

#### GameReader

Started from version 1.15.0 new `GameReaderCallback` was added. Old `GameCallback` still works for
games from stories, but marked as deprecated and will be removed in future versions

:::warning
Started from version 1.21.0 `GameStoryData` was removed and changed to `ContentData`
:::

#### Example

```kotlin
fun setIASGameCallback() {
    InAppStoryManager.getInstance().setGameReaderCallback(
        object : GameReaderCallback {
            override fun startGame(
                gameLaunchSourceData: ContentData?,
                id: String?
            ) {
                TODO("Not yet implemented")
            }

            override fun eventGame(
                gameLaunchSourceData: ContentData?,
                id: String?,
                eventName: String,
                payload: String
            ) {
                TODO("Not yet implemented")
            }

            override fun closeGame(
                gameLaunchSourceData: ContentData?,
                id: String?
            ) {
                TODO("Not yet implemented")
            }

            override fun gameLoadError(
                gameLaunchSourceData: ContentData?,
                id: String?
            ) {
                TODO("Not yet implemented")
            }

            override fun gameOpenError(
                gameLaunchSourceData: ContentData?,
                id: String?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

Before 1.14.x and lower you can use old callback:

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

### Catching load errors in SDK

#### Error

```kotlin
fun setIASErrorCallback() {
    //can be set with custom implementation or with ErrorCallbackAdapter class
    InAppStoryManager.getInstance().setErrorCallback(
        object : ErrorCallback() {
            override fun loadListError(feed: String?) {
                TODO("Not yet implemented")
            }

            override fun cacheError() {
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

## Stories List Callbacks

### Main callback

`StoriesList` actions (loading and clicks) can be obtained with `ListCallback`. It can be set with
custom implementation or with `ListCallbackAdapter` (default implementation for `ListCallback` with
empty methods) class

```kotlin
fun setIASStoriesListCallback(storiesList: StoriesList) {
    storiesList.setCallback(
        object : ListCallback {
            override fun storiesLoaded(size: Int, feed: String?, data: List<StoryData>?) {
                TODO("Not yet implemented")
            }

            override fun storiesUpdated(size: Int, feed: String?, data: List<StoryData>?) {
                TODO("Not yet implemented")
            }

            override fun loadError(feed: String?) {
                TODO("Not yet implemented")
            }

            override fun itemClick(
                storyData: StoryData,
                listIndex: Int,
                isFavoriteList: Boolean,
                feed: String?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### Scroll callback

Also you can handle list scroll events (start scrolling, user stop interaction, scroll ended):

```kotlin
fun setIASStoriesListScrollCallback(storiesList: StoriesList) {
    storiesList.setScrollCallback(
        object : ListScrollCallback {
            override fun scrollStart() {
                TODO("Not yet implemented")
            }

            override fun onVisibleAreaUpdated(
                items: MutableList<ShownStoriesListItem>?
            ) {
                TODO("Not yet implemented")
            }

            override fun scrollEnd() {
                TODO("Not yet implemented")
            }
        }
    )
}
```

It can be set with custom implementation or with `ListScrollCallbackAdapter` (default implementation
for `ListScrollCallback` with empty methods) class

For example it can be used to prevent touch events from parent containers during scroll or to gather
statistics about visible previews.

[Here](/glossarium/statistics/stories-widget-events.md) you can find full information about these events for each widget.

## Pivot table

### Callbacks

All manager events can be handled through `InAppStoryManager.getInstance().setEventNameCallback`.

| Event Name / Method                                                                                               | Variable                                                                                                   | Description                                                                                                   |
|-------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| [**ShowStoryCallback**](events.md#showstory)                                                                      ||
| `fun showStory(storyData: StoryData, source: SourceType, action: ShowStoryAction)`                                || calls when user see loaded story                                                                           |
|                                                                                                                   | `storyData`                                                                                                | all usable information about shown story (id, title, slides count)                                            |
|                                                                                                                   | `source`                                                                                                   | where story reader was opened                                                                                 |
|                                                                                                                   | `action`                                                                                                   | how story was opened in story reader                                                                          |
| [**ShowSlideCallback**](events.md#showslide)                                                                      ||
| `fun showSlide(slideData: SlideData)`                                                                             || calls when user see loaded slide                                                                           |
|                                                                                                                   | `slideData`                                                                                                | all usable information about shown slide (index) and it's story (id, title, slides count)                     |
|                                                                                                                   | `payload`                                                                                                  | slide's additional data                                                                                       |
| [**CloseStoryCallback**](events.md#closestory)                                                                    ||
| `fun closeStory(slideData: SlideData, action: CloseReader, source: SourceType)`                                   || calls when user closes story reader                                                                        |
|                                                                                                                   | `slideData`                                                                                                | all usable information about shown slide (index) and it's story (id, title, slides count)                     |
|                                                                                                                   | `action`                                                                                                   | how story reader was closed                                                                                   |
|                                                                                                                   | `source`                                                                                                   | where story reader was opened                                                                                 |
| [**CallToActionCallback**](events.md#calltoaction)                                                                ||
| `fun callToAction(context: Context, contentData: ContentData, link: String?, action: ClickAction)`                || calls when user interacts with special widgets on a slide or when he clicks on deeplink stories            |
|                                                                                                                   | `context`                                                                                                  | story/in-app message reader's or current screen's context (in case of feed's deeplinks clicking)              |
|                                                                                                                   | `contentData`                                                                                              | all usable information about shown content (slide of story or in-app message                                  |
|                                                                                                                   | `link`                                                                                                     | data to handle                                                                                                |
|                                                                                                                   | `action`                                                                                                   | which action was triggered                                                                                    |
| [**FavoriteStoryCallback**](events.md#favoritestory)                                                              ||
| `fun favoriteStory(slideData: SlideData, value: Boolean)`                                                         || calls when user tries to change story's favorite status                                                    |
|                                                                                                                   | `slideData`                                                                                                | all usable information about shown slide (index) and it's story (id, title, slides count)                     |
|                                                                                                                   | `value`                                                                                                    | value of event (add to favorite / remove from favorite)                                                       |
| [**LikeDislikeStoryCallback**](events.md#likedislikestory)                                                        ||
| `fun likeStory(slideData: SlideData, value: Boolean)`                                                             || calls when user tries to change story's like status                                                        |
|                                                                                                                   | `slideData`                                                                                                | all usable information about shown slide (index) and it's story (id, title, slides count)                     |
|                                                                                                                   | `value`                                                                                                    | value of event (set like / remove like)                                                                       
| `fun dislikeStory(slideData: SlideData, value: Boolean)`                                                          || calls when user tries to change story's dislike status                                                     |
|                                                                                                                   | `slideData`                                                                                                | all usable information about shown slide (index) and it's story (id, title, slides count)                     |
|                                                                                                                   | `value`                                                                                                    | value of event (set dislike / remove dislike)                                                                 |
| [**ClickOnShareStoryCallback**](events.md#clickonsharestory)                                                      ||
| `fun shareClick(slideData: SlideData)`                                                                            || calls when user clicks on share button                                                                     |
|                                                                                                                   | `slideData`                                                                                                | all usable information about shown slide (index) and it's story (id, title, slides count)                     |
| [**OnboardingLoadCallback**](events.md#onboardingload)                                                            ||
| `fun onboardingLoadSuccess(count: Int, feed: String?)`                                                            || calls when onboardings successfully loaded                                                                 |
|                                                                                                                   | `count`                                                                                                    | count of loaded onboardings                                                                                   |
|                                                                                                                   | `feed`                                                                                                     | feed of loaded onboardings                                                                                    |
| `fun onboardingLoadError(feed: String, String reason)`                                                            || calls when onboardings cannot be loaded                                                                    |
|                                                                                                                   | `feed`                                                                                                     | feed id for onboardings                                                                                       |
| [**SingleLoadCallback**](events.md#singleload)                                                                    ||
| `fun singleLoadSuccess(storyData: StoryData)`                                                                     || calls when single story successfully loaded                                                                |
|                                                                                                                   | `storyData`                                                                                                | all usable information about shown story (id, title, slides count)                                            |
| `fun singleLoadError(String storyId, String reason)`                                                              || calls when single story cannot be loaded                                                                   |
| [**StoryWidget**](events.md#notifications-from-widgets-in-stories-reader)                                         ||
| `fun widgetEvent(storyData: SlideData, widgetEventName: String, widgetData: Map<String, String?>, feed: String?)` || calls when single story successfully loaded                                                                |
|                                                                                                                   | `slideData`                                                                                                | all usable information about shown slide (index) and it's story (id, title, slides count)                     |
|                                                                                                                   | `widgetEventName`                                                                                          | name of interacted widget. Look [here](/glossarium/statistics/stories-widget-events.md) for more information. |
|                                                                                                                   | `widgetData`                                                                                               | parameters from widget. Look [here](/glossarium/statistics/stories-widget-events.md) for more information.    |
|                                                                                                                   | `feed`                                                                                                     | feed, where stories reader was opened (may be null)                                                           |
| [**GameReaderCallback**](events.md#notifications-from-game-reader)                                                ||
| `fun startGame(gameLaunchSourceData: ContentData, gameId: String?)`                                               || calls when game was started in game reader                                                                 |
|                                                                                                                   | `gameLaunchSourceData`                                                                                     | all usable information about story's slide/banner/in-app message linked to game                               |
|                                                                                                                   | `gameId`                                                                                                   | id of game                                                                                                    |
| `fun closeGame(gameLaunchSourceData: ContentData, gameId: String?)`                                               || calls when game was finished in game reader without result (or user close reader before game was started)  |
|                                                                                                                   | `gameLaunchSourceData`                                                                                     | all usable information about story's slide/banner/in-app message linked to game                               |
|                                                                                                                   | `gameId`                                                                                                   | id of game                                                                                                    |
| `fun gameLoadError(gameLaunchSourceData: ContentData, gameId: String?)`                                           || calls if game wasn't successfully loaded                                                                   |
|                                                                                                                   | `gameLaunchSourceData`                                                                                     | all usable information about story's slide/banner/in-app message linked to game                               |
|                                                                                                                   | `gameId`                                                                                                   | id of game                                                                                                    |
| `fun gameOpenError(gameLaunchSourceData: ContentData, gameId: String?)`                                           || calls if game can't be opened                                                                              |
|                                                                                                                   | `gameLaunchSourceData`                                                                                     | all usable information about story's slide/banner/in-app message linked to game                               |
|                                                                                                                   | `gameId`                                                                                                   | id of game                                                                                                    |
| `fun eventGame(gameLaunchSourceData: ContentData, gameId: String?, eventName: String?, payload: String?)`         || calls with any in-game event                                                                               |
|                                                                                                                   | `gameLaunchSourceData`                                                                                     | all usable information about story's slide/banner/in-app message linked to game                               |
|                                                                                                                   | `gameId`                                                                                                   | id of game                                                                                                    |
|                                                                                                                   | `eventName`                                                                                                | name of triggered event                                                                                       |
|                                                                                                                   | `payload`                                                                                                  | id of game                                                                                                    |
| [**Error**](events.md#error)                                                                                      ||
| `fun loadListError(feed: String)`                                                                                 || calls when stories list cannot be loaded                                                                   |
|                                                                                                                   | `feed`                                                                                                     | feed id for stories list                                                                                      |
| `fun cacheError()`                                                                                                || calls when story or slide cannot be loaded in reader                                                       |
| `fun emptyLinkError()`                                                                                            || calls when story is hidden in reader and does not contain another way to open                              |
| `fun sessionError()`                                                                                              || calls when session cannot be opened                                                                        |
| `fun noConnection()`                                                                                              || calls when there is no internet connection in some cases (deeplink, load slides)                           |

### Stories List Callbacks

All list events can be handled through `ListCallback` and `ListScrollCallback`

| Event Name / Method                                                           | Variable                                                           | Description                                                                                                         |
|-------------------------------------------------------------------------------|--------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| [**ListCallback**](events.md#main-callback)                                   ||
| `fun storiesLoaded(size: Int, feed: String, data: List<StoryData>?)`          || calls when stories list succesfully loaded                         |
|                                                                               | `size`                                                             | count of loaded stories in stories list                                                                             |
|                                                                               | `feed`                                                             | feed id for stories list                                                                                            |
|                                                                               | `data`                                                             | statistic data from stories                                                                                         |
| `fun storiesUpdated(size: Int, feed: String, data: List<StoryData>?)`         || calls when stories list loaded or add/remove it's items (favorite) |
|                                                                               | `size`                                                             | count of loaded stories in stories list                                                                             |
|                                                                               | `feed`                                                             | feed id for stories list                                                                                            |
|                                                                               | `data`                                                             | statistic data from stories                                                                                         |
| `fun loadError(feed: String)`                                                 || calls when list cannot be loaded                                   |
|                                                                               | `feed`                                                             | feed id for stories list                                                                                            |
| `fun itemClick(storyData: StoryData, listIndex: Int)`                         || calls user clicks on story preview in stories list                 |
|                                                                               | `storyData`                                                        | all usable information about shown story (id, title, slides count)                                                  |
|                                                                               | `listIndex`                                                        | index of story in stories list (including ugc item)                                                                 |
| [**ListScrollCallback**](events.md#scroll-callback)                           ||
| `fun scrollStart()`                                                           || calls when user starts to swipe stories list                       |
| `fun onVisibleAreaUpdated(shownStoriesListItems: List<ShownStoriesListItem>)` || calls when list loaded or list scroll action finished              |
|                                                                               | `shownStoriesListItems`                                            | all usable information about list items (story data: id, title, slides count; index in list; shown preview percent) |
| `fun scrollEnd()`                                                             || calls when user touch up on stories list                           |
