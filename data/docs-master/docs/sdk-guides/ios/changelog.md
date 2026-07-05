# Changelog

## 1.29.1 (4314)

- improved IAM cache detection logic for _sharedLayout_;
- improved scratch card widget behavior in IAM with _sharedLayout_;
- added additional complete closure calls when showing IAM during early interruption;
- added two optional fields, `messageType` and `event`, to `InAppMessageData` for IAM events.
- stability improvements;

## 1.29.0 (4306)

- data handling within the content has been updated
- the fetching of story, banner, and IAM lists has been optimized to reduce data traffic
- `isGameClose = true`, during the game-closing process;
- the logic of the` IASBannersView.create()` method has been updated;
- an optional `ignoreSafeArea` parameter has been added to the `inAppMessageContainer` IAM message display modifier for SwiftUI;
- stability improvements;

## 1.28.6 (4198)

- `isGameClose = true`, during the game-closing process;
- the logic of the `IASBannersView.create()` method has been updated;
- an optional `ignoreSafeArea` parameter has been added to the `inAppMessageContainer` IAM message display modifier for SwiftUI;
- stability improvements;

## 1.28.5 (4192)

- fixed swipeUP widget blocking if `InAppStory.shared.swipeToClose = false`;
- fixed memory leaks when processing images on iOS26;
- fixed the _"Synchronous URL loading … should not occur on this application's main thread"_ bug;
- fixed _WEBP-\_reader->initImage[0] failed err=-50_ in WKWebView;
- fixed _Error -17102 decompressing image — possibly corrupt_ in WKWebView;
- fixed the `closeStory` event contract: when calling the event,` isReaderOpen = false`;
- stability improvements;

## 1.28.4 (4184)

- batches games resources;
- fix plistupdate error;
- stability improvements;

## 1.28.3 (4178)

- `InAppStory.shared` changed to `let`;
- stability improvements;

## 1.28.2 (4176)

- refresh for banners always requests new data from the server;
- stability improvements;

## 1.28.1 (4162)

- improvements to IAM preload complete;
- optimization of energy consumption;
- added optional `complete` closure to `StoryView.create`;
- added optional `complete` closure to `StoryView.refresh`;
- stability improvements;

## 1.28.0 (4152)

- a new type of toast has been added to IAM;
- the IAM display logic has been updated (see the migration guide);
- the caching logic in games has been refined;
- the `BannerCacheManager` has been redesigned;
- banner performance on older devices has been optimized;
- stability improvements;

## 1.27.10 (4054)

- refresh for banners always requests new data from the server;
- stability improvements;

## 1.27.9 (4052)

- fixed the SwipeUP widget blocking when the `InAppStory.shared.swipeToClose` setting is disabled;
- stability improvements;

## 1.27.8 (4048)

- improvements to the complete closure in IAM preloading;
- stability improvements;

## 1.27.7 (4044)

- update `BannerCacheManager`;
- optimize banners for old devices;
- fix crash `timelineManager`;
- update SwipeUp widget;
- stability improvements;

## 1.27.6 (4034)

- fix crash `ProfilingManager.closeEven`;
- optimize games download;
- statistic optimize;
- stability improvements;

## 1.27.5 (4026)

- fixed checking of downloadable resources in games;
- stability improvements;

## 1.27.4 (4024)

- improvements for working with Flutter;
- fixes for `root.utility-qos` crashes;
- fixes for `CSPlaceholderView` crashes;
- fixes for `removeFromSuperview` crashes;
- optimization of banner handling;
- stability improvements;

## 1.27.3 (4016)

- stability improvements;

## 1.27.2 (4010)

- updated logic for loading and checking resources in games;
- restrictions on duplicate single story calls;
- added `placeID` field to banner events;
- stability improvements;

## 1.27.1 (4004)

- fix crash `taskHandler` - `Settings`;
- fix crash `Reachability`;
- fixed the vanishing of banners after unloading the list container from the user interface stack;
- stability improvements;

## 1.27.0 (4002)

- added the ability to cancel story display, onboarding, and IAM operations [more details](cancellation-of-actions.md)
- closure `gameComplete` is deprecated;
- remove `IASEvent.Game.finishGame` event. Use `IASEvent.Game.closeGame`;
- stability improvements;

## 1.26.9 (3916)

- updated logic for loading and checking resources in games;
- restrictions on duplicate single story calls;
- added `placeID` field to banner events;
- fixed crash in `IAMManager` (_com.inappstory.iam.tasks_);
- stability improvements;

## 1.26.8 (3912)

- fixed the logic for loading damaged resources in games;

## 1.26.7 (3910)

- fix crash `taskHandler` - `Settings`;
- fix crash `Reachability`;
- fixed the vanishing of banners after unloading the list container from the user interface stack;
- stability improvements;

## 1.26.6 (3904)

- stability improvements;

## 1.26.5 (3898)

- fix logic for one banner in place;

## 1.26.4 (3894)

- fix GameReader UI for iPhone 17 Pro Max;
- stability improvements;

## 1.26.3 (3890)

- stability improvements;

## 1.26.2 (3886)

