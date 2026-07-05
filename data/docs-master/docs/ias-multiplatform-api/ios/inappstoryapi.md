# InAppStoryAPI

`InAppStoryAPI` is the **main** class
in [`IAS IOS SDK`](/sdk-guides/ios/how-to-get-started.md) for external API usage. To get started, you need to import the SDK in a private SPI area named `IAS_API`.

```Swift
@_spi(IAS_API) import InAppStorySDK
```

To initialize the library you need to specify settings similar to the library initialization described in [documentation](sdk-guides/ios/how-to-get-started.md#library-initialization).

```Swift
InAppStoryAPI.shared.initWith(serviceKey: <api-key>, 
                              settings: Settings(userID: <userID>, 
                                                 tags: <tags array>))

```

Next, to work with the API, you need to refer to the `InAppStoryAPI` class singleton and its subclasses.


## Subclasses

All subclass instances called from `InAppStoryAPI` instance:

```Swift
let settingsAPI = InAppStoryAPI.shared.settingsAPI
```

* [`SettingsAPI`](ias-settings.md) - is used to set and modify tags and placeholders after SDK initialization;
* [`StoryListAPI`](ias-story-list.md) - is used for communication between list widgets
  and `IAS IOS SDK`;
* [`FavoritesAPI`](ias-favorites.md) - is used to remove stories from favorites with external way (
  f.e. by a button on a list widget's item);
* [`SingleStoryAPI`](ias-single-story.md) - is used to show story reader with a single story called
  by id;
* [`OnboardingsAPI`](ias-onboardings.md) - is used to load and show onboarding feed in story reader;
* [`InAppMessagesAPI`](ias-inappmessages.md) - is used to load and display InAppMessages;
* [`StackFeedAPI`](ias-stack-feed.md) - is used for communication between stack-feed widgets
  and `IAS IOS SDK`;
* [`GamesAPI`](ias-games.md) - is used to load and open games from Game center (by game's id);
* [`CallbacksAPI`](ias-callbacks.md) - is used to set callbacks (closures) for `IAS IOS SDK`