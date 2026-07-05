# In-App-Messaging

Starting from 1.21.0 `In-App-Messaging` was added to the InAppStory SDK.

This documentation provides a detailed guide on how to use the InAppMessaging (IAM) module, which
allows you to manage in-app messages (such as popups, fullscreens and bottomsheets) in your
application. The
module provides methods for preloading messages, displaying them, and handling related events.

## Show In-app Message

If you want to show In-App Message by message id or event, you can use
method `InAppStoryManager.getInstance()?.showInAppMessage(...)`

```kotlin
class InAppMessageOpenSettings {
    fun id(id: Int?)
    fun showOnlyIfLoaded(showOnlyIfLoaded: Boolean?)
    fun tags(tags: List<String>?)
    fun event(event: String?)
}

//id or event has to be passed as non null

fun showInAppMessageById(
    iamId: Int,
    // Pass this as true if you don't want to show not preloaded In-app messages and as false otherwise
    showOnlyIfLoaded: Boolean,
    // It can be activity.supportFragmentManager or childFragmentManager of another fragment.
    fragmentManager: FragmentManager,
    // Here you need to pass container id where in-app message will be placed. F.e. R.id.iam_fragment_container
    // It is better if this container will be full screen or occupy as much screen area as possible
    containerId: Int,
    readerIsOpened: () -> Unit,
    readerOpenError: () -> Unit,
    readerIsClosed: () -> Unit,
) {
    val cancellationToken: CancellationToken? =
        InAppStoryManager.getInstance()?.showInAppMessage(
            //It's an object with builder pattern setters, but can be used as data class described before
            InAppMessageOpenSettings()
                .id(iamId)
                .showOnlyIfLoaded(showOnlyIfLoaded),
            fragmentManager,
            containerId,
            //This callback you can use to show your own intermediate loader before reader will be opened
            object : InAppMessageScreenActions {
                override fun readerIsOpened() {
                    readerIsOpened()
                }

                override fun readerOpenError(error: String?) {
                    readerOpenError()
                }

                override fun readerIsClosed() {
                    readerIsClosed()
                }
            }
        )
}

fun showInAppMessageByEvent(
    event: String,
    // Pass this as true if you don't want to show not preloaded In-app messages and as false otherwise
    showOnlyIfLoaded: Boolean,
    // It can be activity.supportFragmentManager or childFragmentManager of another fragment.
    fragmentManager: FragmentManager,
    // Here you need to pass container id where in-app message will be placed. F.e. R.id.iam_fragment_container
    // It is better if this container will be full screen or occupy as much screen area as possible
    containerId: Int,
    readerIsOpened: () -> Unit,
    readerOpenError: () -> Unit,
    readerIsClosed: () -> Unit,
) {
    InAppStoryManager.getInstance()?.let { manager ->
        manager.showInAppMessage(
            //It's an object with builder pattern setters, but can be used as data class described before
            InAppMessageOpenSettings()
                .event(event)
                .showOnlyIfLoaded(showOnlyIfLoaded),
            fragmentManager,
            containerId,
            //This callback you can use to show your own intermediate loader before reader will be opened
            object : InAppMessageScreenActions {
                override fun readerIsOpened() {
                    readerIsOpened()
                }

                override fun readerOpenError(error: String?) {
                    readerOpenError()
                }

                override fun readerIsClosed() {
                    readerIsClosed()
                }
            }
        )
    }
}
```

More about `CancellationToken` objects you can read [here](cancellation-of-actions.md)

## Providing presentation container

Started from 1.24.2 you can specify container in runtime (before In-app Message will be shown). It
allows to provide different containers for different cases (f.e. - in case of different In-app
Message types). Also you can use FrameLayout as provided container if you don't support
fragments (FragmentActivity) in your app

