---
toc_max_heading_level: 2
---

# Changelog

## 1.25.1 (1201)

### Updated

- shared layout for all content types

### Fixed

- unlockShareButton npe fix
- send w-link event for in banners with zero duration
- send IAM error callback if network unavailable
- clear cached asset urls in clearCache method

## 1.25.0 (1200)

### Added

- scratch cards support
- scroll view support

## 1.24.7 (1157)

### Fixed

- send w-link event for in banners with zero duration
- send IAM error callback if network unavailable

## 1.24.6 (1156)

### Fixed

- autoSlideEnd if duration == currentTime in stories UpdateTimeline
- IAM safeArea count timings
- empty widgetUID check

## 1.24.5 (1155)

### Fixed

- NPE in StoriesTabletActivity
- move In-App message callbacks and controller to ViewModel
- fixed readerOpenError scenarios
- replace ScheduledThreadPoolExecutor with looped threads

## 1.24.4 (1154)

### Fixed

- prevent unnecessary requests (widget auto-refresh) on session change

## 1.23.6 (1106)

### Fixed

- NPE in tablets (activity forceFinish call)

## 1.24.3 (1153)

### Updated

- extended game file check errors

### Fixed

- parallel resource loading with same urls
- game offsets calculation
- rtl for fragment mode

## 1.23.5 (1105)

### Fixed

- game offsets calculation
- rtl for fragment mode

## 1.24.2 (1152)

### Added

- custom container provider for In-app messages
- lifecycle controller for In-app message reader
- game launch restrictions (minimum WebView version) with user instructions
- supports layout direction in games

### Updated

- parallel resource loading for games
- sending game logs in case of loading error

### Fixed

- NPE in StoriesViewManager
- NPE in StoriesContentFragment
- Empty banners size

## 1.23.4 (1104)

### Fixed

- NPE in StoriesViewManager
- NPE in StoriesContentFragment
- Empty banners size

## 1.24.1 (1151)

### Fixed

- targeting in onboardings

## 1.23.3 (1103)

### Fixed

- targeting in onboardings

## 1.22.7 (1067)

### Fixed

- targeting in onboardings

## 1.24.0 (1150)

### Added

- new In-App message type support (toast messages)
- new `InAppMessageSlideData` model for `ShowInAppMessageSlideCallback`
- new method `messageType()` in `InAppMessageData` model

### Updated

- changed `ShowInAppMessageSlideCallback` callback signature

### Removed

- method `finishGame` was removed from `GameReaderCallback`

## 1.23.2 (1102)

### Fixed

- handle WebView inflate error (Android 16)
- in-app message id NPE

## 1.23.1 (1101)

### Updated

- updated game resources file path (added symlinks)

## 1.22.6 (1066)

### Updated

- updated game resources file path (added symlinks)

## 1.21.26 (1036)

### Updated

- updated game resources file path (added symlinks)

## 1.23.0 (1100)

### Added

- Cancellation of onboardings, single stories and In-App Messages

### Updated

- SDK logger work now is more consistent

## 1.22.5 (1065)

### Fixed

- showOnlyIfLoaded now works with multi-slide In-App Messages

## 1.22.4 (1064)

### Added

- added url field to shareData model

### Updated

- updated game resources file path (fixed bug with resource overriding)

### Fixed

- fixed path traversal vulnerability in WebViews
- fixed NPE in stories activities

## 1.21.25 (1035)

### Added

- added url field to shareData model

### Updated

- updated game resources file path (fixed bug with overrided resource)

### Fixed

- fixed path traversal vulnerability in WebViews
- fixed NPE in stories activities

## 1.21.24 (1034)

### Fixed

- NPE fix (getCurrentInAppMessageData)
- "tablet" dimension on foldable devices

## 1.22.3 (1063)

### Fixed

- NPE fix (getCurrentInAppMessageData)
- "tablet" dimension on foldable devices

## 1.22.2 (1062)

### Fixed

- fixed refresh session if another userId is cached
- fixed user and session synchronization

## 1.21.23 (1033)

### Fixed

- fixed statistic disabled with forceEnableStatisticV2 priorities
- fixed game logger
- fixed "tablet" dimension on locked foldable devices
- fixed refresh session if another userId is cached
- fixed user and session synchronization

## 1.22.1 (1061)

### Added

- added productCartInteractionCallback to external API

### Fixed

- fixed ClassCastException in banners (banner vertical list)
- fixed not attached GameReader context
- fixed tablet presentation on foldable devices
- fixed slide analytics encode for In-App Messages
- fixed game logger (clear cached old settings)
- fixed anonymous setting and forceEnableStatisticV2 flag priorities

