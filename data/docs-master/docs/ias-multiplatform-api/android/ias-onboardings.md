# IASOnboardings

Class is used to load and show onboarding feed in story reader. Can be called from InAppStoryAPI:

```kotlin
val onboardingsApi = inAppStoryApi.onboardings
```

## Methods

To load [onboarding](/sdk-guides/android/onboardings.md) feed:

```kotlin
fun show(
    context: Context,
    feed: String, //by default == "onboarding"
    appearanceManager: AppearanceManager, //by default == AppearanceManager()
    tags: List<String>,
    limit: Int //has to be set greater than 0 (can be set as any big number if limits is unnecessary)
) 
```

To set `OnboardingLoadCallback`

```kotlin
fun loadCallback(callback: OnboardingLoadCallback)
```

