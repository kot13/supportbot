# InAppStoryAPI

`InAppStoryAPI` is the **main** class
in [`IAS Android SDK`](/sdk-guides/android/how-to-get-started.md) for external API usage. It has to
be initialized as `static` variable or has shared access point. It contains different subclasses to
with different parts of API and besides this is used to initialize `IAS Android SDK`, clear SDK's
cache and add/remove subscribers (f.e. different feed widgets)

## Subclasses

All subclass instances called from `InAppStoryAPI` instance:

```kotlin
fun callSubclassInstance(inAppStoryAPI: InAppStoryAPI) {
    inAppStoryAPI.subclass.method(methodArgs)
}
```

* [`IASManager`](ias-manager.md) - is used to build an instance
  of [`InAppStoryManager`](/sdk-guides/android/inappstory-manager.md);
* [`IASSettings`](ias-settings.md) - is used to set `InAppStoryManager` settings in runtime (after
  main instance already was built) such as user id, language, tags, placeholders and
  common [`AppearanceManager`](/sdk-guides/android/appearance.md);
* [`IASStoryList`](ias-story-list.md) - is used for communication between list widgets
  and `IAS Android SDK`;
* [`IASFavorites`](ias-favorites.md) - is used to remove stories from favorites with external way (
  f.e. by a button on a list widget's item);
* [`IASSingleStory`](ias-single-story.md) - is used to show story reader with a single story called
  by id;
* [`IASOnboardings`](ias-onboardings.md) - is used to load and show onboarding feed in story reader;
* [`IASInAppMessage`](ias-inappmessage.md) - is used to preload and show In-App Messages;
* [`IASStackFeed`](ias-stack-feed.md) - is used for communication between stack-feed widgets
  and `IAS Android SDK`;
* [`IASGames`](ias-games.md) - is used to load and open games from Game center (by game's id);
* [`IASCallbacks`](ias-callbacks.md) - is used to set callbacks for `IAS Android SDK`

## Methods

All methods called from `InAppStoryAPI` instance:

```kotlin
fun callMethod(inAppStoryAPI: InAppStoryAPI) {
    inAppStoryAPI.method(methodArgs)
}
```

To initialize `IAS Android SDK` (method must be called from Application class with
applicationContext as parameter):

```kotlin
fun init(context: Context)
```

To subscribe any list widget next method can be used:

```kotlin
fun addSubscriber(subscriber: IAPISubscriber)
```

Subscriber must implement next interface:

```kotlin
interface IAPISubscriber<T> {
    fun storyIsOpened(storyId: Int)
    fun updateStoryData(story: T)
    fun updateStoriesData(stories: List<T>)
    fun readerIsOpened()
    fun readerIsClosed()
    fun getUniqueId(): String
}
```

Or it can extend one of next classes:

```kotlin 
class InAppStoryAPIListSubscriber : IAPISubscriber<StoryAPIData>
class InAppStoryAPIFavoriteListSubscriber : IAPISubscriber<StoryAPIData>
class InAppStoryAPIStackFeedSubscriber : IAPISubscriber<StoryAPIData>
```

To remove subscriber when when it no longer exists or is no longer needed:

```kotlin
fun removeSubscriber(subscriber: IAPISubscriber)
fun removeSubscriber(uniqueKey: String)
```

Also to clear `IAS Android SDK`'s cache:

```kotlin
fun clearCache()
```