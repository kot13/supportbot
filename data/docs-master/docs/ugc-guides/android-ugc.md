# Android-UGC

## UGC Editor

A library with UGC Editor that works
with [InAppStory library](/sdk-guides/android/how-to-get-started.md).

### Requirements

The minimum SDK version is 21 (Android 5.0).

#### Version compatibility

| UGC SDK version | InAppStory SDK version |
| --------------- |------------------------|
| 1.4.0           | 1.18.0 - 1.20.x        |
| 1.3.0           | 1.17.0+                |
| 1.2.2           | 1.16.2+                |
| 1.2.1           | 1.16.1                 |
| 1.2.0           | 1.16.0                 |
| 1.1.0 - 1.1.2   | 1.15.0-rc1             |
| 1.0.7           | 1.12.4                 |
| 1.0.6           | 1.12.0-rc7             |
| 1.0.5           | 1.12.0-rc3+            |
| 1.0.4           | 1.12.0-rc2             |
| 1.0.0 - 1.0.2   | 1.9.1 - 1.11.1         |

The library is intended for Phone and Tablet projects (not intended for Android TV or Android Wear
applications).

## Adding to the project

Add jitpack maven repo to the root `build.gradle` in the `repositories` section :

```gradle
allprojects {
	repositories {
		...
		maven { url 'https://jitpack.io' }
	}
}
```

In the project `build.gradle` (app level) in the `dependencies` section add dependency to InAppStory
library:

```gradle
implementation("com.github.inappstory:android-sdk:$inappstory_version") {
	transitive=true
}
```

And then add dependency to UGC library (Latest release version is 1.2.2):

```gradle
implementation("com.github.inappstory:ugc-android-sdk:$ugc_version") {
	transitive=true
	exclude group: 'com.github.inappstory', module: 'android-sdk' //exclude to prevent libraries overriding
}
```

## Initialization and Editor Usage

1. [Initialize InAppStory SDK](/sdk-guides/android/how-to-get-started.md#basic-initialization)
2. In [AppearanceManager](/sdk-guides/android/appearance.md#appearancemanager) (in global or
   for `StoriesList`) you need to set `csHasUgc` as true.
3. For `StoriesList` set click callback from UGC item
   with `setOnUGCItemClick(callback: OnUGCItemClick)`. In callback you can open Editor with method
   from `UGCInAppStoryManager.openEditor(ctx: Context, ugcInitData: HashMap<String, Any?>? = null)`

For example:

```kotlin
appearanceManager.csHasUgc(true);
storiesList.setAppearanceManager(appearanceManager)
storiesList.setOnUGCItemClick {
    UGCInAppStoryManager.openEditor(context)
}
storiesList.loadStories()
```

If you want to force close editor, you can use
method `UGCInAppStoryManager.closeEditor(closeCallback: () -> Unit)` //closeCallback has empty body
by default For example:

```kotlin
    UGCInAppStoryManager.closeEditor {
    Log.e(TAG, "Close editor")
}
```

## UgcStoriesList

### Initialization

Starting from version 1.12.x was added `UgcStoriesList` class to view UGC stories. It can be used
like any `View` class. For example - via xml.

```xml

<com.inappstory.sdk.stories.ui.ugclist.UgcStoriesList android:layout_width="match_parent"
    android:layout_height="wrap_content" android:id="@+id/ugc_stories_list" />
```

Or via code:

```kotlin
fun addUGCStoriesList(parentView: ViewGroup, context: Context) {
    val ugcStoriesList = UgcStoriesList(context)
    parentView.addView(ugcStoriesList)
}
```

### Methods

After SDK initialization you can load stories in `UgcStoriesList` with one of next methods

```kotlin
fun loadUGCStories(ugcStoriesList: UgcStoriesList) {
    //use if you want load to show ugc stories without any filter
    ugcStoriesList.loadStories();
}

fun loadUGCStories(ugcStoriesList: UgcStoriesList, stringFilter: String) {
    //use if you want to pass filter as json string
    ugcStoriesList.loadStories(stringFilter);
}

fun loadUGCStories(ugcStoriesList: UgcStoriesList, mapFilter: HashMap<String, Any?>) {
    //use if you want to pass filter as HashMap
    ugcStoriesList.loadStories(mapFilter);
}

```

This method also can be used to reload list (for example in PtR case)

:::warning
This method can generate `DataException` if SDK was not initialized. Strictly recommend to catch `DataException` for additional info.
:::

`UgcStoriesList` is extends `androidx.recyclerview.widget.RecyclerView`. If necessary, you can use
all the methods that are in the `RecyclerView` (setting the `layoutManager`, getting the `adapter`,
etc.).

### Customization and Callbacks

`UgcStoriesList` has same ways of customization and same callbacks as usual `StoriesList`. For more
information you can
read [this (Customization)](/sdk-guides/android/appearance#storieslist-customization)
and [this (Callbacks)](/sdk-guides/android/events.md#stories-list-callbacks)

#### Ugc cell (simple customization)

If you don't use cells customization, you can set parametes for UGC editor cell with this method:

```kotlin
fun setUGCListItemSimpleAppearance(
    appearanceManager: AppearanceManager,
    ugcListItemSimpleAppearance: UGCListItemSimpleAppearance
) {
    appearanceManager
        .csUGCListItemSimpleAppearance(ugcListItemSimpleAppearance);
}


class UGCListItemSimpleAppearance(
    iconColor: Int? = null, //uses for tint icon image
    backgroundColor: Int? = Color("#0C62F3"),
    iconMargin: Int? = Sizes.dpToPx(16, context),
    iconId: Int? = R.drawable.ic_new_ugc, //icon from SDK
)
```

`UGCListItemSimpleAppearance` parameters can be set through `Builder` pattern

```kotlin
val appearance = UGCListItemSimpleAppearance()
    .csIconColor(Color.RED)
    .csBackgroundColor(Color.WHITE)

```

### Loader

In version 1.2.0 added interface`IUgcReaderLoaderView`. You can use it to substitute your own loader instead
of the default one on the ugc editor screen.

```kotlin
fun setCustomLoader() {
    UGCInAppStoryManager.csUgcReaderLoaderView(
        object : IUGCReaderLoaderView {
            override fun getView(context: Context): View {
                TODO("Not yet implemented")
            }

            override fun setIndeterminate(indeterminate: Boolean) {
                TODO("Not yet implemented")
            }

            override fun setProgress(progress: Int, max: Int) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

:::warning
Current version of `UgcStoriesList` does not support favorites, like/dislike and share features. Relevant settings in `AppearanceManager` (`csHasFavorite`, `csHasShare`, `csHasLike` and `csFavoriteListItemInterface`) will not affect the ugc stories list.
:::
