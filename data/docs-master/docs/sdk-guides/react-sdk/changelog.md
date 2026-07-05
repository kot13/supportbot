---
toc_max_heading_level: 2
---

# Changelog
## [1.15.6](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.15.6) (2026-06-30)
### Added
- Add support of cart quantity enabled switch (widget `products`).

## [1.15.5](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.15.5) (2026-06-26)
### Fixed
- Fixed a bug in version `1.15.4` where the page would freeze when switching a story slide to the first layer (for example, in the `quiz` widget).

## [1.15.4](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.15.4) (2026-06-16)
### Fixed
- Fixed a bug that could cause navigation to be blocked in a multi-slide IAM.
- Fixed a bug with `story repeat` widget on first slide or layer.

## [1.15.3](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.15.3) (2026-06-09)
### Fixed
- Fixed a bug where a toast with a message was missing after the `copy` widget was completed.

## [1.15.2](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.15.2) (2026-06-05)
### Added
- Add banners plugin UMD bundle.
- Add support `verbatimModuleSyntax=true` TS compiler option (explicit import type / export type syntax).
### Changed
- Improved SDK source map.

## [1.15.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.15.1) (2026-06-03)
### Fixed
- Fixed a bug where the `userId` was missing in the session open request headers if the configuration was updated during the request. Now the active request will be canceled and resent with the current configuration.

## [1.15.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.15.0) (2026-06-01)
### Added
- Added scroll view support
### Fixed 
- Fixed error in ESM bundle: `Can't resolve './' / webpack_require.b = new URL("./", import.meta.url);` after update webpack to `v5.106.2`.

## [1.14.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.14.1) (2026-05-25)
### Fixed
- Fixed error `userLogout is not function`

