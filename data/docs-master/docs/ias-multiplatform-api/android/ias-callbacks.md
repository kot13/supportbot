# IASCallbacksExternalAPI

Class is used to set callbacks for `IAS Android SDK`. Can be called from InAppStoryAPI:

```kotlin
val callbacksApi = inAppStoryApi.callbacks
```

## Methods

Class has next callbacks that have equivalents in InAppStoryManager: `error`, `clickOnShareStory`, 
`callToAction`, `storyWidget`, `closeStory`, `favoriteStory`, `likeDislikeStory`, `showSlide`, 
`showStory`, `showInAppMessage`, `closeInAppMessage`, `inAppMessageWidget`. For more information about interfaces read [here](/sdk-guides/android/events.md) 
and [here](/glossarium/statistics/stories-widget-events.md).