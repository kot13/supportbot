# Events (≥1.23.0)

To receive events from the SDK, it is necessary to subscribe to closures responsible for these events in the `InAppStory` class.

## Stories events

To receive events from the story list and readers (Single and Onboarding), you need to subscribe to trigger closures:

`InAppStory.shared.storiesEvent: ((_ event: IASEvent.Story) -> Void)`

### Events for loading the list of stories

- `IASEvent.Story.storiesLoaded(feed: String? = nil, stories: Array<StoryData>)` - the list of stories has loaded, `StoryView` is ready to work (fires every time the list is loaded, and also on refresh).
  - `feed` - story feed identifier;
  - `stories<Array<StoryData>>` - an array of `StoryData` containing a brief description of loaded stories;
- `IASEvent.Story.ugcStoriesLoaded(stories: Array<StoryData>)` - the list of UGC stories has loaded, `StoryUGCView` is ready to work (fires every time the list is loaded, and also on refresh).
  - `stories<Array<StoryData>>` - an array of `StoryData` containing a brief description of loaded stories;

### Events triggered after interacting with stories

Standard fields for all notification calls from story for `userInfo` are: `id`, `title`,`tags`, `slidesCount`, `feed`. If a user-created UGC feed is loaded, the `ugcPayload<String(JSON)>` field comes in addition.

- `IASEvent.Story.clickOnStory(storyData: StoryData)` - click on story in the list with additional parameters:
  - `storyData` - containing a brief description of the selected story;
- `IASEvent.Story.showStory(storyData: StoryData, action: ShowStoryAction)` - display of the story reader with additional parameters:
  - `storyData` - containing a brief description of the selected story;
  - `action` - how the story is shown;
- `IASEvent.Story.closeStory(slideData: SlideData, action: CloseStoryAction)` - closing story with additional parameters:
  - `slideData` - containing a brief description of the selected story slide;
  - `action` - closing action;
- `IASEvent.Story.clickOnButton(slideData: SlideData, link: String)` - click on the button in the story with additional parameters:
  - `slideData` - containing a brief description of the selected story slide;
  - `link` - string link;
- `IASEvent.Story.showSlide(slideData: SlideData)` - show slide with additional parameters:
  - `slideData` - containing a brief description of the selected story slide;
