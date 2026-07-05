# Options

Starting with version 1.22.0-rc3, additional options can be added to the SDK.

## Description

Options are represented as a `Map<String, String?>`, where the key is the name of the option to which the value is assigned.

## Predefined and custom option keys

Predefined keys can be called as static constants in `IASOptionKeys`.
Currently, the SDK provides only one predefined key: `POINT_OF_SALE`.

```java
public class IASOptionKeys {
    public static final String POINT_OF_SALE = "pos";
}
```

If necessary, you can set your own key-value pairs:

```kotlin
val options = mapOf(
    IASOptionKeys.POINT_OF_SALE to "custom_point_of_sale",
    "custom_key" to "custom_value"
)
```

## Setup through InAppStoryManager initialization

Options can be set through Builder in InAppStoryManager initialization process

```kotlin
fun createInAppStoryManager(
    apiKey: String,
    customOptions: Map<String, String?>
): InAppStoryManager? {
    return InAppStoryManager.Builder()
        .apiKey(apiKey)
        .options(customOptions)
        //.userId("any_user_id") - this setting can be passed, but will be ignored 
        .create()
}
```

## Change options in runtime

Also options can be set through method `setOptions` or with common method `userSettings`

```kotlin
fun setCustomOptions(
    customOptions: Map<String, String?>
) {
    InAppStoryManager.getInstance()?.setOptions(
        customOptions
    )
}

fun setCustomOptionsWithUserSettings(
    customOptions: Map<String, String?>,
    newPlaceholders: Map<String, String?>,
) {
    InAppStoryManager.getInstance()?.userSettings(
        InAppStoryUserSettings()
            .options(customOptions)
            .placeholders(newPlaceholders)
    )
}
```