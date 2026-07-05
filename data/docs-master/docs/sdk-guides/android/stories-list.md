# StoriesList

## Initialization

`StoriesList` can be added like any `View` class. For example - via xml:

```xml

<com.inappstory.sdk.stories.ui.list.StoriesList 
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:cs_listIsFavorite="false"
    app:cs_feed="customFeed"
    android:id="@+id/stories_list" />
```

Or via code:

```kotlin
fun addCustomFeedAsView(rootView: ViewGroup, context: Context) {
    val storiesList = StoriesList(context);
    storiesList.setFeed("customFeed");
    rootView.addView(storiesList);
}
```

The `cs_listIsFavorite` attribute is responsible for whether we add a regular list or a list of
favorites (true - favorites, false - full list). The `cs_feed` attribute is defines specific feed of
stories, that will be loaded through `loadStories` method.

## Methods

After SDK initialization you can load stories in `StoriesList`.

```kotlin
storiesList.loadStories();
```

This method also can be used to reload list (for example, in PtR case).

Everytime you call method `loadStories` it gets data from web server. It may be necessary (for
better UX) to prevent that behaviour and gets already loaded stories if possible.
In that case you have to set `cacheId` for list (by default it is null):

```kotlin
    storiesList.setCacheId(cacheId)
```

If `cacheId` was set - to clear local data or gets new set of stories from server you need to call one of next methods:

```kotlin
    InAppStoryManager.getInstance()?.clearCachedListById(cacheId)
    InAppStoryManager.getInstance()?.clearCachedListByFeed(feed)
    InAppStoryManager.getInstance()?.clearCachedListByIdAndFeed(cacheId, feed)
    
    InAppStoryManager.getInstance()?.clearCachedLists()
```

`StoriesList` extends `androidx.recyclerview.widget.RecyclerView`. If necessary, you can use all
the methods that are in the `RecyclerView` (setting the `layoutManager`, getting the `adapter`,
etc.).

If you overload `ListScrollCallback` and wants to check visible area of stories items - you can call method `updateVisibleArea(triggerScrollCallback: Boolean)`:

```kotlin
    storiesList.updateVisibleArea(true)
```

If you place list widget inside another scrollable container and want to gather statistic from
widget when you scroll your own container, besides interface overriding you have to call
method `storiesList.updateVisibleArea(triggerScrollCallback: Boolean)`. If you
pass `triggerScrollCallback = true` - `onVisibleAreaUpdated` will be called. To gather statistics in
both cases simultaneously we recommend you to call this method with `triggerScrollCallback = false`
during the scroll process and with `triggerScrollCallback = true` after scroll ends.

It will trigger `ListScrollCallback.onVisibleAreaUpdated` method in callback.

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

### Stories Feed

From version 1.8.x `StoriesList` has a `feed` parameter that defines specific feed of stories, which
will be loaded through `loadStories` method. By default `feed` for `StoriesList` equals 'default'.
Also it can be set through `cs_feed` attribute in xml or with setter:

```kotlin
fun setStoriesListFeed(feed: String?) {
    // If feed parameter is empty or null - it will be set as 'default'
    storiesList.setFeed(feed)
}
```

This parameter is ignored for favorite list and `feed` equals `null`.
