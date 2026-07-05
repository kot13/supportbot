# Appearance

## AppearanceManager

The appearance of the stories list, story reader, game reader and input dialogs are configured through the `AppearanceManager` class. It can be set for the whole SDK, or separately:

1. For `storiesList` before calling `loadStories()`;
2. In onboardings or single calls.

For a common (shared) setting you should call the static method of the class:

```kotlin
AppearanceManager.setCommonInstance(appearanceManager);
```

To set appearanceManager to `StoriesList` you should call:

```kotlin
storiesList.setAppearanceManager(appearanceManager);
```

If `AppearanceManager` wasn't specified for the `StoriesList`, then settings from the common `AppearanceManager` will be used.

## Parameters

Some parameters in `AppearanceManager` can be set only for common instance.

#### Common appearance parameters

| Variable                        | Type     | Default | Purpose | Description                                                                    |
| ------------------------------- | -------- | ------- | ------- | ------------------------------------------------------------------------------ |
| csCustomFont                    | Typeface | null    | Inputs  | The primary regular font in inputs                                             |
| csCustomBoldFont                | Typeface | null    | Inputs  | The primary bold font in inputs                                                |
| csCustomItalicFont              | Typeface | null    | Inputs  | The primary italic font in inputs                                              |
| csCustomBoldItalicFont          | Typeface | null    | Inputs  | The primary bold italic font in inputs                                         |
| csCustomSecondaryFont           | Typeface | null    | Inputs  | The secondary regular font in inputs                                           |
| csCustomSecondaryBoldFont       | Typeface | null    | Inputs  | The secondary bold font in inputs                                              |
| csCustomSecondaryItalicFont     | Typeface | null    | Inputs  | The secondary italic font in inputs                                            |
| csCustomSecondaryBoldItalicFont | Typeface | null    | Inputs  | The secondary bold italic font in inputs                                       |
| csIsDraggable                   | Boolean  | true    | Reader  | A flag, responsible for the ability to close the story reader with drag'n'drop |

Other parameters can be set separately for list/onboardings/single stories:

#### Instance appearance parameters

