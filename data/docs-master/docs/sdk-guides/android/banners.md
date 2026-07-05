# Banner Carousel

## Requirements

SDK version 1.22.0 or higher.

## Initialization

`BannerCarousel` can be added like any `View` class. For example - via xml:

```xml

<com.inappstory.sdk.banners.ui.carousel.BannerCarousel android:id="@+id/bannerCarousel"
    android:layout_width="match_parent" app:cs_place_id="customBannerPlace"
    android:layout_height="wrap_content" />
```

Or via code:

```kotlin
fun addCustomBannerCarouselAsView(rootView: ViewGroup, context: Context) {
    val bannerCarousel = BannerCarousel(context)
    bannerCarousel.setPlaceId("customBannerPlace")
    rootView.addView(bannerCarousel)
}
```

The `cs_place_id` attribute defines specific place id of
banners, that will be bounded with specific loaded banner place.

## Load banners

You can load banners through `BannerCarousel` widget with method `loadBanners()`
or `loadBanners(skipCache: Boolean)`:

```kotlin
fun getBannersForBannerCarousel(bannerCarousel: BannerCarousel) {
    bannerCarousel.loadBanners() //this method loads cached data first by default. If no cached data - it load banners from server
}

fun getBannersForBannerCarouselFromServer(bannerCarousel: BannerCarousel) {
    bannerCarousel.loadBanners(true)
}
```

:::warning[Please note]
`BannerCarousel` has a `uniqueId` parameter which is used as a key to cache it's data. By default it
is represented as a random string, cretaed in the widget constructor. You can customize it to use
specific `uniqueId` for a specific widget with method `uniqueId(id: String)`. For example, if
your `BannerCarousel` is recreated, but you need show old data.
:::

Also you can load banners through `InAppStoryManager`:

```kotlin
fun loadBannerPlace(placeId: String, tags: List<String>?) {
    InAppStoryManager.getInstance()?.loadBannerPlace(
        BannerPlaceLoadSettings()
            .placeId(placeId)
            .tags(tags)
    )
}
```

This method also can be used to reload banner place (for example, in PtR case).
If any `BannerCarousel` with same `placeId` is attached to window - it will load and show banners.
Method `loadBannerPlace` can be invoked before or after attaching `BannerCarousel` to window -
result
will be the same.

If you want to preload banners and get some response through load process -
method `preloadBannerPlace` can be used. It works the same way as `loadBannerPlace` (and can be used
instead of `loadBannerPlace`), but has callback.

```kotlin
data class BannerData(
    val id: Int,
    val bannerPlace: String
) : ContentData

abstract class BannerPlacePreloadCallback {
    abstract fun bannerPlaceLoaded(size: Int, bannerData: List<BannerData>)
    abstract fun loadError()
    abstract fun bannerContentLoaded(bannerId: Int, isFirst: Boolean)
    abstract fun bannerContentLoadError(bannerId: Int, isFirst: Boolean)
}

fun preloadBannerPlace(placeId: String, tags: List<String>?, callback: BannerPlacePreloadCallback) {
    InAppStoryManager.getInstance()?.preloadBannerPlace(
        BannerPlaceLoadSettings()
            .placeId(placeId)
            .tags(tags),
        callback
    )
}
```

Also `BannerCarousel` has its own callback `BannerPlaceLoadCallback` for loading:

```kotlin
abstract class BannerPlaceLoadCallback {
    abstract fun bannerPlaceLoaded(size: Int, bannerData: List<BannerData>, widgetHeight: Int)
    abstract fun loadError()
    abstract fun bannerContentLoaded(bannerId: Int, isFirst: Boolean)
    abstract fun bannerContentLoadError(bannerId: Int, isFirst: Boolean)
}

fun setLoadCallback(
    bannerPlace: BannerPlace,
    callback: BannerPlaceLoadCallback
) {
    bannerPlace.loadCallback(callback)
}
```

:::warning[Please note]
If you add `BannerCarousel` after loading content with methods `loadBannerPlace`
or `preloadBannerPlace` - it will show nothing if you don't call method `loadBanners` from widget
itself. But if any `BannerCarousel` already added to screen - it refreshes it's content with
method `loadBannerPlace` or `preloadBannerPlace`
:::

## Customization

`BannerCarousel` can be customized with `AppearanceManager`:

