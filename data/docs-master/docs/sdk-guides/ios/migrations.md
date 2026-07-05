# Migrations

## IAM migration (SDK 1.28.0)

In version **1.28.0**, the signature of the **`inAppMessageWillShow`** callback was changed and the SDK added the ability to explicitly define the container for showing IAM depending on the presentation type. The rest of the API for showing, preloading, tags, and events remains backward compatible.

Below is what you need to change when upgrading from 1.27 to 1.28 and what new capabilities become available.

---

### 1. `inAppMessageWillShow` callback — signature change

#### Before (1.27)

The callback was invoked when the IAM screen was shown and did not accept arguments and did not return a value:

```Swift
// 1.27
InAppStory.shared.inAppMessageWillShow = {
    // notification about an upcoming show, no parameters
}
```

In 1.27 docs: `inAppMessageWillShow: (() -> Void)`.

#### After (1.28)

The callback is invoked **before each show attempt** and receives three arguments; it can return a container (`UIView`) where the message should be shown:

```Swift
// 1.28
InAppStory.shared.inAppMessageWillShow = { id, event, presentType in
    // id: String - message identifier
    // event: String? - event name (if showing by event), otherwise nil
    // presentType: IAMPresentType - presentation type: .fullScreen, .bottomSheet, .popUp, .toast
    return nil  // nil = use targetView or the default container
}
```

Type in 1.28:  
`((_ id: String, _ event: String?, _ presentType: IAMPresentType) -> UIView?)?`

:::warning
If you assigned `inAppMessageWillShow` a closure without parameters `{ ... }`, after updating to 1.28 this code **will not compile**. You must add three parameters: `id`, `event`, `presentType`, and return `UIView?` (or `nil`).
:::

#### What to do during migration

1. Replace the assignment with a closure using the new signature.
2. If you were only logging the show event, add the parameters and return `nil`:

```Swift
// Before (1.27)
InAppStory.shared.inAppMessageWillShow = {
    log("IAM will show")
}

// After (1.28) — minimal change
InAppStory.shared.inAppMessageWillShow = { id, event, presentType in
    log("IAM will show, id: \(id), presentType: \(presentType)")
    return nil
}
```

3. If you want to show some messages (for example, toasts) in your own window above the entire app, use `presentType` inside the closure to decide whether to return your `UIView` or `nil`. See [current implementation documentation](in-app-messaging-v2.md) for details.

---

### 2. New type `IAMPresentType`

In 1.28, the public API introduces the enum **`IAMPresentType`** (values: `fullScreen`, `bottomSheet`, `popUp`, `toast`). It is passed as the third argument to `inAppMessageWillShow` and allows selecting a container depending on the presentation type.

No import is required: the type is declared in the SDK. Example usage in the callback:

```Swift
InAppStory.shared.inAppMessageWillShow = { id, event, presentType in
    switch presentType {
    case .toast:
        return overlayWindowContainerView  // custom container above the entire app
    case .fullScreen, .bottomSheet, .popUp:
        return nil  // show in the container passed to showInAppMessageWith
    }
}
```

---

### 3. Showing behavior: container priority

In 1.28, the container for IAM is selected in this order:

1. **View returned from `inAppMessageWillShow`** (if non-nil)
2. **`targetView`** passed to `showInAppMessageWith(id:targetView:...)` or `showInAppMessageWith(event:targetView:...)`
3. **Default container** (for example, registered via the SwiftUI modifier `.inAppMessageContainer()`)

In 1.27, a container was not passed: IAM was shown above the current screen (via the top view controller). In 1.28, the callback is **always invoked** before showing, and the `UIView` returned from it (if non-nil) has the highest priority over any passed `targetView`.

---

### 4. `inAppMessageDidClose` callback

The signature **did not change**: it remains `(() -> Void)?`. No code changes are required. Usage is the same: update UI, hide overlay window, etc. after IAM closes.

---

### 5. `showInAppMessageWith` methods — new `targetView` parameter

In 1.27.4, both show methods **did not have** a container parameter:

```Swift
// 1.27.4
func showInAppMessageWith(id: String, onlyPreloaded: Bool = false, completion: ((_ show: Bool) -> Void)? = nil) -> CancellationToken?
func showInAppMessageWith(event: String, onlyPreloaded: Bool = false, tags: Array<String>? = nil, completion: ((_ show: Bool) -> Void)? = nil) -> CancellationToken?
```

