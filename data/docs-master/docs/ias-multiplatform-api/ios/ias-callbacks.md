# CallbacksAPI

Class is used to set callbacks for `IAS IOS SDK`. Can be called from InAppStoryAPI:

```Swift
let callbacksAPI = InAppStoryAPI.shared.callbacksAPI
```

## CallBacks (closures)

Updating the data of the stories list:

```Swift
var storiesDidUpdated: ((_ isContent: Bool, _ storyType: StoriesType) -> Void)?
```

Performing activity in the story by the user:

```Swift
var onActionWith: ((_ target: String, _ type: ActionType, _ storyType: StoriesType?) -> Void)?
```

Story reader will show:

```Swift
var storyReaderWillShow: ((_ storyType: StoriesType) -> Void)?
```

Story reader did close:

```Swift
var storyReaderDidClose: ((_ storyType: StoriesType) -> Void)?
```

The favorites cell was pressed:

```Swift
var favoriteCellDidSelect: (() -> Void)?
```

The editor cell was pressed ([UGC guide](/ugc-guides/ios-ugc.md)):

```Swift
var editorCellDidSelect: (() -> Void)?
```

Obtaining objects of goods ([Goods guide](sdk-guides/ios/widget-goods.md)):

```Swift
var getGoodsObject: ((_ skus: Array<String>, _ complete: @escaping GoodsComplete) -> Void)?
```

The item was entered by the user in the reader:

```Swift
var goodItemSelected: ((_ item: GoodsObjectProtocol, _ storyType: StoriesType?) -> Void)?
```

Custom Sharing call ([Sharing](sdk-guides/ios/favorites.md#share)):

```Swift
var customShare: ((SharingObject, @escaping ((Bool) -> Void)) -> Void)?
```

### Events

Events stories ([Doc](sdk-guides/ios/events.md#stories-events)):

```Swift
var storiesEvent: ((_ event: IASEvent.Story) -> Void)
```

Events of the game ([Doc](sdk-guides/ios/events.md#games-events)):

```Swift
var gameEvent: ((_ event: IASEvent.Game) -> Void)
```

SDK errors ([Doc](sdk-guides/ios/events.md#errors)):

```Swift
var failureEvent: ((_ : IASEvent.Failure) -> Void)
```