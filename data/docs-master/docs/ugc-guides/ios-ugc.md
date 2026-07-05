# iOS-UGC

## UGC Installation

| InAppStory version | Build version | iOS version |
|-|-|-|
| 1.3.4              | 532           | >= 11.0     |

Version of the library can be obtained from the parameter `InAppStoryEditor.frameworkInfo`

### CocoaPods

[CocoaPods](https://cocoapods.org) is a dependency manager for Cocoa projects. For usage and installation instructions, visit their website. To integrate InAppStory into your Xcode project using CocoaPods, specify it in your `Podfile`:

```ruby
use_frameworks!
pod 'InAppStoryUGC', :git => 'https://github.com/inappstory/ios-ugc-sdk.git', :tag => '1.3.4'
```

### Carthage

[Carthage](https://github.com/Carthage/Carthage) is a decentralized dependency manager that builds your dependencies and provides you with binary frameworks. To integrate InAppStory into your Xcode project using Carthage, specify it in your `Cartfile`:

```ogdl
github "inappstory/ios-ugc-sdk" ~> 1.3.4
```

### Swift Package Manager

The [Swift Package Manager](https://swift.org/package-manager/) is a tool for automating the distribution of Swift code and is integrated into the `swift` compiler. It is in early development, but InAppStory does support its use on supported platforms.

Once you have your Swift package set up, adding InAppStory as a dependency is as easy as adding it to the `dependencies` value of your `Package.swift`.

```swift
dependencies: [
    .package(url: "https://github.com/inappstory/ios-ugc-sdk.git", .upToNextMajor(from: "1.3.4"))
]
```

### Manual installation

Download `InAppStoryUGC.xcframework` from the repository. Connect in the project settings on the _General_ tab.

### Library import

The UGC editor works only with InAppStorySDK frameworks. The SDK must be imported to work fully.

##### Swift

```swift
import InAppStorySDK
import InAppStoryUGC
```

## InAppStoryEditor

The main singleton class for managing data and customizing the display of lists and the reader.

### Initialization

Before using the UGC editor, the InAppStorySDK must be initialized with the service key and settings.
InAppStorySDK Initialization is preferably carried out in `AppDelegate`:

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
 InAppStory.shared.initWith(serviceKey: <String>, testKey: <String>, settings: <Settings?>)
 return true
}
```

- `serviceKey` - service authorization key (\<_String_>);
- `testKey` - test authorization key in the service (\<_String_>);
- `settings` - configuration object (_\<[Settings?](/sdk-guides/ios/reference.md#settings)>_ - _optional_).

> **Attention!**  
> If you pass _testKey_, then the library will display the stories only in the **"Moderation"** status.

### Methods

- `showEditor(payload: Dictionary<String, Any?>? = nil, from target: <UIViewController>, delegate: <InAppStoryEditorDelegate>? = nil, complete: (<Bool>) -> Void)` - presenting UGC editor from target controller;
- `func closeEditor(complete: () -> Void)` - close UGC editor.

### Parameters and properties

- `editorPlaceholderView` - custom loader, should implement the protocol _\<[DownloadPlaceholderProtocol](/sdk-guides/ios/reference.md#downloadplaceholderprotocol)>_;

## StoryUGCView (UIKit)

The main class for working with lists of UGC stories.

### Initialization

> **Remark**  
> If the _settings_ parameter was not specified for `InAppStory`, before initializing `StoryUGCView`, it should be set:

```swift
InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>?>)
```

To filter stories by attributes, you must pass the `filter: Dictionary<String, Any>` parameter when initializing the list instance. If you pass an empty filter, all stories from moderation section that passed approval will be displayed.

```swift
var storyView: StoryUGCView!

override func viewDidLoad() {
 super.viewDidLoad()

    storyView = StoryUGCView(frame: <CGRect> = .zero, filter: Dictionary<String, Any> = [:])
 storyView.target = <UIViewController>

 view.addSubview(storyView)

 storyView.create()
}
```

### Methods

- `create` - running internal StoryUGCView logic;
- `refresh` - refresh stories list;
- `present(controller presentingViewController: <UIViewController>, with transitionStyle: <UIModalTransitionStyle>)` - displaying a custom controller on top of the story reader.

### v.1.22.0

In version 1.22.0 you can now use one general method `present` for displaying the controller over readers instead of the remote.

#### Remote method (old)

```swift
StoryUGCView.present(controller presentingViewController: UIViewController, with transitionStyle: UIModalTransitionStyle = .coverVertical)
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

### Parameters and properties

- `storiesDelegate` - should implement the protocol _\<[InAppStoryDelegate](/sdk-guides/ios/reference.md#inappstorydelegate)>_;
- `deleagateFlowLayout` - deprecated, renamed to _delegateFlowLayout_;
- `delegateFlowLayout` - should implement the protocol _\<[StoryViewDelegateFlowLayout](/sdk-guides/ios/reference.md#storyviewdelegateflowlayout)>_;
- `isEditorEnabled` - displaying editor cell in sories lists; (InAppStoryUGC)
- `target` - controller for reader display _\<UIViewController>_;
- `direction` - list scrolling direction. The default value for the list is `horizontal(rows: 1)`, for favorites, the default value `vertical(colums: 3)`.
  _\<[ListDirection](/sdk-guides/ios/reference.md#listdirection)>_;
- `isContent` - there is any content in the list of stories _\<Bool>_;
- `storyCell` - custom cell, should implement the protocol _\<[StoryCellProtocol!](/sdk-guides/ios/reference.md#editorcellprotocol)>_;

## StoryListUGCView (SwiftUI)

The main class for working with lists of stories with SwiftUI.

### Initialization

> **Remark**  
> If the _settings_ parameter was not specified for `InAppStory`, before initializing `StoryView`, it should > be set:
>
```swift
InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>?>)
```

To filter stories by attributes, you must pass the `filter: Dictionary<String, Any>` parameter when initializing the list instance. If you pass an empty filter, all storis from moderation section that passed approval will be displayed.

```swift
struct ContentView: View
{
    var body: some View {
        VStack(alignment: .leading) {
            StoryListUGCView(filter: <Dictionary<String, Any>>,
                             isEditorEnabled: <Bool>,
                             onUpdated: <((Bool) -> Void)?>,
                             onAction: <((String, ActionType) -> Void)?>,
                             onDismiss: <(() -> Void)?>,
                             editorSelect: <(() -> Void)?>,
                             refresh: <Binding<Bool>>)
            Spacer()
        }
    }
}
```

### Parameters

- `filter: <Dictionary<String, Any>>` - filter the list of stories created in the UGC editor;
- `isEditorEnabled` - displaying editor cell in sories lists; ([InAppStoryUGC](https://github.com/inappstory/ios-ugc-sdk/tree/SwiftUI))
- `onUpdated: <((Bool) -> Void)?>` - called after the contents are updated;
- `onAction: <((String, ActionType) -> Void)?>` - called by action in Reader. First parameter is string URL from Story, second parameter action type, more at [ActionType](https://github.com/inappstory/ios-sdk/tree/SwiftUI#actiontype);
- `onDismiss: <(() -> Void)?>` - called when reader did dismiss;
- `editorSelect: <(() -> Void)?>` - called after editor cell did selected;
- `refresh: <Binding<Bool>>` - binding `Bool` value that start refresh logic in list;

### Methods

- `itemsSize(_ size: CGSize) -> StoryListView` - set cell size in list;
- `edgeInserts(_ inserts: UIEdgeInsets) -> StoryListView` - set padding from the edges of the list for cells;
- `lineSpacing(_ spacing: CGFloat) -> StoryListView` - set the vertical padding between cells in a list;
- `interitemSpacing(_ spacing: CGFloat) -> StoryListView` - set horizontal padding between cells in a list;
- `setStoryCell(customCell: StoryCellProtocol) -> StoryListView` - set custom cell for list that realize  [StoryCellProtocol](https://github.com/inappstory/ios-sdk/tree/SwiftUI#storycellprotocol)
- `setEditorCell(customCell: EditorCellProtocol) -> StoryListView` - set custom editor cell, should implement the protocol _\<[EditorCellProtocol!](https://github.com/inappstory/ios-sdk/tree/SwiftUI#EditorCellProtocol)>_;

## Protocols

### InAppStoryEditorDelegate

- `editorEvent(name: String, data: Dictionary<String, Any>)` - editor events [Full list of events](#list-of-delegate-events);

### DownloadPlaceholderProtocol

- `isAnimate: <Bool> { get }` - returns the state of the animation
- `start` - start animation
- `stop` - stop animation

## List of delegate events

The `InAppStoryEditorDelegate` can receive the following events from the editor:

- `editorWillShow` - library will show editor screen;
- `editorDidClose` - library did cloe editor screen;
- `slideAdded` - a slide was added to the editor. Parameters:
  - `slideIndex` - index of the added slide;
  - `totalSlides` - total number of slides;
  - `ts` - time of the event in timestamp format;
- `slideRemoved` - a slide was removed in the editor. Parameters:
  - `slideIndex` - index of the removed slide;
  - `totalSlides` - total number of slides;
  - `ts` - time of the event in timestamp format;
- `storyPublishedSuccess` - The story has been sent for moderation. Parameters:
  - `totalSlides` - total number of slides;
  - `ts` - time of the event in timestamp format;
- `storyPublishedFail` - failed to submit the story for moderation. Parameters:
  - `totalSlides` - total number of slides;
  - `ts` - time of the event in timestamp format;
  - `reason` - the cause of the error, when sending for moderation;
- `EditorFailure` - errors when receiving the editor from the server;
  - `reason` - the cause of an error when retrieving, unpacking or searching the device cache;

## Sample

First you need to initialize the InAppStorySDK and enable the editor cell display in the history lists.

#### AppDelegate.swift

```swift
import InAppStory
...

func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
   // Init InAppstorySDK
   InAppStory.shared.initWith(serviceKey: <String>, testKey: <String>, settings: <Settings?>)

   return true
}
```

Next, in the controller, create a StoryView to display a list of stories.

> **Attention!**  
> For the UGC editor to work properly, you must install and import the InAppStorySDK.

#### ViewController.swift

```swift
import InAppStory // import main framework
import InAppStoryUGC // import UGC editor framework

class ViewController: UIViewController {

    // StoryView variable declaration
    fileprivate var storyView: StoryView!
...
    override func viewDidLoad() {
        super.viewDidLoad()
        // creating a StoryView with a default list of stories and setting the size
        storyView = StoryView(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: 160))
        // specifies the target for the StoryView from which the Story Reader will be displayed
        storyView.target = self
        // Enabling the UGC editor cell display in the list of stories
        storyView.isEditorEnabled = true
        // specifies a delegate in which the StoryView actions can be tracked
        storyView.storiesDelegate = self
        // adding StoryView to the controller's view
        view.addSubview(storyView)

        // running the internal StoryView logic to retrieve a list of stories
        storyView.create()
    }
}

extension ViewController: InAppStoryDelegate
{
    // called after the contents are updated for sories type
    func storiesDidUpdated(isContent: Bool, from storyType: StoriesType) { ... }
    // called after a link is received from stories with the interaction type and stories type
    func storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType) { ... }
    // called after editor cell tapped in stories list
    func editorCellDidSelect()
    {
        // showing an editor with specifying from where to show it and adding a delegate to it
        InAppStoryEditor.shared.showEditor(payload: [<String>:<Any>], from: self, delegate: self) { show in
            // called after editor screen showing
        }
    }
}

// delegate methods for the editor
extension ViewController: InAppStoryEditorDelegate
{
    // all of editor events (editorWillShow, editorDidClose,...)
    func editorEvent(name: String, data: Dictionary<String, Any>) {...}
}
```
