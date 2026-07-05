# Options

Starting from version 1.25.14, additional options can be added to the SDK.

## Description

Options are represented as a `Dictionary<String, String>`, where the key is the name of the option to which the value is assigned.

Currently, the SDK provides only one option: POS.

```Swift
struct OptionsKeys {
   static let POS: String  = "pos"
}
```

If necessary, you can set your own key-value pairs without waiting for these keys to be added to the SDK in new releases:

```Swift
let options = [OptionsKeys.POS : "first_pos",
               "is_authorize" : "true"]
```

:::warning[Please note]
In order for the options to work correctly, they must be agreed upon and set up on the backend side, otherwise the options will simply not produce any results.  
:::

## Setting options

For the options to work correctly, it is recommended to set them after initializing the SDK and before opening any reader for the first time. Changing the options while the reader is open will not result in a reactive change of values in it. Similarly, if you need to filter the feed stream output or display onboarding messages (InAppMessages) based on the options, you need to set the options before launching these objects.

```Swift
import UIKit
import InAppStorySDK

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, tags: <tags array>))
        
        let options = [OptionsKeys.POS : "first_pos",
                       "is_authorize" : "true"]
        InAppStory.shared.options = options
        return true
    }
}
```

## Updating options

If you need to change the options, for example, when changing the region or the user's geolocation, you need to set a new dictionary with updated data in `InAppStory`.

```Swift
func changeUserLocation() {
    let options = [OptionsKeys.POS : "second_pos"]
    InAppStory.shared.options = options
}
```

There are scenarios when you need to switch users and filter the stories feed according to new options. In this case, after setting new parameters, you need to refresh the feed manually.

```Swift
func changeUserLocation() {
    let options = [OptionsKeys.POS : "second_pos"]
    InAppStory.shared.options = options
    storyView.refresh()
}
```

There are also scenarios when it is necessary to change the user or their authorization status. In this case, when changing the `userID`, the story lists will be updated automatically after reopening the session. However, it should be noted that reopening the session and updating the lists occurs asynchronously and quite quickly, so it is better to set new options before changing users.

```Swift
func changeUser() {
    let options = [OptionsKeys.POS : "second_pos",
                   "is_authorize" : "true"]
    InAppStory.shared.options = options
    
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)
}
```

In this case, the options will be applied to the new request for the list of stories after the session is reopened, and the list will already be filtered according to the new parameters.