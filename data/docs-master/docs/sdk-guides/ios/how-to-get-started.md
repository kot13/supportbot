import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to get started

:::warning
The majority of examples in this guide are splitted between two available development frameworks - **UIKit** and **SwiftUI**.
Before the start of development process decide on using one of them and strictly follow the guides for the chosen framework where it's specified.
:::

## Installation

#### UIKit

| InAppStory version | Build version | iOS version |
| ------------------ | ------------- | ----------- |
| 1.29.1             | 4314          | >= 11.0     |

#### SwfitUI

| InAppStory version | Build version | iOS version |
| ------------------ | ------------- | ----------- |
| 1.29.1             | 4314          | >= 13.0     |

Version of the library can be obtained from the parameter `InAppStory.buildInfo`

### CocoaPods

[CocoaPods](https://cocoapods.org) is a dependency manager for Cocoa projects.
Follow instructions on their website for seamless installation.
To integrate InAppStory into your Xcode project using CocoaPods, specify it in your `Podfile`:

<Tabs>
<TabItem value="uikit" label="UIKit">

```ruby
# UIKit
use_frameworks!
pod 'InAppStory', :git => 'https://github.com/inappstory/ios-ias-sdk.git', :tag => '1.29.1'
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

```ruby
# SwiftUI
use_frameworks!
pod 'InAppStory_SwiftUI', :git => '<https://github.com/inappstory/ios-ias-sdk.git>', :tag => '1.29.1-SwiftUI'
```

</TabItem>
</Tabs>

### Carthage

[Carthage](https://github.com/Carthage/Carthage) is a decentralized dependency manager that builds your dependencies and provides you with binary frameworks. To integrate InAppStory into your Xcode project using Carthage, specify it in your `Cartfile`:

<Tabs>
<TabItem value="uikit" label="UIKit">

```ogdl
# UIKit
github "inappstory/ios-ias-sdk" ~> 1.29.1
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

```ogdl
#SwiftUI
github "inappstory/ios-ias-sdk" ~> 1.29.1-SwiftUI
```

</TabItem>
</Tabs>

### Swift Package Manager

The [Swift Package Manager](https://swift.org/package-manager/) is a tool for automating the distribution of Swift code and is integrated into the `swift` compiler. It is in early development, but InAppStory does support its use on supported platforms.

Once you have your Swift package set up, adding InAppStory as a dependency is as easy as adding it to the `dependencies` value of your `Package.swift`.

<Tabs>
<TabItem value="uikit" label="UIKit">

```swift
//UIKit
dependencies: [
    .package(url: "https://github.com/inappstory/IAS-iOS-SPM.git", .exact("1.29.1"))
]
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

```swift
//SwiftUI
dependencies: [
    .package(url: "https://github.com/inappstory/IAS-iOS-SPM.git", .exact("1.29.1-SwiftUI"))
]
```

</TabItem>
</Tabs>

### XCode SPM installation
Alternatively, you can add an InAppStory via XCode:

1. First click on the project;
2. Select "*Add Package Dependencies...*";
3. In the "*Enter Package URL*" field, specify the URL of this repository;
4. Select package ias-ios-spm;
5. Set "*Dependecy rule*" to "*Exact Version*" and specify the version required for installation;
6. Click the "*Add Package*" button and wait for the installation to take place.

### Manual installation

Download `InAppStorySDK.xcframework` from the repository. Connect in the project settings on the _General_ tab.

### Library import

#### Objective-C

```objectivec
#import <InAppStorySDK/InAppStorySDK.h>
```

#### Swift (UIKit)

```swift
import InAppStorySDK
```

#### SwiftUI

```swift
import InAppStorySDK_SwiftUI
```

## Basic initialization

For a quick start and easy integration of InAppStorySDK, you need to:

1. Initialize the library with settings;
2. Create an instance of the list of stories on the screen;
3. Process actions received from the library;

### Library initialization

To initialize the library you need to get the **integration key** in the console - **_api-key_**.
Next - install the library into the project in a convenient way for you.
[Installation](#installation).

It is better to initialize the library in the application at startup, for example in `AppDelegate`.

<Tabs>
<TabItem value="uikit" label="UIKit">

```swift
import UIKit
import InAppStorySDK

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, tags: <tags array>))
        return true
    }
}
```

In `AppDelegate` you can immediately configure _Appearance_ and some library display options. An example with a few of the parameters is shown below. All parameters and properties can be viewed [here](inappstory.md#parameters-and-properties) and [here](appearance.md#list-customization).

```swift
extension AppDelegate {
    func setupAppearance() {
        // the parameter is responsible for logging to the XCode console
        InAppStory.shared.isLoggingEnabled = true
        // the parameter is responsible for displaying the shading under cell headers
        InAppStory.shared.cellGradientEnabled = true
        // the parameter is responsible for the color of the cell gradient of the unread story.
        InAppStory.shared.cellBorderColor = UIColor.blue
        // the parameter is responsible for displaying the bottom panel in the story card (likes, favorites and share)
        // additionally should be configured in the console
        InAppStory.shared.panelSettings = PanelSettings(like: true, favorites: true, share: true)
        // the parameter is responsible for animation of the reader display when you tap on a story cell
        InAppStory.shared.presentationStyle = .zoom
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, tags: <tags array>))
        return true
    }
}
```

If the project does not provide an `AppDelegate`, you can use `UIApplicationDelegateAdaptor`

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        InAppStory.shared.initWith(serviceKey: <api-key>)

        return true
    }
}

@main
struct StoriesApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

Then you can immediately configure _Appearance_ and some library display options. An example with a few of the parameters is shown below. All parameters and properties can be viewed [here](inappstory.md#parameters-and-properties) and [here](appearance.md#list-customization).

```swift
extension StoriesApp {
    func setupAppearance() {
        // the parameter is responsible for logging to the XCode console
        InAppStory.shared.isLoggingEnabled = true
        // the parameter is responsible for displaying the shading under the cell headers
        InAppStory.shared.cellGradientEnabled = true
        // the parameter is responsible for the color of the cell gradient of the unread story.
        InAppStory.shared.cellBorderColor = UIColor.blue
        // the parameter is responsible for displaying the bottom panel in the story card (likes, favorites and share)
        // additionally should be configured in the console
        InAppStory.shared.panelSettings = PanelSettings(like: true, favorites: true, share: true)
        // the parameter is responsible for animation of the reader display when you tap on a story cell
        InAppStory.shared.presentationStyle = .zoom
    }
}
```

</TabItem>
</Tabs>

If _UserID_ or _tags_ are not known at the time of application initialization, they can be set later, before creating `StoryView(UIKit)` or `StoryListView(SwiftUI)`. In this case, the initialization of `InAppStory` will look like this:

<Tabs>
<TabItem value="uikit" label="UIKit">

```swift
import UIKit
import InAppStorySDK

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        InAppStory.shared.initWith(serviceKey: <api-key>)
        return true
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        InAppStory.shared.initWith(serviceKey: <api-key>)
        return true
    }
} 
```

</TabItem>
</Tabs>

### Creating and launching a list of stories

To add a list to the screen, you need to create an instance of `StoryView (UIKit)` or `StoryListView (SwiftUI)` and run the internal logic.

<Tabs>
<TabItem value="uikit" label="UIKit">

```swift
import UIKit
import InAppStorySDK

