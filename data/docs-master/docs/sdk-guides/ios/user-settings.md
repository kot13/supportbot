import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# User settings

## Change user

<Tabs>
<TabItem value="uikit" label="UIKit">

After creating and initializing the `StoryView` it may be necessary to replace the user in the application, during registration or re-authorization, for example.

The library provides the uniqueness of an open session, depending on the settings that were passed to `InAppStory` and when the `Settings` object was changed.

To refresh the data, you need to call `refresh()`. A new session will be opened and new content for the lists will be requested.

#### ViewController.swift

```swift
...
func changeUser() {
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)
    storyView.refresh()
}
...
```

:::warning
When setting a new `Settings` object in InAppStory, if the previous `userID`, `sign`, `anonymous` and `lang` parameters are not equal to what they were before, a new session will be opened, which will result in updating feeds and closing all readers.
:::

### 1.22.1 update

Since **v1.22.1**, if there is a need to change the user and display the list of stories differently from the previous user, you can use the extended method `refresh(newFeed: String? = nil, newTags: Array<String>? = nil)`. Also, this method can help changing users and setting new tags happens in different places of the application.

```swift
...
// refreshing the list after the user change with a new feed
func changeUser() {
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)
    storyView.refresh(newFeed: "new_feed")
}
...
```

```swift
...
// refreshing the list after the user change with a new feed and a new tag list
func changeUser() {
    InAppStory.shared.settings = Settings(userID: <String>)
    storyView.refresh(newFeed: "new_feed", newTags: ["newTag_1", "newTag_2"])
}
...
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

After creating and initializing the `StoryView` it may be necessary to replace the user in the application, during registration or re-authorization, for example.

The library provides the uniqueness of an open session, depending on the settings that were passed to `InAppStory` and when the `Settings` object was changed.

To refresh the data, you need to call `refresh()`. A new session will be opened and new content for the lists will be requested.

```swift
struct SwiftUIView: View {
    @State var isListRefresh: Bool = false

    var body: some View {
        VStack {
            // setting the isListRefresh variable to track when StoryListView is initialized
            StoryListView(refresh: $isListRefresh)
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            Button {
                // updating the settings for InAppStory with a new user and tag list
                InAppStory.shared.settings = Settings(userID: "new_user", tags: ["newTag_1", "newTag_2"])
                // changing the isListRefresh variable when the button is pressed
                isListRefresh.toggle()
            } label: {
                Text("Change user")
            }
            // disabling the button if `isListRefresh == true`, to avoid repeated switching
            .disabled(isListRefresh)
        }
    }
}
```

In **v1.22.1** a method was added to `StoryListView` that provides a refresh closure, which can be assigned to the `View` structure variable `@State` and called as needed with new feed and tags values.

```swift
struct SwiftUIView: View {
    // refresh closure, which will be called from SwiftUIView
    @State var refreshStoriesList: (_ feed: String?, _ tags: Array<String>?) -> Void = {_, _ in}

    @State var user: User

    var body: some View {
        VStack {
            // initialization of StoryListView with feed name equal to 'old_feed'
            StoryListView(feed: "old_feed")
                .refresh { refresh in
                    // assignment of the refresh method to the local closure
                    refreshStoriesList = refresh
                }
                .frame(height: 120)
                .frame(maxWidth: .infinity)
        }
        // tracking changes in the user variable
        .onChange(of: user) { value in
            // updating InAppStory settings for a new user
            InAppStory.shared.settings = Settings(userID: value.id)
            // update stories list with new feed and tags value
            refreshStoriesList("new_feed", ["newTag_1", "newTag_2"])
        }
    }
}
```

</TabItem>
</Tabs>

## Logout

In some application scenarios, it may be necessary not just to change users, but to unlog them. To do this, you can set up a “clean” user by setting up a new `Settings` object, like this:

```swift
func logoutUser() {
    InAppStory.shared.settings = Settings(userID: "",
                                			  sign: nil,
                                			  anonymous: false,
                                			  tags: [],
                                			  placeholders: nil,
                                			  imagesPlaceholders: nil,
                                			  lang: nil)
}
```

After assigning a new `Settings` object, if the previously installed user had other *userID*, *sign* and *lang* parameters, the session will be automatically closed and if `StoryView` or *Stack feed* has already been created, they will update the content according to the user's settings.

Also, before changing the user, it is recommended to make sure that all readers are closed, this can be done by calling the `InAppStory.shared.closeReader()` method, wait for its execution and set new user data.

```swift
func logoutUser() {
    InAppStory.shared.closeReader {
        InAppStory.shared.settings = Settings(userID: "",
                                    	 	      sign: nil,
                                    	 	      anonymous: false,
                                			      tags: [],
                                			      placeholders: nil,
                                			      imagesPlaceholders: nil,
                                			      lang: nil)
    }
}
```

Since version **1.25.0** the `InAppStory.shared.logOut()` method has been added. This method clears *userID*, tags, placeholders for texts and pictures, as well as user signature. It also closes all readers before installing a “clean” user.

```swift
func logoutUser() {
    InAppStory.shared.logOut()
}
```

When unlogging, it may be necessary to set new tags and placeholders for an unauthorized user, for this purpose the `logOut()` method has additional parameters that completely replace the set data for the previous user.

```swift
func logoutUser() {
    InAppStory.shared.logOut(tags: Array<String>?,
                             placeholders: Dictionary<String, String>?,
                             imagesPlaceholders: Dictionary<String, String>?)
}
```

In order to make sure that logout is completed, the method additionally provides a closure that is triggered when all readers are closed and the new user's settings have been changed.

```swift
func logoutUser() {
    InAppStory.shared.logOut(tags: Array<String>?,
                             placeholders: Dictionary<String, String>?,
                             imagesPlaceholders: Dictionary<String, String>?) {
        // logout complete
    }
}
```

## Sign user

If the project needs to sign the user (console security setting), the `sign` parameter must be added parameter together with `userId` when initializing the `Settings` object.

```swift
Settings(userID: <String>, sign: <String>)
```

The settings for the SDK can be passed during initialization, along with the service-key:

```swift
import UIKit
import InAppStorySDK

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, sign: <userIDSign>, anonymous: <Bool>, tags: <tags array>))
        return true
    }
}
```
Read more about SDK initialization [here](https://docs.inappstory.com/sdk-guides/ios/how-to-get-started.md#library-initialization)

In the same way, settings can be passed at any convenient moment before other SDK methods are called. For example, to change the user.

```swift
func changeUser() {
    InAppStory.shared.settings = Settings(userID: <String>, sign: <String>, anonymous: <Bool>, tags: <Array<String>>)
    storyView.refresh()
}
```