```kotlin
class InAppMessageContainerSettings {
    fun fragment(
        fragmentManager: FragmentManager,
        containerId: Int
    ): InAppMessageContainerSettings

    fun layout(
        layout: FrameLayout
    ): InAppMessageContainerSettings
}

interface IAMViewController {
    fun pauseView()
    fun resumeView()
    fun closeView()
}

interface InAppMessageContainerProvider {
    fun provideContainer(messageData: InAppMessageData?): InAppMessageContainerSettings
    fun layoutController(): IAMViewController?
}

fun showInAppMessageByIdInCustomContainer(
    iamId: Int,
    fragmentManager: FragmentManager,
    layoutForToasts: FrameLayout,
    containerIdForRest: Int,
    readerOpened: () -> Unit,
    readerError: () -> Unit,
    readerClosed: () -> Unit,
) {
    val cancellationToken = InAppStoryManager.getInstance()?.showInAppMessage(
        InAppMessageOpenSettings()
            .id(iamId)
            .showOnlyIfLoaded(false),
        object : InAppMessageContainerProvider {
            override fun provideContainer(messageData: InAppMessageData?):
                    InAppMessageContainerSettings {
                return if (messageData?.messageType() == InAppMessageType.TOAST) {
                    InAppMessageContainerSettings().layout(
                        layoutForToasts
                    )
                } else {
                    InAppMessageContainerSettings().fragment(
                        fragmentManager,
                        containerIdForRest
                    )
                }
            }

            override fun layoutController(): IAMViewController? {
                return null
            }
        },
        object : InAppMessageScreenActions {
            override fun readerIsOpened() {
                readerOpened()
            }

            override fun readerOpenError(errorStr: String?) {
                readerError()
            }

            override fun readerIsClosed() {
                readerClosed()
            }
        }
    )
}
```

## Managing In-app Message reader lifecycle

Started from 1.24.2 when you specify container with `InAppMessageContainerProvider` you also can
set `IAMViewController` to control In-app Message reader lifecycle. To simple creation you can use
SDK's `InAppMessageViewController` that implements `IAMViewController` interface.

```kotlin
val iamController = InAppMessageViewController()
showInAppMessageByIdWithContainerController(iamController)

fun showInAppMessageByIdWithContainerController(
    iamId: Int,
    fragmentManager: FragmentManager,
    containerController: IAMViewController,
    containerId: Int,
    readerOpened: () -> Unit,
    readerError: () -> Unit,
    readerClosed: () -> Unit,
) {
    val cancellationToken = InAppStoryManager.getInstance()?.showInAppMessage(
        InAppMessageOpenSettings()
            .id(iamId)
            .showOnlyIfLoaded(false),
        object : InAppMessageContainerProvider {
            override fun provideContainer(messageData: InAppMessageData?):
                    InAppMessageContainerSettings {
                return InAppMessageContainerSettings().fragment(
                    fragmentManager,
                    containerId
                )
            }

            override fun layoutController(): IAMViewController {
                return containerController
            }
        },
        object : InAppMessageScreenActions {
            override fun readerIsOpened() {
                readerOpened()
            }

            override fun readerOpenError(errorStr: String?) {
                readerError()
            }

            override fun readerIsClosed() {
                readerClosed()
            }
        }
    )
}
```

## Preload In-app Messages

If you want to preload In-App Messages (f.e. on splash or another screen),
you can use method `InAppStoryManager.getInstance()?.preloadInAppMessages(...)`:

```kotlin
interface InAppMessageLoadCallback {
    fun loaded(id: Int)

    fun allLoaded()

    fun loadError(id: Int)

    fun loadError()

    fun isEmpty()
}

fun preloadInAppMessages() {
    InAppStoryManager.getInstance()?.preloadInAppMessages(
        object : InAppMessageLoadCallback {
            override fun loaded(id: Int) {
                //It's not a main thread!!!
                //Triggers when In-app Message is preloaded
            }

            override fun allLoaded() {
                //It's not a main thread!!!
                //Triggers when all In-app Messages are preloaded
                success.invoke()
            }

            override fun loadError(id: Int) {
                //It's not a main thread!!!
                error.invoke()
            }

            override fun loadError() {
                //It's not a main thread!!!
                error.invoke()
            }

            override fun isEmpty() {
                //It's not a main thread!!!
                isEmpty.invoke()
            }
        }
    )
}
```

`InAppMessageLoadCallback` can be null.

If you want to preload specific In-app messages, or a list with specific tags, they can be passed
through `InAppMessagePreloadSettings` in `preloadInAppMessages`:

