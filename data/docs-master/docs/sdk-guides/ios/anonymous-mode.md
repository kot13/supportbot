# Anonymous mode

Starting from 1.25.14 anonymous mode was added to SDK.

## Mode restrictions

Features below won't work in anonymous mode:
- Stories with any user-target widget, game links, etc.
- Games
- In-App Messages
- Onboarding stories
- Favorites
- Banners

## Set anonymous mode

Anonymous mode is enabled by passing the `anonymous` parameter when initializing the `Settings` object:

```Swift
import UIKit
import InAppStorySDK

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, anonymous: <Bool>, tags: <tags array>))
        return true
    }
}
```

:::warning[Please note]
If the flag `anonymous = true`, then `userID` is not taken into account in the project, and some of the functionality that requires `userID` will be unavailable.  
:::

## Change anonymous at runtime

To change the anonymous settings, you need to set a new `Settings` object for `InAppStory`. Also, keep in mind that when the `anonymous` flag is set to a positive value, `userID` is not taken into account and is not saved. So, when you disable anonymity, you need to reset `userID`.

```Swift
func changeUser() {
    InAppStory.shared.settings = Settings(userID: <String>, anonymous: <Bool>, tags: <Array<String>>)
    storyView.refresh()
}
```

:::warning[Please note]
The anonymity flag is a parameter which, when changed, causes the session to be reopened, all readers to be closed, and all lists to be updated. See also [Change user](user-settings.md)  
:::