- `IASEvent.Story.likeStory(slideData: SlideData, value: Bool)` - story like with additional parameters:
  - `slideData` - containing a brief description of the selected story slide;
  - `value` - value of "like" position (`true` - is like, `false` - isn't like);
- `IASEvent.Story.dislikeStory(slideData: SlideData, value: Bool)` - story dislike with additional parameters:
  - `slideData` - containing a brief description of the selected story slide;
  - `value` - value of "dislike" position (`true` - is dislike, `false` - isn't dislike);
- `IASEvent.Story.favoriteStory(slideData: SlideData, value: Bool)` - adding story to favorites with additional parameters:
  - `slideData` - containing a brief description of the selected story slide;
  - `value` - value of "favorite" position (`true` - is favorite, `false` - isn't favorite);
- `IASEvent.Story.clickOnShareStory(slideData: SlideData)` - pushing the share button with additional parameters:
  - `slideData` - containing a brief description of the selected story slide;
- `IASEvent.Story.storyWidgetEvent(slideData: SlideData?, name: String, data: Dictionary<String, Any>?)` - action in widget with parameters:
  - `slideData` - containing a brief description of the selected story slide;
  - `name` - name of widget;
  - `data<Dictionary<String, Any>?>` - activated widget data, [detailed data fields](/glossarium/statistics/stories-widget-events.md);

#### Example

```Swift
InAppStory.shared.storiesEvent = { event in
    switch event {
    case .storiesLoaded(let feed, let stories):
        print("Stories loaded with feed: \(String(describing: feed))")
    case .clickOnStory(let storyData, let index):
        print("Click on story with data: \(storyData) at index: \(index)")
    case .showStory(let storyData, let action):
        print("Show story with data: \(storyData) by action: \(action)")
    case .closeStory(let slideData, let action):
        print("Close story with data: \(slideData) by action: \(action)")
    case .showSlide(let slideData):
        print("Show slide with data: \(slideData)")
    case .clickOnButton(let slideData, let link):
        print("Click on button with link: \(link) with data: \(slideData)")
    case .likeStory(let slideData, let value):
        print("Like story with value: \(value)")
    case .dislikeStory(let slideData, let value):
        print("Dislikes story with value: \(value)")
    case .favoriteStory(let slideData, let value):
        print("Favorite story with value: \(value)")
    case .clickOnShareStory(let slideData):
        print("Click on share story with data: \(slideData)")
    case .storyWidgetEvent(let slideData, let name, let data):
        print("Story widget event with name: \(name) and data: \(String(describing: data))")
    default:
        break
    }
}
```

## Games events

To receive events from games, you must subscribe to trigger closure:

`InAppStory.shared.gameEvent: ((_ event: IASEvent.Game) -> Void)`

- `IASEvent.Game.startGame(gameData: GameStoryData)` - opening the reader with a game with additional parameters:
  - `gameData ` - game data;
- `IASEvent.Game.closeGame(gameData: GameStoryData)` - closing the reader with a game with additional parameters:
  - `gameData ` - game data;
- `IASEvent.Game.eventGame(gameData: GameStoryData, name: String, payload: Dictionary<String, Any>)` - closure is called by a special call from the game:
  - `gameData ` - game data;
  - `name` - event name;
  - `payload` - the data description can be viewed [here](https://docs.inappstory.com/glossarium/statistics/game-events.md);
- `IASEvent.Game.gameFailure(gameData: GameStoryData, message: String)` - an error occurred while downloading, unpacking or launching the game;
  - `gameData` - game data;
  - `message` - a message to tell me what the error was;

#### Example

```Swift
InAppStory.shared.gameEvent = { event in
    switch event {
    case .startGame(let gameData):
        print("Start game with data: \(gameData)")
    case .eventGame(let gameData, let name, let payload):
        print("Game event with \(name), payload: \(payload) and data: \(gameData)")
    case .closeGame(let gameData):
        print("Close game with data: \(gameData)")
    case .gameFailure(let gameData, let message):
        print("Game failure with message: \(message) and data: \(gameData)")
    }
}
```

## Banners events

To receive events from banners, you must subscribe to trigger closure:

`InAppStory.shared.iasBannerEvent: ((_ event: IASEvent.IASBanner) -> Void)`

- `IASEvent.IASBanner.bannersLoaded(placeID: String? = nil)` - the list of banners has loaded, `IASBannersView` is ready to work (fires every time the list is loaded, and also on refresh). - `placeID ` - banners place identifier;
- `IASEvent.IASBanner.show(bannerData: IASBannerData)` - called when a banner is displayed on the screen.
  - `bannerData ` - containing a brief description of the selected banner;
- `IASEvent.IASBanner.preloaded(placeID: String, banners: Array<IASBannerData>)` - called when a banners is preloaded by place.
  - `placeID ` - banners place identifier;
  - `bannerData ` - containing a brief description of the selected banner;
- `IASEvent.IASBanner.widgetEvent(bannerData: IASBannerData, name: String, data: Dictionary<String, Any>?)`
  - `bannerData ` - containing a brief description of the selected banner;
    - `name` - name of widget;
    - `data<Dictionary<String, Any>?>` - activated widget data, [detailed data fields](/glossarium/statistics/stories-widget-events.md);

#### Example

```Swift
InAppStory.shared.iasBannerEvent = {
    switch $0 {
    case .bannersLoaded(let placeID):
        print("Banners loaded with place id: \(String(describing: placeID))")
    case .widgetEvent(let bannerData, let name, let data):
        print("Banner widget event with name: \(name) and data: \(String(describing: data))")
    @unknown default:
        print("default")
    }
}
```

## Errors

To receive error events, you must subscribe to closure triggering:

`InAppStory.shared.failureEvent: ((_ : IASEvent.Failure) -> Void)`

In error notifications, `userInfo` also comes in the form of a dictionary `["errorMessage": <Error_message_string>]`

- `IASEvent.Failure.sessionFailure(message: String)` - session error;  
  Reasons:
  - _session opening error;_
  - _authorization key was not specified correctly;_
  - _access is blocked;_
- `IASEvent.Failure.storyFailure(message: String)` - error in story;  
  Reasons:
  - _error loading stories list (onboarding/single/tape);_
  - _problems with decoding data from the server;_
- `IASEvent.Failure.currentStoryFailure(message: String)` - error when loading full story information;  
  Reasons:
  - _getting data for a specific story;_
  - _setting/deleting likes, favorites, sharings;_
- `IASEvent.Failure.networkFailure(message: String)` - network error;  
  Reasons:
  - _no internet connection;_
- `IASEvent.Failure.requestFailure(message: String, statusCode: Int)` - аn error occurred when requesting the server;  
  Reason:
  - _Failed to execute request;_
  - `statusCode` - the server returned a statuscode;

#### Example

```Swift
InAppStory.shared.failureEvent = { event in
    switch event {
    case .sessionFailure(let message):
        print("Session failure with message: \(message)")
    case .storyFailure(let message):
        print("Story failure with message: \(message)")
    case .currentStoryFailure(let message):
        print("CurrentStory failure with message: \(message)")
    case .inAppMessageFailure(let message):
        print("InAppMessage failure with message: \(message)")
    case .networkFailure(let message):
        print("Network failure with message: \(message)")
    case .requestFailure(let message, let statusCode):
        print("Request failure with message: \(message), status code: \(statusCode)")
    }
}
```

## Public objects

The following public objects are used to work with `IASEvent`:

- `StoryType` - object showing what type the story belongs to, if no UGC editor is used in the project, `.story` will always be sent.

```swift
enum StoryType: String {
    case story
    case storyUGC
}
```

- `StorySource` - object showing in which reader the story was shown.
  - _.single_ - is set when showing a single story by id;
  - _.onboarding_ - is set up at the onboarding show;
  - _.list_ - is set when displayed from the StoryView ribbon;
  - _.favorite_ - is set when shown from the StoryView feed if the favorite parameter was specified;

:::warning
`.list` and `.favorite` come from the StoryView list. Different values come depending on what type you specified at the moment of list initialization.

```swift
let storyView = StoryView()
// or //
let storyView = StoryView(favorite: true)
```

:::

```swift
enum StorySource: String {
    case single
    case onboarding
    case list
    case favorite
}
```

### ShowStoryAction

An object that shows how the story was opened in the reader

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

### CloseStoryAction

An object that shows how the story was closed in the reader.

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

### StoryData

Object that contains data of the story.

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

### SlideData

Story slide data.

- _storyData_ - data about the story to which the slide belongs;
- _index_ - story slide index;
- _payload_ - additional data that can be set in the console;

```swift
struct SlideData {
    var storyData: StoryData?
    var index: Int
    var payload: String?
}
```

### GameStoryData

- _slideData_ - data about the story slide from which the game was opened. If the game was opened via the `InAppStory.shared.openGame(...)` method, the data will be empty.
- _gameID_ - game instance id

```swift
struct GameStoryData {
    var slideData: SlideData?
    var gameID: String?
}
```