```kotlin
interface ICustomBannerCarouselAppearance {
    fun bannersOnScreen(): Int // how much banners will be shown same time, by default = 1

    fun nextBannerOffset(): Int // which part (in dp) of next banner will be shown with current, default = 0dp

    fun prevBannerOffset(): Int // which part (in dp) of previous banner will be shown with current, default = 0dp

    fun bannersGap(): Int // distance (in dp) between banners, default = 8dp

    fun cornerRadius(): Int // radius (in dp) of banners, default = 16dp

    fun loop(): Boolean // if banner place is looped, default = true

    fun loadingPlaceholder(context: Context): View //can be used to replace default loader for banners
}


fun customizeBannerCarousel(
    bannerPlaceAppearance: ICustomBannerCarouselAppearance
) {
    AppearanceManager().csBannerCarouselInterface(bannerPlaceAppearance)
}
```

You can also override `DefaultBannerCarouselAppearance` to simplify customization process:

```kotlin
class CustomBannerCarouselAppearance : DefaultBannerCarouselAppearance() {
    override fun nextBannerOffset(): Int {
        return 20
    }

    override fun prevBannerOffset(): Int {
        return 20
    }
}

fun customizeBannerCarousel(
) {
    AppearanceManager().csBannerCarouselInterface(CustomBannerCarouselAppearance())
}
```

## Navigation

In addition to user interaction with banner place or autoscroll - you can use
methods `showNext()`, `showPrevious()` and `showByIndex(index: Int)` to navigate
through banners in place:

```kotlin
fun bannerNavigationExamples(bannerCarousel: BannerCarousel) {

    bannerCarousel.showNext() //scroll to next banner

    bannerCarousel.showPrevious() //scroll to previous banner

    bannerCarousel.showByIndex(3) //scroll banner with index 3, counting from 0 (4th in list)
}
```

Also `BannerCarousel` has callback for it's navigation events. F.e, it can be used to draw any
navigation element.

```kotlin
interface BannerCarouselNavigationCallback {
    fun onPageScrolled(
        position: Int, //current index
        total: Int, //how much elements in banner place
        positionOffset: Float, //offset in percent, value from 0 to 1
        positionOffsetPixels: Int //offset in pixels
    )

    fun onPageSelected(
        position: Int,  //current index
        total: Int //how much elements in banner place
    )
}

fun setNavCallback(
    bannerCarousel: BannerCarousel,
    callback: BannerCarouselNavigationCallback
) {
    bannerCarousel.navigationCallback(callback)
}
```

## Autoscroll manage

If you need to stop and resume `BannerCarousel` autoscroll (f.e. in case of another fragment/dialog
is
overlaps screen with banners), you can use methods `pauseAutoscroll` and `resumeAutoscroll`

```kotlin
fun bannerAutoscrollManageExamples(bannerCarousel: BannerCarousel) {
    bannerCarousel.pauseAutoscroll()

    bannerCarousel.resumeAutoscroll()
}
```

## Events

### ShowBanner

When you show banner in banner place

```kotlin
fun setIASShowBannerCallback() {
    InAppStoryManager.getInstance().setShowBannerCallback(
        object : ShowBannerCallback {
            override fun showBanner(
                bannerData: BannerData?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### BannerWidget

When you get any events from widgets in banner

```kotlin
fun setIASBannerWidgetCallback() {
    InAppStoryManager.getInstance().setBannerWidgetCallback(
        object : BannerWidgetCallback {
            override fun bannerWidget(
                bannerData: BannerData?,
                widgetEventName: String?,
                widgetData: Map<String?, String?>?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

## Vertical gestures handling

Started from version 1.25.0 scratch card widget support was added. If you place banners widget
inside any type of scrollable view, you need to lock parent scroll for correct work of scratch card.
To do this OnVerticalGestureAvailabilityCallback was added (it triggers, when user touch down on
scratch card):

```kotlin
interface OnVerticalGestureAvailabilityCallback {
    fun onAvailabilityChanged(available: Boolean)
}

fun lockUnlockParentScroll(bannerCarousel: BannerCarousel, lockParent: () -> Unit, unlockParent: () -> Unit) {
    bannerCarousel.verticalGestureAvailability(
        object : OnVerticalGestureAvailabilityCallback {
            override fun onAvailabilityChanged(available: Boolean) {
                if (available) unlockParent() else lockParent()
            }
        }
    )
}
```