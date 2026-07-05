# List Placeholder

If you want to add some placeholder with animation during stories loading - you need to subscribe
to `ListCallback` through `storiesList.setCallback(callback: ListCallback)`. Then in your UI you need
to place any view with the same height as story cell.

#### Example

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout 
    android:layout_width="match_parent" 
    android:layout_height="120dp">

    <com.inappstory.sdk.stories.ui.list.StoriesList 
        android:id="@+id/stories_list"
        android:layout_width="match_parent" 
        android:layout_height="match_parent"
        android:elevation="2dp" />

    <com.examples.ListShimmerView 
        android:id="@+id/shimmer" 
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</RelativeLayout>
```

And then you can show and hide your shimmer:

```kotlin
fun showStories() {
    showShimmer()
    storiesList.setCallback(object : ListCallbackAdapter() {
        override fun storiesLoaded(size: Int, feed: String) {
            hideShimmer()
        }

        override fun loadError(feed: String) {
            hideShimmer()
        }
    }
    )
    storiesList.loadStories()
}

fun showShimmer() {
    shimmer.visibility = View.VISIBLE
}

fun hideShimmer(layout: FrameLayout) {
    GlobalScope.launch {
        delay(500)
        withContext(Dispatchers.Main) {
            shimmer.visibility = View.GONE
        }
    }
}
```

#### Example

```kotlin
class NotificationSubscribeSample : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_shimmer_list)
        showStories()
    }

    override fun onDestroy() {
        super.onDestroy()
    }

    private fun doSmthOnShowStory(
        id: Int,
        title: String,
        tags: String,
        slidesCount: Int,
        source: SourceType,
        showStoryAction: ShowStoryAction
    ) {

    }

    private fun doSmthOnCloseStory(
        id: Int,
        title: String,
        tags: String,
        slidesCount: Int,
        index: Int,
        action: CloseReader,
        source: SourceType
    ) {

    }

    private fun showStories(context: Context) {
        val storiesList = findViewById<StoriesList>(R.id.stories_list)
        val shimmer = findViewById<ListShimmerView>(R.id.shimmer)
        val shimmerLayout = findViewById<FrameLayout>(R.id.shimmerLayout)
        shimmer.imageWidth = Sizes.dpToPxExt(120, context).toFloat()
        shimmerLayout.visibility = View.VISIBLE
        storiesList.appearanceManager = AppearanceManager()
        InAppStoryManager.getInstance()
            .setShowStoryCallback { id, title, tags, slidesCount, source, showStoryAction ->
                doSmthOnShowStory(id, title, tags, slidesCount, source, showStoryAction)
            }
        InAppStoryManager.getInstance()
            .setCloseStoryCallback { id, title, tags, slidesCount, index, action, source ->
                doSmthOnCloseStory(id, title, tags, slidesCount, index, action, source)
            }
        val adapterCallback = false
        if (adapterCallback) {
            storiesList.setCallback(object : ListCallbackAdapter() {
                override fun storiesLoaded(size: Int, feed: String?) {
                    hideShimmer(shimmerLayout)
                }

                override fun loadError(feed: String?) {
                    hideShimmer(shimmerLayout)
                }

            })
        } else {
            storiesList.setCallback(object : ListCallback {
                override fun storiesLoaded(
                    size: Int,
                    feed: String?
                ) {

                    hideShimmer(shimmerLayout)
                }

                override fun storiesUpdated(
                    size: Int,
                    feed: String?
                ) {

                }

                override fun loadError(feed: String) {
                    hideShimmer(shimmerLayout)
                }

                override fun itemClick(
                    id: Int,
                    listIndex: Int,
                    title: String?,
                    tags: String?,
                    slidesCount: Int,
                    isFavoriteList: Boolean,
                    feed: String
                ) {
                }
            })
        }
        storiesList.loadStories()
    }

    fun hideShimmer(layout: FrameLayout) {
        GlobalScope.launch {
            delay(500)
            withContext(Dispatchers.Main) {
                layout.visibility = View.GONE
            }
        }
    }
}
```
