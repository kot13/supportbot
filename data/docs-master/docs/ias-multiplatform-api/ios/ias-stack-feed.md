# StackFeedAPI

Class is used for communication between [stack-feed](/sdk-guides/ios/stack-feed.md) widgets
and `IAS IOS SDK`; Can be called from InAppStoryAPI:

```Swift
let stackFeedAPI = InAppStoryAPI.shared.stackFeedAPI
```

## Methods

To load data for stack feed:

```Swift
func getStackFeed(
    feed: String? = nil,
    complete: @escaping (StackFeedResult) -> Void
)
```

To show StackFeed reader

```Swift
func showStackReader(
    with stackList: StackFeedObject,
    with panelSettings: PanelSettings? = nil,
    showing: @escaping (_ show: Bool) -> Void
)
```

## CallBacks (closures)

To get StackFeed updates

```Swift
var stackFeedUpdate: ((_ newStackObject: StackFeedObject?) -> Void)
```