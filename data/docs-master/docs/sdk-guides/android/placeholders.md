# Placeholders

Like tags - all placeholders can be set in `InAppStoryManager` initialization

```kotlin
fun createInAppStoryManagerWithPlaceholders(
    apiKey: String,
    context: Context,
    userId: String,
    placeholders: Map<String, String?>
): InAppStoryManager {
    return InAppStoryManager.Builder()
        .apiKey(apiKey)
        .context(context)
        .userId(userId)
        .placeholders(placeholders)
        .create()
}
```

or can be changed in runtime after `InAppStoryManager` initialization

```kotlin
fun setIASPlaceholders(placeholders: Map<String, String?>) {
    // Set new or completely replace current placeholders list
    InAppStoryManager.getInstance().setPlaceholders(
        placeholders
    )
}

fun setIASSinglePlaceholder(key: String, value: String?) {
    // Set placeholder to the current placeholders list.
    // If you pass null, then the placeholder will be removed
    InAppStoryManager.getInstance().setPlaceholder(
        key,
        value
    )
}
```

In that case you may need to reload `StoriesList` through `storiesList.loadStories()` if data was
already loaded before.

```kotlin
fun setIASPlaceholdersAndReloadList(
    placeholders: Map<String, String?>,
    storiesList: StoriesList
) {
    InAppStoryManager.getInstance().setPlaceholders(
        placeholders
    )
    storiesList.loadStories()
}
```

### Image placeholders (>1.10.0)

This feature was added in v1.10.0.

Image placeholders can be set in `InAppStoryManager` initialization

```kotlin
fun createInAppStoryManagerWithPlaceholders(
    apiKey: String,
    context: Context,
    userId: String,
    imagePlaceholders: Map<String, ImagePlaceholderValue?>
): InAppStoryManager {
    return InAppStoryManager.Builder()
        .apiKey(apiKey)
        .context(context)
        .userId(userId)
        .imagePlaceholders(imagePlaceholders)
        .create()
}
```

or can be changed in runtime after `InAppStoryManager` initialization

```kotlin
fun setIASImagePlaceholders(placeholders: Map<String, ImagePlaceholderValue?>) {
    // Set new or completely replace current image placeholders list
    InAppStoryManager.getInstance().setImagePlaceholders(
        placeholders
    )
}

fun setIASSinglePlaceholder(key: String, value: ImagePlaceholderValue?) {
    // Set placeholder to the current image placeholders list.
    // If you pass null, then the placeholder will be removed
    InAppStoryManager.getInstance().setImagePlaceholder(
        key,
        value
    )
}
```

Here `ImagePlaceholderValue` is a class with private constructor and it's instance can be created
through method `createByUrl(String url)`. Here `url` is a remote link with http(s) scheme to image

```kotlin
val imagePlaceholder = ImagePlaceholderValue.createByUrl("url string")
```

Image placeholders are used only in Stories reader, so you don't need to reload list after new
changes.