IAM was shown above the current screen (via the top presented controller).

In 1.28, both methods add an **optional** parameter `targetView: UIView? = nil`:

```Swift
// 1.28
func showInAppMessageWith(id: String, targetView: UIView? = nil, onlyPreloaded: Bool = false, completion: ((_ show: Bool) -> Void)? = nil) -> CancellationToken?
func showInAppMessageWith(event: String, targetView: UIView? = nil, onlyPreloaded: Bool = false, tags: Array<String>? = nil, completion: ((_ show: Bool) -> Void)? = nil) -> CancellationToken?
```

- **Backward compatibility:** calls without `targetView` are still valid and behave as before (the container is determined via `inAppMessageWillShow` or the default container in SwiftUI).
- **New capabilities:** passing `targetView` defines the container where the IAM will be rendered; if `inAppMessageWillShow` returns its own `UIView`, that view is used instead (priority higher than `targetView`).

> **Pay attention**  
> If in 1.27 you showed IAM only by calling `showInAppMessageWith(id: ...)` or `showInAppMessageWith(event: ...)` without a container, after updating to 1.28 these calls remain valid. To embed IAM into a specific `UIView` (or use a SwiftUI container), in 1.28 you must either pass `targetView` or return a view from `inAppMessageWillShow`.

---

### 6. Remaining API (no changes)

The following did not change in 1.28 in terms of signatures or meaning:

- **Preloading:** `preloadInAppMessages`, preloading by `ids` and `tags`.
- **Tags** when showing by event and when preloading.
- **Events:** `inAppMessagesEvent` (`IASEvent.IAMessage.*`), `failureEvent` (`inAppMessageFailure`, etc.).

No migration is required for these parts.

---

### 7. SwiftUI (1.28)

If you use SwiftUI, in 1.28 the following modifiers and methods are still available (or were added):

- **`.inAppMessageContainer()`** — register the default container.
- **`.inAppMessageContainer(id: String)`** — named container.
- **`showIAMWith(id:inContainer:onlyPreloaded:completion:)`** and **`showIAMWith(event:inContainer:onlyPreloaded:tags:completion:)`** — show in the selected container by ID.
- **`IAMDefaultContainerID`** — default container identifier.

They work together with the updated `inAppMessageWillShow`: if the callback returns `nil`, the SDK uses `targetView` or the container from the registry (including the one registered via these modifiers). See [current IAM implementation docs](in-app-messaging-v2.md) for details.

---

### Quick migration checklist

| Step | Action                                                                                                                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | Update the `inAppMessageWillShow` assignment: a closure with three parameters `(id, event, presentType)` returning `UIView?` (if you do not provide your own container, `return nil`).                                   |
| 2    | If needed, use `presentType` to choose the container (for example, a separate window for `.toast`).                                                                                                                      |
| 3    | If you need to pass a container explicitly, use the new `targetView` parameter in `showInAppMessageWith(id:targetView:...)` or `showInAppMessageWith(event:targetView:...)`; calls without `targetView` are still valid. |
| 4    | The remaining code for preloading, tags, and events can stay unchanged.                                                                                                                                                  |

After these changes, the project should work correctly with IAM in version 1.28. For a full description of capabilities, see [In-App Messaging (current implementation)](in-app-messaging-v2.md).

## Migration to InAppStory events closures (SDK v1.23.0)

:::warning

### Unavaliable

- `InAppStoryDelegate`
- `StoryViewDelegateFlowLayout`
- `GoodsDelegateFlowLayout`

