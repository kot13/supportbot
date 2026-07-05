# InAppStory class

The main singleton class for managing data and customizing the display of lists and the reader.

## Initialization

Library Initialization is preferably carried out in `AppDelegate`:

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
	InAppStory.shared.initWith(serviceKey: <String>, testKey: <String>, settings: <Settings?>)
	return true
}
```

- `serviceKey` - service authorization key `<String>`;
- `testKey ` - test authorization key in the service `<String>`;
- `settings` - configuration object (_\<[Settings](reference.md#settings)>_ - _optional_).

> **Attention!**  
> If you pass _testKey_, then the library will display the stories only in the **"Moderation"** status.

## Methods

- `setTags(<Array<String>>)` - replacing all tags;
- `addTags(<Array<String>>)` - adding tags;
- `removeTags(<Array<String>>)` - remove tags;
- `getWidgetStories(complete: (Array<WidgetStory>?) -> Void)` - getting a list of stories for a widget;
- `showOnboardings(from target: <UIViewController>, delegate: <InAppStoryDelegate>, complete: @escaping (_ show: Boll) -> Void) -> CancellationToken?` - show onboarding reader, also see _\<[InAppStoryDelegate](reference.md#inappstorydelegate)>_
- `showStory(with id: <String>, from target: <UIViewController>, with panelSettings: <PanelSettings>? = nil, complete: @escaping (_ show: Bool) -> Void) -> CancellationToken?` - show single reader, also see _\<[InAppStoryDelegate](reference.md#inappstorydelegate)>_
- `showStoryOnce(with id: <String>, from target: <UIViewController>, with panelSettings: <PanelSettings>? = nil, complete: @escaping (_ show: Bool) -> Void) -> CancellationToken?` - show single reader with once story, also see _\<[InAppStoryDelegate](reference.md#inappstorydelegate)>_-
- `present(controller presentingViewController: <UIViewController>, for presentationStyle: <UIModalPresentationStyle> = .overCurrentContext, with transitionStyle: <UIModalTransitionStyle> = .coverVertical)` - serves for display of a custom controller over a story reader;
- `closeReader(complete: () -> Void)` - closing any story reader that showinng with a closure, `complete` is called after the reader is closed;
- `clearCache` - clear all cache of library;
- `removeFromFavorite(with storyID: <String>)` - remove story from favorites;
- `removeAllFavorites()` - remove all favorites stories;
- `preloadGames()` - starts preloading games in the background, for faster launch later on;

## Parameters and properties

- `isReaderOpen` - show that reader is open on screen or not _nil_ in _InAppStory.shared_
- `favoritesCount` - the number of favorite stories a user has;
- `isLoggingEnabled` - displaying requests to the server in the console;
- `isEditorShowing` - is editor current displaying; ([InAppStoryUGC](../../ugc-guides/ios-ugc.md))
- `placeholders` - personalization substitution list `Dictionary<String, String\>`;
- `imagesPlaceholders` - images personalization substitution list `Dictionary<String, String\>`;
- `widgetStories` - data for iOS widget;
- `sslPinningHashKeys` - hashs of public keys for SSL-Pinning `Array<String>?`;
- `appVersion` - is used to set the custom version of the application where *InAppStorySDK* is integrated;
- `appBuild` - used to set the custom build version of the application where *InAppStorySDK* is integrated;

## Customization

Customization of the appearance of the cells and the reader occurs through the singleton of the class `InAppStory.shared`:

### Goods widget

Look [here](widget-goods.md#parameters) for Goods Widget appearance parameters.

### List

Look [here](appearance.md#list-customization) for List appearance parameters.

### Reader

- `swipeToClose` - closing the reader by swipe `<Bool>`;
- `overScrollToClose` - closing the reader when scrolling through the last story `<Bool>`;
- `muted` - mute/unmute the sound in the story `<Bool>`; (_[Details](sound-control.md)_)
- `panelSettings` - displays the bottom bar (should be enabled in the console) `<PanelSettings>`; [Details](reference.md#panelsettings)

To learn about reader appearance parameters look [here](appearance.md#reader-customization)
