# Jetpack Compose integration

## Adding to screen

`StoriesList` is a `View` class. If you want to add it to any composable, you need to boxing it
in `AndroidView` class like any other `View`s.

```kotlin
@Composable
fun ComposableWithStoriesList() {
    AndroidView(
        modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight()
    ) {
        factory = { context ->
            StoriesList(context).apply {
                //Do any StoriesList customization, like change feed, set AppearanceManager etc...
                loadStories()
            }
        }
    }
}
```

Also you can use call stories loading in side effects. In this case you need to create
StoriesList object in Composable body and pass it to AndroidView:

```kotlin
@Composable
fun ComposableWithStoriesList() {
    val context = LocalContext.current
    val storiesList = remember {
        StoriesList(context).apply {
            //Do any StoriesList customization, like change feed, set AppearanceManager etc...
        }
    }
    AndroidView(
        modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight()
    ) {
        factory = { _ ->
            storiesList
        }
    }
    LaunchedEffect(true) {
        storiesList.loadStories()
    }
}
```

## Cache

If your composable will be destroyed and recreated during app navigation (for example if you move to
another screen and then return back) - `StoriesList` will be also recreated. In that case method
`storiesList.loadStories()` will be called again and user will be waiting it's result every time
this happens. To prevent this type of behaviour you need to use
method `storiesList.setCacheId(cacheId)`.

Now every `storiesList.loadStories()` call will get list data from local cache. If you want to get
new data (for example in case of Pull-To-Refresh or if you don't need your composable with
`StoriesList` anymore) - before `storiesList.loadStories()` call you need to use on of next methods:
`clearCachedListById(cacheId)`, `clearCachedListByFeed(feed)`, `clearCachedListByIdAndFeed(cacheId, feed)`
or `InAppStoryManager.getInstance()?.clearCachedLists()`

```kotlin
@Composable
fun ComposableWithStoriesList(cacheId: String, navigateBack: () -> Unit) {
    val context = LocalContext.current
    val storiesList = remember {
        getStoriesListWithCacheId(context, cacheId)
    }
    AndroidView(
        modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight()
    ) {
        factory = { _ ->
            storiesList
        }
    }
    BackHandler {
        InAppStoryManager.getInstance()?.clearCachedListById(cacheId)
        navigateBack()
    }
    LaunchedEffect(true) {
        storiesList.loadStories()
    }
}

fun getStoriesListWithCacheId(context: Context, cacheId: String): StoriesList {
    return StoriesList(context).apply {
        setCacheId(cacheId)
    }
}
```

## Items customization with composables

Customization interfaces like IStoriesListItem, IGetFavoriteListItem etc..., contains methods that
demands you to create and pass Views
If you want to create this views with also with compose instead of classic way - you have to boxing
your composables in `ComposeView`. Also in this case likely that you need to store items
parameters (title, links, open status, etc...) in any view model.

For example you can implement it like this:

#### Boxing

```kotlin
class StoryListComposeItem(context: Context) : FrameLayout(context) {
    val uniqueId = UUID.randomUUID().toString()
    fun initializeComposable(content: @Composable () -> Unit) {
        addView(ComposeView(context).apply {
            setContent(content)
        })
    }
}
```

#### Utils

```kotlin
private fun getComposeView(view: View?): StoryListComposeItem? {
    return (view as ViewGroup?)?.findViewById<StoryListComposeItem>(R.id.story_list_compose_item)
}
```

#### Get appearance manager

```kotlin
fun getStoryListAppearanceManager(storiesListScreenViewModel: StoriesListScreenViewModel): AppearanceManager {
    return AppearanceManager().apply {
        csListItemInterface(
            object : IStoriesListItem {
                override fun getView(): View {
                    return StoryListComposeItem(context).apply {
                        id = R.id.story_list_compose_item
                        initializeComposable {
                            StoryListItemView(storage = storiesListScreenViewModel, id = uniqueId)
                        }
                    }
                }

                override fun getVideoView(): View {
                    return StoryListComposeItem(context).apply {
                        id = R.id.story_list_compose_item
                        initializeComposable {
                            StoryListItemView(storage = storiesListScreenViewModel, id = uniqueId)
                        }
                    }
                }

                override fun setId(view: View?, storyId: Int) {
                    getComposeView(view)?.let {
                        storiesListScreenViewModel.setStoryId(it.uniqueId, storyId)
                    }
                }

                override fun setTitle(view: View?, title: String?, titleColor: Int?) {
                    getComposeView(view)?.let {
                        storiesListScreenViewModel.setTitle(it.uniqueId, title, titleColor)
                    }
                }

                override fun setImage(view: View?, imagePath: String?, backgroundColor: Int) {
                    TODO("Not yet implemented")
                }

                override fun setHasAudio(view: View?, hasAudio: Boolean) {
                    TODO("Not yet implemented")
                }

                override fun setVideo(view: View?, videoPath: String?) {
                    TODO("Not yet implemented")
                }

                override fun setOpened(view: View?, isOpened: Boolean) {
                    TODO("Not yet implemented")
                }
            }
        )
    }
}
```

#### List item state