As of SDK version 1.23.0 delegates are no longer available for use, you should use closures to keep track of the SDK and interact with content. For more information about them look [here](reference.md#inappstory-closures).

### Deprecated

As of SDK version 1.23.0, receiving notifications and events via NotificationCenter is considered deprecated and closure is recommended;
:::

#### Events (Notifications)

After the changes related to not using NotificationCenter, the notifications themselves have undergone some changes, as the objects passed in events have become more unified and new data has been added.

You must subscribe to closures from InAppStory to receive events:

- `InAppStory.shared.storiesEvent: ((_ event: IASEvent.Story) -> Void)` - events coming from stories and lists;
- `InAppStory.shared.gameEvent: ((_ event: IASEvent.Game) -> Void)` - events coming from the games;
- `InAppStory.shared.failureEvent: ((_ : IASEvent.Failure) -> Void)` - data and query processing errors;

**Comparative table of notifications and events**

| NotificationCenter    | IASEvent                                                                                 | Changes                                                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                       | Story                                                                                    |                                                                                                                                                         |
| "StoriesLoaded"       | `.storiesLoaded(feed: String? = nil, stories: Array<StoryData>)`                         | Removed `count` parameter, now it must be obtained from the data array with `StoryData`                                                                 |
| "UGCStoriesLoaded"    | `.ugcStoriesLoaded(stories: Array<StoryData>)`                                           | Removed `count` parameter, now it must be obtained from the data array with `StoryData`                                                                 |
| "ClickOnStory"        | `.clickOnStory(storyData: StoryData)`                                                    | All data about the tapped item is stored in the `StoryData` object                                                                                      |
| "ShowStory"           | `.showStory(storyData: StoryData, action: ShowStoryAction)`                              | `source` - can be obtained from `StoryData`, `action` - replaced by a `ShowStoryAction` object.                                                         |
| "CloseStory"          | `.closeStory(slideData: SlideData, action: CloseStoryAction)`                            | `index` - can be obtained from `SlideData`, `source` - can be obtained from `SlideData.StoryData`, `action` - replaced with `CloseStoryAction` object ` |
| "ClickOnButton"       | `.clickOnButton(slideData: SlideData, link: String)`                                     | `index` - can be obtained from `SlideData`                                                                                                              |
| "ShowSlide"           | `.showSlide(slideData: SlideData)`                                                       | `index` - can be obtained from `SlideData`, `payload` - can be obtained from `SlideData`                                                                |
| "LikeStory"           | `.likeStory(slideData: SlideData, value: Bool)`                                          | `index` - can be obtained from `SlideData`                                                                                                              |
| "DislikeStory"        | `.dislikeStory(slideData: SlideData, value: Bool)`                                       | `index` - can be obtained from `SlideData`                                                                                                              |
| "FavoriteStory"       | `.favoriteStory(slideData: SlideData, value: Bool)`                                      | `index` - can be obtained from `SlideData`                                                                                                              |
| "ClickOnShareStory"   | `.clickOnShareStory(slideData: SlideData)`                                               | `index` - can be obtained from `SlideData`                                                                                                              |
| "StoryWidgetEvent"    | `.storyWidgetEvent(slideData: SlideData?, name: String, data: Dictionary<String, Any>?)` | `index` - can be retrieved from `SlideData`, `payload` - can be retrieved from `SlideData`, `widgetName` - renamed to `name`                            |
|                       | Game                                                                                     |                                                                                                                                                         |
| "StartGame"           | `.startGame(gameData: GameStoryData)`                                                    | `index` - can be obtained from `GameStoryData.SlideData`                                                                                                |
| "CloseGame"           | `.closeGame(gameData: GameStoryData)`                                                    | `index` - can be obtained from `GameStoryData.SlideData`                                                                                                |
| "FinishGame"          | `.finishGame(gameData: GameStoryData, result: Dictionary<String, Any>)`                  | `index` - can be obtained from `GameStoryData.SlideData`                                                                                                |
| -                     | `.gameFailure(gameData: GameStoryData, message: String)`                                 | `index` - can be obtained from `GameStoryData.SlideData`, `message` - text description of the error                                                     |
|                       | Failure                                                                                  |                                                                                                                                                         |
| "SessionFailure"      | `.sessionFailure(message: String)`                                                       | `message` - text description of the error                                                                                                               |
| "StoryFailure"        | `.storyFailure(message: String)`                                                         | `message` - text description of the error                                                                                                               |
| "CurrentStoryFailure" | `.currentStoryFailure(message: String)`                                                  | `message` - text description of the error                                                                                                               |
| "NetworkFailure"      | `.networkFailure(message: String)`                                                       | `message` - text description of the error                                                                                                               |
| "RequestFailure"      | `.requestFailure(message: String, statusCode: Int)`                                      | `message` - text description of the error, `statusCode` - server response code                                                                          |

#### Reader

The main changes occurred in the logic of the `InAppStory.shared.closeReader(complete:)` method, now this method closes any reader shown on the screen. The same applies to games opened with the `InAppStory.shared.openGame(...)` method.

Also, the `complete` closure in the `InAppStory.shared.closeReader(complete:)` method in version 1.23.0 is called even if no reader has been opened.

#### Game

Changed the logic of `InAppStory.shared.openGame(...)` method, now if the screen with the game is already shown and an attempt to call `.openGame(...)` again, the new reader will not open, and the `complete` g closure will come with the `opened == false` parameter value. Also, in this scenario, if you are subscribed to game events, the `InAppStory.shared.gameEvent` closure will receive the `IASEvent.Game.game.gameFailure` event.

## Migration to InAppStory closures (SDK v1.22.0)

:::warning

### Deprecated / Unavaliable

- `InAppStoryDelegate`
- `StoryViewDelegateFlowLayout`
- `GoodsDelegateFlowLayout`.

The library's delegate methods have been carried over as closures of the `InAppStory` class. For more information about them look [here](reference.md#inappstory-closures).
:::

#### Goods

`goodsCloseBackgroundColor` - Now, the background color of the close button is taken from `InAppStory.shared.goodsSubstrateColor`.

`refreshGoodsImage` - parameter is merged with `refreshImage`. To change the display of "refresh" button in goods, use - `refreshImage`.

### SwiftUI

Due to the transfer of logic from delegates to closures, the [StoryListView](story-list-view.md) and [StoryListUGCView](../../ugc-guides/ios-ugc.md#storylistugcview-swiftui) list interfaces were **updated**.

Closures were **removed** from the initialization methods and moved to variables that can be called from an instance of the class.

<details>
  <summary><b>Code example</b></summary>
  
#### ContentView.swift - old

```swift
struct ContentView: View
{
    var body: some View {
        VStack(alignment: .leading) {
            StoryListView(feed: <String?>,
                          isFavorite: <Bool>,
                          panelSettings: <PanelSettings>?,
                          isEditorEnabled: <Bool>,
                          onUpdated: <((Bool) -> Void)?>,
                          onAction: <((String, ActionType) -> Void)?>,
                          onDismiss: <(() -> Void)?>,
                          favoritesSelect: <(() -> Void)?>,
                          getGoodsObjects: <((Array<String>, (Result<Array<GoodsObjectProtocol>, GoodsFailure>) -> Void) -> Void)?>,
                          selectGoodsItem: <((GoodsObjectProtocol) -> Void)?>,
                          refresh: <Binding<Bool>>)
            Spacer()
        }
    }
}
```

#### ContentView.swift - new

```swift
struct ContentView: View
{
    var body: some View {
        VStack(alignment: .leading) {
            StoryListView(feed: <String?>,
                          isFavorite: <Bool>,
                          panelSettings: <PanelSettings>?,
                          isEditorEnabled: <Bool>,
                          refresh: <Binding<Bool>>)
                .onUpdate { isContent, storyType in
                    // called when the list is updated
                }
                .willAppear({ storyType in
                    // called before reader's screen
                })
                .onDismiss({ storyType in
                    // called after reader screen is closed
                })
                .onAction { target, type, storyType in
                    // called if an action has occurred in the story
                }
                .favoriteDidSelect {
                    // is called when the favorite cell has been clicked
                }
                .editorDidSelect {
                    // called when the editor cell was clicked
                }
                .getGoodsObject { skus, complete in
                    // called to get the list of goods
                }
                .goodItemSelected { item, storyType in
                    // called when an item in a widget is selected
                }
            Spacer()
        }
    }
}
```

</details>

### Replaced / Renamed

#### Merged methods

The methods displaying the controller over readers have been merged into one:

- [StoryView](story-view.md#v1220)<br/>
- [StoryUGCView](/ugc-guides/ios-ugc.md#v1220)<br/>
- [singleStoryPresent](single-story.md#v1220)<br/>
- [onboardingPresent](onboardings.md#remote-method-old)<br/>

#### General method

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

#### Goods

`goodsCellDiscountTextColor` - renamed to `goodsCellOldPriceTextColor`; <br/>
`goodCellDiscountFont` - renamed to `goodCellOldPriceFont`; <br/>

#### GoodsObject

`discount` - renamed to `oldPrice`;<br/>

`init(sku:title:subtitle:imageURL:price:discount:)` - renamed to
`init(sku:title:subtitle:imageURL:price:oldPrice:)`;

### Added

Added **fully custom sharing support**. For more information look [here](favorites.md#fully-custom-sharing-since-1220).

#### Goods

`goodsDimColor` - background color that covers the entire screen;
`goodsSubstrateHeight` - height of the carpet pad under the list of goods, counted from the "close" button;
`goodsCellImageBackgroundColor` - background color of the product image in the default cell;
`goodsCellImageCornerRadius` - corner radius of the product image in the default cell;

### Change of design

In version 1.22.0 changed the default values for some design elements.

#### Stories

- changed icons for the bottom Story card;
- changed stories closing icon;
- timer bars have rounded edges;
- the gradient shadow under the timers has become lighter;

#### StoryList

- The aspect ratio is taken from the console data and the cell size is counted automatically from the size of the list, unless the _FlowLayout_ delegate has been set or closures for the sizes have been overridden;
- default aspect ratio is square (1:1);
- the sound icon has been changed;

#### Games

- "Close" button position is drilled from `InAppStory.shared.closeButtonPosition`;
- icon for the close button is drilled from `InAppStory.shared.closeReaderImage`;

#### UGC

- Close button position is drilled from `InAppStory.shared.closeButtonPosition`;
- icon for the close button is drilled from `InAppStory.shared.closeReaderImage`;

## Migration to the new list view (SDK v1.21.0)

:::warning

### InAppStory limitations

For the [Settings](reference.md#settings) object, field size limits have been added, if this limit is exceeded, information will be displayed in the IDE console and the SDK will stop working:

- `userID` - 255 bytes;
- `tags` - 4000 bytes;
  :::

### Default cells view

Since version 1.21.0 the default cell shape is a square and the dimensions are based on the size of the list itself and the `direction` parameter. To change the aspect ratio and dimensions, you need to use methods of the `StoryViewDelegateFlowLayout` delegate.  
Also since version 1.21.0 the thickness of the cell stroke has changed, now it is 1pt. More details about customization of cells in the list can be found [here](appearance.md#cell-customization)

### Direction

In version 1.21.0 the parameter responsible for the direction of list scrolling was added.

#### It was

- **simple list** - only horizontal scrolling in one line;
- **favourites list** - only vertical scrolling in 3 columns;

#### Now

Since version 1.21.0, you can specify an arbitrary scrolling direction and number of rows/columns for lists, for this purpose must specify in `StoryView` parameter `direction` \<[ListDirection](reference.md#listdirection)>. By default the list has a value of `horizontal(rows: 1)`, and the list of favorites has `vertical(colums: 3)`.

:::tip
The default cell size is calculated from the size of the list and the number of rows/columns. If you change `direction` cells can become very small or large, take this into account.
:::

### Editor (UGC) cell

In version 1.21.0 the default display of the UGC editor cell has been changed.

#### It was

The cell background is blue with a white icon in the center

#### Now

In version 1.21.0, the background of the cell has changed to black and the size of the icon has changed slightly.
To slightly change the appearance of the cell, you don't need to create a custom cell that implements the `EditorCellProtocol` protocol. Now it's enough to create an instance of `EditorCellSettings` and specify it in `InAppStory.shared.editorCellSettings`.

With `EditorCellSettings` you can change:

- `backgroundColor` - the color of the cell background;
- `iconColor` - the tint color of the icon in the cell;
- `iconImage` - set your own icon;

:::tip

- Cell settings are set for the whole project in one place and are used in all lists. If you need to set different UGC cells for different lists, you need to use a custom cell implementing `EditorCellProtocol`.
- The `iconColor` in `EditorCellSettings` overlaps the icon only if `iconImage.renderingMode == .alwaysTemplate`. Please keep an eye on this.
  :::

### NotificationCenter

1. Since version 1.21.0 in [NotificationCenter](events.md) the `title` field will come regardless of whether it is displayed in a cell or not (if `title` is set for stories in the console)
2. Since version 1.21.0, the `action` field has been added to the ShowStory notification, showing how a particular stories was shown. `action` - how the stories was shown (`open`, `auto`, `swipe`, `tap` or `custom`);

## Migration to PanelSettings (SDK v1.16.0)

In SDK version 1.16.0 properies of InAppStory `likePanel`, `favoritePanel` and `sharePanel` were merged into one property `panelSettings<PanelSettings>`, which now enables displaying the bottom bar.

> **Note** <br/>
> Reactions must be previously turned on in the admin console.

#### New

- `panelSettings` - displaying the bottom bar (should be enabled in the console) `<PanelSettings>`; (_[Details](reference.md#panelsettings)_)

#### Removed

- `likePanel` - displaying the bottom bar with likes (should be enabled in the console) `<Bool>`;
- `favoritePanel` - displaying the bottom bar with favorites (should be enabled in the console) `<Bool>`;
- `sharePanel` - displaying the bottom panel with sharing (should be enabled in the console) `<Bool>`;

### NotificationCenter

Added a new NotificationCenter event - `StoryWidgetEvent`.

`StoryWidgetEvent` - action in the widget with parameters:

- `index` - the index of the slide where the widget is located,
- `widgetName` - name of a widget,
- `data<Dictionary<String, Any>?>` - activated widget data;

Look for detailed widget data fields in [Story Widget Events](/glossarium/statistics/stories-widget-events.md)

## Migration to Multi-feed (SDK v1.15.0)

The ability to use multi-feeds was added to the SDK in version 1.15.0.

You can use this new functionality to:

1. Separate story feeds for different screens;
2. Make use of several feeds on one screen;
3. Provide different feeds to different users;
4. Etc.

### StoryView

To work with multi-feed, the `feed: <String>` parameter has been added to the **StoryView**.

By default, this parameter is equal to an empty _String_ and with this value it receives a default story feed from the server.

:::tip
If you don't plan to switch to multi-feed at this time, don't specify a `feed: <String>` when initializing the **StoryView**. In this case, everything will work as before.
:::

```swift
StoryView(frame: <CGRect> = .zero, feed: <String> = "", favorite: <Bool> = false)
```

Look for more info in [Multi-feed](multi-feed.md).

### Onboardings

The multi-feed functionality can also be used in onboardings to separate them by screens or events.

To use multi-feed in onboardings, you must specify `feed: <String>` when calling the `showOnboardings` method.

:::tip
If you don't plan to switch to multi-feed at this time, don't specify a `feed: <String>`. In this case, everything will work as before.
:::

```swift
InAppStory.shared.showOnboardings(feed: <String> = "", from: <UIViewController>, with: <[String]?> = nil, delegate: <InAppStoryDelegate>, complete: <(_ show: Bool) -> Void>)
```

Look for more info in [Onboardings](onboardings.md#sample-onboardingstory).

:::warning
Displaying any feed in onboarding works according to onboarding rules. Stories are shown only once per user. The next time you try to show the onboarding story it will be turned off.
:::

### InAppStoryDelegate

#### StoriesType

Added parameter `feed` for enum `StoriesType` elements.

```swift
enum StoriesType {
    case list(feed: String?)
    case single
    case onboarding(feed: String)
}
```

#### Default values

- For a regular list of stories - **"default"**
- For the list of onboardings - **"onboarding"**

> For `list`, the `feed` parameter can be set to **nil**, in case the delegate method was called from a favorites list.

### NotificationCenter

For all life cycle notifications, the `feed` parameter has been added - indicating from which feed the notification was called.

## Migration to InAppStoryDelegate (SDK v1.11.0)

#### From v1.8.x

In SDK v1.10.0, delegate protocols are merged into a common protocol `InAppStoryDelegate`.
:::warning
The old implementation of the protocols will be available until v1.11.0. After this update, you will have to switch to `InAppStoryDelegate` protocol.
:::

#### From v1.9.x

Added a new optional parameter for `InAppStoryDelegate` methods in SDK v1.10.0.

Parameter `storyView` is `nil` for `.single` and `.onboarding` `storyType` values.

When `storyType` value equals to `.list`, `storyView` is the list of stories which called this method.

#### From v1.10.x

Added support for SwiftUI in SDK v1.11.0. Removed a new optional parameter in `InAppStoryDelegate` methods.
:::warning
Parameter `storyView` is not avalable. For cloasing reader, your may use `InAppStory.shared.closeReader(complete:)`, that close all reader on the screen. _closeReader_ removed from `StoryView`.
:::

### InAppStoryDelegate

The protocol combines the methods of all three old implementations. The _\<[StoriesType](reference.md#storiestype)>_ parameter has been added to distinguish the source of a method call.  
Some of the methods have become optional and do not need to be implemented.

- `storiesDidUpdated(isContent: Bool, from storyType: StoriesType)` - called after the contents are updated for sories type _\<[StoriesType](reference.md#storiestype)>_;
- `storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType)` - called after a link is received from stories with the interaction type _\<[ActionType](reference.md#actiontype)>_ and _\<[StoriesType](reference.md#storiestype)>_;
- `storyReaderWillShow(with storyType: StoriesType)` - called before the reader will show _(optional)_;
- `storyReaderDidClose(with storyType: StoriesType)` - called after closing the story reader _(optional)_;
- `favoriteCellDidSelect()` - called when the favorite cell has been selected _(optional)_;
- `getGoodsObject(with skus: <Array<String>>, complete: <GoodsComplete>)` - get goods items from parent app with closure, _\<[GoodsComplete](reference.md#goodscomplete)>_;
- `goodItemSelected(_ item: <Any>, with storyType: <StoriesType>)` - selected goods item in widget, with object sended in `getGoodsObject(...)`

### Migration

To replace the old delegates methods, you need to do the following:

1. Add `InAppStoryDelegate` implementation;
2. Transfer implementation of old methods to new ones;
3. If you have used several implementations in the same class and they performed different actions, you must separate them using the `storyType` parameter.
4. Change method and parameter calls to set the delegate:
   - for `storyView`, parameter `delegate` renamed to `storiesDelegate`;
   - for showng single story, method `showSingleStory(...)` renamed to `showSingle(...)`;
   - for showing onboarding, method `showOnboarding(...)` renamed to `showOnboardings(...)`;
5. If you got the data for the iOS widget from the _StoryViewDelegate_ method `storyViewUpdated(...)`, you can get it from `InAppStory.shared.widgetStories` after calling `storiesDidUpdated(...)` with _storyType == .list_ or via `InAppStory.shared.getWidgetStories(complete: (Array<WidgetStory>?) -> Void)`;
6. Remove implementation of old methods and calls;

> **Attention!**

In version 1.9.0, the ability to open a story by a link has been added. If a story is opened from the list and a new story is in the same list too, it (a new story) will be open in the same reader. Otherwise, a new reader with a single story will be opened. Also, when opening stories using a link from _SingleReader_ or _Onboarding_, a new reader will be opened.

If you use the new `InAppStoryDelegate` protocol, the delegate methods with the appropriate _StoriesType_ will be called.
If you are using old protocols, you need to make sure that the classes that implement _StoryViewDelegate_ and _OnboardingDelegate_ also implement the _SingleStoryDelegate_ functionality. Otherwise, when opening a new _SingleReader_, you will not be able to call the corresponding methods.

## Migration to InAppStoryDelegate (SDK v1.10.0)

#### From v1.8.x

In SDK v1.10.0, delegate protocols are merged into a common protocol `InAppStoryDelegate`. The old implementation of the protocols will be available until v1.11.0, after this update, you will need to switch to using the `InAppStoryDelegate` protocol.

#### From v1.9.x

In SDK v1.10.0, add new optional parameter in `InAppStoryDelegate` methods. Parameter `storyView` is _nil_ for `.single` and `.onboarding` _storyType_ values. For a _storyType_ value equal to `.list`, `storyView` is the list of stories from which this method was called.

### InAppStoryDelegate

The protocol combines the methods of all three old implementations. The _\<[StoriesType](reference.md#storiestype)>_ parameter has been added to distinguish the source of a method call.  
Some of the methods have become optional and do not need to be implemented.

- `storiesDidUpdated(isContent: Bool, from storyType: StoriesType, storyView: <StoryView>?)` - called after the contents are updated for sories type _\<[StoriesType](reference.md#storiestype)>_;
- `storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType, storyView: <StoryView>?)` - called after a link is received from stories with the interaction type _\<[ActionType](reference.md#actiontype)>_ and _\<[StoriesType](reference.md#storiestype)>_;
- `storyReaderWillShow(with storyType: StoriesType, storyView: <StoryView>?)` - called before the reader will show _(optional)_;
- `storyReaderDidClose(with storyType: StoriesType, storyView: <StoryView>?)` - called after closing the story reader _(optional)_;
- `favoriteCellDidSelect()` - called when the favorite cell has been selected _(optional)_;
- `getGoodsObject(with skus: <Array<String>>, complete: <GoodsComplete>)` - get goods items from parent app with closure, _\<[GoodsComplete](reference.md#goodscomplete)>_;
- `goodItemSelected(_ item: <Any>, with storyType: <StoriesType>, storyView: <StoryView>?)` - selected goods item in widget, with object sended in `getGoodsObject(...)`

### Migration

To replace the old delegates methods, you need to do the following:

1. Add `InAppStoryDelegate` implementation;
2. Transfer implementation of old methods to new ones;
3. If you have used several implementations in the same class and they performed different actions, you must separate them using the `storyType` parameter.
4. Change method and parameter calls to set the delegate:
   - for `storyView`, parameter `delegate` renamed to `storiesDelegate`;
   - for showng single story, method `showSingleStory(...)` renamed to `showSingle(...)`;
   - for showing onboarding, method `showOnboarding(...)` renamed to `showOnboardings(...)`;
5. If you got the data for the iOS widget from the _StoryViewDelegate_ method `storyViewUpdated(...)`, you can get it from `InAppStory.shared.widgetStories` after calling `storiesDidUpdated(...)` with _storyType == .list_ or via `InAppStory.shared.getWidgetStories(complete: (Array<WidgetStory>?) -> Void)`;
6. Remove implementation of old methods and calls;

> **Attention!**

In version 1.9.0, the ability to open a story by a link has been added. If a story is opened from the list and a new story is in the same list too, it (a new story) will be open in the same reader. Otherwise, a new reader with a single story will be opened. Also, when opening stories using a link from _SingleReader_ or _Onboarding_, a new reader will be opened.

If you use the new `InAppStoryDelegate` protocol, the delegate methods with the appropriate _StoriesType_ will be called.
If you are using old protocols, you need to make sure that the classes that implement _StoryViewDelegate_ and _OnboardingDelegate_ also implement the _SingleStoryDelegate_ functionality. Otherwise, when opening a new _SingleReader_, you will not be able to call the corresponding methods.

## Migration to InAppStoryDelegate (SDK v1.9.0)

In SDK v1.9.0, delegate protocols are merged into a common protocol `InAppStoryDelegate`. The old implementation of the protocols will be available until v1.11.0, after this update, you will need to switch to using the `InAppStoryDelegate` protocol.

### InAppStoryDelegate

The protocol combines the methods of all three old implementations. The _\<[StoriesType](reference.md#storiestype)>_ parameter has been added to distinguish the source of a method call.  
Some of the methods have become optional and do not need to be implemented.

- `storiesDidUpdated(isContent: Bool, from storyType: StoriesType)` - called after the contents are updated for sories type _\<[StoriesType](reference.md#storiestype)>_;
- `storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType)` - called after a link is received from stories with the interaction type _\<[ActionType](reference.md#actiontype)>_ and _\<[StoriesType](reference.md#storiestype)>_;
- `storyReaderWillShow(with storyType: StoriesType)` - called before the reader will show _(optional)_;
- `storyReaderDidClose(with storyType: StoriesType)` - called after closing the story reader _(optional)_;
- `favoriteCellDidSelect()` - called when the favorite cell has been selected _(optional)_;

### Migration

To replace the old delegates methods, you need to do the following:

1. Add `InAppStoryDelegate` implementation;
2. Transfer implementation of old methods to new ones;
3. If you have used several implementations in the same class and they performed different actions, you must separate them using the `storyType` parameter.
4. Change method and parameter calls to set the delegate:
   - for `storyView`, parameter `delegate` renamed to `storiesDelegate`;
   - for showng single story, method `showSingleStory(...)` renamed to `showSingle(...)`;
   - for showing onboarding, method `showOnboarding(...)` renamed to `showOnboardings(...)`;
5. If you got the data for the iOS widget from the _StoryViewDelegate_ method `storyViewUpdated(...)`, you can get it from `InAppStory.shared.widgetStories` after calling `storiesDidUpdated(...)` with _storyType == .list_ or via `InAppStory.shared.getWidgetStories(complete: (Array<WidgetStory>?) -> Void)`;
6. Remove implementation of old methods and calls;

> **Attention!**

In version 1.9.0, the ability to open a story by a link has been added. If a story is opened from the list and a new story is in the same list too, it (a new story) will be open in the same reader. Otherwise, a new reader with a single story will be opened. Also, when opening stories using a link from _SingleReader_ or _Onboarding_, a new reader will be opened.

If you use the new `InAppStoryDelegate` protocol, the delegate methods with the appropriate _StoriesType_ will be called.
If you are using old protocols, you need to make sure that the classes that implement _StoryViewDelegate_ and _OnboardingDelegate_ also implement the _SingleStoryDelegate_ functionality. Otherwise, when opening a new _SingleReader_, you will not be able to call the corresponding methods.
