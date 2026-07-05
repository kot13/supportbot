# Migrations

## To 1.25.0

Started from version 1.25.0 scratch card widget support was added. If you place banners widget
inside any type of scrollable view, you need to lock parent scroll for correct work of scratch card.
To do this, new callback for `BannerCarousel` was added. More about it you can
read [here](banners.md#vertical-gestures-handling)

## To 1.24.2

For In-App Messaging new version of method `showInAppMessage` was added.
More about it you can read [here](in-app-messaging.md#providing-presentation-container)

## To 1.24.0

Method `finishGame` was removed from `GameReaderCallback`

Changed `ShowInAppMessageSlideCallback` callback signature.
More about it you can read [here](in-app-messaging.md#showinappmessageslidecallback)

## To 1.23.0

Methods `showOnboardingStories`, `showStory`, `showStoryOnce` and `showInAppMessage`
in `InAppStoryManager` now return `CancellationToken` object.
More about it you can read [here](cancellation-of-actions.md)

## From 1.22.0-rc7 to 1.22.0

:::warning[Please note]
Android Gradle plugin minimum version was changed to 8.0.0 and now requires Java 17.
:::

Next classes, interfaces and methods were renamed:

- class `BannerPlace` to `BannerCarousel`
- interface `ICustomBannerPlaceAppearance` to `ICustomBannerCarouselAppearance`
- interface `BannerPlaceNavigationCallback` to `BannerCarouselNavigationCallback`
- method `AppearanceManager.csBannerPlaceInterface` to `AppearanceManager.csBannerCarouselInterface`

`BannerData` was moved to another package.

## To 1.21.x

- `ErrorCallback`, `OnboardingLoadCallback` and `SingleLoadCallback`'s signatures were changed

```kotlin
interface ErrorCallback {
    fun loadListError(feed: String?)

    fun cacheError()

    fun emptyLinkError()

    fun sessionError()

    fun noConnection()
}

interface OnboardingLoadCallback {
    fun onboardingLoadSuccess(count: Int, feed: String?)

    fun onboardingLoadError(feed: String?, reason: String?)
}

interface SingleLoadCallback {
    fun singleLoadSuccess(storyData: StoryData?)

    fun singleLoadError(storyId: String?, reason: String?)
}
```

- `GameStoryData` was removed and changed to `ContentData`
- `SlideData` in callToAction callback was changed to `ContentData`
- `StoryData`'s and `SlideData`'s fields marked as deprecated (will be private in future versions).
  Use their methods instead.
- Field `tags` was removed from `StoryData`
- Part of undocumented code became private or was removed
- AppearanceManager can be set only through setter (not as property)
- `clearCachedList` was removed (changed for `clearCachedListById`, `clearCachedListByFeed`
  and `clearCachedListByIdAndFeed`)
- Non-context method in class `Sizes` were removed
- Method `destroy` was removed. Use `InAppStoryManager.getInstance().userLogout()` instead
- Changed proportions for stories content (only safe area now used)
- Stories reader for tablets now works through activity instead of fragment
- Changed `loadStories` cache logic. Now it caches content by default for a specific feed

## To 1.20.x

:::warning

- `UrlClickCallback` interface will be removed in the next release. Use `CallToActionCallback`
  instead.
  :::

- Extended and updated `ShareCallback` interface. Method `onBackPress` now recieves `View` as an
  additional parameter. Method `onDestroyView(view: View)` was added as well. It's triggered when
  custom share view gets destroyed by any reason.
- Updated `ICustomGoodsWidget` interface. Methods `getSkus` and `onItemClick` now recieve `View` (
  widget view) as an additional parameter.

## To 1.19.x

:::warning

- **Updated inner loaders**. Now if you override `AppearanceManager.IStoriesListItem`, it's methods
  like `setImage` and `setVideo` are triggered from the worker thread. You have to redirect to main
  thread yourself if needed.
  :::

## To 1.18.x

:::warning

- **Updated SDK initialization**. Now you need to call
  method `InAppStoryManager.initSdk(context: Context)` in `Application` class.
  Then, from any class (`Application`, `Activity`, `Fragment`, etc.) you need to
  call `InAppStoryManager.Builder(). ... .create()`;
  :::

- Updated `GameReaderCallback` interface. Now it has a **new method
  ** `gameOpenError(data: GameStoryData?, gameId: String?)`;

- Added **stack feed feature**. For more information read [here](stack-feed.md);

- Added `InAppStoryManager.isStoryReaderOpened()` and `InAppStoryManager.isGameReaderOpened()`. Can
  be used to manage reader state;

- Added interface `IStoriesListItemWithStoryData`. It can be used instead of `IStoriesListItem` if
  you need to get `StoryData` objects in its methods. For more information
  read [here](appearance.md#istorieslistitemwithstorydata);

- Signature of `ListCallback`'s methods `storiesLoaded` and `storiesUpdated` were updated. Now
  they have a **third argument** `data: List<StoryData>?`;

- Added new story and game reader display option. Now you can use them as **fragments** instead of
  activities. For more information read [here](reader-presentation.md);

- Added `isDeviceIDEnabled` and `gameDemoMode` options in `InAppStoryManager.Builder`.;

-

Added `InAppStoryManager.closeStoryReader(forceClose: Boolean, forceCloseCallback: ForceCloseReaderCallback)`.
For more information read [here](link-handling.md);

:::warning

- Contextless methods from `Sizes` class marked as **deprecated** and **will be removed** in the
  next version.
  If you use them to convert sizes from `dp` to `px`, you can replace them to methods with context

  **For example:** <br/>
  `Sizes.dpToPxExt(sizeInDp: Int)` -> `Sizes.dpToPxExt(sizeInDp: Int, context: Context)`

:::

## To 1.17.x

- Signature of all callback methods with story or slide info was updated. Now they use `StoryData`
  or `SlideData` objects instead of separate fields. For more information read [here](events.md).

- Extended the `ListScrollCallback` interface. Now it has a method `onVisibleAreaUpdated`. For more
  information read [here](events.md#scroll-callback).

- Added method `updateVisibleArea()` to `StoriesList`.

- Added method `showStoryOnce()` to `InAppStoryManager`. For
  more information read [here](single-story.md#show-story-once).

- Added method `csStoryReaderPresentationStyle` to `AppearanceManager`.

:::warning

- Method `csListItemWidth` was **removed** from `AppearanceManager`.
  Use `appearanceManager.csListItemRatio` instead.
- `GameCallback` is **removed** from SDK. Use `GameReaderCallback` instead.
  :::

- `CallToActionCallback`'s `callToAction` signature has **changed**.
  - Parameter `context: Context` was
    **added**. It contains Stories Reader context. For example, it can be used to navigate to
    another
    screen. [Here](events.md#notifications-from-stories-reader) you can find it's usage.

- `ICustomGoodsWidget`'s `onItemClick` signature has **changed**.
  - Parameter `view: View` was
    added. It contains a clicked view and can be used to retrieve
    context. [Here](widget-goods.md#onitemclick) you can find it's usage.

## To 1.16.x

:::warning

- `UrlClickCallback` and `InAppStoryManager.setUrlClickCallback` marked as **deprecated**. Use
  `CallToActionCallback` instead.

- Interfaces `IGameLoaderView` and `ILoaderView` are marked as **deprecated**.
  Use `IStoryReaderLoaderView`
  and `IGameReaderLoaderView` instead. For more information
  read [**here**](appearance.md#istoryreaderloaderview-1160).

  :::

- `CallToActionCallback`'s `callToAction` signature has **changed**. Now it's returns `SlideData`
  object
  instead of separate fields. [Here](events.md#notifications-from-stories-reader) you can find it's
  usage

- `InAppStoryManager.openGame` signature has **changed**. For more information read [here](games.md)

- `ICustomGoodsWidget.getWidgetView`, `ICustomGoodsWidget.onItemClick`
  and `ICustomGoodsItem.getView` signatures **changed**. `SimpleCustomGoodsItem` class was
  added
  to simplify goods item customization. For more information read [here](widget-goods.md)

## To 1.15.x

:::tip[IMPORTANT]
**Working with sharing customization has changed completely**. Now it is possible to show custom
share panel over stories reader or games. [Here](favorites.md#share) is described how to implement
this
behavior.
:::

- `ShowStoryAction` constant `CLICK` was **changed** to `TAP`.

- Default **ratio** for feed items now can be set in InAppStory Console. Ratios still can be
  overridden
  in `AppearanceManager`.
- **Added** method `openGame` to `InAppStoryManager`. For more information read [here](games.md).

:::warning

- `InAppStoryManager.destroy()` was marked as **deprecated** and **will be removed** in the future.
  Use `InAppStoryManager.logout()` instead.
- `CsEventBus` and it's events were **removed** from SDK. You need to migrate to callbacks if you
  still use `CsEventBus`.
  For more information read [here](events.md#inappstory-manager-callbacks).
- `GameReaderCallback` was **added**. Old `GameCallback` is marked as **deprecated**.
  :::

## To 1.14.x

The signature of `showStory` method in `ShowStoryCallback` has **changed** (
added `action: ShowStoryAction?`
parameter).

```kotlin
interface ShowStoryCallback {
    fun showStory(
        id: Int,
        title: String?,
        tags: String?,
        slidesCount: Int,
        source: SourceType?,
        action: ShowStoryAction?
    )
}
```

## To 1.13.x

:::warning
`appearanceManager.csListItemWidth()` **is now deprecated**. `appearanceManager.csListItemRatio()`
was
**added** instead. Use this one only with `appearanceManager.csListItemHeight()`.
:::

- The appearance of a default
  favorite cell has changed (now it looks more similar to iOS InAppStory SDK).

- `appearanceManager.csColumnCount()` was **added**.
  ::: warning
  Use it only with `csListItemRatio` and only if you
  want to use a
  grid (you still need to set font size properly).
  :::

- `appearanceManager.csUGCListItemSimpleAppearance()` was
  **added**. [Here](/ugc-guides/android-ugc.md#ugc-cell-simple-customization) is described it's
  usage.

## To 1.12.x

:::tip[NEW FEATURE]
**UGC Feeds**. [Here](/ugc-guides/android-ugc.md#ugcstorieslist) is described their
usage.
:::

## To 1.11.x

Now parameters from methods
in [IGetFavoriteListItem](appearance.md#igetfavoritelistitem) (`bindFavoriteItem` and `setImages`)
may contain more than 4 elements (and count may be more than 4).

## To 1.10.x

- Added image placeholders. [Here](placeholders.md#image-placeholders-1100) is
  described it's usage.

- Signature of `showSlide` method in `ShowSlideCallback` has changed. (added `String payload`
  parameter)

```kotlin
interface ShowSlideCallback {
    fun showSlide(
        id: Int,
        title: String?,
        tags: String?,
        slidesCount: Int,
        index: Int,
        payload: String?
    )
}
```

## To 1.9.1

Added widget callbacks. [Here](events.md#notifications-from-widgets-in-stories-reader) is
described it's usage.

## From 1.8.x to 1.9.x

Added UGC Editor feature. [Here](/ugc-guides/android-ugc.md#ugc-editor) is described it's usage.

## From 1.6.x or 1.7.x to 1.8.x

- **Added** new feeds feature to `StoriesList`. Onboarding stories now have a public `feed: String?`
  parameter. [Here](stories-list.md#stories-feed) is described it's usage.

- Callback for `StoriesList` and it's adapter has **changed** (added `feed: String?` parameter to
  methods).

```kotlin
interface ListCallback {
    fun storiesLoaded(size: Int, feed: String?)

    fun loadError(feed: String?)

    fun itemClick(
        id: Int,
        listIndex: Int,
        title: String?,
        tags: String?,
        slidesCount: Int,
        isFavoriteList: Boolean,
        feed: String?
    )
}
```

Next callbacks and their adapters for `InAppstoryManager` also have changed (added `feed` parameter
to methods)

```kotlin
interface ErrorCallback {
    fun loadListError(feed: String?)

    fun loadOnboardingError(feed: String?)

    fun loadSingleError()

    fun cacheError()

    fun readerError()

    fun emptyLinkError()

    fun sessionError()

    fun noConnection()
}

interface OnboardingLoadCallback {
    fun onboardingLoad(count: Int, feed: String?);
}
```

- `StoriesLoaded`, `OnboardingLoad` and `StoriesErrorEvent` events now have a `getFeed()` method.

## From 1.5.x to 1.6.x

:::warning

- `setInstance` method for `AppearanceManager` is now **deprecated**. Use `setCommonInstance` method
  instead.
- `csStoryTouchListener` method for `AppearanceManager` is now **deprecated**.
  Use `setStoryTouchListener`
  method for `StoriesList` instead.
  If you don't want customize anything and use default implementations - you can
  call `loadStories()`
  method from `StoriesList` without setting `AppearanceManager`.
  :::

- `InAppStoryManager` **cannot** be initialized through Builder without setting a `userId` (You
  still can pass an empty `String` but the value can't be `null`).

- The interface for custom stories list cell `IStoriesListItem` has **changed**. Now it returns
  cached file
  path instead of web url in `setImage` and `setVideo` methods and calls only after these resouces
  are
  cached.
  <br/> Poster url and background color were **removed** from `setVideo`.

```kotlin
interface IStoriesListItem {
    void setImage(View itemView, String imageFilePath, int backgroundColor);

    void setVideo(View itemView, String videoFilePath);
}
```

## 1.5.4 and later

`ClickAction` DEEPLINK value was added. Here is described it's
usage: [setCallToActionCallback](events.md#notifications-from-stories-reader).

## From 1.4.x to 1.5.x

:::warning
`CloseStoryReaderEvent` was **removed** from the SDK. Use static
method `InAppStoryManager.closeStoryReader()` instead.
:::

## From 1.3.x to 1.4.x

- `targetSdkVersion` in the SDK gradle file was **updated** from 29 to 30.
  ::: warning
  It is necessary to
  update `targetSdkVersion` in your project gradle file.
  :::

- `InAppStoryManager` and `StoriesList` callbacks were **added** (you should use them instead
  of `CsEventBus`). For more information read [here](events.md#inappstory-manager-callbacks).

- `InAppStoryManager.closeStoryReader()` method was **added** to the SDK. We recommend to use it
  instead
  of `CsEventBus.getDefault().post(new CloseStoryReaderEvent(CloseStory.CUSTOM))`
