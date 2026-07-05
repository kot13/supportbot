# Games (>1.15.0)

## Open game

Starting from v1.15.0 you can open games not only from stories, but through `InAppStoryManager` with
method `inAppStoryManager.openGame`

#### Example

```kotlin
fun openGameFromIASManager(
    iasManager: InAppStoryManager,
    gameId: String, //You can get it from console
    context: Context
) {
    iasManager.openGame(gameId, context)
}
```

## Close game

You can close opened game reader using the method `inAppStoryManager.closeGame`.

#### Example

```kotlin
fun closeGameExternally(
    iasManager: InAppStoryManager
) {
    iasManager.closeGame() //gameLoadedCallback can be null
}
```

## Preload games

Starting from v1.19.0 game preloading feature was added. Usually games preloads automatically after
opening session for user (first request for game/story/stories feed/onboardings, etc.). If you want
to preload games by yourself (f.e. in case if your app doesn't use any stories), you can call next
method:

```kotlin
fun preloadIASGames(iasManager: InAppStoryManager) {
    iasManager.preloadGames()
}
```

## Loading animation in games

Before v1.19.0 games can use default loading animation or you can override it
with `IGameReaderLoaderView`([More about it](appearance.md#igamereaderloaderview-1160)).
Starting from v1.19.0 you can use lottie animation in games ([More about it](lottie-animation.md))

## Notifications from Game reader

Starting from v1.15.0 new `GameReaderCallback` has been added. Old `GameCallback` was removed from
SDK in v1.17.0.

:::warning
`GameReaderCallback.gameOpenError` was added to SDK in v1.18.0.
:::

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

Here `ContentData` is a common class for `SlideData` or `InAppMessageData`:

```kotlin
enum class ContentType {
    STORY,
    UGC,
    IN_APP_MESSAGE
}

enum class InAppMessageType {
    FULLSCREEN,
    POPUP,
    BOTTOM_SHEET,
    TOAST,
    UNDEFINED
}

class ContentData(
    val contentType: ContentType,
    val sourceType: SourceType
)

data class StoryData(
    val id: SlideData?,
    val title: String?,
    val slidesCount: Int,
    val feed: String,
)

data class SlideData(
    val storyData: StoryData?,
    val index: Int,
    val payload: String?
) : ContentData

data class InAppMessageData(
    val id: Int,
    val title: String?,
    val event: String?,
    val messageType: InAppMessageType
) : ContentData
```

### GameCallback (< 1.15.x)

Before 1.15.x and lower you can use old callback:

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

## Reader customization

To customize close and icons - use `csCloseIcon` and `csRefresIcon` properties in global `AppearanceManager` instance.
[Here](appearance.md#close-and-refresh-buttons) more about icons customization
