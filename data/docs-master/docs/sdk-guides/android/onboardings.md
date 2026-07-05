# Onboardings

The library supports work with onboarding stories. The function for loading onboarding stories is
follows:

```kotlin
fun showOnboardingStories(
    limit: Int? = null, //if null - loads all onboarding stories
    feed: String = "onboarding",
    tags: List<String>? = null,
    context: Context,
    manager: AppearanceManager
) {
    val cancellationToken: CancellationToken? = InAppStoryManager.getInstance()?.showOnboardingStories(limit, feed, tags, context, manager)
}
```

More about `CancellationToken` objects you can read [here](cancellation-of-actions.md)

Functions are passed, context, display manager (used to determine the position of the close button
and animation in the reader) and list of tags for second. It may be necessary to perform some action
in the application immediately after the onboarding stories is loaded (or if they could not appear
on screen, since all of them were already displayed earlier or some kind of error occurred). In can
be done by setting next callback:

```kotlin
fun setIASOnboardingLoadCallback() {
    InAppStoryManager.getInstance().setOnboardingLoadCallback(
        object : OnboardingLoadCallback {
            override fun onboardingLoadSuccess(count: Int, feed: String?) {
                TODO("Not yet implemented")
            }

            override fun onboardingLoadError(feed: String?, reason: String?) {
                TODO("Not yet implemented")
            }
        }
    )
}
```
