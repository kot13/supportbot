# Stack Feed

Stack Feed is a feature that represents a virtual stack of stories that are placed on top of each other and displayed on the screen. This stack contains the last unread story of the user. When a story becomes read, the first unread story after it is automatically added to the top of the stack, and older stories are pushed down. This handy tool allows users to easily keep track of the latest updates and move on to the next story with minimal effort.

A full working example with the UI representation of StackFeed, can be seen in [Example project](https://github.com/inappstory/iOS-Example/tree/SDK-1.23.0-RC/InAppStoryExample/Examples/Stackfeed).

## Public objects

The following public objects are used to work with StackFeed:

- `StackFeedResult` - the result of the query behind the list of stories to display in the UI view.

```swift
typealias StackFeedResult = Result<StackFeedObject?, Error>
```

- `StackFeedCover` - data for building the "top story" (cover) of StackFeed.
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

- `StackFeedObject` - story list data, used to display StackFeed, as well as to open StoryReader.
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
    var storyData: Array<StoryData> /// a list of stories in the feed
    var currentIndex: Int /// top story index
}
```

- `StoryData` - the story data on the list.
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

## Initialize

To use StackFeed, you must initialize the InAppStory library in the project.

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    /// library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    /// settings can be set at any time, the main thing is that they should be set
    /// before the first use of InAppStory
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    return true
}
```

In the controller where you want to display StackFeed call `InAppStory.shared.getStackFeed(feed:complete:)` to get data about the list of stories and data for rendering the "top story". The retrieved data can be saved before the StackFeed UI view is created, or immediately set to the view if it has already been created.

#### StackfeedController.swift

```swift
class StackfeedController: UIViewController {
    /// Stack feed view, since InAppStorySDK only presents data, it is necessary to implement a UI view.
    fileprivate var stackView: StackView!
    /// Stack feed data object received from SDK
    fileprivate var stackFeed: StackFeedObject? {
        didSet {
            if stackView != nil {
                stackView.updateFeed(newStackFeed: stackFeed!)
            }
        }
    }
}

...

extension StackfeedController {
    /// Configuring InAppStory before use
    fileprivate func setupInAppStory() {
        /// Receive object with data from SDK
        InAppStory.shared.getStackFeed { [weak self] result in
            guard let weakSelf = self else { return }

            switch result {
            case .success(let newStackFeed):
                /// if the result is successful, write the value of the local variable
                weakSelf.stackFeed = newStackFeed
                break
            case .failure(_):
                /// in case of an error, you can display a notification or do other actions
                break
            }
        }
    }
}
...
```

Next, you need to subscribe to updates of the list data and the data for rendering the "top story". The `stackFeedUpdate` closure will be called every time the read data of the story in the stack is updated, even if it is not the "top story".

#### StackfeedController.swift

```swift
...
extension StackfeedController {
    /// Configuring InAppStory before use
    fileprivate func setupInAppStory() {
        ...
        /// Adding closures called when an object with Stack feed data from SDK is updated.
        /// Called while opening stories, not necessarily from stack feed, all openings between feeds are synchronized
        InAppStory.shared.stackFeedUpdate = { [weak self] newStackFeed in
            guard let weakSelf = self else { return }
            /// write the value of the local variable
            weakSelf.stackFeed = newStackFeed
        }
    }
}
...
```

Also, to track the user's interaction with the reader and stories, you need to subscribe to events from the reader.

> **Pay attention**  
> When tracking user actions, in closures comes the parameter `StoriesType`, be careful, for StackFeed was not entered a new value and will come `StoriesType.list`.

#### StackfeedController.swift

```swift
...
extension StackfeedController {
    /// Configuring InAppStory before use
    fileprivate func setupInAppStory() {
        ...
        /// setting a closure on user action in stories
        InAppStory.shared.onActionWith = onActionWith
        /// setting the reader opening closure
        InAppStory.shared.storyReaderWillShow = storyReaderWillShow(_:)
        /// setting the reader closing closure
        InAppStory.shared.storyReaderDidClose = storyReaderDidClose(_:)
    }
}

extension StackfeedController {
    /// closure, called when a button or SwipeUp event is triggered in the reader
    func onActionWith(_ target: String, _ type: ActionType, _ storyType: StoriesType?) {
        if let url = URL(string: target) {
            UIApplication.shared.open(url)
        }
    }

    /// closure, is called each time the reader is opened
    func storyReaderWillShow(_ storyType: StoriesType) {
        print("Story reader will show")
    }

    /// is called each time the reader is closed
    func storyReaderDidClose(_ storyType: StoriesType) {
        print("Story reader did close")
    }
}
...
```

## Reader

In order to display the reader with stories for StackFeed it is necessary to call `InAppStory.shared.showStackReader` method to the parameters of which it is necessary to pass the data received in `getStackFeed` or `stackFeedUpdate` closures. If the reader can be displayed on the screen, the `showing` closure will be set to `true`.

> **Note**  
> If necessary, the StackReader can be closed from external code without waiting for internal logic or user actions to complete. To do this, call `InAppStory.shared.closeReader(complete: () -> Void)`, which will close the current reader and call `complete` closure when the animation is complete.

#### StackfeedController.swift

```swift
...
extension StackfeedController {
    /// Handling a click on the Stack feed view in the interface
    @objc func stackViewTouch(sender: UITapGestureRecognizer) {
        /// Check that there is Stack feed data obtained from `getStackFeed` or `stackFeedUpdate`
        guard let stackFeed = stackFeed else { return }

        /// Display Stack feed reader with data
        InAppStory.shared.showStackReader(with: stackFeed) { show in
            /// If all data matches, the reader will be shown and closure will return show == true.
        }
    }
}
```

Stories in the list may contain a link or a game, usually in such cases the story itself is hidden in the reader and the story reader will not be shown.

- In case the story contains a link, the closure `InAppStory.shared.onActionWith` will be called, passing the `target` parameter with the link to it.
- If the story contains a game, a GameReader with the game will be shown.

## Refresh

To update the StackFeed list, you need to call `getStackFeed` again and get new data on the list, to update the UI view. For example, this can be done by pressing a button.

#### StackfeedController.swift

```swift
...
extension StackfeedController {
    /// Processing of user change button pressing
    @objc func buttonAction(sender: UIButton!) {
        /// To update the data in Stack feed, getStackFeed must be called again.
        /// In this case, a new list will be obtained.
        InAppStory.shared.getStackFeed { [weak self] result in
            guard let weakSelf = self else { return }

            switch result {
            case .success(let newStackFeed):
                weakSelf.stackFeed = newStackFeed
                break
            case .failure(_):
                break
            }
        }
    }
}
```
