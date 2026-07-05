# Link handling

For handling deeplinks or button clicks in stories use the method below:

```kotlin
fun setIASCallToActionCallback() {
    InAppStoryManager.getInstance().setCallToActionCallback(
        object : CallToActionCallback {
            override fun callToAction(
                context: Context?, //Insert the context of story reader or storiesList context if it is called from it's deeplinks
                slide: SlideData?,
                url: String?,
                action: ClickAction
            ) {
                val storyData: StoryData = slide.story
                val slideIndex: Int = slide.index
                val storyId: Int = storyData.id
                val storyTags: String = storyData.tags
                val storyTitle: String = storyData.title
                val storySlidesCount: Int = storyData.slidesCount
                TODO("Not yet implemented")
            }
        }
    )
}
```

## Close stories reader

If you need to close the reader when the handler is triggered, you need to call static
method `InAppStoryManager.closeStoryReader()` in `callToAction`:

```kotlin
interface ForceCloseReaderCallback {
    fun onComplete()
}

fun setIASCallToActionCallback() {
    InAppStoryManager.getInstance().setCallToActionCallback(
        object : CallToActionCallback {
            override fun callToAction(
                context: Context?,
                slide: SlideData?,
                url: String?,
                action: ClickAction
            ) {
                InAppStoryManager.closeStoryReader()
                linkHandling(url = url)
            }
        }
    )
}

fun linkHandling(url: String?) {
    TODO("Not yet implemented")
}
```

From version 1.17.15
use `InAppStoryManager.closeStoryReader(forceClose: Boolean, forceCloseCallback: ForceCloseReaderCallback)`
instead (f.e. if you want to reopen same activity in case of deeplink handling).

```kotlin
interface ForceCloseReaderCallback {
    fun onComplete()
}

fun setIASCallToActionCallback() {
    InAppStoryManager.getInstance().setCallToActionCallback(
        object : CallToActionCallback {
            override fun callToAction(
                context: Context?,
                slide: SlideData?,
                url: String?,
                action: ClickAction
            ) {
                InAppStoryManager.closeStoryReader(
                    true,
                    object : ForceCloseReaderCallback {
                        override fun onComplete() {
                            linkHandling(url = url)
                        }
                    }
                )
            }
        }
    )
}

fun linkHandling(url: String?) {
    TODO("Not yet implemented")
}
```

## Open a screen above stories reader

If you want to open a new screen above stories reader after link handling you can use the
passed `context: Context`:

```kotlin
fun setIASCallToActionCallback() {
    InAppStoryManager.getInstance().setCallToActionCallback(
        object : CallToActionCallback {
            override fun callToAction(
                context: Context?,
                slide: SlideData?,
                url: String?,
                action: ClickAction
            ) {
                context?.let {
                    openNewScreen(it, url)
                }
            }
        }
    )
}

fun openNewScreen(context: Context, url: String?) {
    val intent = Intent(context, MyActivity::class.java)
    intent.putExtra("url", url)
    context.startActivity(intent)
}
```

## Extend default behaviour

If you want to keep default link handling and also do something in addition - you can use next
example:

```kotlin
fun setCTACallbackWithDefaultLinkHandling() {
    InAppStoryManager.getInstance().setCallToActionCallback(
        object : CallToActionCallback {
            override fun callToAction(
                context: Context?,
                slide: SlideData?,
                url: String?,
                action: ClickAction
            ) {
                context?.let {
                    defaultLinkHandling(it)
                    additionLinkHandling(it, slide, url, action)
                }
            }
        }
    )
}

fun defaultLinkHandling(context: Context) {
    val intent = Intent(Intent.ACTION_VIEW)
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    intent.setData(Uri.parse(url))
    context.startActivity(intent)
}

fun additionLinkHandling(
    context: Context,
    slide: SlideData?,
    url: String?,
    action: ClickAction
) {
    TODO("Not yet implemented")
}
```

## Link handling (< 1.16.0)

In older versions you can use the method `setUrlClickCallback` instead:

```kotlin
fun setIASUrlClickCallback() {
    InAppStoryManager.getInstance().setUrlClickCallback(
        object : InAppStoryManager.UrlClickCallback() {
            @Override
            override fun onUrlClick(link: String?) {
                Log.d(TAG, link)
            }
        }
    )
}
```

If you need to close the reader when the handler is triggered, you need to call the static
method `InAppStoryManager.closeStoryReader()` in `onUrlClick`:

```kotlin
fun setIASUrlClickCallbackWithReaderClosure() {
    InAppStoryManager.getInstance().setUrlClickCallback(
        object : InAppStoryManager.UrlClickCallback() {
            @Override
            override fun onUrlClick(link: String?) {
                InAppStoryManager.closeStoryReader();
                Log.d(TAG, link ?: "")
            }
        }
    )
}
```

## Default link handler

The SDK has a default link handler:

```kotlin
fun defaultLinkHandler(link: String) {
    val i = Intent(Intent.ACTION_VIEW)
    i.setData(Uri.parse(link))
    startActivity(i)
}
```

It is not used during overriding, so if you want to keep the processing of links that are not
required by the application in their default form, then you need to take them into account when
overriding.
