# Likes, Share, Favorites

:::warning
To prevent possible memory leaks it is recommended not to keep context/views as strong references in all callbacks.
:::

## Likes/Dislikes

To include like functionality in you app use `csHasLike(true)` property in `AppearanceManager` class.
It can be set separately for current list or for common instance.

To customize like/dislike icons - use `csLikeIcon` and `csDislikeIcon` properties.
[Here](appearance.md#favorite-like-dislike-buttons) more about icons customization

If you need to perform some action in the application after buttons clicks - use next callback:

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

## Share

### Method object types

```kotlin
enum class StoryType {
    COMMON, UGC
}

data class StoryData(
    val id: SlideData?,
    val storyType: Story.StoryType = StoryType.COMMON,
    val title: String?,
    val tags: String?,
    val slidesCount: Int,
    val feed: String,
    val sourceType: SourceType
)

data class SlideData(
    val storyData: StoryData?,
    val index: Int,
    val payload: String?
)

data class IASShareData(
    val url: String?,
    val files: List<String>,
    val payload: String?
)
```

### Share button click callback

To include share functionality in you app use `csHasShare(true)` property in `AppearanceManager`
class. It can be set separately for current list or in common instance.

To customize share icon - use `csShareIcon` property.
[Here](appearance.md#share-button) more about icons customization

If you need to perform some action in the application after buttons clicks - use next callback:

```kotlin
fun setIASClickOnShareStoryCallback() {
    InAppStoryManager.getInstance().setClickOnShareStoryCallback(
        object : ClickOnShareStoryCallback {
            override fun shareClick(
                slideData: SlideData?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### Share custom behavior

:::warning
It is recommended not to keep context/views as strong references in any of the callbacks to prevent possible memory leaks.
:::

You can customize default share behaviour (for example - to create your custom share dialog window)
with next handler:

```kotlin
fun setIASShareCallback() {
    InAppStoryManager.getInstance().setShareCallback(
        object : ShareCallback {
            var savedView: View? = null

            override fun getView(
                context: Context,
                dataMap: HashMap<String, Any?>,
                /**
                 * dataMap = {
                 *   "slidePayload" : <String>,
                 *   "storyId" : <Int>,
                 *   "slideIndex" : <Int>,
                 *   "shareData" : <IASShareData>
                 * }
                 */
                actions: OverlappingContainerActions
            ): View {
                val savedView = getViewWithSharePanel(context, shareData, actions)
                return savedView
            }

            override fun viewIsVisible(view: View?) {
                startSharePanelShowAnimation(view)
            }

            override fun onDestroyView(view: View?) {
                savedView = null
            }

            override fun onBackPress(
                view: View?,
                actions: OverlappingContainerActions
            ): Boolean {
                startSharePanelHideAnimation(actions, view)
                return true
            }
        }
    )
}

fun startSharePanelShowAnimation(view: View?) {
    TODO("Not yet implemented")
}

fun startSharePanelHideAnimation(actions: OverlappingContainerActions, view: View?) {
    TODO("Not yet implemented")
}

fun getViewWithSharePanel(
    context: Context,
    dataMap: HashMap<String, Any?>,
    actions: OverlappingContainerActions
) {
    val storyId = dataMap["storyId"] as Int?
    val slidePayload = dataMap["slidePayload"] as String?
    val slideIndex = dataMap["slideIndex"] as Int?
    val shareData = dataMap["shareData"] as IASShareData?
    val shareUrl = shareData?.url
    val shareFiles: List<String> = shareData?.files
    val slidePayloadFromShareData = shareData?.payload
    //slidePayload == slidePayloadFromShareData
    TODO("Not yet implemented")
}
```

`OverlappingContainerActions` is an interface that has to be used to close the container of your custom
share panel after successful or unsuccessful sharing. It's signature is:

```kotlin
interface OverlappingContainerActions {
    fun closeView(data: HashMap<String, Any?>) //after sharing you have to pass here an map with key "shared" and sharing result as boolean (true if successful)
}
```

`IASShareData` is a class that contains share files (list of file paths) or share url with share
payload. You can use them directly or, if you don't want to customize share logic, you can use
class `IASShareManager` which contains 2 methods:

- `shareToSpecificApp`,
- `shareDefault` which takes a parameter `BroadcastReceiver receiver`.
  For example - you can realize next method and use it from
  your custom share panel:

```kotlin
fun share(
    context: Context,
    data: IASShareData,
    actions: OverlappingContainerActions,
    packageName: String
) {
    val shareManager = IASShareManager()
    if (packageName != null)
        shareManager.shareToSpecificApp(
            ShareBroadcastReceiver::class.java,
            context,
            data,
            packageName
        )
    else
        shareManager.shareDefault(
            ShareBroadcastReceiver::class.java,
            context,
            data
        );
}
```

And `ShareBroadcastReceiver` looks like:

```kotlin
class ShareBroadcastReceiver : BroadcastReceiver {
    override fun onReceive(context: Context?, intent: Intent?) {
        //Here you need to notify your share callback about successful sharing
        TODO("Not yet implemented")
    }
}
```

If you want to customize share logic and you want to share images (from game or slide screenshots) -
you can use method `getUrisFromShareData(context: Context, shareData: IASShareData)` from
class `IASShareManager`.

#### Example

```kotlin
 fun getShareIntent(context: Context, shareData: IASShareData?): Intent {
    val sendingIntent = Intent()
    sendingIntent.setAction(Intent.ACTION_SEND)
    val shareManager = IASShareManager()
    val files = if (shareData != null)
        shareManager.getUrisFromShareData(context, shareData)
    else
        arrayListOf()
    if (files.isEmpty()) {
        sendingIntent.setType("text/plain")
    } else {
        sendingIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        sendingIntent.setType("image/*")
        if (files.size() > 1) {
            sendingIntent.setAction(Intent.ACTION_SEND_MULTIPLE)
            sendingIntent.putParcelableArrayListExtra(
                Intent.EXTRA_STREAM,
                arrayListOf(files)
            )
        } else {
            sendingIntent.putExtra(Intent.EXTRA_STREAM, files.get(0))
        }
    }
    return sendingIntent
}
```

[Here](https://github.com/inappstory/Android-Example/tree/main/kotlinexamples/src/main/java/com/inappstory/kotlinexamples/share)
you can look at complete example with custom sharing.

## Favorites

To include favorite functionality in you app use `csHasFavorite(true)` property
in `AppearanceManager` class. It turns on favorite cell in lists and favorite button in reader and
can be set separately for current list or in common instance.

To customize favorite icon - use `csFavoriteIcon` property.
[Here](appearance.md#favorite-like-dislike-buttons) more about icons customization

If you need to perform some action in the application after buttons clicks - use next callback:

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

If you want to show only favorited stories in list - add `StoriesList` like this:

```xml

<com.inappstory.sdk.stories.ui.list.StoriesList android:layout_width="match_parent"
    android:layout_height="wrap_content" app:cs_listIsFavorite="true"
    android:id="@+id/stories_list" />
```

You can also customize favorite cell in list with `csFavoriteListItemInterface` property
in `AppearanceManager`
More about this you can read [here](appearance.md#igetfavoritelistitem).

To interact with the favorite cell (for example, to open a new window with a list of favorite
stories), you need to add a handler:

```kotlin
fun setIASFavoriteCellClickHandler(storiesList: StoriesList) {
    storiesList.setOnFavoriteItemClick(
        object : OnFavoriteItemClick() {
            override fun onClick() {
                TODO("Not yet implemented")
            }
        }
    )
}
```

Also you can remove favorites through `InAppStoryManager` methods. Next method allows you to remove
story from favorite by story id

```kotlin
fun removeStoryFromFavorite(storyId: Int) {
    InAppStoryManager.getInstance().removeFromFavorite(storyId)
}
```

To get story id you can implement custom interface `IStoriesListItem` for stories list item and get
it from method `setId`. For example:

```kotlin
fun customizeListItemWithInterface(appearanceManager: AppearanceManager, context: Context) {
    appearanceManager.csListItemInterfacecsListItemInterface(
        object : IStoriesListItem {
            override fun getView(): View? {
                return LayoutInflater.from(context).inflate(
                    R.layout.custom_story_list_item,
                    null,
                    false
                )
            }

            override fun getVideoView(): View? {
                return LayoutInflater.from(context).inflate(
                    R.layout.custom_story_list_video_item,
                    null,
                    false
                )
            }

            override fun setId(view: View, storyId: Int) {
                view.findViewById(R.id.removeStoryButton).setOnClickListener {
                    if (InAppStoryManager.getInstance() != null) {
                        InAppStoryManager.getInstance().removeFromFavorite(storyId)
                    }
                }
            }

            override fun setTitle(view: View, title: String?, color: Int?) {
                view.findViewById<AppCompatTextView>(R.id.title)?.apply {
                    setTextColor(color ?: Color.BLACK)
                    text = title ?: ""
                }
            }

            override fun setImage(view: View, url: String?, backgroundColor: Int) {
                ImageWorker.showImage(
                    url = url,
                    backgroundColor = backgroundColor,
                    imageView = view.findViewById<AppCompatImageView>(R.id.image)
                )
            }

            override fun setHasAudio(itemView: View, hasAudio: Boolean) {

            }

            override fun setVideo(view: View, s: String) {
            }

            override fun setOpened(view: View, isOpened: Boolean) {
                val cardView = view.findViewById<MaterialCardView>(R.id.mainCard)
                cardView.strokeColor = if (isOpened) {
                    Color.TRANSPARENT
                } else {
                    Color.BLACK
                }
            }
        }
    )
}
```

Also you can remove from favorites all stories together with next method:

```kotlin
fun removeAllStoriesFromFavorite() {
    InAppStoryManager.getInstance().removeAllFavorites()
}
```

Also you can customize favorites list layout. For example if you want to show stories as grid with 2
columns, you can do next:

### In 1.13.0 or higher

```kotlin
fun showStoriesListAsGrid(storiesList: StoriesList) {
    storiesList.appearanceManager = AppearanceManager()
        .csColumnCount(2)
        .csListItemRatio(0.8f) //cellWidth to cellHeight
}
```

### Before 1.13.0

```kotlin
fun showStoriesListAsGridOld(storiesList: StoriesList) {
    val itemWidthInPx =
        Sizes.dpToPxExt(120) //here place your stories cell width. By default cell width is 120 dp
    val itemPaddingInPx = Sizes.dpToPxExt(12)  //here place padding between stories or edges
    val screenWidth = Sizes.getScreenSize().x
    val columnCount = 2
    val itemPaddingInPx =
        Math.max((screenWidth - columnCount * itemWidthInPx) / (columnCount + 1), 0)
    storiesList.layoutManager =
        GridLayoutManager(context, columnCount, RecyclerView.VERTICAL, false)
    storiesList.addItemDecoration(
        object : RecyclerView.ItemDecoration() {
            override fun getItemOffsets(
                outRect: Rect, view: View, parent: RecyclerView,
                state: RecyclerView.State
            ) {
                val position = parent.getChildAdapterPosition(view)
                val itemCount = parent.adapter?.itemCount ?: 0
                val lp = view.layoutParams as GridLayoutManager.LayoutParams
                val bottomIndex = itemCount - columnCount + (itemCount % columnCount)
                outRect.left = itemPaddingInPx
                outRect.right = 0
                outRect.top =
                    if (position < count) itemPaddingInPx else itemPaddingInPx
                outRect.bottom = if (position >= bottomIndex) itemPaddingInPx else 0
            }
        }
    )
}
```
