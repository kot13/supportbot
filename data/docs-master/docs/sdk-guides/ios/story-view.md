# StoryView (UIKit)

The main class for working with lists of stories.

## Initialization

**Remark**  
If the _settings_ parameter was not specified for `InAppStory`, before initializing `StoryView`, it should be set:

```swift
InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>?>)
```

To use the multi-feed function,`feed: <String>`must be set. By default, this is an empty string, and the list loads the main feed from the console.
If the parameter`favorite: <Bool?>` is equal true, the list will be displayed favorite stories.

```swift
var storyView: StoryView!

override func viewDidLoad() {
 super.viewDidLoad()

    storyView = StoryView(frame: <CGRect> = .zero, feed: <String> = "", favorite: <Bool> = false)
 storyView.target = <UIViewController>

 view.addSubview(storyView)

 storyView.create()
}
```

## Methods

- `create` - running internal StoryView logic;
- `refresh(newFeed: String? = nil, newTags: Array<String>? = nil)` - update the list of stories with the ability to set a new feed and tag list, more at [Refresh](refresh.md);
- `present(controller presentingViewController: <UIViewController>, with transitionStyle: <UIModalTransitionStyle>)` - displaying a custom controller on top of the story reader.
- `onVisibleAreaUpdated: ((_ items: Array<VisibleStoryItem>) -> Void)?` - return the list of objects with Information about the shown stories, more at [Visible Update Sample](visible-update.md) & [VisibleStoryItem](reference.md#visiblestoryitem);
- `collectVisibleAreaData()` - collects information about the stories shown (it is desirable to use when _ScrollView_ is covered), more at [Visible Update Sample](visible-update.md);
- `updateVisibleArea()` - collects information about the stories shown and causes a closure `onVisibleAreaUpdated`, more at [Visible Update Sample](visible-update.md);

### v.1.22.0

In version **1.22.0** you can now use one general method `present` for displaying the controller over readers instead of the remote.

#### Remote method (old)

```swift
StoryView.present(controller presentingViewController: UIViewController, with transitionStyle: UIModalTransitionStyle = .coverVertical)
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

### v.1.28.1

In version **1.28.1**, `StoryView` got completion closures for `create` and `refresh`.
These closures help you handle the final result of update operations in one place and are aligned with SDK update/error events (`storiesDidUpdated` / `failureEvent`).

Updated method signatures:

```swift
func create(
    completion: ((_ isContent: Bool, _ storyType: StoriesType, _ error: IASEvent.Failure?) -> Void)? = nil
)

func refresh(
    newFeed: String? = nil,
    newTags: Array<String>? = nil,
    completion: ((_ isContent: Bool, _ storyType: StoriesType, _ error: IASEvent.Failure?) -> Void)? = nil
)
```

Key notes:

- completion is optional (`= nil`), so existing integrations continue to work without changes;
- completion gives a single terminal callback for the current `create` / `refresh` operation;
- success path returns `error == nil`;
- failure path returns a non-`nil` `error` and mirrors the same failure flow used by SDK events.

#### Example: create with completion

```swift
storyView.create { isContent, storyType, error in
    if let error {
        print("Create failed:", error)
        return
    }

    print("Create completed. Has content:", isContent, "type:", storyType)
}
```

#### Example: refresh with new feed/tags and completion

```swift
storyView.refresh(newFeed: "summer_campaign", newTags: ["vip", "ru"]) { isContent, storyType, error in
    if let error {
        print("Refresh failed:", error)
        return
    }

    if isContent {
        print("Refresh completed with content for:", storyType)
    } else {
        print("Refresh completed, but no stories for:", storyType)
    }
}
```

#### Example: backward-compatible call (old behavior)

```swift
storyView.create()
storyView.refresh(newFeed: "default")
```

## Parameters and properties
:::warning[Please note]
### Unavaliable

- `InAppStoryDelegate`
- `StoryViewDelegateFlowLayout`
- `GoodsDelegateFlowLayout`

As of SDK version 1.23.0 delegates are **no longer available** for use, you should use **closures** to keep track of the SDK and interact with content. For more information about them see [here](reference.md#inappstory-closures).
:::
- `storiesDelegate` - should implement the protocol _\<[InAppStoryDelegate](reference.md#inappstorydelegate)>_;
- `deleagateFlowLayout` - deprecated, renamed to _delegateFlowLayout_;
- `delegateFlowLayout` - should implement the protocol _\<[StoryViewDelegateFlowLayout](reference.md#storyviewdelegateflowlayout)>_;
- `isEditorEnabled` - displaying editor cell in sories lists; ([InAppStoryUGC](../../ugc-guides/ios-ugc.md))
- `target` - controller for reader display `<UIViewController>`;
- `direction` - list scrolling direction. The default value for the list is `horizontal(rows: 1)`, for favorites, the default value `vertical(colums: 3)`.
  _\<[ListDirection](reference.md#listdirection)>_;
- `isContent` - there is any content in the list of stories _\<Bool>_;
- `storyCell` - custom cell, should implement the protocol _\<[StoryCellProtocol](reference.md#storycellprotocol)>_;
- `editorCell` - custom editor cell, should implement the protocol _\<[EditorCellProtocol](reference.md#editorcellprotocol)>_;

## PanelSettings

#### StoryView

After the `StoryView` is initialized and before the `create()` method is called, `panelSettings` can be specified which will only apply to that `StoryView` instance.

> **Pay attention**  
> To display buttons on the bottom panel, you must also enable this functionality in the console in the project settings.

```swift
...
let storyView = StoryView() // init StoryView
storyView.panelSettings = PanelSettings(like: true, favorites: true, share: true) // set panel settings
storyView.target = self
addSubview(storyView)

storyView.create() // start storyView internal logic
```
