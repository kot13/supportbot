# SettingsAPI

Class is used to set `InAppStory` settings in runtime (after main instance already was built)
such as [`tags `](sdk-guides/ios/tags.md), [`placeholders `](/sdk-guides/ios/placeholders.md). Can be called from InAppStoryAPI:

```Swift
let settingsAPI = InAppStoryAPI.shared.settingsAPI
```

## Properties

To set placeholders. 

```Swift
var placeholders: Dictionary<String, String>
```

```Swift
var imagesPlaceholders: Dictionary<String, String>
```

More information about working with placeholders can be found in the [main documentation](/sdk-guides/ios/placeholders.md)

## Methods

To set tags:

```Swift
func setTags(_ tags: Array<String>)
```

To add tags:

```Swift
func setTags(_ tags: Array<String>)
```

To remove tags:

```Swift
func setTags(_ tags: Array<String>)
```

More information about working with tags can be found in the [main documentation](sdk-guides/ios/tags.md)