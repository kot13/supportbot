import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Likes, Share, Favorites

## Favorites

<Tabs>
<TabItem value="uikit" label="UIKit">

To display the favorites screen, you should wait for the StoryView to call the `favoriteCellDidSelect()` delegate method. After that, go to the screen with your favorite stories.

:::tip
"Favorites" are shared between all feeds. Adding a story to favorites in one feed will cause it to appear in favorites in all feeds.
:::

#### ViewController.swift

```swift
...

var storyView: StoryView!

override func viewDidLoad() {
    super.viewDidLoad()

    storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0)) //initialize StoryView
    storyView.storiesDelegate = self //set InAppStoryDelegate delegate

    view.addSubview(storyView) //add object to the view

    storyView.create() //running internal logic
}

// MARK: - StoryViewDelegate
// triggered when clicking on the favorites cell
func favoriteCellDidSelect()
{
    // example of displaying the favorites list screen
    // the favorites screen is displayed by the developer, and can be displayed in any way
    let storyBoard: UIStoryboard = UIStoryboard(name: "Main", bundle: nil)
    let favoritesController = storyBoard.instantiateViewController(withIdentifier: "FavoritesController")
    self.show(favoritesController, sender: self)
}
...
```

The favorites screen is created in the same way as the list of stories. `StoryView` with the parameter `favorite = true`.

#### FavoritesController.swift

```swift
class FavoritesController: UIViewController {

    var favoritesView: StoryView!

    override func viewDidLoad() {
        super.viewDidLoad()

        favoritesView = StoryView(frame: CGRect(x: 0.0, y: 100, width: 320, height: 160.0), favorite: true) //initialize StoryView
        favoritesView.target = self //reader display controller
        favoritesView.delegate = self //set StoryView delegate

        view.addSubview(favoritesView) //add object to the view

        favoritesView.create() //running internal logic
    }
}

extension FavoritesController: InAppStoryDelegate
{
    func storiesDidUpdated(isContent: Bool, from storyType: StoriesType) {
        //called when the data in the StoryView is updated
    }

    // called when a button or SwipeUp event is triggered in the reader
    func storyReader(actionWith target: String, for type: ActionType, from storyType: StoriesType) {
       if type == .swipe { // link obtained by swipeUP action
           if let url = URL(string: target) {
               let swipeContentController = SwipeContentController()
               // passing link to controller from WebView
               swipeContentController.linkURL = url

               if storyType == .list {
	               // opening the controller over of the reader
	               storyView.present(controller: swipeContentController)
               }
           }
       } else { // .button, .game, .deeplink
            // if the processed link leads to a screen in the application,
            // recommend to close the reader
            if let storyView = storyView {
	            storyView.closeReader {
	                // processing a link, for example, to follow it in safari
	                if let url = URL(string: target) {
	                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
	                }
	            }
            } else {
                InAppStory.shared.closeReader {
                    // processing a link, for example, to follow it in safari
	                if let url = URL(string: target) {
	                    UIApplication.shared.open(url, options: [:], completionHandler: nil)
	                }
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

To display the favorites screen, you should wait for the StoryView to call the `favoriteDidSelect` closure.

:::tip
"Favorites" are shared between all feeds. Adding a story to favorites in one feed will cause it to appear in favorites in all feeds.
:::

#### ContentView.swift

```swift
struct ContentView: View
{
    var body: some View {
        /// ...
        StoryListView()
            .favoriteDidSelect {
                showFavoriteView()
            }
            .frame(height: 120)
            .frame(maxWidth: .infinity)
        /// ...
    }

