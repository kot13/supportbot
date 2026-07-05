# SSL pinning

If you want to use SSL pinning for security reasons, you must specify a list of generated hash keys from trusted SSL certificates after initializing `InAppStory`.

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    /// library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    /// settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    /// SSL certificate hashes setting
    InAppStory.shared.sslPinningHashKeys = ["hash_1", "hash_2"]

    return true
}
```

:::tip[Remark]
The installation of certificate hashes should preferably be done before the first API call is made from the InAppStorySDK.

The main methods after which the API is called:

- `StoryView.create()  `
- `InAppStory.shared.showOnboardings(...)`
- `InAppStory.shared.showStory(...)`

For SwiftUI, the API is called when `StoryListView` is created, as well as when `onboardingStories` and `showStory` modifiers are activated.
:::
