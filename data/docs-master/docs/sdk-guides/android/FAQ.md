# FAQ

## Logger implementation

For a detailed list of requests/responses, errors and technical messages `InAppStoryManager.logger` has to be implemented:

```kotlin
fun initLogger() {
    InAppStoryManager.logger = IASLoggerImpl()
}

class IASLoggerImpl : InAppStoryManager.IASLogger {
    override fun showELog(tag: String?,message: String?) {
        Log.d("IAS_SDK_LOG", "${tag ?: "DEF_TAG"} ${message ?: ""}")

    }

    override fun showDLog(tag: String?,message: String?) {
        Log.d("IAS_SDK_LOG", "${tag ?: "DEF_TAG"} ${message ?: ""}")
    }
}
```

## Opening stories from push notifications

In the push notification handler function, add a call to a single story using
the `InAppStoryManager.getInstance().showStory(String storyId, Context context, AppearanceManager manager, IShowStoryCallback callback)`
function.

## Prevent swipe to refresh or outer scroll events during stories list scroll

#### Example

```kotlin
storiesList.setScrollCallback(object : ListScrollCallback {
    override fun scrollStart() {
        requestParentForDisallow(storiesList.parent, true)
    }

    override fun scrollEnd() {
        requestParentForDisallow(storiesList.parent, false)
    }
})


// This method enables/disables all parent touch events. You shouldn't use it directly and better to lock only necessary views
private fun requestParentForDisallow(view: ViewParent, disallow: Boolean) {
    if (view.parent == null) return
    view.parent.requestDisallowInterceptTouchEvent(disallow)
    if (view.parent is SwipeRefreshLayout) {
        (view.parent as SwipeRefreshLayout).isEnabled = !disallow
    }
    requestParentForDisallow(view.parent, disallow)
}
```

## Memory leaks

:::warning
It is recommended not to keep context/views as strong references in any of the callbacks to prevent possible memory leaks.
:::
Also it is recommended to avoid setting callbacks as anonymous classes, because they keep the parent class reference inside. It is better to implement callback interfaces as separate classes (with weak reference to the parent class if needed).
You can look at the custom share sample in [this repository](https://github.com/inappstory/Android-Example/tree/main/kotlinexamples/src/main/java/com/inappstory/kotlinexamples/share)
to see an example.