## 1.22.0 (1060)

:::warning[Please note]
Android Gradle plugin minimum version was changed to 8.0.0 and now requires Java 17.
:::

### Added

- multi-slide InAppMessage support
- Products checkout support

### Updated

- renamed class `BannerPlace` to `BannerCarousel`
- renamed interface `ICustomBannerPlaceAppearance` to `ICustomBannerCarouselAppearance`
- renamed interface `BannerPlaceNavigationCallback` to `BannerCarouselNavigationCallback`
- renamed method `AppearanceManager.csBannerPlaceInterface`
  to `AppearanceManager.csBannerCarouselInterface`

## 1.21.22 (1032)

### Added

- added feed in updateStoriesData (external API)

### Fixed

- fixed viewModel NPE in IAMContentFragment

## 1.22.0-rc7 (1056)

### Added

- RTL in Banners

### Fixed

- `updateStateForAllRelatives` nullable place id
- synchronization in `BannerPlaceViewModelsHolder`
- Banners `viewPager` clear
- nullable subscriber in `reloadSubscriber`
- X-Device-ID header is no longer used with anonymous settings
- stories list default item sizes in case of `columnCount` usage

## 1.21.21 (1031)

### Fixed

- X-Device-ID header is no longer used with anonymous settings
- stories list default item sizes in case of `columnCount` usage

## 1.22.0-rc6 (1055)

### Updated

- Gradle updates to 7.3.0
- Update Banners logic

### Fixed

- NPE in Stories reader closing (id and timer)
- Bannerspass session parameters to update statistic

## 1.21.20 (1030)

### Fixed

- Fixed NPE in Stories reader closing (id and timer)
- Bannerspass session parameters to update statistic

## 1.22.0-rc5 (1054)

### Updated

- Update Banners logic

## 1.22.0-rc4 (1053)

### Fixed

- Fixed Banners duplicates in case of loading multiple different Banner carousels

## 1.22.0-rc3 (1052)

### Added

- Added options feature support
- Added anonymous mode feature support
- Extended disable close feature in stories (backpress)
- Added disable close feature in In-App messages

### Fixed

- Fixed banner callbacks
- Changed API requests
- Fixed In-App message callback data

## 1.21.19 (1029)

### Added

- Added anonymous mode
- Added `enableOnBackInvokedCallback` support

### Fixed

- Fixed `forceFinish` for story reader

## 1.21.18 (1028)

### Fixed

- Fix passing InAppMessageData to `ViewModel`

## 1.21.17 (1027)

### Fixed

- Fix backdrop for fullscreen IAMs
- Fix default loader color changes

## 1.21.16 (1026)

### Fixed

- fixed stories feed blink on reload

## 1.21.15 (1025)

### Added

- `readerIsClosed` event for IAMs
- more conditional error messages for IAMs
- check context in Games

## 1.21.14 (1024)

### Fixed

- concurrent access to tags
- NPE in stories reader

## 1.21.13 (1023)

### Fixed

- send statistic by default

## 1.21.12 (1022) //REMOVED

### Fixed

- move IASCore callbacks from synchronize blocks
- migrate touch pause to longPress pause

## 1.21.11 (1021) //REMOVED

### Added

- new method `csCustomIcons` in AppearanceManager (custom views for reader buttons)

### Updated

- methods `csCloseIcon`, `csRefreshIcon`, `csFavoriteIcon`, `csLikeIcon`, `csDislikeIcon`, `csShareIcon`, `csSoundIcon`
  were moved from local AppearanceManager instance to global

### Fixed

- In-app messages rendering

## 1.21.10 (1020)

### Fixed

- added StoriesList visible items (ShownStoriesListItem) synchronization

## 1.21.9 (1019)

### Fixed

- video frames blink
- timeline state change on slide change
- removed Locale.setDefault usage
- escaping single quotes in data

## 1.21.8 (1018)

### Fixed

- hotfix for JS slideTimerEnd

## 1.21.7 (1017)

### Updated

- Change copy widget logic
- Keep screen on for games

### Fixed

- Use old scheme for IAM backgrounds in case of incorrect model

## 1.21.6 (1016)

### Added

- Change RTL logic (lang-dependent)
- Android 16 backpress handling
- JS slideTimerEnd
- IAM transparent backgrounds
- IAM gradient backgrounds
- statistic and caches initialization in worker threads

## 1.21.5 (1015)

### Fixed