| Variable                       | Type                  | Default            | Purpose     | Description                                                                                                                                          |
| ------------------------------ | --------------------- | ------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| csCustomFont                   | Typeface              | null               | List        | The primary regular font for list cells. It can be set separately only for list cells, but not for inputs                                            |
| csHasLike                      | Boolean               | false              | Reader      | A flag, responsible for connecting the like / dislike functionality                                                                                  |
| csHasShare                     | Boolean               | false              | Reader      | A flag, responsible for connecting the sharing functionality                                                                                         |
| csHasUgc                       | Boolean               | false              | List        | A flag, responsible for showing UGC items in the SDK. Full documetation about UGC Editor can be found [here](/ugc-guides/android-ugc.md#ugc-editor). |
| csHasFavorite                  | Boolean               | false              | Reader/List | A flag, responsible for connecting the functionality of favorite stories                                                                             |
| csCloseOnSwipe                 | Boolean               | true               | Reader      | A flag, responsible for closing stories by swiping down                                                                                              |
| csCloseOnOverscroll            | Boolean               | true               | Reader      | A flag, responsible for closing stories by swiping left on the last story or right on the first story                                                |
| csListItemHeight               | Integer               | null               | List        | Height of the list cell in pixels                                                                                                                    |
| csListItemRatio                | Float                 | null               | List        | Ratio of the list cell (width to height)                                                                                                             |
| csColumnCount                  | Integer               | null               | List        | Count of columns in grid mode. Use it only with csListItemRatio and only if you want grid (you still need to set font size properly)                 |
| csListItemRadius               | Integer               | 16sp               | List        | Radius of the list cell in pixels                                                                                                                    |
| csListItemTitleSize            | Integer               | 14sp               | List        | Size of the title                                                                                                                                    |
| csListItemBorderColor          | Integer               | Color.BLACK        | List        | The border color for a not opened cell                                                                                                               |
| csListItemGradientEnable       | boolean               | true               | List        | Adds bottom gradient for default cell if true                                                                                                        |
| csListOpenedItemBorderColor    | Integer               | Hided (Color.GRAY) | List        | The border color for an opened cell                                                                                                                  |
| csListOverscroll               | boolean               | true               | List        | Reset Android 13 and higher default behaviour (expand and shrink back)                                                                               |
| csListItemMargin               | Integer               | 4dp                | List        | Indent between cells                                                                                                                                 |
| csNavBarColor                  | Integer               | 0                  | Reader      | Color of the navigation bar                                                                                                                          |
| csNightNavBarColor             | Integer               | 0                  | Reader      | Color of the navigation bar in dark mode. If 0 - csNavBarColor will be used                                                                          |
| csClosePosition                | Integer               | 2                  | Reader      | The place of story close button display in the reader (`TOP_LEFT = 1; TOP_RIGHT = 2; BOTTOM_LEFT = 3; BOTTOM_RIGHT = 4;`)                            |
| csReaderRadius                 | Integer               | 0                  | Reader      | Radius for stories reader pages                                                                                                                      |
| csStoryReaderAnimation         | Integer               | 2                  | Reader      | Animation of scrolling through stories in the story reader (`ANIMATION_DEPTH = 1; ANIMATION_CUBE = 2, ANIMATION_COVER = 3, ANIMATION_FLAT = 4;`)     |
| csStoryReaderPresentationStyle | Integer               | 0                  | Reader      | Animation of story reader opening and closing (`ZOOM = 0; FADE = 1, POPUP = 2, DISABLE = -1;`)                                                       |
| csCoverQuality                 | Integer               | 1                  | List        | Quality for stories list covers. If not set - the SDK will use medium image quality (`QUALITY_MEDIUM = 1; QUALITY_HIGH = 2;`)                        |
| csTimerGradientEnable          | Boolean               | false              | Reader      | A flag, responsible for show dark gradient behind timer in reader                                                                                    |
| csTimerGradient                | StoriesGradientObject | null               | Reader      | Appearance for gradient shade in reader                                                                                                              |

All setters return `AppearanceManager` instance and can be set like this:

```kotlin
fun setAppearanceManagerParameters(context: Context) {
    appearanceManager
        .csListItemBorderColor(Color.RED)
        .csListItemMargin(0)
        .csClosePosition(AppearanceManager.BOTTOM_RIGHT)
        .csListItemTitleSize(
            Sizes.dpToPxExt(20, context)
        )
}
```

## Complex Interfaces

There are several interfaces in the `AppearanceManager`.

### Fully custom cells

Next three interfaces are used to fully customize list cells.

#### For stories cells

```kotlin
fun setListItemInterface(listItemInterface: IStoriesListItem) {
    appearanceManager
        .csListItemInterface(listItemInterface)
}
```

#### For favorite cell

```kotlin
fun setFavoriteListItemInterface(favoriteListItemInterface: IGetFavoriteListItem) {
    appearanceManager
        .csFavoriteListItemInterface(favoriteListItemInterface)
}
```

#### For UGC cell

```kotlin
fun setListUGCItemInterface(listUGCItemInterface: IStoriesListUGCItem) {
    appearanceManager
        .csListUGCItemInterface(listUGCItemInterface)
}
```

These three interfaces may be set separately for each list. For more information about these
interfaces you can
read [here (IStoriesListItem)](#istorieslistitem), [here (IGetFavoriteListItem)](#igetfavoritelistitem)
and [here (UGC customization)](/ugc-guides/android-ugc.md#customization-and-callbacks).

Additionally, `AppearanceManager` allows you to customize loaders in story reader and game reader
with
next two interfaces. This interface must be set for the common `AppearanceManager`.

### IStoryReaderLoaderView (>1.16.0)

Added in v1.16.0.
`IStoryReaderLoaderView iStoryReaderLoaderView` - use to substitute the default loader with your
own.

```kotlin
interface IStoryReaderLoaderView {
    fun getView(context: Context): View
}
```

#### Example

```kotlin
globalAppearanceManager.csStoryLoaderView(
    object : IStoryReaderLoaderView() {
        override fun getView(context: Context): View {
            val v = RelativeLayout(context);
            v.addView(
                View(context).apply {
                    setLayoutParams(
                        RelativeLayout.LayoutParams(
                            Sizes.dpToPxExt(48, context),
                            Sizes.dpToPxExt(48, context)
                        )
                    );
                    setBackgroundColor(Color.GREEN);
                }
            )
            return v;
        }
    }
)
```

### IGameReaderLoaderView (>1.16.0)

Added in v1.16.0
`IGameReaderLoaderView iGameReaderLoaderView` - use to substitute your own loader instead of the
default one (or lottie) on the games screen. This interface must be set for the
global `AppearanceManager`.

```kotlin
interface IGameReaderLoaderView {
    // When inheriting from an interface, View must return itself
    fun getView(context: Context): View

    // Progress values - from 0 to 100, 100 is transmitted as max
    fun setProgress(progress: Int, max: Int)

    // Type of progress bar
    fun setIndeterminate(indeterminate: Boolean)

    // Triggers when game already loaded all resources and started initialize process
    fun launchFinalAnimation()
}

globalAppearanceManager.csGameReaderLoaderView(
    object : IGameReaderLoaderView() {
        override fun getView(context: Context): View {
            TODO("Not yet implemented")
        }

        override fun setProgress(progress: Int, max: Int) {
            TODO("Not yet implemented")
        }

        override fun setIndeterminate(indeterminate: Boolean) {
            TODO("Not yet implemented")
        }

        override fun launchFinalAnimation() {
            TODO("Not yet implemented")
        }
    }
)
```

### ILoaderView

:::warning[DEPRECATED]
Deprecated in v1.16.0 and higher.

:::
`ILoaderView iLoaderView` - use to substitute the default loader with your own.

```kotlin
interface ILoaderView {
    fun getView(): View
}
```

#### Example

```kotlin
globalAppearanceManager.csLoaderView(
    object : ILoaderView() {
        override fun getView(): View {
            val v = RelativeLayout(context);
            v.addView(
                View(context).apply {
                    setLayoutParams(
                        RelativeLayout.LayoutParams(
                            Sizes.dpToPxExt(48, context),
                            Sizes.dpToPxExt(48, context)
                        )
                    );
                    setBackgroundColor(Color.GREEN);
                }
            )
            return v;
        }
    }
)
```

### IGameLoaderView

:::warning[DEPRECATED]
Deprecated in v1.16.0 and higher.
:::
`IGameLoaderView iGameLoaderView` - use to substitute your own loader instead of the default one on
the games screen. This interface must be set for the global `AppearanceManager`.

```kotlin
interface IGameLoaderView {
    // When inheriting from an interface, View must return itself
    fun getView(): View

    // Progress values - from 0 to 100, 100 is transmitted as max
    fun setProgress(progress: Int, max: Int)
}
```

### IStoriesListItem

`IStoriesListItem csListItemInterface` - used for full customization of list items.

:::tip
Other parameters that affect the appearance of the list cell will be ignored if this interface is
specified.
:::

```kotlin
interface IStoriesListItem {
    // here you need to pass View - the appearance of the cell
    fun getView(): View

    // here you need to pass the View - the appearance of the cell in case the cells use the cover video
    fun getVideoView(): View

    // itemView is the current cell, in the required View we use the story header. storyId - unique story id that can be used for your own purposes. For example - to remove from favorite by id
    fun setId(itemView: View, storyId: Int)

    // itemView is the current cell, in the required View we use the story header. The titleColor parameter can be null
    fun setTitle(itemView: View, title: String, titleColor: Integer)

    // itemView - the current cell, in the required View show the story's cover (imagePath - path for local file) or background color if it is absent. For video cover imagePath returns poster frame
    fun setImage(itemView: View, url: String, background: Int)

    // itemView is the current cell, change it as needed if it is opened
    fun setOpened(itemView: View, isOpened: Boolean)

    // itemView - the current cell, change it as needed if this story has audio inside
    fun setHasAudio(itemView: View, hasAudio: Boolean)

    // itemView is the current cell, in the required View we show the video cover (videoPath - path for local file). To work with video cells, it is recommended to use a class from the VideoPlayer library as a container for displaying video and the loadVideo(String videoPath) method to launch. The VideoPlayer class inherits from TextureView
    fun setVideo(itemView: View, videoPath: String)
}
```

#### Example

```kotlin
appearanceManager.csListItemInterface(
    object : IStoriesListItem() {
        override fun getView(): View? {
            return LayoutInflater.from(MainActivity.this)
                .inflate(R.layout.custom_story_list_item, null, false);
        }

        override fun getVideoView(): View? {
            return LayoutInflater.from(MainActivity.this)
                .inflate(R.layout.custom_story_list_video_item, null, false);
        }

        override fun setId(itemView: View, storyId: Int) {
            //do smth with storyId
        }

        override fun setTitle(itemView: View, title: String?, titleColor: Int?) {
            (itemView.findViewById(R.id.title) as AppCompatTextView).setText(title)
        }

        override fun setImage(itemView: View, url: String?, background: Int) {
            // If there is a story with an image and without, then you may need to pre-clear the imageView using setImageResource(0)
            loadImageOrSetBackground(
                itemView.findViewById(R.id.image),
                imagePath,
                backgroundColor
            );
        }

        override fun setVideo(itemView: View, videoPath: String?) {
            (itemView.findViewById(R.id.video) as VideoPlayer).loadVideo(videoPath);
        }

        override fun setOpened(itemView: View, isOpened: Boolean) {
            itemView.findViewById(R.id.border).setVisibility(
                if (isOpened)
                    View.INVISIBLE
                else
                    View.VISIBLE
            )
        }

        override fun setHasAudio(itemView: View, hasAudio: Boolean) {

        }
    }
)
```

### IStoriesListItemWithStoryData

`IStoriesListItemWithStoryData csListItemInterface` - inherits from IStoriesListItem and can be used
to get `StoryData` object when you bind item. It adds
method `fun setCustomData(itemView: View, customData: StoryData?)`.

#### Example

```kotlin
appearanceManager.csListItemInterface(
    object : IStoriesListItemWithStoryData() {
        override fun getView(): View? {
            return LayoutInflater.from(MainActivity.this)
                .inflate(R.layout.custom_story_list_item, null, false);
        }

        override fun getVideoView(): View? {
            return LayoutInflater.from(MainActivity.this)
                .inflate(R.layout.custom_story_list_video_item, null, false);
        }

        override fun setId(itemView: View, storyId: Int) {
            //do smth with storyId
        }

        override fun setTitle(itemView: View, title: String?, titleColor: Int?) {
            (itemView.findViewById(R.id.title) as AppCompatTextView).setText(title)
        }

        override fun setImage(itemView: View, url: String?, background: Int) {
            // If there is a story with an image and without, then you may need to pre-clear the imageView using setImageResource(0)
            loadImageOrSetBackground(
                itemView.findViewById(R.id.image),
                imagePath,
                backgroundColor
            );
        }

        override fun setVideo(itemView: View, videoPath: String?) {
            (itemView.findViewById(R.id.video) as VideoPlayer).loadVideo(videoPath);
        }

        override fun setOpened(itemView: View, isOpened: Boolean) {
            itemView.findViewById(R.id.border).setVisibility(
                if (isOpened)
                    View.INVISIBLE
                else
                    View.VISIBLE
            )
        }

        override fun setHasAudio(itemView: View, hasAudio: Boolean) {

        }

        override fun setCustomData(itemView: View, storyData: StoryData?) {
            storyData?.let {
                useStoryData(itemView, it)
            }
        }


    }
)

private fun useStoryData(view: View, storyData: StoryData) {
    TODO("Not yet implemented")
}

```

### IGetFavoriteListItem

`IGetFavoriteListItem csFavoriteListItemInterface` - used to fully customize the favorite item in
the list

```kotlin
interface IGetFavoriteListItem {
    fun getFavoriteItem(): View?

    fun bindFavoriteItem(
        view: View,
        backgroundColors: List<Int?>?,
        count: Int
    )

    fun setImages(
        view: View,
        images: List<String?>?,
        backgroundColors: List<Int?>?,
        count: Int
    )
}
```

`View favCell` in `bindFavoriteItem` method - `RelativeLayout`, which contains the View returned
by `getFavoriteItem` method. If you need to access the internal View directly - you must firstly set
an id for it or access it as `favCell.getChildAt(0)`.

Class `FavoriteImage` contains methods:
| Method | Type | Description |
|----------------------------|--------------------------|-----------------------------------------------------------------|
| `getId()` | `int` | story id |
| `getImage()` | `Image` |cover story (the Image object contains the `getUrl()` method to get a link
to the picture)|
| `getBackgroundColor()`| `int`| background color |

#### Example

```kotlin
appearanceManager.csFavoriteListItemInterface(
    object : IGetFavoriteListItem() {
        override fun getFavoriteItem(): View? {
            return LayoutInflater.from(getActivity()).inflate(
                R.layout.item_story_custom_fav_new,
                null, false
            )
        }

        override fun bindFavoriteItem(
            view: View,
            backgroundColors: List<Int?>?,
            count: Int
        ) {
            val title = view.findViewById(R.id.title) as AppCompatTextView
            title.setText(getResources().getString(R.string.favorites))
            val imageViewLayout = view.findViewById(R.id.container) as RelativeLayout
            imageViewLayout.removeAllViews();
            bindFavoriteCellImages(imageViewLayout, null, backgroundColors, count);
        }

        override fun setImages(
            view: View,
            images: List<String>,
            backgroundColors: List<Int?>?,
            count: Int
        ) {
            bindFavoriteCellImages(
                view.findViewById(R.id.container),
                images,
                backgroundColors,
                count
            )
        }
    }
)
```

Also, to interact with the favorite cell (for example, to open a new window with a list of favorite
stories), you need to add a handler:

```kotlin
storiesList.setOnFavoriteItemClick(
    object : StoriesList.OnFavoriteItemClick() {
        override fun onClick() {
            doAction();
        }
    }
)
```

Clicks to list cells also can be customized with next handler (for example - if you want to add
click touch animations):

```kotlin
storiesList.setStoryTouchListener(
    object : StoryTouchListener {
        override fun touchDown(view: View, position: Int) {}
        override fun touchUp(view: View, position: Int) {}
    }
)
```

## Cell customization

### Cell reshaping: rectangle, circle

In order to define a rectangular cell - in the `AppearanceManager` you can
use `csListItemWidth(width: Int)`, `csListItemRatio(widthToHeightRatio: Float)`
, `csListItemRadius(radius: Int)`.

:::warning
In versions before v1.13.0 you have to use `csListItemHeight(height: Int)`
with `csListItemWidth(width: Int)` instead of `csListItemRatio`
:::

If you need more shape customization - you have to use `csListItemInterface`.

### Cell title parameters: size

If you want to change default title size you can use `csListItemTitleSize(color: Int)`

#### Example

```kotlin

fun setAppearanceManagerTitleParameters(context: Context) {
    appearanceManager
        .csListItemTitleSize(Sizes.dpToPx(16, context))
}
```

### Custom font

To customize the font of the cell, use `csCustomFont(font: Typeface)` in the `AppearanceManager`.
There is no font customization in the story reader, the font for stories is automatically downloaded
from the backend server.

### Favorite cell customization

When initializing `AppearanceManager` use the `csHasFavorite(true)` property. In the case of
customizing the appearance of the list cells through `IStoriesListItem`, you must also customize the
appearance of the favorites cell using the `IGetFavoriteListItem csFavoriteListItemInterface`
interface. In addition, to interact with the favorites cell, add
the `storiesList.setOnFavoriteItemClick(callback: StoriesList.OnFavoriteItemClick)` handler. When
displaying a list of favorites in xml-layout with a list, you must add the `cs_listIsFavorite`
attribute.

For more information about Favorites look [here](favorites.md#favorites).

## StoriesList Customization

The appearance of the stories list, as well as some elements of the story reader, is configured
through the `AppearanceManager` class. It must be set globally for the library, or separately for
the list before calling `loadStories()`. For a global setting, you must call the static method of
the class:

```kotlin
    AppearanceManager.setCommonInstance(globalAppearanceManager);
```

To set the list you should call the instance method of the `StoriesList` class:

```kotlin
    storiesList.setAppearanceManager(appearanceManager);
```

Next `AppearanceManager` parameters can be set for list appearance:
| Variable | Type | Default| Description |
|----------------------------------|---------------------|--------|-------------------------------------------------------------------------|
| csListItemGradientEnable | Boolean | true | Add gradient to default stories cells |
| csListItemRadius | Integer | 16dp | radius for list cell in pixels |
| csListItemWidth | Integer | null | the width of the list cell in pixels |
| csListItemHeight | Integer | null | the height of the list cell in pixels |
| csListItemTitleSize | Integer | 14sp | size of the title |
| csListItemBorderColor | Integer | Color.BLACK | the border color for the unopened cell |
| csCustomFont | Typeface | null | the primary regular font, default for the title of the story in the cell. |
| csListItemMargin | Integer | 4dp | indent between cells |
| csCoverQuality | Integer | 1 | quality for stories list covers. If not set - sdk uses medium image quality (`QUALITY_MEDIUM = 1; QUALITY_HIGH = 2;`)|

## Reader's buttons customization

Buttons inside readers (Stories, InAppMessages, Games) can be customized through changing icons or with full views replacement.
Buttons can have multiple states (up to 4).

:::warning
Before 1.21.11 SDK only icons customization is supported and methods `csCloseIcon`, `csRefreshIcon`, etc have to be used with local `AppearanceManager` instance.
Started from 1.21.11 custom button view's support were added and icons customization were moved to global `AppearanceManager` instance.
:::

### Changing icons

#### Close and refresh buttons

Close and refresh buttons has only one state (active|enabled). It's icon can be set through methods `csCloseIcon` and `csRefreshIcon`.

```kotlin
fun setCloseIcon(closeIconResId: Int) {
    globalAppearanceManager.csCloseIcon(closeIconResId)
}

fun setRefreshIcon(refreshIconResId: Int) {
    globalAppearanceManager.csRefreshIcon(refreshIconResId)
}

setCloseIcon(R.drawable.custom_close_icon) //can be used stateless image
setRefreshIcon(R.drawable.custom_refresh_icon) //can be used stateless image
```

#### Share button

Close button has 2 states (active|enabled and active|disabled). It's icon can be set through method `csShareIcon`.

```kotlin
setShareIcon(R.drawable.custom_share_icon) //can be used resource with selector

fun setShareIcon(shareIconResId: Int) {
    globalAppearanceManager.csShareIcon(shareIconResId)
}
```

```xml custom_share_icon.xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_enabled="true" android:drawable="@drawable/share_enabled_icon" />
    <item android:state_enabled="false" android:drawable="@drawable/share_disabled_icon" />
</selector>
```

#### Sound button

Close button has 2 states (active|enabled and inactive|enabled). It's icon can be set through method `csSoundIcon`.

```kotlin
setSoundIcon(R.drawable.custom_sound_icon) //can be used resource with selector

fun setSoundIcon(soundIconResId: Int) {
    globalAppearanceManager.csSoundIcon(soundIconResId)
}
```

```xml custom_sound_icon.xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_activated="true" android:drawable="@drawable/sound_on_icon" />
    <item android:state_activated="false" android:drawable="@drawable/sound_off_icon" />
</selector>
```

#### Favorite, like, dislike buttons

Favorite, like and dislike buttons has 4 states (active|enabled, inactive|enabled, active|disabled, inactive|disabled). Their icons can be set through methods `csFavoriteIcon`, `csLikeIcon` and `csDislikeIcon`

```kotlin
setFavoriteIcon(R.drawable.custom_favorite_icon) //can be used resource with selector

fun setFavoriteIcon(favoriteIconResId: Int) {
    globalAppearanceManager.csFavoriteIcon(soundIconResId)
}
```

```xml custom_favorite_icon.xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_activated="true" android:state_enabled="true" android:drawable="@drawable/favorite_active_enabled" />
    <item android:state_activated="false" android:state_enabled="true" android:drawable="@drawable/favorite_inactive_enabled" />
    <item android:state_activated="true" android:state_enabled="false" android:drawable="@drawable/favorite_active_disabled" />
    <item android:state_activated="false" android:state_enabled="false" android:drawable="@drawable/favorite_inactive_disabled" />
</selector>
```

Like and dislike icons can be set same way.

### Custom views (>= 1.21.11)

Also reader's button's views can be replaces with custom views with `csCustomIcons` method.

```kotlin
interface ICustomIconState {
    fun enabled(): Boolean
    fun active(): Boolean
}

abstract class CustomFavoriteIconInterface {
    abstract fun createIconView(context: Context?, maxSizeInPx: SizeF?): View
    abstract fun updateState(iconView: View?, iconState: ICustomIconState?)
    fun touchEvent(iconView: View?, event: MotionEvent?) {}
    fun clickEvent(iconView: View?) {}
}

abstract class CustomLikeIconInterface {
    abstract fun createIconView(context: Context?, maxSizeInPx: SizeF?): View
    abstract fun updateState(iconView: View?, iconState: ICustomIconState?)
    fun touchEvent(iconView: View?, event: MotionEvent?) {}
    fun clickEvent(iconView: View?) {}
}

abstract class CustomDislikeIconInterface {
    abstract fun createIconView(context: Context?, maxSizeInPx: SizeF?): View
    abstract fun updateState(iconView: View?, iconState: ICustomIconState?)
    fun touchEvent(iconView: View?, event: MotionEvent?) {}
    fun clickEvent(iconView: View?) {}
}

abstract class CustomShareIconInterface {
    abstract fun createIconView(context: Context?, maxSizeInPx: SizeF?): View
    abstract fun updateState(iconView: View?, iconState: ICustomIconState?)
    fun touchEvent(iconView: View?, event: MotionEvent?) {}
    fun clickEvent(iconView: View?) {}
}

abstract class CustomSoundIconInterface {
    abstract fun createIconView(context: Context?, maxSizeInPx: SizeF?): View
    abstract fun updateState(iconView: View?, iconState: ICustomIconState?)
    fun touchEvent(iconView: View?, event: MotionEvent?) {}
    fun clickEvent(iconView: View?) {}
}

abstract class CustomCloseIconInterface {
    abstract fun createIconView(context: Context?, maxSizeInPx: SizeF?): View
    fun touchEvent(iconView: View?, event: MotionEvent?) {}
    fun clickEvent(iconView: View?) {}
}

abstract class CustomRefreshIconInterface {
    abstract fun createIconView(context: Context?, maxSizeInPx: SizeF?): View
    fun touchEvent(iconView: View?, event: MotionEvent?) {}
    fun clickEvent(iconView: View?) {}
}

fun setCustomIcons(
    favoriteButtonInterface: CustomFavoriteIconInterface?,
    likeButtonInterface: CustomLikeIconInterface?,
    dislikeButtonInterface: CustomDislikeIconInterface?,
    shareButtonInterface: CustomShareIconInterface?,
    soundButtonInterface: CustomSoundIconInterface?,
    closeButtonInterface: CustomCloseIconInterface?,
    favoriteButtonInterface: CustomRefreshIconInterface?
) {
    globalAppearanceManager.csCustomIcons(
        favoriteButtonInterface,
        likeButtonInterface,
        dislikeButtonInterface,
        shareButtonInterface,
        soundButtonInterface,
        closeButtonInterface,
        favoriteButtonInterface
    )
}
```

If any of interfaces in `csCustomIcons` are nulls - default or overridden icon with default button view will be used.

## StoriesReader customization

### Changing the position of the timer / cross

The `AppearanceManager` uses `csClosePosition`.

### Changing the loader in the story reader

The global `AppearanceManager` uses customization via `csLoaderView`.

### Reader gradient

`AppearanceManager` has two parameters thar responsible for gradient in reader under timer.
`csTimerGradientEnable` can be used to turn on/off that gradient and `csTimerGradient` - to
customize its appearance. To customize you should pass StoriesGradientObject to setter.

```kotlin
class StoriesGradientObject(
    csGradientHeight: Int = 100, //size in dp
    csColors: List<Integer> = listOf(0x00000000, 0x50000000),
    csLocations: List<Float> = listOf(0f, 1f)
)
```

You can set `csColors` and `csLocatios` must have equal size that has to be greater or equal to 2.
Also if you want create a fullscreen gradient - you can set `csGradientHeight` as 0.
`StoriesGradientObject` parameters can be set through `Builder` pattern

```kotlin
val gradient = StoriesGradientObject()
    .csColors(
        mutableListOf(
            Color.parseColor("#90000000"),
            Color.parseColor("#00000000"),
            Color.parseColor("#00000000")
        )
    )
    .csLocations(mutableListOf(0f, 0.2f, 1f))
    .csGradientHeight(0)
```
