import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Onboardings

Onboarding is used to display stories not present in the main list.

## Presentation

> **Remark**  
> If the _settings_ parameter was not specified for `InAppStory` before showing the onboarding, it should be set with:

```swift
InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>?>)
```

To display an onboarding, you need call the `showOnboardings` method of the singleton class `InAppStory.shared`:

```swift
InAppStory.shared.showOnboardings(feed: <String> = "", limit: Int = 0, from target: <UIViewController>, with tags: [String]? = nil, delegate: <InAppStoryDelegate>, with panelSettings: PanelSettings? = nil, complete: <()->Void>) -> CancellationToken?
```

> **Remark**  
> Starting from version 1.27.0, the method returns `CancellationToken?` which allows cancelling the operation. For more details, see [Cancellation of actions](cancellation-of-actions.md).

## Parameters

Also, in the onboarding, you can show a separate list specified in the console. To do this, you must specify the `feed: <String>` parameter related to the feed. By default, this is an empty string, and the list loads the oboarding feed from the console.

`limit: Int` - limit for displaying the number of onboardings in one query. With `limit=0` all available and unread at the moment are displayed.

`tags: [String]?` - override InAppStory settings tags;

Parametr `panelSettings` displaying the bottom bar (overwrite `InAppStory.shared.panelSettings`) _\<PanelSettings>_; (_[Details](#panel-settings)_)

To close the reader of onboarding, call `closeReader(complete: () -> Void)`. This may be necessary, such as when handling open the link by push a button in story. `complete` called after closing the reader.

### SwiftUI parameters

- `isPresented: <Binding<Bool>>` - binding `Bool` value that start showing onboarding reader. `false` - value close reader, but it's better to use `InAppStory.share.closeReader()`;
- `onDismiss: <(() -> Void)?>` - called when reader is dismiss;
- `onAction: <((String, ActionType) -> Void)?>` - called by action in Reader. First parameter is string URL from Story, second parameter action type, more at [ActionType](reference.md#actiontype);
- `goodsObjects: <((Array<String>, (Result<Array<GoodsObjectProtocol>, GoodsFailure>) -> Void) -> Void)?>` - called when library need goods items for widget. First parameter is array of goods' SKUs, the second parameter is a closure to which you need to pass objects of goods that implement the protocol `GoodsObjectProtocol`;
- `selectGoodsItem: <((GoodsObjectProtocol) -> Void)?>` - called when goods item select in story reader;

## Sample (OnboardingStory)

This type of stories is a separate list that is configured in the console. It can be used to display welcome screens, advertisements, etc.

To display onboarding, you need to initialize InAppStory library in the project

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    return true
}
```

## Default Onboardings

<Tabs>
<TabItem value="uikit" label="UIKit">

In the controller, where you want to show onboarding, call the `showOnboarding` method of the `InAppStory`.  
By default (if `feed: <String>` is not specified), the feed marked in the console as "Onboarding" will be displayed.

#### ViewController.swift

```swift
...

override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)

    InAppStory.shared.showOnboardings(from: <UIViewController>, delegate: <InAppStoryDelegate>) { show in
        // the closure is triggered when the onboarding reader is opened
        // show: <Bool> - if the reader was presented on the screen, value is true
    }
}
...
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

To display onboarding, you need to specify the `onboardingStories` modifier in the `View` where you want to display it and set the `@State` variable, depending on which the reader will be displayed. Further, if you want to display onboarding immediately when you switch to the screen, then in `.onAppear()` the variable should be set to `true`.  
By default (if `feed: <String>` is not specified), the feed marked in the console as "Onboarding" will be displayed.

#### ContentView.swift

```swift
struct ContentView: View
{
    @State var isOnboardingPresent: Bool = false

    var body: some View {
        VStack {
            /// ...
            StoryListView()
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            /// ...
        }
        .onAppear() {
            /// when we show the screen, we show onboarding
            isOnboardingPresent = true
        }
        /// onboarding modifier that accepts parameters for display and closures from user actions
        .onboardingStories(
            isPresented: $isOnboardingPresent,
            onAction: { target, actionType in
                /// you can also call InAppStory.shared.closeReader()
                isOnboardingPresent = false
            })
    }
}
```

</TabItem>
</Tabs>

## Custom tags Onboardings

For onboarding, you can set a list of tags other than those set in `InAppStory.shared.settings`. Tags set in this way completely override the tags set in `InAppStory.shared.settings` for a particular onboarding call.

<Tabs>
<TabItem value="uikit" label="UIKit">

#### ViewController.swift