- RTL mode bugs (icons and timelines mirroring, close button offset)

## 1.21.4 (1014)

### Fixed

- like/dislike external API callbacks

## 1.21.3 (1013)

### Fixed

- tablet reader activity animation
- stories reader proportions count
- `ConcurrentModificationException`, copy tags list to temporary variable
- remove `showLoader` in `changeCurrentSlide`

### Updated

- free data form from JS send statistic event

## 1.21.2 (1012)

### Fixed

- stories statistic send

## 1.21.1 (1011) //REMOVED

### Updated

- draggable UX (stories reader)
- goods widget 2.0 preparations
- close readers in external API

### Fixed

- story and game reader intent NPE
- `StoriesList` adapter update thread

## 1.21.0 (1010) //REMOVED

### Added

- tags support for IAMs
- check game files after downloading

### Updated

- tags were removed from `StoryData`
- tags template checking
- re-download games on `refresh`
- game reader for Android 15 (offsets)
- delayed game logs

### Fixed

- close button position in IAM reader
- favorite cell (delete item sync)
- tags limit count
- borders for multiple lists
- AppTheme styles changed to StoriesSDKAppTheme
- StoriesList opened status
- IAM BottomSheet line appearance

## 1.21.0-rc6 (1005)

### Added

- `userSign` for external API initialization

### Fixed

- favorites cache
- favorite cell (delete item sync)

## 1.21.0-rc5 (1004)

### Added

- in-game accelerometer support
- backdrop support for `In-App Messages`

### Fixed

- memory leaks for sharing, orientation change and VibrateUtils
- problem with internal destroy method
- game loading and preloading same time

## 1.21.0-rc4 (1003)

### Added

- `InAppStoryManager.getInstance().userLogout` and `InAppStoryManager.getInstance().userSettings`
  methods
- passing event in `InAppMessageData`
- added limits and priority for `In-App Messages`
- tablet support for `In-App Messages` (all types)
- exceptions handling

### Updated

- method `destroy` was removed. Use `InAppStoryManager.getInstance().userLogout()` instead
- changed proportions for stories content (only safe area now used)
- removed nav bar and status bar color changes for Android 15
- stories reader for tablets now works through activity instead of fragment
- changed `loadStories` cache logic

### Fixed

- favorite cell item orders
- getStringSet
- onboarding crashes
- share usecases
- LeakedCloseableViolation

## 1.21.0-rc2 (1001)

### Added

- preloading `In-App Messages` by list of ids
- tablet support (popups only)

### Fixed

- default `In-App Messages` parameters
- image placeholders priority
- showOnlyIfLoaded for IAMs
- video slides for IAMs
- close IAM by closeStoryReader

## 1.21.0-rc1 (1000)

### Added

- new feature `In-App Messages` was added
- internal refactoring
  - part of undocumented code became private or was removed
  - AppearanceManager can be set only through setter (not as property)
  - error callback and single/onboarding callbacks were changed (now all errors about
    single/onboardings are in the corresponding callbacks)
  - non-context method in class `Sizes` were removed
  - `clearCachedList` was divided for `clearCachedListById`, `clearCachedListByFeed`
    and `clearCachedListByIdAndFeed`

## 1.20.13 (963)

### Fixed

- NPE in game reader intent variables

## 1.20.12 (962)

### Updated

- tags template checking

### Fixed

- borders for multiple lists
- AppTheme styles changed to StoriesSDKAppTheme
- multiple sharing leak
- tags limit count
- buttons panel memory leak
- stories list opens status

## 1.20.11 (961)

### Added

- userSign to external API initialization

## 1.20.10 (960)

### Fixed

- bug with game preloading

## 1.20.9 (959)

### Added

- game js exception logs

### Fixed

- LeakedCloseableViolation
- negative offset for timelines
- tablet outside click
- vibration bug

## 1.20.8 (958)

### Added

- user sign feature

## 1.20.7 (957)

### Fixed

- NPE in `setUserId`
- NPE in external API
- Disable overscroll for WebViews (slider widget bug)

## 1.20.6 (956)

### Fixed