class ViewController: UIViewController {
    fileprivate var storyView: StoryView!

    override func viewDidLoad() {
        super.viewDidLoad()
        createStoryView()
    }
}

extension ViewController {
    fileprivate func createStoryView() {
        // get screen width
        let screenWidth = UIScreen.main.bounds.width
        // create an instance of the StoryView list
        storyView = StoryView(frame: CGRect(origin: .zero, size: CGSize(width: screenWidth, height: 120)))

        /* You can specify additional parameters 
        and settings for a particular list. before calling the `.create()` method 
        that starts the internal logic. */

        // rewriting the settings, for the bottom panel with the story card set in InAppStory
        storyView.panelSettings = PanelSettings(like: true, share: true)
        // setting the scroll direction
        storyView.direction = .horizontal()

        // add the list to the screen
        view.addSubview(storyView)
        // start the internal logic
        storyView.create()
    }

    
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct ContentView: View {
    var body: some View {
        StoryListView()
    }
} 
```

You can specify list settings and
 parameters during initialization.

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct ContentView: View {
    var body: some View {
        // overwrite the parameters, for the bottom panel with the story card set in InAppStory
        StoryListView(panelSettings: PanelSettings(like: true, share: true))
            .direction(.horizontal) // set scroll direction
    }
}
```

</TabItem>
</Tabs>