## [1.14.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.14.0) (2026-05-19)
### Added
{/* - Added slide `scroll view` support. */}
- Added [`hybridApp`](./how-to-get-started.md#configuration) into `InAppStoryManagerConfig` property for hybrid app.
### Changed
- Improved story slides error handling.
- Update packages.
- Added `forwardRef` bypass (because `forwardRef` is marked depreacted in official docs https://react.dev/reference/react/forwardRef).

## [1.13.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.13.0) (2026-04-28)
### Added
- Added `scratch card` widget support.
- Added toast `width` appearance parameter.

## [1.12.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.12.0) (2026-04-21)
### Added
- Added `product carousel` widget support.
### Changed
- Improved completion animation for `reaction` widget.
### Fixed
- The name of the `-webkit-mask-image` property has been corrected.

## [1.11.4](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.11.4) (2026-04-13)
### Fixed
- Fixed updating of placeholders in IAMs

## [1.11.3](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.11.3) (2026-04-06)
### Added
- Added font prefix for correct display of fonts in toasts in IAS console.

## [1.11.2](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.11.2) (2026-04-03)
### Added
- Add IAM slide payload field for IAM events

## [1.11.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.11.1) (2026-04-02)
### Fixed
- Fixed the "Show animation after selection" option for the `reaction` widget
- Fixed the timeline behavior in IAM for widgets with layers
- Fixed a bug with IAM timeline rendering in Safari

## [1.11.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.11.0) (2026-03-12)
### Added
- Added `reactions` widget

## [1.10.3](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.10.3) (2026-03-11)
### Fixed
- Opening a IAM toast does not block the user interface.
- Statistics for IAMs and banners are sent (using the Beacon API) even if the browser aborts the request.

## [1.10.2](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.10.2) (2026-03-10)
### Added
- Added support for automatic language direction detection in games
- Added support for IAS on-premise solutions
### Fixed
- Fixed download icon position in `GameReader` share panel
- Fixed IAM toast backdrop

## [1.10.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.10.1) (2026-02-25)
### Fixed
- IAS console game preview in demo mode

## [1.10.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.10.0) (2026-02-20)
### Added 
- Added new `toast` IAM type support
### Changed
- Improved error handling in game reader
- Remove internal `waitConfig()` method
- The device's `safe area` is passed to the `GameReader`

## [1.9.6](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.9.6) (2026-01-30)
### Added 
- Added IAM [`z-index`](./in-app-messaging.md#customization) appearance property
- Support for time display formats has been added to the `timer` widget.

## [1.9.5](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.9.5) (2026-01-15)
### Added
- Added the ability to use only one modification (color or size) in a product checkout
### Fixed
- Fixed display of backdrop background images for stories with multiple layers

## [1.9.4](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.9.4) (2026-01-12)
### Added
- Added share text feature into `GameReader` share panel
- Added resize handler for dot lottie plugin
- Added show layer completion action for `timer` widget
- Added submit button for `rate us` widget
- Added the ability to cancel the display of onboarding and IAMs
### Fixed
- Fixed an issue with displaying list markers on the single-slide IAM.
- Fixed a bug with the timer and text element.

## [1.9.3](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.9.3) (2025-12-24)
### Fixed
- Fixed artifacts in the corners of the `StoryReader` in Safari.
- Fixed bug with Game onboarding in `GameReader`.

## [1.9.2](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.9.2) (2025-12-18)
### Fixed
- Fixed checkout sub offer selector

## [1.9.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.9.1) (2025-12-12)
### Added
- A default favicon has been added to the sharing panel if the link's favicon fails to load.
### Fixed 
- The bottom sheet of the product feed overlaps the bottom sheet of product details.
- If an empty string is passed in the feed slug, it is replaced with `default` (the same as for `null` or `undefined` values)
- Disable the product feed opening button while the product feed is loading.

## [1.9.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.9.0) (2025-12-01)
### Added 
- Added [checkout](./checkout.md) support
### Fixed 
- Fixed bugs with customization of multi-slide IAMs and IAM timeline operation

## [1.9.0-rc.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.9.0-rc.0) (2025-11-21)
### Added
- Added support for multi-slide IAMs
- Added swipe gesture support for the IAM bottom sheet variant on desktop
- Added a timeout for opening the game
### Fixed
- Fixed the shifting of the story slide content relative to the action bar

## [1.8.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.1) (2025-11-27)
### Fixed
- Fixed aliasing of banners with a specified border radius.

## [1.8.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0) (2025-11-13)
### Added
- Added RTL support in banners
- Added `direction` property to customize banner slider direction
- Added the `mountBannerList` component to display a vertical list of banners
### Changed
- Method `mountBannerPlace` is marked as deprecated and has been replaced by the `mountBannerCarousel`.

## [1.8.0-rc.15](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.15) (2025-11-12)
### Added
- Fixed a bug with sending banner statistics.

## [1.8.0-rc.14](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.14) (2025-11-11)
### Added
- Fixed banner clipping in IAS console preview

## [1.7.13](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.13) (2025-11-07)
### Fixed
- Added support for promo codes in links

## [1.8.0-rc.13](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.13) (2025-11-01)
### Fixed
- Fixed a bug with re-define of web components when using HMR

## [1.8.0-rc.12](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.12) (2025-10-27)
### Fixed
- Fixed a bug with the display of the `quest` widget after switching between slides without selecting an answer, followed by opening and reopening the story reader with this widget.

## [1.7.12](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.12) (2025-10-27)
### Fixed
- Fixed a bug with the display of the `quest` widget after switching between slides without selecting an answer, followed by opening and reopening the story reader with this widget.

## [1.8.0-rc.11](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.11) (2025-10-22)
### Fixed
- Fixed a bug with overlapping images of rounded corners in `IAM`
- Fixed a bug with the appearance of artifacts (black triangles on the corners of the banner) when initializing banners in `Safari`
- Fixed a bug that caused an error message to be displayed in the browser console for empty banner place.
- Fixed a bug with sending network requests without a session ID or integration key after unmounting the `IASContainer`

## [1.7.11](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.11) (2025-10-22)
### Fixed
- Fixed a bug with overlapping images of rounded corners in `IAM`
- Fixed a bug with the appearance of artifacts (black triangles on the corners of the banner) when initializing banners in `Safari`
- Fixed a bug with sending network requests without a session ID or integration key after unmounting the `IASContainer`

## [1.8.0-rc.10](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.10) (2025-10-15)
### Added
- Added LRU cache [More details](./cache.md)
### Fixed
- Fixed IAM overflow bug
- Fixed story reader navigation error when parallel call `showOnboardingStories`

## [1.7.10](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.10) (2025-10-15)
### Added
- Added LRU cache [More details](./cache.md)
### Fixed
- Fixed IAM overflow bug
- Fixed story reader navigation error when parallel call `showOnboardingStories`

## [1.8.0-rc.9](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.9) (2025-10-07)
### Changed
- In the names of CSS banner selectors, the substring `banner` has been replaced with `bnr` to prevent blocking by ad blockers.

## [1.7.9](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.9) (2025-10-07)
### Added
- Added a feature to prevent IAM closing.

## [1.7.8](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.8) (2025-09-19)
### Changed
- `GET` requests for the `story feed` and `IAMs` have been replaced with `POST` requests due to the browser's limitation on the permissible URL length (for example, when transmitting a long list of `tags`)
- Improved the stability of stories in case of media resource loading errors
### Fixed
- Fixed displaying the close button for a story that had closing disabled

## [1.8.0-rc.8](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.8) (2025-09-12)
### Fixed
- Fixed IAM show message error (the second parameter is marked as optional)
- Fixed IAM filtering by time range

## [1.7.7](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.7) (2025-09-12)
### Fixed
- Fixed IAM show message error (the second parameter is marked as optional)
- Fixed IAM filtering by time range

## [1.8.0-rc.7](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.7) (2025-09-10)
### Added
- Added `options` parameter to `StoryManagerConfig`, [more details](options.md);
- Added `anonymous` flag to `StoryManagerConfig`
### Fixed
- Fixed re-subscription to touch controller event in React Strict Mode
- Fixed game copy to clipboard
- Remove unsed slider radius vartiable from style attr (IAM)
- Fixed loader & error screen (IAM)
- Fixed story slides elements animation delay

## [1.7.6](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.6) (2025-09-10)
### Added
- Added `options` parameter to `StoryManagerConfig`, [more details](options.md); 
- Added `anonymous` flag to `StoryManagerConfig`
### Fixed
- Fixed re-subscription to touch controller event in React Strict Mode
- Fixed game copy to clipboard
- Remove unsed slider radius vartiable from style attr (IAM)
- Fixed loader & error screen (IAM)
- Fixed story slides elements animation delay

## [1.8.0-rc.6](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.6) (2025-09-03)
### Fixed
- Fixed IAM grab handle border radius
- Fixed IAM modal border radius
- Added `user-select:none` to banners slider
- Fixed grab area for banners with different aspect ratios

## [1.7.5](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.5) (2025-09-03)
### Fixed
- Fixed IAM grab handle border radius
- Fixed IAM modal border radius

## [1.8.0-rc.5](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.5) (2025-09-01)
### Added
- Added source maps for development and debugging
### Fixed
- Fixed native sharing in games
- Fixed behavior of story loader on weak devices

## [1.7.4](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.4) (2025-09-01)
### Added
- Added source maps for development and debugging
### Fixed
- Fixed native sharing in games
- Fixed behavior of story loader on weak devices

## [1.8.0-rc.4](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.4) (2025-08-26)
### Fixed
- Fired `widgetEvent` event for banners
### Changed 
- Improved type declaration for external events
- Changed payload for `widgetEvent` event in IAM

## [1.8.0-rc.3](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.3) (2025-08-21)
### Added 
- Added `autoplayTimerTick` event for banners plugin
### Fixed
- Banners plugin types declarations
- Removed `tags` field from story events

## [1.8.0-rc.2](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.2) (2025-08-15)
### Added 
- Added `showBanner`, `showBannerFailed`, `bannerWidget` events
### Breaking changes
- `clickOnButton` deprecated event. Use [`w-link`](./link-handling.md#2-handling-via-w-link-widgetevent) widget event

## [1.8.0-rc.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.1) (2025-08-14)
### Fixed 
- Fixed a bug with auto-scrolling of banners with `0` duration

## [1.8.0-rc.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.8.0-rc.0) (2025-08-12)
### Added
- Added support for [banners](./banners.md)
### Fixed 
- Fixed a bug with displaying toasts in `barcode` and `copy` widgets

## [1.7.3](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.3) (2025-08-05)
### Fixed
- Fixed error `Close the launched game with ID` when calling `openGame` from `useEffect` in React Strict Mode

## [1.7.2](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.2) (2025-08-04)
### Added
- To enable modern layout, use the `layout` property from `StoryReaderOptions`
### Fixed
- Fixed a bug with handling clicks on stories in React 19

## [1.7.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.1) (2025-07-18)
### Fixed
- Fixed a bug with media playback after closing story and switching browser tabs
- Fixed a bug with game launch when an error occurred while loading dependencies of the "DotLottie" plugin
- Fixed a bug with the influence of story slide styles on the host application
### Changed 
- Improved display of story action bar animations on mobile devices

## [1.7.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.7.0) (2025-06-30)
### Added
- Added new design variant for `StoryReader` slider. To enable a new display option, use the `useExperimentalModernVariant` property from `StoryReaderOptions`
### Fixed
- Fixed bug with image cropping in `StoryReader`
### Changed
- Migrated to `@inappstory/slide-api` v0.1.14

## [1.6.5](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.6.5) (2025-06-27)
### Changed
- Restart story slide timer on click/tap on leftmost slide of leftmost story

## [1.6.4](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.6.4) (2025-06-20)
### Fixed
- Fixed a bug that caused onboarding to be shown repeatedly in games for the same user on a different device
### Changed
- On mobile devices, the action bar is displayed in stories on a dark background below the content

## [1.6.3](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.6.3) (2025-06-06)
### Added
- Added `dir` parameter to `StoryManagerConfig`
- Added support for gradient backgrounds in IAM
### Fixed
- Fixed display of `StoryReader` in RTL display
- Fixed a bug in the `StoryReader` slider with a cube effect when moving a story outside of viewport a mobile device
- Fixed a bug with range slider widget

## [1.6.2](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.6.2) (2025-05-27)
### Fixed
- Fixed `StoryReader` text flickering on IOS

## [1.6.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.6.1) (2025-05-23)
### Fixed
- When opening a session, the correct header value `x-device-id` is passed instead of `undefined`
- Headers with `undefined` values ​​are not passed
- Fixed a bug with throwing an exception when setting the `disableDeviceId` parameter
- Fixed `401 error` when opening a session

 ## [1.6.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.6.0) (2025-05-19)
 ### Added 
 - Added slide pause button when showing `StoryReader` on desktop
 ### Changed
 - Reduced package size
 - The video on demand module has been removed from the package and moved to a separate [`IasVideoOnDemandPlugin` plugin](./plugins.md).
 - The `react-input-mask` package has been removed from the package
 - The appearance of the action bar has been changed
 - Changed the default appearance of the close button
 ### Fixed
 - Fixed a bug where the same widget did not work on layers other than the first one
 - Fixed 1px gap appearing in some aspect ratios in `StoryReader`
 - Fixed bug with setting IAM opacity

## [1.5.9](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.5.9) (2025-04-28)
### Added
- Added support user defined slider range for mode `lock to ticks` (instead of fixed 1 - 10)
### Fixed
- Fixed a bug with the story viewing duration statistics when opening a game from story and then returning to story
- Fixed the behavior where story slides switch when clicking on the product card

## [1.5.8](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.5.8) (2025-04-23)
### Added
- Added support for new `products` widget

## [1.5.7](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.5.7) (2025-04-22)
### Fixed
- Fixed `ReferenceError` when unmounting `IASContainer` if `StoryReader` was open
  
## [1.5.6](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.5.6) (2025-04-22)
### Fixed
- Using `StoryManager` methods in React StrictMode. For example, calling `showStory()` might not result in the story being displayed.
- Fixed a bug with resetting the scrollbar settings when unmounting `IASContainer` if `StoryReader` was open
### Changed
- Changed `showSharePage()` method prototype
- Removed `events` package from external dependencies
  
## [1.5.5](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.5.5) (2025-04-15)
### Added 
- Added support `authUrl` in `GameReader`
- Added `renderItem()` property to `GoodsWidgetOptions`
### Fixed
- Fixed flickering of text elements on mobile devices
- Fixed click on button event emitting
- Fixed feed height jump when loading feed
- Removed MobX warning messages
- Fixed IAM text flickering

## [1.5.4](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.5.4) (2025-04-08)
### Fixed 
- Fixed `SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` error on React 19

## [1.5.3](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.5.3) (2025-04-07)
### Fixed 
- Fixed the mechanism for sending statistics in preview mode
- Fixed `language` validation error when `lang` parameter is omitted

## [1.5.2](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.5.2) (2025-04-02)
### Fixed 
- Fixed display of games on mobile devices

## [1.5.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.5.1) (2025-04-01)
### Added
- Added tag filtering. Tags must meet the following requirements:
    1. Length: from `1` to `50` characters.
    2. First character: `letter (any language)`, `number` or `_`.
    3. Other characters: `letters`, `numbers`, `_`, `-`.
- Added support for [`custom tags`](./in-app-messaging.md) in IAM
- Added support for React 19
### Fixed
- Fixed bug with reloading IAM after network error
- Fixed bug with IAM display in `Safari < 14`
- Fixed a bug with starting the story timeline after opening the game from another game
- Fixed `getParser()` is not a function error
### Changed
- Improved display of games in widescreen mode
- `GameReader` event `gameEvent` has been renamed to `eventGame`

## [1.5.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.5.0) (2025-03-18)
### Added
- Added support for multiple widgets on one story
- Added support for IAM appearance settings
### Fixed
- Fixed a bug with story font sizes when changing the screen size or orientation
### Changed
- Updated package dependencies
- Reduced bundle size

## [1.4.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.4.0) (2025-03-11)
### Added
- Added support for [in app messaging](./in-app-messaging.md) (IAM)
### Fixed
- Fixed bug with reloading `GameReader` 
### Changed
- Removed `effector` NPM dependency
- Improved performance of `StoryReader` & `StoryList`

## [1.3.6-rc.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.3.6-rc.0) (2025-02-24)
### Fixed
- Fixed a bug with displaying the first two images of story cards in Android WebView
### Changed
- Calling `showOnboardingStories` no longer throws an `EmptyOnboardingStoryList` exception if there are no stories to display.

## [1.3.5](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.3.5) (2025-02-12)
### Fixed
- Fixed a bug with the promise hanging when calling `showStory`, `showStoryOnce`, `showOnboardingStories` if the `IASContainer` was unmounted.

## [1.3.4](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.3.4) (2025-02-11)
### Added
- Added static names of story list CSS classes
### Fixed
- Fixed bug with using custom project fonts
- Fixed a bug with opening multiple sessions
- Fixed a bug with auto scrolling to the top of the page when closing `StoryReader`

## [1.3.3](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.3.3) (2025-02-07)
### Fixed
- Fixed a bug with displaying story list navigation controls when using the [`display`](https://developer.mozilla.org/en-US/docs/Web/CSS/display) CSS property for the loader

## [1.3.2](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.3.2) (2025-02-07)
### Fixed
- Fixed a bug with scrolling the list of stories with the mouse wheel
- Fixed a bug with the display of story list navigation controls on mobile devices with support for inertial scrolling
- Fixed a bug with the `StoryReader` action bar disappearing on Iphone 15 and below when using the [`container`](https://developer.mozilla.org/en-US/docs/Web/CSS/container) CSS property

## [1.3.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.3.1) (2025-02-06)
### Fixed
- Fixed a bug with double tapping on the input field in the ask a question widget on IOS
- Fixed a bug with flickering stories with videos
- Fixed a bug in ESM bundle leading to errors like `method is not a function`
### Changed
- Links in the list of story cards have been replaced with block elements for improvement SEO

## [1.3.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.3.0) (2025-01-27)
### Changed
- Remove `mobx` from peer dependency

## [1.2.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.2.0) (2025-01-21)
### Added
- Added `userIdSign` story manager config parameter
### Changed
- Added `mobx` peer dependency

## [1.1.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.1.1) (2025-01-17)
### Added
- Added [`autoScrollOnStoryClose`](./feeds.md#storieslist-options) option to control auto scroll to invisible story card when closing the story reader
### Fixed
- Fixed onboarding stories order with tags
- Fixed sending statistics at the time of document upload
- Fixed displaying the reload button on top of the dot lottie animation when a game loading error occurs
- Fixed a bug causing story cards to become unclickable on some mobile devices until the feed is scrolled
### Changed
- The default appearance settings for the stories list have been changed. The changes affected the properties `card.variant`, `card.border`, `card.height` and `card.title`.

## [1.1.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.1.0) (2024-12-27)
### Added
- Added ESM bundle into package
- Added plugin system
- Added DotLottie animations plugin
- Added barcode widget support
- Added VOD loading error handling with the ability to reload story
### Changed
- Improved performance of StoryReader swipe animations 
 
## [1.1.0-rc.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.1.0-rc.1) (2024-12-23)
### Fixed
- Fixed a bug with the display of story list navigation controls at the edges of the list

## [1.1.0-rc.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.1.0-rc.0) (2024-12-24)
### Added
- Fired `feedLoad` event after onboarding stories loaded 
- Added `done` state for the copy button in the sharing panel of the story slide

### Fixed
- Fixed layering of the first two stories on top of each other
- Fixed a bug with showing story when calling `showStory()`
- Fixed a bug where, during a long loading of story media resources, you can start changing slides by timeout when you lose focus and then focus on the story tab.
- Fixed a bug that caused the story to freeze when loading media resources unsuccessfully and then swiping between stories
- Fixed a bug where a blank image could be shared on iOS

## [1.0.1](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.0.1) (2024-12-03)
### Fixed
- Fixed story reader bugs with react strict mode
### Changed
- Removed @emotion/styled dependencies

## [1.0.0](https://www.npmjs.com/package/@inappstory/react-sdk/v/1.0.0) (2024-11-28)
### Added
- Added the ability to share text along with an image
### Fixed
- Fixed error "permission denied to access property `innerWidth`/`innerHeight` on cross-origin object"
### Changed
- Lazy loading of story content instead of loading content for all stories at once

## [0.6.3](https://www.npmjs.com/package/@inappstory/react-sdk/v/0.6.3) (2024-11-11)
### Fixed
- Types declaration for `StoryCardViewModel`
- Remove story card `title.color` property 

## 0.6.2 (2024-11-07)
### Fixed
- Fixed bug with pointer events on story slides 

## 0.6.1 (2024-10-23)
### Fixed
- Bug with ignoring `commonOptions`, which led to the display of an empty action panel in the story reader
### Changed
- If the aspect ratio of the viewport on the desktop is less than `310/480`, then the story reader is displayed by the same way as on mobile devices

## 0.6.0 (2024-10-17)
### Changed
- Composite HTTP requests have been replaced with regular ones
- All properties of the `StoryList` component are made optional
- Improved performance and reduced the number of re-renders.
### Added
- Added support for the feature of opening a game from another game
  
## 0.5.1 (2024-10-09)
### Fixed
- Fixed storage of game data in GameReader
### Added
- Added "Next" button to the voting widget

## 0.5.0 (2024-10-04)
### Added
- Added a feature to close a story by clicking on a button, image or using the swipe up gesture.
### Changed
- Improved performance and reduced the number of re-renders.
   
## 0.4.3 (2024-09-16)
### Added
- Added RTL compatible display of stories feed and readers
- Added RTL compatible values ​​for properties `closeButtonPosition`,  `sliderAlign`, `textAlign` (values `left` and `right` marked as `deprecated`). 
  
## 0.4.2 (2024-09-12)
### Fixed
 - Fixed CSP support

## 0.4.1 (2024-09-05)
## 0.4.1-rc.0 (2024-09-05)
### Fixed
 - Fixed bug with values of story list navigation properties `reachStart` and `reachEnd` on mobile devices

## 0.4.0 (2024-09-03)
### Added
 - Added full VoD (Video on Demand) support.
 - Added the ability to reload the story feed.

### Fixed
 - Fixed bug with the display of story list navigation buttons.
 - Fixed bug with the display of the story card radius.
 - Fixed bugs with swipe animation in the feed on mobile devices.
 - Optimized swipe animation in the feed on both mobile devices and desktop.

## 0.3.6 (2024-08-26)

### Fixed
- Fixed package types declaration (bug with `StoriesListDirection` enum export)

## 0.3.5 (2024-08-23)

### Fixed
- Fixed package types declaration

## 0.3.4 (2024-08-22)

### Fixed
- Fixed an issue where the styles from our package were unintentionally affecting the external web application's styles. The styles are now properly isolated, preventing any impact on external elements and components. This ensures that your application displays and functions correctly without conflicts with our styles.
- Fixed an issue where one story card would overlap with another when using the `sidePadding` property.

## 0.3.3 (2024-08-20)

### Fixed
- Added dependency on `effector` to the package dependencies.

## 0.3.2 (2024-08-19)

### Fixed
- Added dependency on `@inappstory/slide-api` to the package dependencies.

## 0.3.1 (2024-08-02)

### Added 
- Added share panel customization params. See share panel [customization guide](./share-panel.md).

## 0.3.0 (2024-07-31)

### Changed in this version

- Full implementation of `js-sdk` on `react`
- react-sdk is no longer used `iframe`

### Breaking changes in v0.3.0

Migration guide → [migrations](./migrations.md)
- No longer necessary to manually create instances of `<AppearanceManager>` and `<StoryManager>`
- The `<IASContainer>` and its `props` are used for configuration.
