import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Link handling

The SDK can handle links set in stories and games.

There are 4 sources of references ([ActionType](https://docs.inappstory.com/sdk-guides/ios/reference.md#actiontype)):

1. `.button` - type comes when you click a button inside a story;
2. `.swipe` - the type comes when the SwipeUp widget is fired (when you swipe or tap);
3. `.game` - type comes if a button was pressed in the game or a link call script was triggered;
4. `.deeplink` - type comes from a story that has a link set in the console, this type comes only from the list, by clicking on a cell.

To retrieve a reference/link, you must specify an `onActionWith: { target, type, storyType }` closure from `StoryView`/`StoryListView`, where:

- **target**: link called from the SDK;
- **type**: the type of action that triggered this closure;
- **storyType**: the type of story that was opened, depending on the source;

For links in single stories and onboarding, see: [SingleStory](https://docs.inappstory.com/sdk-guides/ios/single-story.md#sample-singlestory) and [OnboardingStory](https://docs.inappstory.com/sdk-guides/ios/onboardings.md#onboardings-actions)

## Simple link handling

There are two main ways of link handling - using [closures](#closures) and through [InAppStory.shared](#inappstoryshared).

The `StoryView`/`StoryListView` closures override the `InAppStory.shared` closures and have a higher priority. Thus, if you need to handle all closures in one place, you can specify them in `InAppStory.shared` instead of closures.

<Tabs>
<TabItem value="uikit" label="UIKit">

### Closures

:::tip
As of version 1.22.0 InAppStory closures can be used to configure link handling and are considered to be the correct method to do so.
:::

1. Initialize the InAppStory library in the project:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    /// library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be set at any time before creating a StoryView or calling single stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    return true
}
```

2. Initialize `StoryView` in the controller and specify the closure `onAction`:

#### ViewController.swift

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    /// StoryView initialization
    let storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0))
    storyView.storiesDelegate = self

    /// specifying a closure for processing references from the SDK
    storyView.onActionWith = { target, type, storyType in
        /// simple opening of a link in an external browser
        if let url = URL(string: target) {
            UIApplication.shared.open(url)
        }
    }

    /// adding a StoryView to the view
    view.addSubview(storyView)

    /// running internal logic
    storyView.create()
}
```

Also, the closure can be specified through a separate method of the class where `StoryView` is embedded or an external object

#### ViewController.swift

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    /// StoryView initialization
    let storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0))
    storyView.storiesDelegate = self

    /// method assignment to a closure
    storyView.onActionWith = storyAction(_:_:_:)

    /// adding a StoryView to the view
    view.addSubview(storyView)

    /// running internal logic
    storyView.create()
}

...
/// Closure is caused when SDK tries to call a link from a reader, a game or a list of stories.
fileprivate func storyAction(_ target: String, _ type: ActionType, _ storyType: StoriesType) {
    /// simple opening of a link in an external browser
    if let url = URL(string: target) {
        UIApplication.shared.open(url)
    }
}
```

### InAppStory.shared

`InAppStory.shared` is used to configure link handling for [single stories](single-story.md), [onboardings](onboardings.md#) and [games](#link-handling-for-non-story-games-1220), and moreover can be used to configure all link handling just there instead of separate closures.

:::warning
If you don't track the event type, all references from SDK will work the same way. It doesn't matter to the library where the reference came from, calling a closure with type passing in any case.
If there is a need to process references from different sources, it is necessary to track the **event type**. Processing of references with closures is the same as when using `InAppStoryDelegate`. See below for examples.
:::

### Link handling before v1.22.0

:::warning
As of SDK version 1.22.x, `InAppStoryDelegate` is deprecated. It is replaced by [closures](#closures), see [1.22.x migration guide](https://docs.inappstory.com/sdk-guides/ios/migrations.md#migration-to-inappstory-closures-sdk-v1-22-0) for more details.
When using closures to get a reference, you must specify the `onActionWith: ((_ target:<String>, _ type:<ActionType>, _ storyType:<StoriesType?>) -> Void)?` closure in `StoryView`, where:
:::

1. Initialize the InAppStory library in the project:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    /// library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    /// settings can also be set at any time before creating a StoryView or calling single stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    return true
}
```

