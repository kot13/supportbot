# Cancellation of long-running actions

Starting from 1.23.0 background long-running actions, such as loading onboardings, single stories and in-app messages can be cancelled.
To do this you can use `CancellationToken` object, that returns in methods of the actions listed above.

```kotlin
enum class CancellationTokenCancelResult {
    SUCCESS,
    ERROR_OPERATION_FINISHED,
    ERROR_ALREADY_CANCELLED
}

interface CancellationToken {
    fun cancel(): CancellationTokenCancelResult
    fun getUniqueId(): String
}
```

For example:
```kotlin
fun showAndCancelSingleStory(
    storyId: String,
    context: Context,
    manager: AppearanceManager,
    callback: IShowStoryCallback? = null
) {
    val cancellationToken: CancellationToken = 
        InAppStoryManager.getInstance().showStory(
            storyId,
            context,
            manager,
            callback
        )
    cancellationToken.cancel()
}
```
