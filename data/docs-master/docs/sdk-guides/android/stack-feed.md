# Stack Feed

## Initialization

If you want to include stories inside your own list, you can use
method `InAppStoryManager.getInstance().getStackFeed()` to get stories data and render it by
yourself:

```kotlin
fun loadStackFeed(
    feedId: String = "default",
    uniqueId: String? = null, //Need to set if you want to use 2 or more different stack feeds with same feedId in your application
    tags: List<String>,
    appearanceManager: ApperanceManager?,
    onSuccess: (IStackStoryData?, IStackFeedActions) -> Unit = {}, //result will be returned in non-UI thread
    onError: () -> Unit = {}, //result will be returned in non-UI thread
    onUpdate: (IStackStoryData?) -> Unit = {} //result will be returned in non-UI thread
) {
    InAppStoryManager.getInstance()?.getStackFeed(
        feed,
        uniqueId,
        tags,
        appearanceManager,
        object : IStackFeedResult {
            override fun success(
                stackStoryData: IStackStoryData?,
                stackFeedActions: IStackFeedActions
            ) {
                onSuccess(stackStoryData, stackFeedActions)
            }

            override fun update(stackStoryData: IStackStoryData?) {
                onUpdate(stackStoryData)
            }

            override fun error() {
                onError()
            }
        }
    )
}
```

Here `IStackFeedResult` is a next interface:

```kotlin
interface IStackFeedResult {
    fun success(
        stackStoryData: IStackStoryData?,
        stackFeedActions: IStackFeedActions
    )
    //calls when stack feed's data is loaded from server. stackStoryData is a data for top story

    fun update(stackStoryData: IStackStoryData?)
    //calls when current top stack feed's story is opened. stackStoryData is a data for next top story

    fun error()
    //calls when stack feed's data wasn't received from server (for example: in case of bad internet connection) 
}
```

`IStackStoryData` is an interface with data of top story and partial data for rest stories as well:

```kotlin
interface IStackStoryData {
    //data of a top story
    fun title(): String
    fun titleColor(): Int
    fun hasAudio(): Boolean
    fun cover(): IStackStoryCover?
    fun stackFeedIndex(): Int

    //data for all stack feed's stories
    fun stackFeedOpenedStatuses(): BooleanArray
    fun stackFeedStories(): Array<StoryData>
}

interface IStackStoryCover {
    fun backgroundColor(): Int

    //server urls for top story covers
    fun imageCoverPath(): String?
    fun feedCoverPath(): String?
    fun videoCoverPath(): String?
}
```

Also to open story reader by clicking on your stack feed's presentation view you need to use method
from passed interface `IStackFeedActions`

```kotlin
interface IStackFeedActions {
    fun openReader(context: Context)
}

fun bindViewAndSetClick(view: View) {
    loadStackFeed(
        onSuccess = { data: IStackStoryData?, actions: IStackFeedActions -> 
            bindViewByData(data)
            view.setOnClickListener {
                actions.openReader(view.context)
            }
        }, //result will be returned in non-UI thread
        onUpdate{ data: IStackStoryData? ->
            bindViewByData(data)
        }
    )
}

fun bindViewByData(data: IStackStoryData?) {
    TODO("Not yet implemented")
}
```

[Here](https://github.com/inappstory/Android-Example/tree/1_18_x/kotlinexamples/src/main/java/com/inappstory/kotlinexamples/stackfeed)
you can see complete example for stack feed integration into RecyclerView.