2. Initialize `StoryView` in the controller:

#### ViewController.swift

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    /// StoryView initialization
    let storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0))
    storyView.storiesDelegate = self

    /// adding a StoryView to the view
    view.addSubview(storyView)

    /// running internal logic
    storyView.create()
}
```

3. Implement a delegate method to retrieve the reference:

#### ViewController.swift

```swift
extension ViewController: InAppStoryDelegate
{
    ...
    /// method is called when SDK tries to call a link from a reader, game or story list.
    func storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType) {
        /// simple opening of a link in an external browser
        if let url = URL(string: target) {
            UIApplication.shared.open(url)
        }
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

1. Initialize the InAppStory library when you start the project:

#### ContentView.swift

```swift
struct ContentView: View
{
    init() {
        /// library initialization
        InAppStory.shared.initWith(serviceKey: <String>)

        // settings can also be set at any time before creating a StoryView or calling single stories
        InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)
    }

    var body: some View {
        StoriesScreenView()
    }
}
```

2. Initialize `StoryListView` on the screen and specify closure `onAction`:

#### StoriesScreenView.swift

```swift
struct StoriesScreenView: View
{
    var body: some View {
        StoryListView()
            /// closure is caused when SDK tries to call a link from a reader, game or story list.
            .onAction { target, type, actionType in
                /// simple opening of a link in an external browser
                if let url = URL(string: target) {
                    UIApplication.shared.open(url)
                }
            }
            /// When initializing a StoryListView, you must specify its size,
            /// otherwise it will stretch to the entire screen
            .frame(height: 150.0)
    }
}
```

</TabItem>
</Tabs>

:::warning
If you don't keep track of the event type, all references from SDK will work the same way. For the library it does not matter where the reference came from, in any case the delegate method with type passing will be called. If there is a need to process references from different sources, it is necessary to track the type of event or source. See examples below.
:::


<Tabs>
<TabItem value="uikit" label="UIKit">

Processing of links can also be divided by type. For example, when working on the SwipeUp widget, you can show the internal controller with the browser on top of the story, without transferring the user to Safari. To do this, you need to track the event type in the `storyReader(actionWith...)` method.

#### ViewController.swift

```swift
extension ViewController: InAppStoryDelegate
{
    ...
    /// method is called when SDK tries to call a link from a reader, game or story list.
    func storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType) {
        if type == .swipe {
            let swipeContentController = SwipeContentController()
            /// passing a link to the controller to be shown on top of the story reader
            swipeContentController.linkURL = url

            /// opening a controller on top of a story reader
            InAppStory.shared.present(controller: swipeContentController)
        }
    }
}
```

Also, in order to switch to the application screen with closing the reader, for example, from a game or by pressing a button in the story reader, it is necessary to track these types and close the reader or game before switching to a new screen.

#### ViewController.swift

```swift
extension ViewController: InAppStoryDelegate
{
    ...
    /// method is called when SDK tries to call a link from a reader, game or story list.
    func storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType) {
        /// determining that the link came from clicking a button in the story reader or from the game
        if type == .button || type == .game {
            InAppStory.shared.closeReader {
                /// this closure is triggered after the reader is completely closed,
                /// after that, you can show the screen in the application
                showOtherScreen(with: target)
            }
        }
    }
}
```

Event with type `ActionType.deeplink`, comes only from the list on pressing a cell. With this type of event the reader will not have a story, so if you need to close the reader to go to another screen, it is important to check the type of event. In this case, the `InAppStory.shared.closeReader` method will not trigger the closure.

#### ViewController.swift

```swift
extension ViewController: InAppStoryDelegate
{
    ...
    /// method is called when SDK tries to call a link from a reader, game or story list.
    func storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType) {
        /// determining that the link came from clicking on a cell in the story list
        if type == .deeplink  {
            /// the reader has not been opened, there is no need to close it
            /// and you can switch to another screen immediately
            showOtherScreen(with: target)
        } else {
            /// at events with types .button, .swipe and .game,
            /// you may need to close the reader
            InAppStory.shared.closeReader {
                /// this closure is triggered after the reader is completely closed,
                /// after which, you can show the screen in the application
                showOtherScreen(with: target)
            }
        }
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

Processing of links can also be divided by type. For example, when working on the SwipeUp widget, you can show the internal controller with the browser on top of the story, without transferring the user to Safari. To do this, you need to track the event type in the `onAction(...)` closure.

#### StoriesScreenView.swift

```swift
struct StoriesScreenView: View
{
    var body: some View {
        StoryListView()
            /// closure is triggered when SDK tries to call a link from a reader, game or story list.
            .onAction { target, type, actionType in
                if type == .swipe {
                    /// creating a View with the URL parameter to display what came from the closure
                  let circleView = SwipeContentView(url: target)

                  /// To pass the displayed screen to the SDK,
                  /// you need to wrap it in a UIHostingController
            let controller = UIHostingController(rootView: circleView)

                    /// opening a controller on top of a story reader
                    InAppStory.shared.present(controller: controller)
                }
            }
            /// When initializing a StoryListView, you must specify its size,
            /// otherwise it will stretch to the entire screen
            .frame(height: 150.0)
    }
}
```

Also, in order to switch to the application screen with closing the reader, for example, from a game or by pressing a button in the story reader, it is necessary to track these types and close the reader or game before switching to a new screen.

#### StoriesScreenView.swift

```swift
struct StoriesScreenView: View
{
    var body: some View {
        StoryListView()
            /// closure is triggered when SDK tries to call a link from a reader, game or story list.
            .onAction { target, type, actionType in
                /// determining that the link came from clicking
                /// a button in the story reader or from the game
                if type == .button || type == .game {
                    InAppStory.shared.closeReader {
                        /// this closure is triggered when the reader is completely closed,
                        /// after which you can show the screen in the application
                        showOtherScreen(with: target)
                    }
                }
            }
            /// When initializing a StoryListView, you must specify its size,
            /// otherwise it will stretch to the entire screen
            .frame(height: 150.0)
    }
}
```

Event with type `ActionType.deeplink`, comes only from the list on pressing a cell. With this type of reader event there will be no story, so if it is necessary to close the reader to move to another screen, it is important to check the event type, because in this case the `InAppStory.shared.closeReader` closure will not be called.

#### StoriesScreenView.swift

```swift
struct StoriesScreenView: View
{
    var body: some View {
        StoryListView()
            /// closure is triggered when SDK tries to call a link from a reader, game or story list.
            .onAction { target, type, actionType in
                /// detection that the link came by tapping on a cell in the story list
                if type == .deeplink  {
                    /// because the reader has not been opened, there is no need
                    /// to close it and you can switch to another screen immediately
                    showOtherScreen(with: target)
                } else {
                    /// at events with types .button, .swipe and .game,
                    /// you may need to close the reader
                    InAppStory.shared.closeReader {
                        /// this closure is triggered when the reader is completely closed,
                        /// after which you can show the screen in the application
                        showOtherScreen(with: target)
                    }
                }
            }
            /// When initializing a StoryListView, you must specify its size,
            /// otherwise it will stretch to the entire screen
            .frame(height: 150.0)
    }
}
```

</TabItem>
</Tabs>

:::tip
Starting with SDK version 1.22.x, a game can be shown separately from stories. The actions of this game can only be tracked in the closure `InAppStory.shared.onActionWith: ((:, :, :, :) -> Void)?`. See below for an example of usage.
:::

## Link handling for non-story games (>1.22.0)

It is now possible to open games by id not from stories. Since the game has no source, closures tracking user actions were added to `InAppStory.shared`. To use them, you must specify closures before showing the game.

<Tabs>
<TabItem value="uikit" label="UIKit">

#### ViewController.swift

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    /// The closure is triggered when the SDK tries to call a link from the game
    InAppStory.shared.onActionWith = { target, type, storyType in
        /// simple opening of a link in an external browser
        if let url = URL(string: target) {
            UIApplication.shared.open(url)
        }
    }
}
...

/// method is executed when the button is pressed
@IBAction func openGame(_ sender: UIButton) {
    /// game opening at the touch of a button
    InAppStory.shared.openGame(with: Game(id:"game_id")) { opened in
        /// the closure is triggered by opening the game
        /// if an error occurs while opening the game
        /// the opened parameter will be false
    }
}
```

If the application has specified closures for `StoryView` event handling via `InAppStory.shared` and the application has games opened via stories, then `storyType` must be additionally tracked to close the games when a link is received. Because if you call `InAppStory.shared.closeGame()` for a game shown from a story, only the game will close, and the story reader will remain shown. In this case it is necessary to call `InAppStory.shared.closeReader(:)`.

#### ViewController.swift

```swift

var targetURL: String?

override func viewDidLoad() {
    super.viewDidLoad()

    /// The closure is triggered when the SDK tries to call a link from the game.
    InAppStory.shared.onActionWith = { target, type, storyType in
        /// if the link came from the game
        if type == .game {
            /// assigning the target value to a temporary variable
            targetURL = target
            /// if storyType == nil, then the game was not opened from the story
            if storyType == nil {
                /// in this case, we close the game and
                /// wait for gameComplete closure
                InAppStory.shared.closeGame()
            } else {
                /// if the game is opened from story, you need to close
                /// the story reader, the game will close automatically
                InAppStory.shared.closeReader {
                    /// since the reader is closed to close the game,
                    /// you must wait for gameComplete closure
                }
            }
        }
    }

    /// closure will be called after the game closes from stories or on its own
    InAppStory.shared.gameComplete = { [weak self] data, result, url in
        /// it is necessary to check that self is not equal to nil
        guard let weakSelf = self else { return }
        /// it is necessary to check if there is a url in the closure,
        /// if there is, then the game has closed by internal logic and
        /// it is necessary to process exactly the url that is passed in
        if let url = url {
            weakSelf.showOtherScreen(with: url)
            return
        }

        /// If the url is not found in the closure, it means that
        /// the closure was triggered due to closing by an external method and
        /// it is necessary to get the url from the temporary variable.
        if let targetURL = targetURL {
            weakSelf.showOtherScreen(with: targetURL)
        }
    }

    /// initialization of StoryView which has stories with the game
    let storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0))

    /// adding a StoryView to the view
    view.addSubview(storyView)

    /// running internal logic
    storyView.create()
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

#### GameScreenView.swift

```swift
struct GameScreenView: View
{
    var body: some View {
        /// play button
        Button {
            /// game opening by ID
            InAppStory.shared.openGame(with: Game(id: "gameId")) { opened in
                /// check if the game is open, if the game is not open
                /// it makes no sense to track the event call from the URL
                guard opened else { return }

                /// closure is triggered when the SDK tries to call a link from the game.
                InAppStory.shared.onActionWith = { target, type, _ in
                    /// simple opening of a link in an external browser
                    if let url = URL(string: target) {
                        UIApplication.shared.open(url)
                    }
                }
            }
        } label: {
            Text("Show game")
        }
    }
}
```

In the SwiftUI version of the SDK, if there is a need to track links from the story list and the game, you need to set the `InAppStory.shared.onActionWith` closure for the game, and also set the closure for `StoryListView`.

#### GameScreenView.swift

```swift
struct GameScreenView: View
{
    init() {
        /// closure is triggered when the SDK tries to call a link from the game.
        InAppStory.shared.onActionWith = { target, type, _ in
            /// simple opening of a link in an external browser
            if let url = URL(string: target) {
                UIApplication.shared.open(url)
            }
        }
    }

    var body: some View {
        VStack {
            StoryListView()
                /// closure is triggered when the SDK tries to call a link from a story
                .onAction { target, type, storyType in
                    /// simple opening of a link in an external browser
                    if let url = URL(string: target) {
                        UIApplication.shared.open(url)
                    }
                }
                /// When initializing a StoryListView, you must specify its size,
                /// otherwise it will stretch to the entire screen
                .frame(height: 150.0)
            Spacer(minLength: 16)
            /// the button to open the game
            Button {
                /// game opening by ID
                InAppStory.shared.openGame(with: Game(id: "gameId"))
            } label: {
                Text("Show game")
            }
        }
    }
}
```

:::warning
If the game was opened from the story reader, the event about the attempt to open the URL link will be sent to the closure of the story list. The closure `InAppStory.shared.onActionWith` will be called only from a game opened via `InAppStory.shared.openGame`.
:::

</TabItem>
</Tabs>