```swift
...

override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)

    // feed - custom feed id;
    // from - controller for showing reader;
    // with - array of castom tads;
    // delegate - delegate for onbording reader;
    InAppStory.shared.showOnboardings(feed: <String> = "AboutFeed", from: <UIViewController>, with: ["Array with new tags"], delegate: <InAppStoryDelegate>) { show in
        // the closure is triggered when the onboarding reader is opened
        // show: <Bool> - if the reader was presented on the screen, value is true
    }
}
...
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

#### ContentView.swift

```swift
struct ContentView: View
{
    @State var isOnboardingPresent: Bool = false

    var body: some View {
        VStack {
            /// ...
            StoryListView()
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            /// ...
        }
        .onAppear() {
            /// when we show the screen, we show onboarding
            isOnboardingPresent = true
        }
        /// onboarding modifier that accepts parameters for display and closures from user actions
        .onboardingStories(
            tags: ["New", "tags", "array"], /// array of castom tads
            isPresented: $isOnboardingPresent,
            onAction: { target, actionType in
                /// you can also call InAppStory.shared.closeReader()
                isOnboardingPresent = false
            }
        )
    }
}
```

</TabItem>
</Tabs>

## Onboarding limits

<Tabs>
<TabItem value="uikit" label="UIKit">

In order to display a certain number of onboardings in the reader, you must set a limit when you call `showOnboardings(...)`. If you call `showOnboardings(...)` again, the following onboardings will be obtained according to the limit.
`limit: Int` - limit for displaying the number of onboardings in one query. With `limit=0` all available and unread at the moment are displayed.

#### ViewController.swift

```swift
...
override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)

    InAppStory.shared.showOnboardings(limit: 2, from: <UIViewController>, delegate: <InAppStoryDelegate>) { show in
        // the closure is triggered when the onboarding reader is opened
        // show: <Bool> - if the reader was presented on the screen, value is true
    }
}
...
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

To display a specific number of onboardings in the reader, you must set a limit when creating the `.onboardingStories` modifier. When the reader is displayed again, the following onboardings will be received according to the set limit.
`limit: Int` - limit on displaying the number of onboardings in one request. If `limit=0` all currently available and unread onboardings are displayed.

#### ContentView.swift

```swift
struct ContentView: View
{
    @State var isOnboardingPresent: Bool = false

    var body: some View {
        VStack {
            /// ...
            StoryListView()
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            /// ...
        }
        .onAppear() {
            /// when we show the screen, we show onboarding
            isOnboardingPresent = true
        }
        /// onboarding modifier that accepts parameters for display and closures from user actions
        .onboardingStories(
            limit: 2, /// limit the number of stories that can be displayed per reader call
            isPresented: $isOnboardingPresent,
            onAction: { target, actionType in
                /// you can also call InAppStory.shared.closeReader()
                isOnboardingPresent = false
            }
        )
    }
}
```

</TabItem>
</Tabs>

## Custom feed Onboardings

<Tabs>
<TabItem value="uikit" label="UIKit">

In onboarding, you can show any feed from the list in the console. To show a non-default feed, you must specify `feed: <String>` when calling the `showOnboarding` method of the `InAppStory`.

#### ViewController.swift

```swift
...
override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)

    InAppStory.shared.showOnboardings(feed: <String> = "AboutFeed", from: <UIViewController>, delegate: <InAppStoryDelegate>) { show in
        // the closure is triggered when the onboarding reader is opened
        // show: <Bool> - if the reader was presented on the screen, value is true
    }
}
...
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

In onboarding, you can show any feed from the list in the console. To show a non-default feed, you must specify `feed: <String>` when creating the `onboardingStories` modifier.

#### ContentView.swift

```swift
struct ContentView: View
{
    @State var isOnboardingPresent: Bool = false

    var body: some View {
        VStack {
            /// ...
            StoryListView()
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            /// ...
        }
        .onAppear() {
            /// when we show the screen, we show onboarding
            isOnboardingPresent = true
        }
        /// onboarding modifier that accepts parameters for display and closures from user actions
        .onboardingStories(
            feed: "CustomFeed", /// the name of the feed to be displayed as onboarding
            isPresented: $isOnboardingPresent,
            onAction: { target, actionType in
                /// you can also call InAppStory.shared.closeReader()
                isOnboardingPresent = false
            }
        )
    }
}
```

</TabItem>
</Tabs>

:::warning[Attention!]
 Displaying any feed in onboarding works according to onboarding rules. Onboarding stories are shown **only once per user**. The next time you try to show an already read story in onboarding it will cut off.
:::

## Link handling

:::warning
InAppStoryDelegate is currently considered **deprecated**, and it's methods were carried over as `InAppStory` class [closures](./reference.md#inappstory-closures).
:::

Use [`InAppStory.shared`](./link-handling.md#inappstoryshared) to configure onboarding link handling.

<Tabs>
<TabItem value="uikit" label="UIKit">

To track the actions of the onboarding reader, you need to implement the `InAppStoryDelegate` methods

```swift
extension ViewController: InAppStoryDelegate
{
    func storiesDidUpdated(isContent: Bool, from storyType: StoriesType) {
        // called when the contents of the list are updated
    }