- add public init method for `ProductCartOffer`;
- stability improvements;

## 1.26.1 (3882)

- add asymmetric inserts in banners;
- 2 optional parameters added to `IASBannersAppearance`:
  - `leadingInset`
  - `trailingInset`
- stability improvements;

## 1.26.0 (3876)

- Added support for Multi-slide IAM and improved IAM behavior.
- Improved video playback in stories cells: new `IASVideoPlayerLayer` based on `AVSampleBufferDisplayLayer`; [see example](appearance.md#custom-video-example).
- Optimized resource loading and memory management.
- Added shopping cart functionality for the products widget [more info](checkout.md#shopping-cart);
- Added banner widget [more info](banners.md);
- bug fix and stability improvements;

## 1.25.16 (3736)

- the distribution of queues when loading the game and its resources has been reworked;;
- stability improvements;

## 1.25.15 (3732)

- add video layer class `IASVideoPlayerLayer` [see example](appearance.md#custom-video-example);
- stability improvements;

## 1.25.14 (3726)

- Added anonymous mode, [more info](anonymous-mode.md);
- Added `options` parameter, [more info](options.md);
- stability improvements;

## 1.25.13 (3718)

- fixed a call closure when displaying IAM using the `showInAppMessageWith` method;
- fixed a crash when opening the game and changing `Settings` at the same time;
- stability improvements;

## 1.25.12 (3712)

- fixed session opening looping crash;
- fixed crash in `StoryView.create()`;
- fixed crash in `StoryView.refresh()`;
- stability improvements;

## 1.25.11 (3700)

- fixed crash when initializing and setting tags;
- fixed crash in `setupGame()`;
- stability improvements;

## 1.25.10 (3692)

- fixed default value of close button position to `.trailing`;
- stability improvements;

## 1.25.9 (3688)

- custom `UIView` implementation with `IconViewProtocol` for overriding icons in the SDK, [more info](appearance.md#iconviewprotocol);
- game preloading queue fix with game display by ID functionality;
- `URLSessionDelegate` crash fix implementation;
- action correction on `.tap` event in ShowStory when transitioning from the first slide of the previous story via tap;
- session reopening loop fix during network errors to prevent infinite session reopening;
- stability improvements;

## 1.25.8 (3664)

- fixed sending of `showSlide` event notification;

## 1.25.7 (3660)

- updated work with timelines;
- improved work with video when switching slides and stories;
- fixed display of InAppMessages on top of the entire content screen;
- stability improvements;

## 1.25.6 (3650)

- fix for resource updates in games;
- stability improvements;

## 1.25.5 (3638)

- using UIPasteboard to get data from the Copy widget;
- IAM gradient and transparent background;
- improved display of preloaded IAMs;
- disabling screen sleep timer when opening Story and Game Reader;
- fixed headers for storiesLoade event;
- redesigned interface direction (LTR/RTL), depending on the passed language in the Settings object;
- stability improvements;

## v1.25.4 (3610)

- fixes for FlutterSDK;

## v1.25.3 (3608)

- fixes for FlutterSDK;
- stability improvements;

## v1.25.2 (3604)

- stability improvements;

## v1.25.1 (3602)

- URLSession union for the whole SDK;
- stability improvements;

## v1.25.0 (3596)

- added InAppMessages functionality [more info](in-app-messaging.md#showing);
- added sign parameter in `Settings` object;
- added `logOut` method;
- added accelerometer support in GameReader;
- added .zip archive in games when refresh button is pressed;
- added tag filtering when setting by `"^[\\p{L}{L}_\\\d][\p{L}_\\d\\-]{0,49}$"` rule, [more info](tags.md);
- added failure events replacing assertionFailure when publishing;
- updated "Close" button positioning in games;
- calculate length of tag lists by their **URLEncoded**;
- fixed `fullScreen` mode on phones in games;
- fixes for `assetsManagerUpdate` crash;
- fixed webViewRequest crash when clearing data and changing user;
- fix `FFCacheManager.writeData` crash;
- fix haptic vibrations after minimizing application to background;

## v1.24.18 (3506)

- URLSession union for the whole SDK;
- stability improvements;

## v1.24.17 (3504)

- added ability to intercept SDK logging by external developer;
- fixed fullScreen mode on phones in games;
- added tag filtering when setting by `"^[\\p{L}_\\d][\p{L}_\\d][\p{L}_\\d\\-]{0,49}$"` rule;
- added failure events replacing `assertionFailure` when publishing;
- fix `FFCacheManager.writeData` crash;
- stability improvements;

## v1.24.16 (3490)

- added the ability to intercept logging;
- stability improvements;

## v1.24.15 (3482)

- fix video caching for cell list cover;

## v1.24.14 (3480)

- stability improvements;

## v1.24.13 (3476)

- fix crash assetsManagerUpdate;
- fixed the logic placeholders;
- fixed the logic of setting and updating placeholders;
- stability improvements;

## v1.24.12 (3466)

- add user id sign;
- stability improvements;

## v1.24.11 (3460)

- update reader radius logic;
- disallow displaying a game with an empty id;
- stability improvements;

## v1.24.10 (3458)

- update `reloadData` at lists;
- game reader now won't open if SDK is not initialized;
- stability improvements;

## v1.24.9 (3448)

- add custom `appVersion` and `appBuild` parameters to InAppStory class;
- stability improvements;

## v1.24.8 (3440)

- added the ability to set the visibility of the timeline from the console;
- added the ability to set the timeline color from the console;
- stability improvements;

## v1.24.7 (3426)

- fix runtime warnings at SwiftUI;
- fixes with the overlap of favorites in different lists;
- stability improvements;

## v1.24.6 (3414)

- fix **EXC_BREACKPOINT** at `didHighlightItemAt`;
- stability improvements;

## v1.24.5 (3410)

- added support for opening a game by button from another game;
- stability improvements;

## v1.24.4 (3406)

- fix crash with wrong game archive name;
- fix **EXC_BREACKPOINT** in `assetsManagerUpdate`;
- fix freeze after poweOff on the last story with `overScrollToClose`;
- stability improvements;

## v1.24.3 (3398)

- added closed story reader by button inside the story;
- fix `taskHandler` crash;
- VOD stories stability improvements;
- stability improvements;

## v1.24.2 (3376)

- update `gameComplete` event for displaying a single story;
- game preloading has been moved to a separate thread;
- stability improvements;

## v1.24.1 (3342)

- update lottie bridge;
- update prefab games;
- stability improvements;

## v1.24.0 (3334)

- preloading games after opening a session;
- forced preloading of games before session opening via the `InAppStory.shared.preloadGames()` method;
- support for lottie animations on the loading screen in games;
- preloading of bundles of resources for stories;
- VOD functions for large videos in stories;
- the minimum deployment target for the UIKit version of the library was raised to iOS 11.0.

## v1.23.10 (3252)

- added closed story reader by button inside the story;
- stability improvements;

## v1.23.9 (3248)

- fix `taskHandler` crash;
- stability improvements;

## v1.23.8 (3236)

- fix `performTaskQueue` crash;
- fix `refresh` crash;

- add `InAppStory.shared.cellBorderOpenedColor` parameter;

- stability improvements;

## v1.23.7 (3232)

- synchronized closing of _GameReader_;
- fixed duplicate call `complete` in `.closeReader`;
- fixed `payload` in _SlideData_;
- stability improvements;

## v1.23.6 (3228)

- stability improvements;

## v1.23.5 (3224)

- `InAppStory.shared.stackFeedUpdate` closure has been changed, in the new version, the `newStackObject` object is optional, similar to the `InAppStory.shared.getStackFeed(::)` closure;
- stability improvements;

## v1.23.4 (3220)

- fixed screen freeze after double closing the Story and Game reader;

## v1.23.3 (3216)

- added `lang` parameter to SDK settings;
- added `IASFilePicker` support for games, more info at [documentation](https://docs.inappstory.com/sdk-guides/ios/filepicker.md)
- stability improvements;

## v1.23.2 (3186)

- Cleaned up the logging handler for webView via JS, which did cause the WebKit to crash;
- Stability improvements;

## v1.23.1 (3184)

- Close reader if `refresh()` is called;
- Fixed `showStoryOnce` logic;
- Stability improvements;

## v1.23.0 (3180)

### Removed (unavailable)

:::warning
As of version 1.22.0, delegates have been **deprecated** and are no longer used as of version 1.23.0. To replace them, you must use the closures added to InAppStory and StoryView. A list of closures can be found in [changelog v1.22.0](#v1220-2920). In the next big update, delegates will be removed.

- `InAppStoryDelegate`
- `StoryViewDelegateFlowLayout`
- `GoodsDelegateFlowLayout`
  :::

### Deprecated

:::warning
Since version 1.23.0, notifications from _NotificationCenter_ have become **deprecated** and replaced by closures. At the moment, notifications are still working, but it is desirable to switch to closures soon. In the next big update, notifications via _NotificationCenter_ will be removed.
The list of notifications from the _NotificationCenter_ can be viewed in [notifications](notifications.md).  
The list of closures with events and descriptions of working with it can be seen in [events](events.md)
:::

Events can be tracked using closures:

- `InAppStory.shared.storiesEvent: ((_ event: IASEvent.Story) -> Void)` - events coming from stories and lists;
- `InAppStory.shared.gameEvent: ((_ event: IASEvent.Game) -> Void)` - events coming from the games;
- `InAppStory.shared.failureEvent: ((_ : IASEvent.Failure) -> Void)` - data and query processing errors;

**List of events**

```swift
enum IASEvent {
    enum Story {
        case storiesLoaded(feed: String? = nil, stories: Array<StoryData>)
        case ugcStoriesLoaded(stories: Array<StoryData>)

        case clickOnStory(storyData: StoryData)
        case showStory(storyData: StoryData, action: ShowStoryAction)
        case closeStory(slideData: SlideData, action: CloseStoryAction)
        case clickOnButton(slideData: SlideData, link: String)
        case showSlide(slideData: SlideData)
        case likeStory(slideData: SlideData, value: Bool)
        case dislikeStory(slideData: SlideData, value: Bool)
        case favoriteStory(slideData: SlideData, value: Bool)
        case clickOnShareStory(slideData: SlideData)
        case storyWidgetEvent(slideData: SlideData?, name: String, data: Dictionary<String, Any>?)
    }

    enum Game {
        case startGame(gameData: GameStoryData)
        case closeGame(gameData: GameStoryData)
        case finishGame(gameData: GameStoryData, result: Dictionary<String, Any>)
        case gameFailure(gameData: GameStoryData, message: String)
    }

    enum Failure {
        case sessionFailure(message: String)
        case storyFailure(message: String)
        case currentStoryFailure(message: String)
        case networkFailure(message: String)
        case requestFailure(message: String, statusCode: Int)
    }
}
```

### Updated

1. Updated the operation of the `InAppStory.shared.closeReader(complete: () -> Void)` method:

- If this method is called, all readers currently displayed on the screen (Stories and games) will be closed;
- when calling this method, if no reader is on the screen, the `complete` closure will still be called;

2. The logic of the game show method has been changed, if a game is already shown on the application screen, then calling `InAppStory.shared.openGame` again will not show the new game screen and the `complete` closure will take the value _false_.

### Added

#### InAppStory

Starting with version 1.23.0, when initializing InAppStorySDK, placeholders for texts and images can be set in the settings.

```swift
let IASSettings = Settings(userID: "<User-id>",
                           tags: ["tag_1",
                                  "tag_2",
                                  "tag_3",
                                  "tag_4"],
                           placeholders: ["key_1" : "value_1",
                                          "key_2" : "value_2",
                                          "key_3" : "value_3",],
                           imagesPlaceholders: ["img_key_1" : "url_value_1",
                                                "img_key_2" : "url_value_2",
                                                "img_key_3" : "url_value_3"])
InAppStory.shared.initWith(serviceKey: "<Setvice-Key>", settings: IASSettings)
```

:::warning[Attention!]
When changing placeholders via the InAppStory parameters `placeholders` and `imagesPlaceholders`, the values set in _Settings_ will be overwritten with a new list of keys and values.
:::

#### Disable device ID sending

Starting from SDK version 1.23.0, the parameter, `InAppStory.shared.isDeviceIDEnabled` has been added to disable the collection and sending of device UUIDs during requests.

:::warning[Attention!]
DeviceID in requests is used to replace UserID, so if the `isDeviceIDEnabled` parameter is turned off, SDK will not be able to send requests if UserID is not specified and will generate the `IASEvent.Failure.storyFailure(:)` event.
:::

#### Show story once

Starting with SDK version 1.23.0 we have added the ability to display a single story only once (similar to onboarding).

```swift
InAppStory.shared.showStoryOnce(with: "<storyID>",
                                from: self, // target from where the reader will be shown
                                delegate: self) // single story delegate
{ _ in
    // closure after showng reader
}
```

#### Game

1. Added 2 closures to keep track of the game showing on the screen:

```swift
/// is called before the game is shown on the screen
InAppStory.shared.gameReaderWillShow: <(() -> Void)?>
/// is called after the game closing animation is over
InAppStory.shared.gameReaderDidClose: <(() -> Void)?>
```

2. Also added a parameter by which you can track whether the game screen is currently shown on the application screen

```swift
InAppStory.shared.isGameOpen: <Bool>
```

3. Added an error notification if the game failed to download, unzip or run.

```swift
IASEvent.Game.gameFailure(gameData: GameStoryData, message: String)
```

#### StackFeed

Stack Feed is a feature that represents a virtual stack of stories that are placed on top of each other and displayed on the screen. This stack contains the last unread story of the user. When a story becomes read, the first unread story after it is automatically added to the top of the stack, and older stories are pushed down. This handy tool allows users to easily keep track of the latest updates and move on to the next story with minimal effort.

A full working example with the UI representation of StackFeed, can be seen in [Example project](https://github.com/inappstory/iOS-Example/tree/SDK-1.23.0-RC/InAppStoryExample/Examples/Stackfeed).

InAppStory, the `InAppStory.shared.getStackFeed(feed:complete:)` method for getting StackFeed has been added, as well as a closure for getting updates on list changes `InAppStory.shared.shared.stackFeedUpdate`.

For a full description of the changes and examples of use, see [Stack Feed](stack-feed.md)

#### Public Objects (Stack Feed)

The following objects have been added to make the new StackFeed functionality work:

1. `StackFeedResult` - the result of the query behind the list of stories to display in the UI view.

```swift
typealias StackFeedResult = Result<StackFeedObject?, Error>
```

2. `StackFeedCover` - data for building the "top story" (cover) of StackFeed.

- _feedCover_ - URL address of the default cover for the feed, used if the "top story" doesn't have a cover;
- _storyCover_ - URL address of the "top story" cover, used if there is no video cover;
- _videoCover_ - URL address of the cover video;
- _hasAudio_ - shows if there is an audio track inside the "top story", used to notify the user that an open story may have audio playing;
- _title_ - "top story" title;
- _titleColor_ - "top story" title color (customizable in the console);
- _backgroundColor_ - background color of the "top story" cover (configurable in the console), can be displayed if none of the covers is set;

```swift
struct StackFeedCover {
    var feedCover: URL?
    var storyCover: URL?
    var videoCover: URL?

    var hasAudio: Bool

    var title: String
    var titleColor: UIColor

    var backgroundColor: UIColor
}
```

3. `StackFeedObject` - story list data, used to display StackFeed, as well as to open StoryReader.

- _feed_ - the name of the story feed that was downloaded;
- _cover_ - object with data for cover design;
- _opened_ - stories opening data;
- _storyData_ - list of story data in the feed;
- _currentIndex_ - "top story" index;

```swift
struct StackFeedObject {
    var feed: String
    var cover: StackFeedCover?
    var opened: Array<Bool>
    var storyData: Array<StoryData>
    var currentIndex: Int
}
```

#### Public objects (Notifications)

New public objects have been added for the new notification functionality:

1. `StoryType` - object showing what type the story belongs to, if no UGC editor is used in the project, `.story` will always be sent.

```swift
enum StoryType: String {
    case story
    case storyUGC
}
```

2. `StorySource` - object showing in which reader the story was shown.

- _.single_ - is set when showing a single story by id;
- _.onboarding_ - is set up at the onboarding show;
- _.list_ - is set when displayed from the StoryView ribbon;
- _.favorite_ - is set when shown from the StoryView feed if the favorite parameter was specified;

```swift
enum StorySource: String {
    case single
    case onboarding
    case list
    case favorite
}
```

:::warning[Attention!]
`.list` and `.favorite` come from the StoryView list. Different values come depending on what type you specified when initializing the list.

```swift
 let storyView = StoryView()
 // or //
 let storyView = StoryView(favorite: true)
```

:::

3. `ShowStoryAction` - object showing how the story was opened in the reader

- _.open_ - is set when showing stories from a list, onboarding or single;
- _.tap_ - is set when showing stories by tapping on the previous story in the list;
- _.swipe_ - is set when showing stories by swiping from the previous story in the list;
- _.auto_ - is set during automatic timer flipping;
- _.custom_ - is set when showing a story from another story by pressing the button;

```swift
enum ShowStoryAction: String {
    case open
    case tap
    case swipe
    case auto
    case custom
}
```

4. `CloseStoryAction` - object showing how the story was closed in the reader.

- _.swipe_ - is set when closing the story by swiping down;
- _.click_ - is set when closing a story by pressing the "close" button;
- _.auto_ - is set when the reader closes automatically (when the timers expire);
- _.custom_ - is set when closing the reader by calling SDK method closeReader(:\_);

```swift
enum CloseStoryAction: String {
    case swipe
    case click
    case auto
    case custom
}
```

5. `StoryData` - the story data on the list.

- _id_ - id story;
- _title_ - story title;
- _tags_ - tags assigned to the story;
- _feed_ - the name of the feed to which the story belongs;
- _slidesCount_ - number of slides in a story;
- _type_ - story type (for StackFeed it will always be `.story`);
- _source_ - the source of the story display (for StackFeed it will always be `.list`);
- _payload_ - additional data that can be set in the console;

```swift
struct StoryData {
    var id: String?
    var title: String?
    var tags: Array<String>?
    var feed: String
    var slidesCount: Int
    var type: StoryType
    var source: StorySource
    var payload: Dictionary<String, String>?
}
```

6. `SlideData` - story slide data.

- _storyData_ - data about the story to which the slide belongs;
- _index_ - story slide index;
- _payload_ - additional data that can be set in the console;

```swift
struct SlideData {
    var storyData: StoryData?
    var index: Int
    var payload: Dictionary<String, Any>?
}
```

7. `GameStoryData` - game data.

- _slideData_ - data about the story slide from which the game was opened. If the game was opened via the `InAppStory.shared.openGame(...)` method, the data will be empty.
- _gameID_ - game instance id

```swift
struct GameStoryData {
    var slideData: SlideData?
    var gameID: String?
}
```

## v1.22.15 (3132)

### Fixes

- Close reader if `refresh()` is called;
- Fixed double close notification;
- Stability improvements;

## v1.22.14 (3130)

### Added

- Added parameter `InAppStory.share.isDeviceIDEnabled`;

### Fixes

- Fix crash from `prefab`;
- Stability improvements;

## v1.22.13 (3124)

### Fixes

- Added multiple input option to the Feedback widget;
- Fix crash from `startCacheComplete`;
- Fix crash from `showOnboardings`;
- Fix crash from `setupWebViewConstraints`;
- Stability improvements;

## v1.22.12 (3116)

### Fixes

- Fixed crash from `taskHandler`;
- Statistic update;
- Stability improvements;

## v1.22.11 (3112)

### Fixes

- Fixed conflict when deleting favorites on closing the reader and deleting all stories at the same time;
- Fixed an issue with context being pulled into the reader when showing the game;
- Updated the `InAppStory.shared.present` method to work correctly with _UIModalPresentationStyle_ `.popover,` `.formSheet` and `.pageSheet` (works only with iOS 13+);
- stability improvements;

## v1.22.10 (3098)

### Fixed

- The `onVisibleAreaUpdated` closure is triggered only if the `StoryView` is added to the screen or has not been removed from the screen;

## v1.22.9 (3094)

### Fixed

- Fixed _EXC_BREAKPOINT_ crash in `Reader.rebuild(with:)`

## v1.22.8 (3090)

### Fixed

- Fixed _EXC_BREAKPOINT_ crash in `CurrentStoryView.startCacheComplete(:)`

### Other changes

- Stability improvements;

## v1.22.7 (3086)

### Added

- Added `payload` to [StoryWidgetEvent](events.md#events-triggered-after-interacting-with-stories)

### Other changes

- Stability improvements;

## v1.22.6 (3082)

### Added

- Added _Start_, _Finish_ and _Close_ notification for games displayed via `openGame()`;
- Added optional parameter `from` for the `openGame` method;

```swift
openGame(with game: Game,
         from presentingViewController: UIViewController? = nil,
         notificationInfo: Dictionary<String, Any>? = nil,
         complete: ((_ opened: Bool) -> Void)? = nil)
```

If the from parameter is not specified, the game reader will try to identify the top controller in the application screen hierarchy itself and call `.present` from it. If the parameter is specified, the game display will be taken from the selected controller.

### Updated

- Modified of `InAppStory.present` method to display controller with _popoverPresentation_ for iPad;
- Refined for animation of displaying stories from the list with _.zoom_ type for iPad;

### Other changes

- Stability improvements;

## v1.22.5 (3064)

### Added

- Added PrivacyPolicy data file;

### Updated

- Updated the minimum required version of Xcode to 14.0.1 (14A400);

### Fixed

- Fix `storiesDidUpdated` feed label;
- Fix grate percents if headers data length not set;
- Fix favorite list closures;

## v1.22.4 (3052)

### Added

- The list of UGC stories has been added to the `UGCStoriesLoaded` notification;
- Added `ugcPayload` parameter to events from UGC list of stories;

### Updated

- Extended `StoryCellProtocol` with optional `setUGCPayload` method;
- Updated `.cube` animation (flipping through stories in reader);

### Other changes

- Fixed;
- Stability improvements;

## v1.22.3 (3010)

- Fixed;
- Stability improvements;

## v1.22.2 (2954)

- Fixed;
- Stability improvements;

### Added

#### Screening of cell mapping

- `collectVisibleAreaData(_ collect: ((_ collect: () -> Void) -> Void)) -> StoryListView` - collects information about shown stories, more at [Visible Update Sample](visible-update.md);

## v1.22.1 (2950)

- Fixed;
- Stability improvements;

### Added

#### Screening of cell mapping

- `onVisibleAreaUpdated: ((_ items: Array<VisibleStoryItem>) -> Void)?` - return the list of objects with Information about the shown stories, more at [Visible Update Sample](visible-update.md);
- `updateVisibleArea(_ update: @escaping ((_ update: @escaping () -> Void) -> Void)) -> StoryListView` - collects information about the stories shown and causes a closure `onVisibleAreaUpdated`, more at [Visible Update Sample](visible-update.md);

As of version 1.22.1, you can track the display of stories cells on the screen. `StoryListView` now has an `onVisibleAreaUpdated: ((_ items: Array<VisibleStoryItem>) -> Void)?` closure, which gives an array with data of displayed stories when executed. This closure works when the feed is scrolled.

Added `updateVisibleArea(...)` closure, giving a method that can be called to get the current stories displayed on the screen. It can be used to get data about the displayed stories, for example if the `StoryListView` is in a `ScrollView` and you need to understand which stories are displayed when scrolling vertically.

### VisibleStoryItem

#### Parameters

- `storyId` - id of the shown story `<Int>`
- `index` - index of the story in the list `<Int>`
- `title` - title of the story `<String?>`
- `feed` - the feed in which the story is located `<String>`
- `tags` - list of tags of stories `<Array<String>>`
- `slidesCount` - number of slides in the story `<Int>`
- `visiblePercents` - area shown on the screen from the stories cell in percent `<Double>`

More at [VisibleStoryItem](reference.md#visiblestoryitem)

<details>
  <summary><b>Code example</b></summary>
  
#### SwiftUIView.swift

```swift
import InAppStorySDK_SwiftUI

struct SwiftUIView: View {
    @State var updateVisibleArea: () -> Void = {}

    var body: some View {
        VStack {
            StoryListView()
                .onVisibleAreaUpdated { items in
                    // is called when the StoryView scroll is finally stopped
                    // from VisibleStoryItem you can get data about the stories that have been shown
                    // display percentage accumulates and in the final call the values for a story for the whole scroll time are given out
                }
                .updateVisibleArea { update in
                    self.updateVisibleArea = update
                }
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            Button {
                // call of the updateVisibleArea() method will start the logic of
                // calculating visible stories and upon its completion
                // the onVisibleAreaUpdated closure will be called.
                updateVisibleArea()
            } label: {
                Text("Update")
            }
        }
    }
}

```

</details>

:::tip
For a more detailed breakdown on how to use the `updateVisibleArea` functionality, see the [integration documentation](visible-update.md).
:::

### Refresh

Version 1.22.1 added the `refresh(...)` closure, which provides a method that can be used to call a list refresh.

This extension allows you to display a list of stories with a new feed without creating a new `StoryListView` instance. Also, you can update the list of tags in the feed without calling the `setTags(_ tags: Array<String>)` method.

The method is called when creating a stories list instance to pass the update closure.
With the help of this closure it is possible to refresh the list without changing the Binding variable refresh.

To handle a return closure, you must create a local variable `@State` and assign a refresh value to it in the method. Then, you can call the local closure from any method, for example, when you press a button.

<details>
  <summary><b>Code example</b></summary>

#### SwiftUIView.swift - new

```swift
import InAppStorySDK_SwiftUI

struct SwiftUIView: View {
    @State private var storiesRefresh: (_ feed: String?, _ tags: Array<String>?) -> Void = {_,_ in}

    var body: some View {
        VStack(spacing: 16) {
            StoryListView()
                .refresh { refresh in
                    storiesRefresh = refresh
                }
            Button {
                storiesRefresh("newFeed", ["newTag1", "newTag2"])
            } label: {
                Text("Refresh")
            }
        }
    }
}

```

</details>

## v1.22.0 (2920)

### Deprecated

- `InAppStoryDelegate`
- `StoryViewDelegateFlowLayout`
- `GoodsDelegateFlowLayout`

The library's delegate methods have been carried over as closures of the `InAppStory` class:

```swift
// InAppStoryDelegate closures
public var storiesDidUpdated: ((_ isContent: Bool, _ storyType: StoriesType) -> Void)? = nil
public var onActionWith: ((_ target: String, _ type: ActionType, _ storyType: StoriesType?) -> Void)? = nil

public var storyReaderWillShow: ((_ storyType: StoriesType) -> Void)? = nil
public var storyReaderDidClose: ((_ storyType: StoriesType) -> Void)? = nil

public var favoriteCellDidSelect: (() -> Void)? = nil

public var editorCellDidSelect: (() -> Void)? = nil

public var getGoodsObject: ((_ skus: Array<String>, _ complete: @escaping GoodsComplete) -> Void)? = nil
public var goodItemSelected: ((_ item: GoodsObjectProtocol, _ storyType: StoriesType?) -> Void)? = nil

// StoryViewDelegateFlowLayout closures
public var sizeForItem: (() -> CGSize)? = nil
public var insetForSection: (() -> UIEdgeInsets)? = nil
public var minimumLineSpacingForSection: (() -> CGFloat)? = nil
public var minimumInteritemSpacingForSection: (() -> CGFloat)? = nil

// GoodsDelegateFlowLayout closures
public var goodsSizeForItem: (() -> CGSize)? = nil
public var goodsInsetForSection: (() -> UIEdgeInsets)? = nil
public var goodsMinimumLineSpacingForSection: (() -> CGFloat)? = nil
```

Due to the transfer of logic from delegates to closures, the `StoryListView` and `StoryListUGCView` list interfaces were updated. Closures were removed from the initialization methods. The closures were moved to variables that can be called from an instance of the class.

<details>
  <summary><b>Example code</b></summary>
  
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

### Replaced

The methods displaying the controller over readers have been merged into one:

#### Remote Methods

```swift
StoryView.present(controller presentingViewController: UIViewController, with transitionStyle: UIModalTransitionStyle = .coverVertical)

StoryUGCView.present(controller presentingViewController: UIViewController, with transitionStyle: UIModalTransitionStyle = .coverVertical)

InAppStory.onboardingPresent(controller presentingViewController: UIViewController, with transitionStyle: UIModalTransitionStyle = .coverVertical)

InAppStory.singleStoryPresent(controller presentingViewController: UIViewController, with transitionStyle: UIModalTransitionStyle = .coverVertical)
```

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

### Added

#### Custom Sharing

Version 1.22.0 added the ability to display a custom "Share" window, for this in `InAppStory` added a closure `public var customShare: ((SharingObject, @escaping ((Bool) -> Void)) -> Void)? = nil`.

The `customShare` closure passes two parameters:

1. `SharingObject` - object containing data about what you want to share, link, pictures, text or data set in the console;

**SharingObject Parameters**

- `text` - plain text `<String?>`;
- `images` - image array `<Array\<UIImage>?>`;
- `link` - link `<String?>`;
- `payload` - custom data set in the console when creating the widget "Share `<String?>`;

2. the closure of the completion, which should be called after the closing of the sharing and, if possible, to transfer to it the data, whether the sharing was done or the screen was just closed;

To display custom shaping, you need a definition for `InAppStory.shared.customShare` and after calling it, display your own "Share" controller using the `InAppStory.shared.present` method.

<details>
  <summary><b>Code example</b></summary>
  
#### ContentView.swift

```swift
struct ContentView: View
{
 @State private var isStoryRefreshSelected: Bool = false

    var body: some View {
        VStack(alignment: .leading) {
            StoryListView(feed: "default",
                          refresh: $isStoryRefreshSelected)
                          .onAppear {
                          // tracing a call from the SDK closure about displaying the sharying
                          InAppStory.shared.customShare = { shareObject, complete in
                                  // create a custom share screen
                                  let newController = UIHostingController(rootView: ShareView(shareObject: shareObject, complete: complete, defaultComplete: { [weak self] in
                                      let weakSelf = self else { return }
                                      //call to show default screen will share
                                      weakSelf.defaultShareComplete(shareObject: shareObject, complete: complete)
                                  }))
                                  // transparent background for the custom sharing screen
                                  newController.view.backgroundColor = .clear
                                  // display the custom viewing screen
                                  InAppStory.shared.present(controller: newController, with: .crossDissolve)
                              }
                          }
            Spacer()
        }
    }

    // create and display the default sharing screen
    func defaultShareComplete(shareObject: SharingObject, complete: ((Bool) -> Void)? = nil) {
        var items = [Any]()
        // collection of data to be passed into UIActivityViewController
        if let text = shareObject.text {
            items.append(text)
        }

        if let url = shareObject.link {
            items.append(url)
        }

        if let images = shareObject.images, !
            for images in images {
                items.append(image)
            }
        }

        // create UIActivityViewController
        let activityViewController = UIActivityViewController(activityItems: items, applicationActivities: nil)
        // display UIActivityViewController on top of the reader
        InAppStory.shared.present(controller: activityViewController, with: .crossDissolve)

        // completion of the UIActivityViewController
        activityViewController.completionWithItemsHandler = { (activity, success, items, error) in
            if let completeSharing = complete {
                if success {
                    completeSharing(true) // the user tried to share
                } else {
                    completeSharing(false) // the user has closed the window
                }

                if error != nil {
                    completeSharing(false) // an error occurred
                }
            }
        }
    }
}
```

</details>
<br/>

#### Games

In version 1.22.0 we added the ability to open games not from stories. The `InAppStory.shared.openGame(...)` and `InAppStory.shared.closeGame()` methods were added for this functionality, as well as a closure to track game completion `InAppStory.shared.gameComplete`.

- `openGame(with game:<Game>, complete: ((_ opened: Bool) -> Void)? = nil)` - open game with `Game` object and closure indicating if game screen was opened;
- `closeGame()` - closing the game screen;
- `gameComplete: ((_ data: <String>, _ result: <Dictionary<String, Any>?>, _ url: <String?>) -> Void)` - the closure is called when the game is over;

1. `data` - data from the game, set in the console;
2. `result` - the results of the game session;
3. `url` - link for the transition (for example, deepLink, set in the console)

**Game object parameters** <br/>

- `id` - game id obtained from the console `<String?>`;

<details>
  <summary><b>Code example</b></summary>
  
#### ContentView
  
```swift
struct ContentView: View {
    var body: some View {
            VStack(alignment: .leading) {
                Button("Open game") {
                    // opening the game
                    InAppStory.shared.openGame(with: Game(id: "1")) { opened in
                        // if the game is not opened, a notification can be displayed for the user
                        if ! opened {
                            self.showErrorAlert()
                        }
                    }
                }
                Spacer()
            }
            .onAppear {
                InAppStory.shared.gameComplete = { data, results, url in
                    // do something with the data
                }
            }
        }
}
```

</details>

### Change of design

In version 1.22.0 changed the default values for some design elements.

**Stories**

- changed icons for the bottom Story card;
- changed stories closing icon;
- timer bars have rounded edges;
- the gradient shadow under the timers has become lighter;

**StoryList**

- The aspect ratio is taken from the console data and the cell size is counted automatically from the size of the list, unless the _FlowLayout_ delegate has been set or closures for the sizes have been overridden;
- default aspect ratio is square (1:1);
- the sound icon has been changed;

**Games**

- "Close" button position is drilled from `InAppStory.shared.closeButtonPosition`;
- icon for the close button is drilled from `InAppStory.shared.closeReaderImage`;

**UGC**

- Close button position is drilled from `InAppStory.shared.closeButtonPosition`;
- icon for the close button is drilled from `InAppStory.shared.closeReaderImage`;

### Goods

#### Added

- `goodsDimColor` - background color that covers the entire screen;
- `goodsSubstrateHeight` - height of the carpet pad under the list of goods, counted from the "close" button;
- `goodsCellImageBackgroundColor` - background color of the product image in the default cell;
- `goodsCellImageCornerRadius` - corner radius of the product image in the default cell;

#### Renamed

- `goodsCellDiscountTextColor` - renamed to `goodsCellOldPriceTextColor`;
- `goodCellDiscountFont` - renamed to `goodCellOldPriceFont`;

#### Unavailable

- `goodsCloseBackgroundColor` - Now, the background color of the close button is taken from InAppStory.shared.goodsSubstrateColor
- `refreshGoodsImage` - parameter is merged with `refreshImage`. To change the display of "refresh" button in goods, use - `refreshImage`.

### GoodObject

#### Renamed

- `discount` - renamed to `oldPrice`;

- `init(sku:title:subtitle:imageURL:price:discount:)` - renamed to `init(sku:title:subtitle:imageURL:price:oldPrice:)`;