```kotlin
data class StoryListItemState(
    val title: String = "",
    val titleColor: Int = Color.BLACK,
    val storyId: Int = -1
)
```

#### View model (items states storage)

```kotlin
class StoriesListScreenViewModel {
    private val storyListItemMutableStateFlows =
        hashMapOf<String, MutableStateFlow<StoryListItemState>>()

    fun storyListItemStateFlow(uniqueId: String): StateFlow {
        return storyListItemMutableStateFlow(uniqueId).asStateFlow()
    }

    private fun storyListItemMutableStateFlow(uniqueId: String): MutableStateFlow {
        return storyListItemMutableStateFlows.getOrPut(uniqueId) {
            MutableStateFlow(StoryListItemState())
        }
    }

    fun setTitle(uniqueId: String, title: String?, titleColor: Int?) {
        storyListItemMutableStateFlow(uniqueId).update {
            it.copy(title = title ?: "", titleColor = titleColor ?: Color.BLACK)
        }
    }

    fun setStoryId(uniqueId: String, storyId: Int?) {
        storyListItemMutableStateFlow(uniqueId).update {
            it.copy(storyId = storyId ?: -1)
        }
    }
}
```

#### Composables

```kotlin
@Composable
fun StoryListItemView(storage: StoriesListScreenViewModel, id: String) {
    val storyListItemState: StoryListItemState by storage.storyListItemStateFlow(id)
        .collectAsState()
    StoryListItemViewUI(storyListItemState)
}

@Composable
fun StoryListItemViewUI(storyListItemState: StoryListItemState) {
    TODO("Not yet implemented")
}
```

## Adding inside scrollable containers

Also if you adding StoriesList inside any scrollable container - you have to
implement `StoriesList.setScrollCallback()` override `scrollStart`
/`scrollEnd` methods and lock/unlock scroll for container in them:

```kotlin
@Composable
fun ComposableWithStoriesList() {
    val context = LocalContext.current
    var scrollEnabled by remember {
        mutableStateOf(true)
    }
    val storiesList = remember {
        StoriesList(context)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(
                state = rememberScrollState(),
                enabled = scrollEnabled
            )
    ) {
        AndroidView(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight()
        ) {
            factory = { _ ->
                storiesList
            }
        }
    }
    LaunchedEffect(true) {
        storiesList.setScrollCallback(
            object : ListScrollCallbackAdapter {
                override fun scrollStart() {
                    scrollEnabled = false
                }

                override fun scrollEnd() {
                    scrollEnabled = true
                }
            }
        )
        storiesList.loadStories()
    }
}
```

## Handle StoriesList previews statistic

If you want to gather statistic about stories previews in cases of user interaction with list
widget (scroll) - you have to implement `StoriesList.setScrollCallback()` and
override `onVisibleAreaUpdated` method. It calls when stories loaded into widget and when widget
finishes it's scroll after user interaction.

```kotlin
data class ShownStoriesListItem(
    val storyData: StoryData?,
    val listIndex: Int,
    val areaPercent: Float
)

@Composable
fun ComposableWithStoriesList() {
    val context = LocalContext.current
    val storiesList = remember {
        StoriesList(context)
    }
    AndroidView(
        modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight()
    ) {
        factory = { _ ->
            storiesList
        }
    }
    LaunchedEffect(true) {
        storiesList.setScrollCallback(
            object : ListScrollCallbackAdapter {
                override fun onVisibleAreaUpdated(
                    items: MutableList<ShownStoriesListItem>?
                ) {
                    //TODO Here you can gather data from items
                }
            }
        )
        storiesList.loadStories()
    }
}
```

But if you place list widget inside another scrollable container and want to gather statistic from
widget when you scroll your own container, besides interface overriding you have to call
method `storiesList.updateVisibleArea(triggerScrollCallback: Boolean)`. If you
pass `triggerScrollCallback = true` - `onVisibleAreaUpdated` will be called. To gather statistics in
both cases simultaneously we recommend you to call this method with `triggerScrollCallback = false`
during the scroll process and with `triggerScrollCallback = true` after scroll ends:

```kotlin
@Composable
fun ComposableWithStoriesList() {
    val context = LocalContext.current
    val scrollState = rememberScrollState()
    val storiesList = remember {
        StoriesList(context)
    }
    Box(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .background(Color.White)
    ) {
        AndroidView(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight()
        ) {
            factory = { _ ->
                storiesList
            }
        }
    }
    LaunchedEffect(true) {
        storiesList.setScrollCallback(
            object : ListScrollCallbackAdapter {
                override fun onVisibleAreaUpdated(
                    items: MutableList<ShownStoriesListItem>?
                ) {
                    //TODO Here you can gather data from items
                }
            }
        )
        storiesList.loadStories()
    }

    LaunchedEffect(scrollState) {
        snapshotFlow { scrollState.value }.collect {
            favoriteStoriesList.updateVisibleArea(false)
        }
    }
    var listScrolled = false
    LaunchedEffect(scrollState) {
        snapshotFlow { scrollState.isScrollInProgress }.collect {
            if (listScrolled && !it) {
                storiesList.updateVisibleArea(true)
            }
            listScrolled = it
        }
    }
}
```