    func showFavoriteView() {
        /// switch to the screen with FavoritesView favorites
    }
}
```

The favorites screen is created in the same way as the list of stories. `StoryListView` with the parameter `favorite = true`.

#### FavoritesView.swift

```swift
struct FavoritesView: View {
    var body: some View {
        /// ...
        StoryListView(isFavorite: true)
            .onUpdate { isContent, storyType in
                /// the closure is called every time the content is updated
                /// if stories were deleted from favorites in the reader, then after closing the reader,
                /// the list of displayed stories will be updated and this closure will be called.
            }
            .onAction { target, type, storyType in
                /// handling user actions in stories, e.g.
                /// tapping buttons or activating the SwipeUP widget
            }
            .frame(height: 120)
            .frame(maxWidth: .infinity)
        /// ...
    }
}
```

</TabItem>
</Tabs>

### Removing favorites by ID

`InAppStory.shared.removeFromFavorite(with storyID: <String>)`

To remove a specific story from favorites, you need to call the `removeFromFavorite(with storyID: <String>)` method and specify the ID required for removal. You can get the story ID from the `StoryCellProtocol` cell in the `var storyID: String property! { get set }`. The request to delete stories is sent immediately after the method call and cannot be cancelled. To use the undo deletion function, you must first collect the ID of the story to be deleted and call the delete method for each through a loop.

### Removing all favorites

`InAppStory.shared.removeAllFavorites()`

To remove all favorite stories, call the `removeAllFavorites()`. This method also has no undo functionality.

### Customization

_Favorites_ button icon can be redefined and set to your own, more suitable for the design of the application. For button, you need to set icons for each state - _selected/unselected_. Icons can be of any format (recommended to use _.svg_). Size: _24ptx24pt_.

Icons are set via `InAppStory.shared`:

```swift
InAppStory.shared.favoriteImage = UIImage(named: "favorites")!
InAppStory.shared.favoriteSelectedImag = UIImage(named: "favorites_selected")!
```

:::tip
We advise to set the icons and settings for the appearance of the reader **before** initializing the lists or displaying onboardings and single stories.
:::

To customize the favorite cell, you need to configure its display through delegate methods, or redefine the entire cell. More details about cell customization are written [here](appearance#customfavoritecellswift).

> These settings only affect the `StoryView` instance to which they are assigned. Others will be set to _default_ values or taken from `InAppStory.shared.panelSettings` (if set)

## Like

The **"Like"** functionality allows you to track user reactions to stories. Likes are tied to a specific user ID, for which you need to specify it when initializing the library.  
To display _Like/Dislike_ buttons in the bottom panel of stories, you must specify the `like` parameter when initializing `PanelSettings`.

```swift
PanelSettings(like: true)
```

### Customization

_Like/Dislike_ button icons can be redefined and set to your own, more suitable for the design of the application. For each button, you need to set icons for each state - _selected/unselected_. Icons can be of any format (recommended to use _.svg_). Size: _24ptx24pt_.

Icons are set via `InAppStory.shared`:

```swift
InAppStory.shared.likeImage = UIImage(named: "like")!
InAppStory.shared.likeSelectedImage = UIImage(named: "like_selected")!
InAppStory.shared.dislikeImage = UIImage(named: "dislike")!
InAppStory.shared.dislikeSelectedImage = UIImage(named: "dislike_selected")!
```

:::tip
We advise to set the icons and settings for the appearance of the reader before initializing the lists or displaying onboardings and single stories.
:::

## Share

The **"Share"** functionality allows you to share links to a specific story or an image of this story (it is separately enabled in the console).  
To display _Share_ button in the bottom panel of stories, you must specify the `share` parameter when initializing `PanelSettings`.

```swift
PanelSettings(share: true)
```

### Customization

_Share_ button icon can be redefined and set to your own, more suitable for the design of the application. For button, you need to set icons for each state - _selected/unselected_. Icons can be of any format (recommended to use _.svg_). Size: _24ptx24pt_.

Icons are set via `InAppStory.shared`:

```swift
InAppStory.shared.shareImage = UIImage(named: "share")!
InAppStory.shared.shareSelectedImage = UIImage(named: "share_selected")!
```

> it is advisable to set the icons and settings for the appearance of the reader before initializing the lists or displaying onboardings and single stories

### Fully custom sharing (since 1.22.0)

Version 1.22.0 added the ability to display a custom "Share" window, for this in `InAppStory` added a closure `public var customShare: ((SharingObject, @escaping ((Bool) -> Void)) -> Void)? = nil`.

The `customShare` closure passes two parameters:

1. `SharingObject` - object containing data about what you want to share, link, pictures, text or data set in the console;
2. The closure about the completion, which should be called after the closing of the sharing and, if possible, to transfer to it the data, whether the sharing was done or the screen was just closed.

To display custom shaping, you need a definition for `InAppStory.shared.customShare` and after calling it, display your own "Share" controller using the `InAppStory.shared.present` method.

<details>
  <summary><b>Code example (SwiftUI)</b></summary>
  
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

#### SharingObject

An object containing information about what you want to share:

**Parameters**

- `text` - plain text _\<String?>_;
- `images` - image array _\<Array\<UIImage>?>_;
- `link` - link _\<String?>_;
- `payload` - custom data set in the console when creating the widget "Share _\<String?>_;

## PanelSettings

### Overview

In SDK version 1.15.1, a `PanelSettings` object has been added to work with displaying the bottom panel in a story with actions (like, favorites, share)

:::warning
The old variant with `likePanel`, `favoritePanel` and `sharePanel` of `InAppStory.shared` are currently available, but **will be removed** soon.
:::

To display the bottom panel with actions in stories, you must specify `InAppStory.shared.panelSettings` with the necessary display settings.

```swift
InAppStory.shared.panelSettings = PanelSettings(like: true, // enable like functional
                                                favorite: true, // enable favorites functional
                                                share: true) // enable share functional
```

Also, this parameter can be overridden for a specific feed, onboarding, or single story.
