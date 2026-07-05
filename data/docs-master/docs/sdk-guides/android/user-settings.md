# User settings

## Change user id

After creating and initializing the `StoriesList`, it may be necessary to replace the user in the
application.
For example - during registration or re-authorization.

To get this - you can use the `InAppStoryManager.getInstance().setUserId` method.

```kotlin
fun changeUser(userId: String) {
    InAppStoryManager.getInstance().setUserId(userId)
}
```

:::warning[Please note]
Do not use personal data (phones, emails, passport data) as a user identifier.
userID must be a string not longer than 255 bytes.
:::

All loaded `StoriesList` instances will be reloaded automatic and will show content for new user.

## User sign

If the project needs to sign a user (console security setting), then the parameter `userSign` needs
to be passed with `userId` (works only from 1.20.8):

```kotlin
fun changeUser(userId: String, userSign: String?) {
    InAppStoryManager.getInstance().setUserId(userId, userSign)
}
```

If only userSign was changed (in case if you pass same userId as current) `StoriesList` instances
still will be reloaded

## Multiple parameters

Also if you want to set new user and other parameters like tags simultaneously, you can use method `userSettings`

```kotlin
fun setUserSettings(
    newUserId: String, 
    newUserSign: String? = null,
    newLang: Locale? = null,
    newTags: List<String>? = null, 
    newPlaceholders: Map<String, String?>? = null,
    newImagePlaceholders: Map<String, ImagePlaceholderValue?>? = null,
) {
    InAppStoryManager.getInstance()?.userSettings(
        InAppStoryUserSettings()
            .userId(newUserId, newUserSign)
            .lang(newLang)
            .tags(newTags)
            .placeholders(newPlaceholders)
            .imagePlaceholders(newImagePlaceholders)
    )
}
```

## User logout

Started from SDK ver 1.21.0, if you want to `logout` current user from SDK, you can use method `userLogout`

```kotlin
InAppStoryManager.getInstance()?.userLogout()
```

Also you can set tags and placeholders when you logout user:

```kotlin
fun logoutWithParameters(newTags: List<String>, newPlaceholders: Map<String, String?>) {
    InAppStoryManager.getInstance()?.userLogout(
        InAppStoryUserSettings().tags(newTags).placeholders(newPlaceholders)
    )
}
```