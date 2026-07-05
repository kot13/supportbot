# Single Story

## Show story

SDK allows to open particular story by its id or slug.

```kotlin
interface IShowStoryCallback {
    fun onShow() //Calls after loading data about story from server
    fun onError() //Calls if loading fails
}

fun showSingleStory(
    storyId: String,
    context: Context,
    manager: AppearanceManager,
    callback: IShowStoryCallback? = null
) {
    val cancellationToken: CancellationToken? = InAppStoryManager.getInstance()?.showStory(
        storyId,
        context,
        manager,
        callback
    )
}
```

More about `CancellationToken` objects you can read [here](cancellation-of-actions.md)

It may be necessary to perform some action in the application immediately after the stories are loaded. It can be done by setting up a callback:

```kotlin
fun setIASSingleLoadCallback() {
    InAppStoryManager.getInstance().setSingleLoadCallback(
        object : SingleLoadCallback {
            override fun singleLoadSuccess(storyId: String?) {
                TODO("Not yet implemented")
            }

            override fun singleLoadError(storyId: String?, reason: String?) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

## Show story once

Starting from v1.18.x you can use method `showStoryOnce` instead of `showStory` if you want the user
to see a story only once.

```kotlin
interface IShowStoryOnceCallback {
    fun onShow() //Calls after loading data about story from server
    fun onError() //Calls if loading fails
    fun alreadyShown() //Calls if story with this ID was shown to current user on any device
}

fun showSingleStoryOnce(
    storyId: String,
    context: Context,
    manager: AppearanceManager,
    show: () -> Unit = {},
    error: () -> Unit = {},
    alreadyShownToUser: () -> Unit = {}
) {
    InAppStoryManager.getInstance().showStoryOnce(
        storyId,
        context,
        manager,
        object : IShowStoryOnceCallback() {
            override fun onShow() {
                show()
            }

            override fun onError() {
                error()
            }

            override fun alreadyShown() {
                alreadyShownToUser()
            }
        }
    )
}
```