```kotlin
class InAppMessagePreloadSettings {
    fun tags(tags: List<String>?)
    fun inAppMessageIds(inAppMessageIds: List<String>?)
}

fun preloadInAppMessages(inAppMessageIds: List<String>, tags: List<String>) {
    InAppStoryManager.getInstance()?.preloadInAppMessages(
        InAppMessagePreloadSettings()
            .tags(tags)
            .inAppMessageIds(inAppMessageIds),
        object : InAppMessageLoadCallback {
            override fun loaded(id: Int) {
                //It's not a main thread!!!
                //Triggers when In-app Message is preloaded
            }

            override fun allLoaded() {
                //It's not a main thread!!!
                //Triggers when all In-app Messages are preloaded
                success.invoke()
            }

            override fun loadError(id: Int) {
                //It's not a main thread!!!
                error.invoke()
            }

            override fun loadError() {
                //It's not a main thread!!!
                error.invoke()
            }

            override fun isEmpty() {
                //It's not a main thread!!!
                isEmpty.invoke()
            }
        }
    )
}
```

Also you can listen preloading status of In-App Messages with external callback (but its events can
be triggered not only from preload method):

```kotlin
fun preloadInAppMessages(
    success: () -> Unit,
    error: () -> Unit,
    isEmpty: () -> Unit
) {
    InAppStoryManager.getInstance()?.let { manager ->

        manager.setInAppMessageLoadCallback(
            object : InAppMessageLoadCallback {
                override fun loaded(id: Int) {
                    //It's not a main thread!!!
                    //Triggers when In-app Message is preloaded
                }

                override fun allLoaded() {
                    //It's not a main thread!!!
                    //Triggers when all In-app Messages are preloaded
                    success.invoke()
                }

                override fun loadError(id: Int) {
                    //It's not a main thread!!!
                    error.invoke()
                }

                override fun loadError() {
                    //It's not a main thread!!!
                    error.invoke()
                }

                override fun isEmpty() {
                    //It's not a main thread!!!
                    isEmpty.invoke()
                }
            }
        )
        manager.preloadInAppMessages(null)
    }
}
```

## BackPress handling

All in-app messages opens as fragments in passed fragmentManager. That's why it's necessary to pass
BackPress events from parent activity to in-app message fragment:

```kotlin
override fun onBackPressed() {
    InAppStoryManager.getInstance()?.let {
        if (it.onBackPressed())
            return
    }
    parentActivityOnBackPressHandling()
}

private fun parentActivityOnBackPressHandling() {
    //...
}
```

## Events

```kotlin
enum class InAppMessageType {
    FULLSCREEN, POPUP, BOTTOM_SHEET, TOAST, UNDEFINED
}

data class InAppMessageData(
    val id: Int,
    val title: String?,
    val event: String?,
    val messageType: InAppMessageType
)

data class InAppMessageSlideData(
    val index: Int,
    val inAppMessage: InAppMessageData,
    val payload: String?
)
```

### ShowInAppMessage

When you show in-app message reader

```kotlin
fun setIASShowInAppMessageCallback() {
    InAppStoryManager.getInstance().setShowInAppMessageCallback(
        object : ShowInAppMessageCallback {
            override fun showInAppMessage(
                iamData: InAppMessageData?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### CloseInAppMessage

When you close in-app message reader

```kotlin
fun setIASCloseInAppMessageCallback() {
    InAppStoryManager.getInstance().setCloseInAppMessageCallback(
        object : CloseInAppMessageCallback {
            override fun closeInAppMessage(
                iamData: InAppMessageData?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### InAppMessageWidget

When you get any events from widgets in in-app messages

```kotlin
fun setIASInAppMessageWidgetCallback() {
    InAppStoryManager.getInstance().setInAppMessageWidgetCallback(
        object : InAppMessageWidgetCallback {
            override fun inAppMessageWidget(
                iamData: InAppMessageData?,
                widgetEventName: String?,
                widgetData: Map<String?, String?>?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

### ShowInAppMessageSlideCallback

Starting from 1.22.0 multi-slide in-app messages support was added to SDK.

When you get any events from slide changing in in-app messages (single slide in-app messages also
triggers this event)

```kotlin
fun setIASShowInAppMessageSlideCallback() {
    InAppStoryManager.getInstance().setShowInAppMessageSlideCallback(
        object : ShowInAppMessageSlideCallback {
            override fun showSlide(
                iamData: InAppMessageSlideData?
            ) {
                TODO("Not yet implemented")
            }
        }
    )
}
```

## Reader customization

To customize close icon - use `csCloseIcon` property in global `AppearanceManager` instance.
[Here](appearance.md#close-and-refresh-buttons) more about icons customization
