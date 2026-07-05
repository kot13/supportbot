# Changelog

## 0.7.12

### Fixed

- Fixed refresh on BannerPlace widget in iOS devices

### Changed

- Updated iOS SDK to 1.27.10

## 0.7.11

### Fixed

- fixed the SwipeUP widget blocking

### Changed

- Updated Android SDK to 1.24.6
- Updated iOS SDK to 1.27.9

## 0.7.10

### Added

- Changing the `feedId` in the story list causes the feed to reload
- Added ability to change nav bar color in android

### Fixed

- Vertical scrolling on banners blocked scrolling in ScrollView widgets(SingleChildScrollView,
  ListView, etc.)

## 0.7.9

### Fixed

- Fixed build error on iOS arm64 emulators

## 0.7.8

### Added

- Added CallToAction callback in InAppStoryManager

### Fixed

- Banner clicks do not trigger the CallToAction callback
- Enabling anonymous mode causes the application to crash on iOS devices

### Changed

- Updated iOS and Android native SDK

## 0.7.7

### Added

- Story reader scroll and presentation style

### Changed

- Updated Android SDK to 1.24.2
- Updated iOS SDK to 1.27.7

### Fixed

- BannerPlace stability improvements

## 0.7.6

### Changed

- Updated iOS SDK to 1.27.5

## 0.7.5

### Fixed

- Onboardings on Android running in new activity
- Build error on iOS devices

## 0.7.4

### Fixed

- Games on Android running in new activity
- Game events do not trigger a call to action (CTA)

## 0.7.3

### Fixed

- BannerPlace stability improvements

### Changed

- Updated Android native SDK to 1.24.1
- Updated iOS native SDK to 1.27.4

## 0.7.2

### Fixed

- BannerPlace stability improvements on Android

## 0.7.1

### Added

- Feature to show multiple/same stories feed in one screen

### Changed

- `IASGameReaderCallback` method `finishGame` is now `Deprecated`, please use `closeGame` callback
- Updated iOS native SDK to 1.26.7
- Updated Android native SDK to 1.22.5

### Fixed