 All list parameters and settings can be viewed
[here](story-view.md#parameters-and-properties).

### (1.21.x) Handling list actions

<Tabs>
<TabItem value="uikit" label="UIKit">

If you need to handle list actions, such as clicking a link button or tracking a click on a favorite cell, you need to use `InAppStoryDelegate`. To do this, it must be specified in `StoryView` before calling the `.create()` method.

```swift
extension ViewController {
    fileprivate func createStoryView() {
        // get screen width
        let screenWidth = UIScreen.main.bounds.width
        // create an instance of the StoryView list
        storyView = StoryView(frame: CGRect(origin: .zero, size: CGSize(width: screenWidth, height: 120)))
        // specifying a delegate
        storyView.storiesDelegate = self
        // adding the list to the screen
        view.addSubview(storyView)
        // start the internal logic
        storyView.create()
    }
}

extension ViewController: InAppStoryDelegate {
    func storiesDidUpdated(isContent: Bool, from storyType: InAppStorySDK.StoriesType) {
        // processing of the list update
    }

    func storyReader(actionWith target: String, for type: InAppStorySDK.ActionType, from storyType: InAppStorySDK.StoriesType) {
        // processing actions from StoryView, e.g. pressing a button with a link
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

If it is necessary to process actions in the list, for example, pressing a button with a link or to track a click on a favorite cell, it is necessary to specify closures at initialization of `StoryListView`.

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct ContentView: View {
    var body: some View {
        StoryListView { isContent in
            // processing of list update
        } onAction: { target, actionType in
            // processing actions from StoryView, e.g. clicking a button with a link
        } onDismiss: {
            // called after closing the list
        }

    }
}
```

</TabItem>
</Tabs>

### (1.22.x) Handling list actions

<Tabs>
<TabItem value="uikit" label="UIKit">

If you need to handle actions in a list, such as clicking a link button or tracking a click on a favorite cell, you need to use closures. To do this, you must specify their implementation for `InAppStory` before calling the `.create()` method of `StoryView`

```swift
import UIKit
import InAppStorySDK

class ViewController: UIViewController {
    fileprivate var storyView: StoryView!

    override func viewDidLoad() {
        super.viewDidLoad()
        setupClosures()
        createStoryView()
    }
}

extension ViewController {
    fileprivate func setupClosures() {
        // setting the list update closure
        InAppStory.shared.storiesDidUpdated = { isContent, storyType in
            // handling of list update
        }
        // set closing actions in stories
        InAppStory.shared.onActionWith = { target, actionType, storyType in
            // handling actions from StoryView, e.g. pressing a button with a link
        }
    }

    fileprivate func createStoryView() {
        // get screen width
        let screenWidth = UIScreen.main.bounds.width
        // create an instance of the StoryView list
        storyView = StoryView(frame: CGRect(origin: .zero, size: CGSize(width: screenWidth, height: 120)))
        // add the list to the screen
        view.addSubview(storyView)
        // start the internal logic
        storyView.create()
    }
}
```

Closures can also be specified for a specific list. Such closures will overwrite the closures of `InAppStory` and will be prioritized, but will work only for the list to which they are specified. For this purpose, they must be specified in `StoryView` before calling the `.create()` method.

```swift
extension ViewController {
    fileprivate func createStoryView() {
        // get screen width
        let screenWidth = UIScreen.main.bounds.width
        // create an instance of StoryView list
        storyView = StoryView(frame: CGRect(origin: .zero, size: CGSize(width: screenWidth, height: 120)))
        // setting the list update closure
        storyView.storiesDidUpdated = storiesDidUpdated(isContent:from::)
        // set closing of actions in stories
        storyView.onActionWith = onAction(actionWith:for:from::)
        // adding the list to the screen
        view.addSubview(storyView)
        // start the internal logic
        storyView.create()
    }
}

extension ViewController {
    func storiesDidUpdated(isContent: Bool, from storyType: InAppStorySDK.StoriesType) {
        // processing of the list update
    }

    func onAction(actionWith target: String, for type: InAppStorySDK.ActionType, from storyType: InAppStorySDK.StoriesType) {
        // processing actions from StoryView, e.g. pressing a button with a link
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

If it is necessary to process actions in the list, for example, clicking a button with a link or tracking a click on a favorite cell, it is necessary to specify closures in `StoryListView`.

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct ContentView: View {
    var body: some View {
        StoryListView()
            .onUpdate { isContent, storyType in
                // processing of list update
            }
            .onAction { target, type, storyType in
                // handling actions from StoryView, e.g. clicking a button with a link
            }
            .onDismiss { storyType in
                // called after closing the list
            }
    }
}
```

</TabItem>
</Tabs>