    // called when a button or SwipeUp event is triggered in the reader
    func storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType) {
        switch storyType {
        case .list(let listFeed):
            print("List feed is \(listFeed)") // stories list feed id
        case .onboarding(let onboardingFeed):
            print("Onboarding feed is \(onboardingFeed)") // onboarding list feed id
        default:
            print("Feed is not set") // by favorites or sigle
        }

        if type == .swipe { // link obtained by swipeUP action
           if let url = URL(string: target) {
               let swipeContentController = SwipeContentController()
               // passing link to controller with WebView
               swipeContentController.linkURL = url

               if storyType == .onboarding {
                // opening the controller on top of the reader
                InAppStory.shared.onboardingPresent(controller: swipeContentController)
               }
           }
       } else { // .button, .game, .deeplink
            // if the processed link leads to a screen in the application,
            // it is recommend to close the reader
            InAppStory.shared.closeReader {
                // processing a link, for example, to follow it in safari
                if let url = URL(string: target) {
                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
                }
            }
        }
    }

    func storyReaderWillShow(with storyType: StoriesType) {
        // called before the reader will show
    }

    func storyReaderDidClose(with storyType: StoriesType) {
        // called after closing the story reader
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

To track the reader's actions, you must specify closures when creating the `onboardingStories` modifier.

#### ContentView.swift

```swift
struct ContentView: View
{
    @State var isOnboardingPresent: Bool = false

    var body: some View {
        VStack {
            /// ...
            StoryListView()
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            /// ...
        }
        .onAppear() {
            /// when we show the screen, we show onboarding
            isOnboardingPresent = true
        }
        /// onboarding modifier that accepts parameters for display and closures from user actions
        .onboardingStories(
            isPresented: $isOnboardingPresent,
            willAppear: {
                /// the short circuit is triggered before the onboarding is shown.
            },
            onDismiss: {
                /// the closure is triggered after the onboarding is closed
            },
            onAction: { target, actionType in
                /// you can also call InAppStory.shared.closeReader()
                isOnboardingPresent = false
            }
        )
    }
}
```

</TabItem>
</Tabs>

In version 1.22.0 you can now use one general method `present` for displaying the controller over readers instead of the remote.

### General method (new)

```swift
/// Displaying the modal controller on top of the stories reader
/// - Parameters:
///   - presentingViewController: displayed controller
///   - presentationStyle: display style, defaults to .overCurrentContext
///   - transitionStyle: display animation style, default is .coverVertical
func present(controller presentingViewController: UIViewController,
             for presentationStyle: UIModalPresentationStyle = .overCurrentContext,
             with transitionStyle: UIModalTransitionStyle = .coverVertical)
```

### Remote method (old)

```swift
InAppStory.onboardingPresent(controller presentingViewController: UIViewController, with transitionStyle: UIModalTransitionStyle = .coverVertical)
```

## Panel settings

<Tabs>
<TabItem value="uikit" label="UIKit">

To set special settings for the bottom bar in onboardings. You must specify the `panelSettings` parameter when calling the `showOnboardings(...)` method.

```swift
InAppStory.shared.showOnboardings(from: self, // target from where the reader will be shown
                                  delegate: self, // onboarding delegate
                                  with: PanelSettings(like: true, favorites: true, share: true)) // custom panel settings
{ show in
    // closure after showng reader
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

To specify new settings for the bottom panel in onboardings. You must specify the `panelSettings` parameter when creating the modifier `onboardingStories`.

#### ContentView.swift

```swift
struct ContentView: View
{
    @State var isOnboardingPresent: Bool = false

    var body: some View {
        VStack {
            /// ...
            StoryListView()
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            /// ...
        }
        .onAppear() {
            /// when we show the screen, we show onboarding
            isOnboardingPresent = true
        }
        /// onboarding modifier that accepts parameters for display and closures from user actions
        .onboardingStories(
            /// setting the bottom panel settings
            panelSettings: PanelSettings(like: true, favorites: true, share: true),
            isPresented: $isOnboardingPresent,
            onAction: { target, actionType in
                /// you can also call InAppStory.shared.closeReader()
                isOnboardingPresent = false
            }
        )
    }
}
```

</TabItem>
</Tabs>