- Issue on android 12 and lower devices, when using back navigation in in-app-messages. Please
  see [migration guide](migrations.md#from-070-to-071)
- After switching between applications or opening the built-in browser, banners may disappear
- Enable audio mixing for video previews in story list

### Removed

- Removed legacy `getStoriesWidgets()` and `getFavoritesStoriesWidgets()` methods from `InAppStoryPlugin` class

## 0.7.0

### Added

- [Checkout](checkout.md) feature
- BannerPlace now supports multiple banner places in one screen

### Fixed

- Gestures on banners don't work, if the scrollable view is a parent element
- Changing the banner placeId didn't reload the BannerPlace widget
- Adding stories to favorites doesn't work on iOS devices in some cases
- Fixed a crash when using anonymous mode and banners on iOS devices.

### Changed

- Added more info and support multiple banner places in the `IASBannerPlaceCallback` mixin
- `IASGameReaderCallback` instead of old `GameReaderCallbackFlutterApi`
- Updated iOS SDK to 1.26.3

## 0.6.1

### Added

- [Options](options.md) feature
- [Banners](banners.md) feature
- Added `onBannerPlacePreloadedError` callback

### Changed

- Updated Android SDK to 1.22.0
- Updated iOS SDK to 1.26.0
- Changed `onBannerPlacePreloaded` callback

## 0.5.5

### Fixed

- Scrolling to stories in feed in android devices has visual bugs

## 0.5.4

### Added

- Added custom logger

### Changed

- Updated Android SDK, that includes internal fixes

## 0.5.2

### Changed

- The way to scroll to the last viewed story

## 0.5.1

### Added

- Added various options to `FeedStoryDecorator` to customize the transition to recently opened
  stories

### Fixed

- Visual bug when jumping to last viewed story after closing story reader

## 0.5.0

### Added

- User sign feature
- User logout method
- Ability to change cache size on Android devices
- Anonymous mode
- Ability to change user settings

### Changed

- User change method, now it has an optional `userSign` parameter

### Fixed

- Issue when user can't close IAM by pressing back button or using back gesture on Android devices

## 0.4.1

### Fixed

- Refactoring of ios story reader events logic

## 0.4.0

### Added

- Sound control in story reader
- Custom icon appearance
- Ability to change cover quality in stories list
- Goods v1

### Changed

- `AppearanceManager` is now singleton class, see [migration guide](migrations.md#from-034036-to-040) for more details
- `CallToAction` callback is now a mixin class
- Updated Android SDK to 1.21.16, that includes internal fixes
- Updated iOS SDK to 1.25.13, that includes internal fixes, make sure you run `pod install` or
  `pod install --repo update` command before building your app
- Changed Favorites logic implementation
- Various internal fixes

### Fixed

- Fixed issue when items weren't updated in grid favorites widget
- Bug with clearing cache on Android devices
- Issue with inability to close in-app-message using system back button on Android devices

## 0.4.0-rc.4

### Fixed

- Changed 'favorites' logic implementation

## 0.4.0-rc.3

### Fixed

- Goods v1 implementation on Android
- Fixed issue when items not updated in grid favorites widget

## 0.4.0-rc.2

### Changed

- Updated Android SDK to 1.21.13
- Updated iOS SDK to 1.25.10

## 0.4.0-rc.1

### Added

- Sound control in story reader
- Custom icon appearance

### Changed

- AppearanceManager is now singleton class, see a [migration guide](migrations.md#from-034036-to-040)
- CallToAction callback is now mixin class
- Updated Android SDK to 1.21.11, that includes internal fixes
- Updated iOS SDK to 1.25.9, that includes internal fixes, make sure you run `pod install` or
  `pod install --repo update` command before building your app
- Various internal fixes

## 0.3.9

### Fixed

- Issue with sending game statistics from Android

## 0.3.8

### Fixed

- Issue with `onCloseStory` callback always returning `0` index in `SlideData` on android devices

## 0.3.7

### Changed

- Updated Android SDK to 1.21.13, that includes internal fixes

## 0.3.6

### Changed

- Updated Android SDK to 1.21.10, that includes internal fixes
- Updated iOS SDK to 1.25.8, that includes internal fixes, make sure you run `pod install` or
  `pod install --repo update` command before building your app

## 0.3.5

### Changed

- Updated Android SDK to 1.21.7, that includes internal fixes
- Updated iOS SDK to 1.25.6, that includes internal fixes, make sure you run `pod install` or
  `pod install --repo update` command before building your app

## 0.3.4

### Added

- Added optional parameter `locale` to initialization method
- Added method to change locale in `InAppStoryManager`

### Changed

- Refactor `InAppStoryManager`, now you need to call `InAppStoryManager.instance` to access methods

## 0.3.3

### Added

- Added `clearCache()` method in `InAppStoryManager`
- Added `storiesLoaded()` callback in `FeedStoriesWidget` and `FavoritesStoriesWidget`, that allows listen when stories
  in a list are loaded

### Changed

- Updated Android SDK to 1.21.6, that includes internal fixes
- Updated iOS SDK to 1.25.5, that includes internal fixes

## 0.3.2

### Fixed

- Internal fixes

## 0.3.1

### Fixed

- Fixed flickering video covers

## 0.3.0

### Added

- Added `FeedStoriesWidget`, `FavoritesStoriesWidget`, `StoryContentWidget` widgets
- Added video support for `FeedStoriesWidget` and `FavoritesStoriesWidget`
- Added border around stories in `FeedStoryDecorator`, that indicates the story has been opened
- Added `InAppMessages` feature, see documentation [here](in-app-messaging.md)
- Added `storiesLoaded` callback in `FeedStoriesWidget` and `FavoritesStoriesWidget` to listen when stories are loaded'

### Changed

- Changed Android initialization to `InAppStoryPlugin.initSDK(this)` in `Application` class.
  See [how to get started](how-to-get-started.md#android-requirements) Android section for details
- `loaderBuilder` and `errorBuilder` parameters are now optional in `FeedStoriesWidget` widget
- `InAppStoryPlugin().getStoriesWidgets()` is deprecated, use `FeedStoriesWidget` instead
- `InAppStoryPlugin().getFavoritesStoriesWidgets()` is deprecated, use `FavoritesStoriesWidget` instead

### Fixed

- Fixed build error when android gradle plugin can't find main class path
- Fixed build error in iOS
- Fixed 'flickering' stories when an uploaded image replaced a placeholder

## 0.3.0-rc.5

### Fixed

- Fixed build error in iOS

## 0.3.0-rc.4

### Changed

- Changed Android initialization to `InAppStoryPlugin.initSDK(this)` in `Application` class.
  See [how to get started](how-to-get-started.md#android-requirements) Android section for details

### Fixed

- Fixed build error when android gradle plugin can't find main class path

## 0.3.0-rc.3

### Added

- Added border around stories in `FeedStoryDecorator`, that indicates the story has been opened

## 0.3.0-rc.2

### Added

- Added `InAppMessages` feature, see documentation [here](in-app-messaging.md)

### Changed

- `loaderBuilder` and `errorBuilder` parameters are now optional in `FeedStoriesWidget` widget

## 0.3.0-rc.1

### Added

- Added `FeedStoriesWidget`, `FavoritesStoriesWidget`, `StoryContentWidget` widgets
- Added video support for `FeedStoriesWidget` and `FavoritesStoriesWidget`

### Changed

- `InAppStoryPlugin().getStoriesWidgets()` is deprecated, use `FeedStoriesWidget` instead
- `InAppStoryPlugin().getFavoritesStoriesWidgets()` is deprecated, use `FavoritesStoriesWidget` instead
- refactor library structure

### Fixed

- Fixed 'flickering' stories when an uploaded image replaced a placeholder

## 0.2.3

### Added

- Updated Android SDK to 1.21.4
- Updated iOS SDK to 1.25.4, make sure you run `pod install --repo-update` in the `ios` folder of
  your Flutter project.

### Fixed

- Like/Dislike buttons are not working in Android devices
- Placeholders in story feed are not working in iOS devices
- Fixed image caching issues in iOS devices

## 0.2.2

### Added

- Added new callbacks for listening story reader events

### Changed

- Moved `IASCallBacksFlutterApi` code to `IASCallbacks` mixin class

## 0.2.0

### Added

- Added the ability to set the status bar to transparent for the story reader.
- Updated Android SDK to 1.21.2
- Updated iOS SDK to 1.25.2, make sure you run `pod install --repo-update` in the `ios` folder of your Flutter project.
- Added the ability to launch games
- FeedStoriesController to force reload the feed stories

### Changed

- Renamed `IShowStoryOnceCallbackFlutterApi` to `IShowStoryCallbackFlutterApi`
- Initializing Android native SDK, please watch README for details
- OnboardingLoadCallbackFlutterApi now has `onboardingLoadSuccess(int count, String feed)` and
  `onboardingLoadError(String feed, String? reason)` methods
- SingleLoadCallbackFlutterApi now has `singleLoadSuccess(StoryDataDto storyData)` and
  `singleLoadError(String feed, String? reason)` methods

### Removed

- Removed `loadOnboardingError()`, `loadSingleError()`, `readerError()` callbacks from ErrorCallbackFlutterApi

### Fixed

- Fixed a crash when calling `AppearanceManagerHostApi().setClosePosition(position)` in iOS devices
- Fixed a issue where cover images were lost after refreshing the story feed.

## 0.0.18

### Added

- InAppStoryManagerHostApi.closeReaders() close all readers

## 0.0.17

### Changed

- IASSingleStoryHostApi storyId now `String show({required String storyId})`
- IASSingleStoryHostApi storyId now `String showOnce({required String storyId})`
- Android IASSingleStory opened with Activity Context

### Removed

- Removed slide argument `IASSingleStoryHostApi.show()`

## 0.0.16

### Fixed

- Open Android story reader with Activity Context (Application Context leads to new Task)
