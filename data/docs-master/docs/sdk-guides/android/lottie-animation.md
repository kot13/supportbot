---
title: Lottie animation (≥1.19.0)
---

Starting from v1.19.0-rc1 in games you can implement `iaslottie` and use lottie animations as game
loading animations (if game support this feature).

## Installation

In the project `build.gradle` (app level) in the `dependencies` section add:

```gradle
 implementation `com.github.inappstory.android-sdk-utils:iaslottie:1.0.2`
```

After this game with uploaded lottie animation (in console) will use it.

By default SDK uses `com.airbnb.android:lottie:5.0.3`. If you app uses lottie with higher version
and you want to prevent any possible conflicts - you can exclude lottie library when
implement `iaslottie`:

```gradle
implementation ("com.github.inappstory.android-sdk-utils:iaslottie:1.0.2") {
    exclude group: 'com.airbnb.android', module: 'lottie'
}
```

## Custom loader

`IGameReaderLoaderView iGameReaderLoaderView` - use to substitute your own loader instead of the
lottie animation or default on the games screen. This interface must be set for the
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

## Changelog

## 1.0.2 (3)

- Updated consumer-rules.pro.
