import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Single Story

Used to display stories by their id or slug.

## Presentation

**Remark**  
If the _settings_ parameter was not specified for `InAppStory` before showing single story, it should be set:

```swift
InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>?>)
```

<Tabs>
<TabItem value="uikit" label="UIKit">

To display single story, you need call the `showStory` method of the singleton class `InAppStory.shared`:

```swift
InAppStory.shared.showStory(with id: <String>, from target: <UIViewController>, with panelSettings: <PanelSettings>? = nil, with panelSettings: PanelSettings? = nil, complete: <()->Void>) -> CancellationToken?
```

Parametr `panelSettings` displaying the bottom bar (overwrite `InAppStory.shared.panelSettings`) _\<PanelSettings>_; (_[Details](#panel-settings)_)

> **Remark**  
> Starting from version 1.27.0, the method returns `CancellationToken?` which allows cancelling the operation. For more details, see [Cancellation of actions](cancellation-of-actions.md).

To close the reader of single story, call `closeReader(complete: () -> Void)`. This may be necessary, such as when handling open the link by push a button in story. `complete` called after closing the reader.

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

To display a single story, you must specify the `singleStory` modifier and change its `isPresented` parameter to true:

```swift
.singleStory(storyID: <String>, isPresented: <Binding<Bool>>)
```

To close a single story reader, set the `isPresented` parameter to true or call `closeReader(complete: () -> Void)`. This may be necessary, such as when handling open the link by push a button in story. `complete` called after closing the reader.

## Parameters

* `storyID` - needed story ID;
* `panelSettings: <PanelSettings?> = nil` - displaying the bottom bar (overwrite `InAppStory.shared.panelSettings`) _\<PanelSettings>_; (_[Details](#panel-settings)_)

* `isPresented: <Binding<Bool>>` - binding `Bool` value that start showing onboarding reader. `false` - value close reader, but it's better to use `InAppStory.share.closeReader()`;
* `onDismiss: <(() -> Void)?>` - called when reader did dismiss;
* `onAction: <((String, ActionType) -> Void)?>` - called by action in Reader. First parameter is string URL from Story, second parameter action type, more at [ActionType](reference.md#actiontype);
* `goodsObjects: <((Array<String>, (Result<Array<GoodsObjectProtocol>, GoodsFailure>) -> Void) -> Void)?>` - called when library need goods items for widget. First parameter is array of goods' SKUs, the second parameter is a closure to which you need to pass objects of goods that implement the protocol `GoodsObjectProtocol`;
* `selectGoodsItem: <((GoodsObjectProtocol) -> Void)?>` - called when goods item select in story reader;

</TabItem>
</Tabs>

## Sample (SingleStory)

This type of story is opened by the specified `id` or `slug`. It can be used open from a push notification or be tied to an entity in an app (like a poll or trailer).

To display single story, you need to initialize InAppStory library in the project.

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

<Tabs>
<TabItem value="uikit" label="UIKit">

In the controller, where it is necessary to show a single story, call the `showStory` method on `InAppStory`.

#### ViewController.swift

```swift
...

func pushNotification() {
    InAppStory.shared.showStory(with: <String>, from: <UIViewController>, with: <PanelSettings>?) { show in
        // the closure is triggered when the single story reader is opened
        // show: <Bool> - if the reader was presented on the screen, value is true
    }
}
...
```

To track actions of the single story reader, you need to implement `InAppStoryDelegate` methods:

#### ViewController.swift

```swift
extension ViewController: InAppStoryDelegate
{
    func storiesDidUpdated(isContent: Bool, from storyType: StoriesType) {
        // called when the contents of the list are updated
    }

    // called when a button or SwipeUp event is triggered in the reader
    func storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType) {
        if type == .swipe { // link obtained by swipeUP action
           if let url = URL(string: target) {
               let swipeContentController = SwipeContentController()
               // passing link to controller with WebView
               swipeContentController.linkURL = url

               if storyType == .single {
                // opening the controller on top of the reader
                InAppStory.shared.singlePresent(controller: swipeContentController)
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

You need to set the variable on which the reader will depend and specify the `.singleStory` modifier in a View, where you want to display a single story.

#### ContentView.swift

```swift
struct ContentView: View
{
    @State var isSinglePresent: Bool = false
    @State var storyID: String
    
    var body: some View {
        VStack {
            /// ...
            StoryListView()
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            /// ...
            Button {
                showSingle()
            } label: {
                Text("Show single story")
            }
            /// ...
        }
        /// setting a modifier to display a single story
        .singleStory(storyID: storyID, isPresented: $isSinglePresent)
    }
    
    /// display story by action from the app
    func showSingle() {
        storyID = "new_story_id"
        isSinglePresent = true
    }
}
```

Also for tracking user actions, it is possible - when setting the modifier to set closures called from the reader.

#### ContentView.swift

```swift
struct ContentView: View
{
    @State var isSinglePresent: Bool = false
    @State var storyID: String
    
    var body: some View {
        VStack {
            /// ...
            StoryListView()
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            /// ...
            Button {
                showSingle()
            } label: {
                Text("Show single story")
            }

        }
        /// setting a modifier to display a single story
        .singleStory(
            storyID: storyID,
            isPresented: $isSinglePresent,
            willAppear: {
                /// the short circuit is triggered before the onboarding is shown.
            }, onDismiss: {
                /// the closure is triggered after the onboarding is closed
            }, onAction: { target, type in
                /// closure is called after user actions in the reader,
                /// e.g. pressing a button or calling the swipeUP widget
                /// 
                /// you can also call InAppStory.shared.closeReader()
                isSinglePresent = false
            }
        )
    }
    
    /// display story by action from the app
    func showSingle() {
        storyID = "new_story_id"
        isSinglePresent = true
    }
}
```

</TabItem>
</Tabs>

### v.1.22.0

In version 1.22.0 you can now use one general method `present` for displaying the controller over readers instead of the remote.

#### Remote method (old)

```swift
InAppStory.singleStoryPresent(controller presentingViewController: UIViewController, with transitionStyle: UIModalTransitionStyle = .coverVertical)
```

#### General method (new)

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

## Panel Settings

<Tabs>
<TabItem value="uikit" label="UIKit">

To set special settings for the bottom bar in single story. You must specify the `panelSettings` parameter when calling the `showStory(...)` method.

```swift
InAppStory.shared.showStory(with: "<storyID>",
                            from: self, // target from where the reader will be shown
                            with: PanelSettings(like: true, favorites: true, share: true)) // custom panel settings
{ _ in
    // closure after showng reader
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

To specify new settings for the bottom panel in single story. You must specify the `panelSettings` parameter when creating the modifier `singleStory`.

```swift
struct ContentView3: View
{
    @State var isSinglePresent: Bool = false
    @State var storyID: String
    
    var body: some View {
        VStack {
            /// ...
            StoryListView()
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            /// ...
            Button {
                showSingle()
            } label: {
                Text("Show single story")
            }

        }
        /// setting a modifier to display a single story
        .singleStory(
            storyID: storyID,
            panelSettings: PanelSettings(like: true, favorites: true, share: true),
            isPresented: $isSinglePresent
        )
    }
    
    /// display story by action from the app
    func showSingle() {
        storyID = "new_story_id"
        isSinglePresent = true
    }
}
```

</TabItem>
</Tabs>

## Link handling

:::warning
InAppStoryDelegate is currently considered **deprecated**, and it's methods were carried over as `InAppStory` class [closures](./reference.md#inappstory-closures).
:::

Use [`InAppStory.shared`](./link-handling.md#inappstoryshared) to configure single story link handling.

## Show story once

Starting with SDK version 1.23.0 we have added the ability to display a single story only once (similar to onboarding). In this scenario, a story will be shown if it has not been requested by a particular user. In scenarios where the application has a list or shows onboarding, reading the story in one of the sources will be blocked in the `InAppStory.shared.showStoryOnce` method.

<Tabs>
<TabItem value="uikit" label="UIKit">

To show a single story by id, with the ability to display it only once, you need to call the `InAppStory.shared.showStoryOnce(...)` method:

```swift
InAppStory.shared.showStoryOnce(with: "<storyID>",
                                from: self, // target from where the reader will be shown
                                with panelSettings: PanelSettings(like: true, favorites: true, share: true)) // single story delegate
{ _ in
    // closure after showng reader
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

To display a single story by id, with the possibility of displaying it only once, specify the `once = true` parameter for the `singleStory` modifier:

```swift
struct ContentView3: View
{
    @State var isSinglePresent: Bool = false
    @State var storyID: String
    
    var body: some View {
        VStack {
            /// ...
            StoryListView()
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            /// ...
            Button {
                showSingle()
            } label: {
                Text("Show single story")
            }

        }
        /// setting a modifier to display a single story
        .singleStory(
            storyID: storyID,
            once: true,
            isPresented: $isSinglePresent
        )
    }
    
    /// display story by action from the app
    func showSingle() {
        storyID = "new_story_id"
        isSinglePresent = true
    }
}
```

</TabItem>
</Tabs>
