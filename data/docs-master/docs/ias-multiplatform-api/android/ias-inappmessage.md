# IASInAppMessage

Class is used to load and show onboarding feed in story reader. Can be called from InAppStoryAPI:

```kotlin
val inAppMessageApi = inAppStoryApi.inAppMessage
```

## Methods

To open [IAM](/sdk-guides/android/in-app-messaging.md) by id or event:

```kotlin
fun show(
    inAppMessageOpenSettings: InAppMessageOpenSettings,
    fragmentManager: FragmentManager,
    containerId: Int,
    screenActions: InAppMessageScreenActions
) 
```

To set `InAppMessageLoadCallback`

```kotlin
fun callback(callback: InAppMessageLoadCallback)
```

To preload IAMs `InAppMessageLoadCallback`

```kotlin
fun preload(inAppMessageIds: List<String>?, callback: InAppMessageLoadCallback)
```