- change game load status (if game loading wasn't successful)
- check if game fragment is attached before game rendering

## 1.20.5 (955)

### Updated

- check for ids (single stories, onboarding feeds and games)
- resumeTimers for webViews
- default radius for story reader

### Fixed

- csReaderBackgroundColor option usage on tablets

## 1.20.4 (954)

### Added

- external app version
- check if `webView` is installed

### Updated

- marked `csListItemTitleColor` as deprecated (will be removed in 1.21.x)
- pass session local parameters to requests
- encode userId in requests and configs

### Fixed

- bundle resources downloads (change keys)
- default video options header (emulator bug)
- sync around ScheduleThreadPoolExecutors
- `closeOnSwipe` option usage
- story opening in fragments (container visibility)
- game opening in fragments (from story)
- recreate session on `setUserId` if deviceId is disabled

## 1.20.3 (953)

### Added

- timeline color and visibility management from console

### Updated

- changed internal logic in slide model

## 1.20.2 (952)

### Added

- open a game from another game

### Fixed

- bundle resources downloads
- feed refresh doesn't cause clearing full stories models
- wrong thread forceFinish
- changePriority Story NPE

## 1.20.1 (951)

### Updated

- changed `ICustomGoodsWidget`'s `getSkus` and `onItemClick` signatures (extended with `widgetView`
  parameter)
- changed `ShareCallback`'s `onBackPress` [signature](migrations.md#to-120x) (extended
  with `widgetView` parameter)
