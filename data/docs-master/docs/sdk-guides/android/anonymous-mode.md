# Anonymous mode

Starting from 1.21.19 anonymous mode was added to SDK.

## Mode restrictions

Features below won't work in anonymous mode:

- Stories with any user-target widget, game links, etc.
- Games
- In-App Messages
- Onboarding stories
- Favorites
- Banners

## Setup through InAppStoryManager initialization

Anonymous setting can be set through Builder in InAppStoryManager initialization process

```kotlin
fun createInAppStoryManager(
    apiKey: String,
    userId: String
): InAppStoryManager? {
    return InAppStoryManager.Builder()
        .apiKey(apiKey)
        .anonymous(true)
        //.userId("any_user_id") - this setting can be passed, but will be ignored 
        .create()
}
```

## Change anonymous settings in runtime

Also anonymous setting can be set through method `userSettings`

```kotlin
fun setAnonymousInRuntime(
    anonymous: Boolean
) {
    InAppStoryManager.getInstance()?.userSettings(
        InAppStoryUserSettings()
            .anonymous(anonymous)
    )
}
```

:::warning[Please note]
If you need to set new settings like placeholders, options, etc. through method `userSettings` and
want to save user in anonymous mode - you have to pass anonymous setting. Otherwise it will be reset
to false.  
:::

You can pass it with another parameters (but userId will be ignored)

```kotlin
fun setUserSettings(
    anonymous: Boolean,
    newLang: Locale? = null,
    newTags: List<String>? = null,
    newPlaceholders: Map<String, String?>? = null,
    newImagePlaceholders: Map<String, ImagePlaceholderValue?>? = null,
) {
    InAppStoryManager.getInstance()?.userSettings(
        InAppStoryUserSettings()
            .anonymous(anonymous)
            .lang(newLang)
            .tags(newTags)
            .placeholders(newPlaceholders)
            .imagePlaceholders(newImagePlaceholders)
    )
}
```

Also changing to anonymous mode will clear user id from settings and will block `setUserId` method
To restore userId, you need to pass `anonymous = false` and 'userId':

```kotlin
fun restoreUserId(
    userId: String,
    userSign: String? = null,
) {
    InAppStoryManager.getInstance()?.userSettings(
        InAppStoryUserSettings()
            .anonymous(false)
            .userId(userId, userSign)
    )
}
```