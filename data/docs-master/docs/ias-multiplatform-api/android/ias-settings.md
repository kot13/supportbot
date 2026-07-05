# IASSettings

Class is used to set `InAppStoryManager` settings in runtime (after main instance already was built)
such as user id, language, tags, placeholders and
common [`AppearanceManager`](/sdk-guides/android/appearance.md). Can be called from InAppStoryAPI:

```kotlin
val settingsApi = inAppStoryApi.settings
```

## Methods

To set user id:

```kotlin
fun setUserId(userId: String?)
```

or starting from 1.20.8

```kotlin
fun setUserId(userId: String?, userSign: String?)
```

To set locale:

```kotlin
fun setLang(lang: Locale)
```

To set placeholders:
```kotlin
fun setPlaceholders(placeholders: Map<String, String>)
```

```kotlin
fun setImagePlaceholders(placeholders: Map<String, ImagePlaceholderValue>)
```

To set tags:

```kotlin
fun setTags(tags: ArrayList<String>)
```

To set common AppearanceManager:

```kotlin
fun setCommonAppearanceManager(appearanceManager: AppearanceManager)
```