- added `onDestroyView` in [ShareCallback](migrations.md#to-120x)
- updated font size and gap between list items (default settings)

## 1.19.8 (918)

### Fixed

- bundle resources downloads
- feed refresh doesn't cause clearing full stories models
- wrong thread forceFinish
- changePriority Story NPE

## 1.19.7 (917)

### Fixes

- partial fix for memory leaks in [share callbacks](favorites.md#share-custom-behavior)

### Added

- closing story reader from new widget

## 1.19.6 (916)

### Fixed

- dialog proportions and animation for tablets
- memory leak for tablets (inner classes)
- timeline blink

## 1.19.4 (914)

### Fixed

- changed story pause logic (added local pauses)
- prevent clicks and click handlers in slide-change time
- tablet memory leaks
- `InAppStoryManager` and `InAppStoryService` NPEs (Added initialized callbacks)

## 1.19.3 (913)

### Fixed

- removed long synchronization
- added additional checks in `StoriesActivity`
- unsubscribed from `ReaderPageFragment` to prevent memory leaks
- clearing unused items in favorite cell

## 1.19.2 (912)

### Updated

- restricted game reader opening if another instance was opened
- userId change with synchronization
- default story cell text break strategy

### Fixed

- sharing bugs
- InAppStoryManager initialization status check
- goods widget for tablets
- memory leak from timeline
- statistic for story navigation
- memory leak from timeline
- UGC cell ratio

## 1.19.1 (911)

- added logs for utils repository
- fixed sharing bugs
- fixed additional check utils repository
- fixed unfreezeUI
- fixed move reader page creation
- extended consumer-rules.pro

## 1.19.0 (910)

- check story id and index in statistic click events
- fixed timeline visibility
- fixed preload games request (exclude session id, add hasFeatureWebp)
- fixed StoriesAdapter.getIndexById (if UGC cell used)

## 1.18.6 (866)

### Fixed

- fixed durations restore in case of background pause
- fixed wrong offset for timeline in stories reader pages after returning from background
- fixed check stories list cell before triggers cell interface (csListItemInterface, etc.) methods

## 1.19.0-rc1 (900)

### Added

- added games preloading after session opening and `inAppStoryManager.preloadGames()`
- added lottie animations in games feature support
- added bundle resources preloading for stories
- added VOD feature support
- added test-key usage in single story requests

### Updated

- updated bar colors for game reader (now depends of opening spot)
- changed story timers logic (depends on JS code now)
- new stack feed logic
- changed offsets (top and bottom) for stories

### Fixed

- fixed disableClose usage in stories loader fragment
- fixed added screenshot sharing callback in case of any error

## 1.18.5 (865)

### Added

- Update: dialog timings and logic in stories

## 1.18.4 (864)

### Added

- added external API (RN)

### Fixed

- fixed NPE in StoriesActivity
- fixed game progress loader width

## 1.18.3 (863)

### Added

- added unfreezeUI JS method

### Updated

- changed default nav bar color to black

### Fixed

- fixed tablet stories sizes

## 1.18.2 (862)

### Added

- added file picker support
- added `setLang(locale: Locale)` and `Builder`'s `lang(locale: Locale)` option
  in `InAppStoryManager`

### Removed

- Removed: runtime download from webViewClient

### Fixed

- Bug in `isDeviceIdEnabled` usage
- Bug in stackFeed and common feed sync opened statuses
- Pause stories reader when goods widget is opened in tablet version
- Disable drag in tablets
- NPE in ReaderManager.newStoryTask
- ClassCastException in DefaultOpenStoriesReader.onOpen

## 1.18.1 (861)

### Updated

- Update: game loader with infinite progress (changed behaviour)

### Fixed

- Fixed `ConcurrentModificationException` if session opens with an error
- Fixed OOB for favorite cell
- Fixed first slide reopening

## 1.18.0 (860)

### Updated

:::warning

- InAppStoryManager initialization has changed. Now it has to be initialized only in `Application`
  class through method `InAppStoryManager.initSdk(context: Context)`. Then, from any
  class (`Application`, `Activity`, `Fragment`, etc.) you need to
  call `InAppStoryManager.Builder(). ... .create()` (without passing context)
  :::

- Updated signature of `ListCallback`'s methods `storiesLoaded` and `storiesUpdated`. Now
  they have third argument `data: List<StoryData>?`
- Updated `GameReaderCallback` interface. It was extended with
  method `gameOpenError(data: GameStoryData?, gameId: String?)`

:::warning

- Contextless methods from `Sizes` class marked as deprecated and will be removed in next version.
  If you used them to conv ert sizes from dp to px, you can replace them to methods with context
  (f.e.: `Sizes.dpToPxExt(sizeInDp: Int)` -> `Sizes.dpToPxExt(sizeInDp: Int, context: Context)`)
  :::

### Added

- Added new story and game reader display option. Now they can be shown in fragments instead of
  activities.
- Added interface `IStoriesListItemWithStoryData`. It can be used instead of `IStoriesListItem`
-

Added `InAppStoryManager.closeStoryReader(forceClose: Boolean, forceCloseCallback: ForceCloseReaderCallback)`.

- Added `isDeviceIDEnabled` and `gameDemoMode` options in `InAppStoryManager.Builder`.
- Added `InAppStoryManager.isStoryReaderOpened()` and `InAppStoryManager.isGameReaderOpened()`.
- Added stack feed feature. For more information read [here](stack-feed.md)
- Added method `showStoryOnce()` to `InAppStoryManager`.

## 1.17.17 (817)

### Fixed

- Fixed `ConcurrentModificationException` if session opens with an error
- Fixed OOB for favorite cell

## 1.17.16 (816)

### Added

- Added `isDeviceIDEnabled` and `gameDemoMode` options in `InAppStoryManager.Builder`.

## 1.17.15 (815)

### Added

- Added InAppStoryManager.closeStoryReader() with force closing feature

### Fixed

- Changed resources cache keys (sha1 and url dependency)

## 1.17.14 (814)

### Updated

- Updated recieving dialog input parameters from the server
- Updated minimum font size for WebViews

## v.1.17.13 (813)

### Added

- Added `InAppStoryManager.isStoryReaderOpened()` and `InAppStoryManager.isGameReaderOpened()`

### Fixed

- fixed added statistic for game opening (from list item)
- fixed game loading after refresh clicking

## v.1.17.12 (812)

### Fixed

- Changed `finishGame` and `closeGame` callback logic

## v1.17.11 (811)

### Fixed

- Fixes NPEs for InAppStoryService

## v1.17.10 (810)

### Fixed

- Fixed session reopening if userId was changed in session opening time

## v1.17.9 (809)

- fixed screen orientation change in game reader for Android 8.0

## v1.17.8 (808)

### Fixed

- fixed memory usage optimization
- fixed crash in game reader (insets for tablets)
- fixed set orientation for old games
- fixed crash in game reader (onDestroy calls after returning from background)

## v1.17.7 (807)

### Version was removed due to critical bugs

## v1.17.6 (806)

### Fixed

- Fixed link caching (use QS)
- Fixed crash with durations array
- Fixed crash with null values in stories cache
- Fixed image decompression

## v1.17.5 (805)

### Fixed

- Fixed `StoriesReader` navigation (to outside story)
- Fixed `GameActivity` (check InAppStoryService before usage)
- Fixed `StoryTimelineManager` crash (get duration from empty array)

## v1.17.4 (804)

### Fixed

- Fixed cached story checking

## v1.17.3 (803)

### Fixed

- Fixed a bug with favorite previews - check images if it was lost (removed/renamed)

## v1.17.2 (802)

### Added

- Added support for widget "layers" in stories

> **Note** <br/>
> In previous versions timers won't reset when you switch between layers.

- Added demo mode for games in private API

## v.1.16.12 (762)

### Fixed

- Fixed session reopening if userId was changed in session opening time

## v1.16.6 (756)

### Fixed

- Fixed a bug with favorite previews - check images if it was lost (removed/renamed)
