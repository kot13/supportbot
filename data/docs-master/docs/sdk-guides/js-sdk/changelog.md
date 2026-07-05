---
toc_max_heading_level: 2
---

# Changelog
## [3.14.6](https://cdn.inappstory.com/sdk/v3.14.6/dist/js/IAS.js) (2026-06-30)
### Added
- Add support of cart quantity enabled switch (widget `products`).

## [3.14.5](https://cdn.inappstory.com/sdk/v3.14.5/dist/js/IAS.js) (2026-06-26)
### Fixed
- Fixed a bug in version `3.14.4` where the page would freeze when switching a story slide to the first layer (for example, in the `quiz` widget).

## [3.14.4](https://cdn.inappstory.com/sdk/v3.14.4/dist/js/IAS.js) (2026-06-16)
### Fixed
- Fixed a bug that could cause navigation to be blocked in a multi-slide IAM.
- Fixed a bug with `story repeat` widget on first slide or layer.

## [3.14.3](https://cdn.inappstory.com/sdk/v3.14.3/dist/js/IAS.js) (2026-06-09)
### Fixed
- Fixed a bug where a toast with a message was missing after the `copy` widget was completed.

## [3.14.2](https://cdn.inappstory.com/sdk/v3.14.2/dist/js/IAS.js) (2026-06-05)
### Added
- Add banners plugin UMD bundle.
- Add support `verbatimModuleSyntax=true` TS compiler option (explicit import type / export type syntax).
### Changed
- Improved SDK source map.

## [3.14.1](https://cdn.inappstory.com/sdk/v3.14.1/dist/js/IAS.js) (2026-06-03)
### Fixed
- Fixed a bug where the `userId` was missing in the session open request headers if the configuration was updated during the request. Now the active request will be canceled and resent with the current configuration.

## [3.14.0](https://cdn.inappstory.com/sdk/v3.14.0/dist/js/IAS.js) (2026-06-01)
### Added
- Added scroll view support
### Fixed 
- Fixed error in ESM bundle: `Can't resolve './' / webpack_require.b = new URL("./", import.meta.url);` after update webpack to `v5.106.2`.

## [3.13.1](https://cdn.inappstory.com/sdk/v3.13.1/dist/js/IAS.js) (2026-05-25)
### Fixed
- Fixed error `userLogout is not function`

## [3.13.0](https://cdn.inappstory.com/sdk/v3.13.0/dist/js/IAS.js) (2026-05-19)
### Added
- Added [`hybridApp`](./how-to-get-started.md#configuration) into `StoryManagerConfig` property for hybrid app.
### Changed
- Improved story slides error handling.
- Update packages

## [3.12.0](https://cdn.inappstory.com/sdk/v3.12.0/dist/js/IAS.js) (2026-04-28)
### Added
- Added `scratch card` widget support.
- Added toast `width` appearance parameter.

## [3.11.0](https://cdn.inappstory.com/sdk/v3.11.0/dist/js/IAS.js) (2026-04-21)
### Added
- Added `product carousel` widget support.
### Changed
- Improved completion animation for `reaction` widget.
### Fixed
- The name of the `-webkit-mask-image` property has been corrected.

## [3.10.4](https://cdn.inappstory.com/sdk/v3.10.4/dist/js/IAS.js) (2026-04-13)
### Added
- Fixed updating of placeholders in IAMs

## [3.10.3](https://cdn.inappstory.com/sdk/v3.10.3/dist/js/IAS.js) (2026-04-06)
### Added
- Added font prefix for correct display of fonts in toasts in IAS console.

## [3.10.2](https://cdn.inappstory.com/sdk/v3.10.2/dist/js/IAS.js) (2026-04-03)
### Added
- Add IAM slide payload field for IAM events

## [3.10.1](https://cdn.inappstory.com/sdk/v3.10.1/dist/js/IAS.js) (2026-04-02)
### Fixed
- Fixed the "Show animation after selection" option for the `reaction` widget
- Fixed the timeline behavior in IAM for widgets with layers
- Fixed a bug with IAM timeline rendering in Safari

## [3.10.0](https://cdn.inappstory.com/sdk/v3.10.0/dist/js/IAS.js) (2026-03-12)
### Added 
- Added `reactions` widget

## [3.9.3](https://cdn.inappstory.com/sdk/v3.9.3/dist/js/IAS.js) (2026-03-11)
### Fixed
- Opening a IAM toast does not block the user interface.
- Statistics for IAMs and banners are sent (using the Beacon API) even if the browser aborts the request.

## [3.9.2](https://cdn.inappstory.com/sdk/v3.9.2/dist/js/IAS.js) (2026-03-10)
### Added
- Added support for automatic language direction detection in games
- Added support for IAS on-premise solutions
### Fixed
- Fixed download icon position in `GameReader` share panel
- Fixed the addition of additional `ias-app` elements when attempting to create multiple `InAppStoryManager` instances
- Fixed IAM toast backdrop

## [3.9.1](https://cdn.inappstory.com/sdk/v3.9.1/dist/js/IAS.js) (2026-02-25)
### Fixed
- IAS console game preview in demo mode

## [3.9.0](https://cdn.inappstory.com/sdk/v3.9.0/dist/js/IAS.js) (2026-02-20)
### Added 
- Added new `toast` IAM type support
### Changed
- Improved error handling in game reader
- Remove internal `waitConfig()` method
- The device's `safe area` is passed to the `GameReader`

## [3.8.6](https://cdn.inappstory.com/sdk/v3.8.6/dist/js/IAS.js) (2026-01-30)
### Added 
- Added IAM [`z-index`](./in-app-messaging.md#customization) appearance property.
- Support for time display formats has been added to the `timer` widget.

## [3.8.5](https://cdn.inappstory.com/sdk/v3.8.5/dist/js/IAS.js) (2026-01-15)
### Added
- Added the ability to use only one modification (color or size) in a product checkout
### Fixed
- Fixed display of backdrop background images for stories with multiple layers

## [3.8.4](https://cdn.inappstory.com/sdk/v3.8.4/dist/js/IAS.js) (2026-01-12)
### Added
- Added share text feature into `GameReader` share panel
- Added resize handler for dot lottie plugin
- Added show layer completion action for `timer` widget
- Added submit button for `rate us` widget
- Added the ability to cancel the display of onboarding and IAMs
### Fixed
- Fixed an issue with displaying list markers on the single-slide IAM.
- Fixed a bug with the timer and text element.

## [3.8.3](https://cdn.inappstory.com/sdk/v3.8.3/dist/js/IAS.js) (2025-12-24)
### Fixed
- Fixed artifacts in the corners of the `StoryReader` in Safari.
- Fixed bug with Game onboarding in `GameReader`.

## [3.8.2](https://cdn.inappstory.com/sdk/v3.8.2/dist/js/IAS.js) (2025-12-18)
### Fixed
- Fixed checkout sub offer selector

## [3.8.1](https://cdn.inappstory.com/sdk/v3.8.1/dist/js/IAS.js) (2025-12-12)
### Added
- A default favicon has been added to the sharing panel if the link's favicon fails to load.
### Fixed 
- The bottom sheet of the product feed overlaps the bottom sheet of product details.
- If an empty string is passed in the feed slug, it is replaced with `default` (the same as for `null` or `undefined` values)
- Disable the product feed opening button while the product feed is loading.

## [3.8.0](https://cdn.inappstory.com/sdk/v3.8.0/dist/js/IAS.js) (2025-12-01)
### Added 
- Added [checkout](./checkout.md) support
### Fixed 
- Fixed bugs with customization of multi-slide IAMs and IAM timeline operation

## [3.8.0-rc.0](https://cdn.inappstory.com/sdk/v3.8.0-rc.0/dist/js/IAS.js) (2025-11-21)
### Added
- Added support for multi-slide IAMs
- Added swipe gesture support for the IAM bottom sheet variant on desktop
- Added a timeout for opening the game
### Fixed
- Fixed the shifting of the story slide content relative to the action bar

## [3.7.1](https://cdn.inappstory.com/sdk/v3.7.1/dist/js/IAS.js) (2025-11-27)
### Fixed
- Fixed aliasing of banners with a specified border radius.

## [3.7.0](https://cdn.inappstory.com/sdk/v3.7.0/dist/js/IAS.js) (2025-11-13)
### Added
- Added RTL support in banners
- Added `direction` property to customize banner slider direction
- Added the `IasBannerList` component to display a vertical list of banners
### Changed
- `IasBannerPlace` is marked as deprecated and has been replaced by the `IasBannerCarousel` component.

## [3.7.0-rc.16](https://cdn.inappstory.com/sdk/v3.7.0-rc.16/dist/js/IAS.js) (2025-11-12)
### Fixed
- Fixed a bug with sending banner statistics.

## [3.7.0-rc.15](https://cdn.inappstory.com/sdk/v3.7.0-rc.15/dist/js/IAS.js) (2025-11-11)
### Fixed
- Fixed banner clipping in IAS console preview

## [3.7.0-rc.14](https://cdn.inappstory.com/sdk/v3.7.0-rc.14/dist/js/IAS.js) (2025-11-07)
### Added
- Added support for promo codes in links

## [3.6.13](https://cdn.inappstory.com/sdk/v3.6.13/dist/js/IAS.js) (2025-11-07)
### Fixed
- Added support for promo codes in links

## [3.7.0-rc.13](https://cdn.inappstory.com/sdk/v3.7.0-rc.13/dist/js/IAS.js) (2025-11-01)
### Fixed
- Fixed a bug with re-define of web components when using HMR

## [3.7.0-rc.12](https://cdn.inappstory.com/sdk/v3.7.0-rc.12/dist/js/IAS.js) (2025-10-27)
### Fixed
- Fixed a bug with the display of the `quest` widget after switching between slides without selecting an answer, followed by opening and reopening the story reader with this widget.

## [3.6.12](https://cdn.inappstory.com/sdk/v3.6.12/dist/js/IAS.js) (2025-10-27)
### Fixed
- Fixed a bug with the display of the `quest` widget after switching between slides without selecting an answer, followed by opening and reopening the story reader with this widget.

## [3.7.0-rc.11](https://cdn.inappstory.com/sdk/v3.7.0-rc.11/dist/js/IAS.js) (2025-10-22)
### Fixed
- Fixed a bug with overlapping images of rounded corners in `IAM`
- Fixed a bug with the appearance of artifacts (black triangles on the corners of the banner) when initializing banners in `Safari`
- Fixed a bug that caused an error message to be displayed in the browser console for empty banner place.
- Fixed a bug with sending network requests without a session ID or integration key after destroy `InAppStoryManager`

## [3.6.11](https://cdn.inappstory.com/sdk/v3.6.11/dist/js/IAS.js) (2025-10-22)
### Fixed
- Fixed a bug with overlapping images of rounded corners in `IAM`
- Fixed a bug with the appearance of artifacts (black triangles on the corners of the banner) when initializing banners in `Safari`
- Fixed a bug with sending network requests without a session ID or integration key after destroy `InAppStoryManager`

## [3.7.0-rc.10](https://cdn.inappstory.com/sdk/v3.7.0-rc.10/dist/js/IAS.js) (2025-10-15)
### Added
- Added LRU cache [More details](./cache.md)
### Fixed
- Fixed IAM overflow bug
- Fixed story reader navigation error when parallel call `showOnboardingStories`

## [3.6.10](https://cdn.inappstory.com/sdk/v3.6.10/dist/js/IAS.js) (2025-10-15)
### Added
- Added LRU cache [More details](./cache.md)
### Fixed
- Fixed IAM overflow bug
- Fixed story reader navigation error when parallel call `showOnboardingStories`

## [3.7.0-rc.9](https://cdn.inappstory.com/sdk/v3.7.0-rc.9/dist/js/IAS.js) (2025-10-07)
### Changed
- In the names of CSS banner selectors, the substring `banner` has been replaced with `bnr` to prevent blocking by ad blockers.

## [3.6.9](https://cdn.inappstory.com/sdk/v3.6.9/dist/js/IAS.js) (2025-10-07)
### Added
- Added a feature to prevent IAM closing.
- Added `setOptions` method

## [3.6.8](https://cdn.inappstory.com/sdk/v3.6.8/dist/js/IAS.js) (2025-09-19)
### Changed
- GET requests for the `story feed` and `IAMs` have been replaced with POST requests due to the browser's limitation on the permissible URL length (for example, when transmitting a long list of tags)
- Improved the stability of stories in case of media resource loading errors
### Fixed
- Fixed displaying the close button for a story that had closing disabled

## [3.7.0-rc.8](https://cdn.inappstory.com/sdk/v3.7.0-rc.8/dist/js/IAS.js) (2025-09-12)
### Fixed
- Fixed IAM show message error (the second parameter is marked as optional)
- Fixed IAM filtering by time range

## [3.6.7](https://cdn.inappstory.com/sdk/v3.6.7/dist/js/IAS.js) (2025-09-12)
### Fixed
- Fixed IAM show message error (the second parameter is marked as optional)
- Fixed IAM filtering by time range

## [3.7.0-rc.7](https://cdn.inappstory.com/sdk/v3.7.0-rc.7/dist/js/IAS.js) (2025-09-10)
### Added
- Added `options` parameter to `InAppStoryManagerConfig`. [More details](options.md);
- Added `anonymous` flag to `InAppStoryManagerConfig`
### Fixed
- Fixed re-subscription to touch controller event in React Strict Mode
- Fixed game copy to clipboard
- Remove unsed slider radius vartiable from style attr (IAM)
- Fixed loader & error screen (IAM)
- Fixed story slides elements animation delay

## [3.6.6](https://cdn.inappstory.com/sdk/v3.6.6/dist/js/IAS.js) (2025-09-10)
### Added
- Added `options` parameter to `InAppStoryManagerConfig`. [More details](options.md);
- Added `anonymous` flag to `InAppStoryManagerConfig`
### Fixed
- Fixed re-subscription to touch controller event in React Strict Mode
- Fixed game copy to clipboard
- Remove unsed slider radius vartiable from style attr (IAM)
- Fixed loader & error screen (IAM)
- Fixed story slides elements animation delay

## [3.7.0-rc.6](https://cdn.inappstory.com/sdk/v3.7.0-rc.6/dist/js/IAS.js) (2025-09-03)
### Fixed
- Fixed IAM grab handle border radius
- Fixed IAM modal border radius
- Added `user-select:none` to banners slider
- Fixed grab area for banners with different aspect ratios

## [3.6.5](https://cdn.inappstory.com/sdk/v3.6.5/dist/js/IAS.js) (2025-09-03)
### Fixed
- Fixed IAM grab handle border radius
- Fixed IAM modal border radius

## [3.7.0-rc.5](https://cdn.inappstory.com/sdk/v3.7.0-rc.5/dist/js/IAS.js) (2025-09-01)
### Added
- Added source maps for development and debugging
### Fixed
- Fixed native sharing in games
- Fixed behavior of story loader on weak devices

## [3.6.4](https://cdn.inappstory.com/sdk/v3.6.4/dist/js/IAS.js) (2025-09-01)
### Added
- Added source maps for development and debugging
### Fixed
- Fixed native sharing in games
- Fixed behavior of story loader on weak devices

## [3.7.0-rc.4](https://cdn.inappstory.com/sdk/v3.7.0-rc.4/dist/js/IAS.js) (2025-08-26)
### Fixed
- Fired `widgetEvent` event for banners
### Changed 
- Improved type declaration for external events
- Changed payload for `widgetEvent` event in IAM

## [3.7.0-rc.3](https://cdn.inappstory.com/sdk/v3.7.0-rc.3/dist/js/IAS.js) (2025-08-21)
### Added 
- Added `autoplayTimerTick` event for banners plugin
### Fixed
- Banners plugin types declarations
- Removed `tags` field from story events

## [3.7.0-rc.2](https://cdn.inappstory.com/sdk/v3.7.0-rc.2/dist/js/IAS.js) (2025-08-15)
### Added 
- Added `showBanner`, `showBannerFailed`, `bannerWidget` events for banners plugin
### Breaking changes
- `clickOnButton` deprecated event. Use [`w-link`](./link-handling.md#2-handling-via-w-link-widgetevent) widget event

## [3.7.0-rc.1](https://cdn.inappstory.com/sdk/v3.7.0-rc.1/dist/js/IAS.js) (2025-08-14)
### Fixed 
- Fixed a bug with auto-scrolling of banners with 0 duration

## [3.7.0-rc.0](https://cdn.inappstory.com/sdk/v3.7.0-rc.0/dist/js/IAS.js) (2025-08-12)
### Added
- Added support for [banners](./banners.md)
### Fixed 
- Fixed a bug with displaying toasts in `barcode` and `copy` widgets

## [3.6.3](https://cdn.inappstory.com/sdk/v3.6.3/dist/js/IAS.js) (2025-08-05)
### Fixed
- Fixed error `Close the launched game with ID` when calling `openGame` from `useEffect` in React Strict Mode

## [3.6.2](https://cdn.inappstory.com/sdk/v3.6.2/dist/js/IAS.js) (2025-08-04)
### Added
- To enable modern layout, use the `layout` property from `StoryReaderOptions`
### Fixed
- Fixed a bug with handling clicks on stories in React 19

## [3.6.1](https://cdn.inappstory.com/sdk/v3.6.1/dist/js/IAS.js) (2025-07-18)
### Fixed
- Fixed a bug with media playback after closing story and switching browser tabs
- Fixed a bug with game launch when an error occurred while loading dependencies of the "DotLottie" plugin
- Fixed a bug with the influence of story slide styles on the host application
### Changed 
- Improved display of story action bar animations on mobile devices

## [3.6.0](https://cdn.inappstory.com/sdk/v3.6.0/dist/js/IAS.js) (2025-06-30)
### Added
- Added new design variant for `StoryReader` slider. To enable a new display option, use the `useExperimentalModernVariant` property from `StoryReaderOptions`
### Fixed
- Fixed bug with image cropping in `StoryReader`
### Changed
- Migrated to `@inappstory/slide-api` v0.1.14

## [3.5.5](https://cdn.inappstory.com/sdk/v3.5.5/dist/js/IAS.js) (2025-06-27)
### Changed
- Restart story slide timer on click/tap on leftmost slide of leftmost story

## [3.5.4](https://cdn.inappstory.com/sdk/v3.5.4/dist/js/IAS.js) (2025-06-20)
### Fixed
- Fixed a bug that caused onboarding to be shown repeatedly in games for the same user on a different device
### Changed
- On mobile devices, the action bar is displayed in stories on a dark background below the content

## [3.5.3](https://cdn.inappstory.com/sdk/v3.5.3/dist/js/IAS.js) (2025-06-06)
### Added
- Added `dir` parameter to `StoryManagerConfig`
- Added support for gradient backgrounds in IAM
### Fixed
- Fixed display of `StoryReader` in RTL display
- Fixed a bug in the `StoryReader` slider with a cube effect when moving a story outside of viewport a mobile device
- Fixed a bug with range slider widget

## [3.5.2](https://cdn.inappstory.com/sdk/v3.5.2/dist/js/IAS.js) (2025-05-27)
### Fixed
- Fixed `StoryReader` text flickering on IOS

## [3.5.1](https://cdn.inappstory.com/sdk/v3.5.1/dist/js/IAS.js) (2025-05-23)
### Fixed
- When opening a session, the correct header value `x-device-id` is passed instead of `undefined`
- Headers with `undefined` values ​​are not passed
- Fixed a bug with throwing an exception when setting the `disableDeviceId` parameter
- Fixed `401 error` when opening a session

## [3.5.0](https://cdn.inappstory.com/sdk/v3.5.0/dist/js/IAS.js) (2025-05-19)
 ### Added 
 - Added slide pause button when showing `StoryReader` on desktop
 ### Changed
 - Reduced bundle size
 - The video on demand module has been removed from the package and moved to a separate [`IasVideoOnDemandPlugin` plugin](./plugins.md).
 - The `react-input-mask` package has been removed from the package
 - The appearance of the action bar has been changed
 - Changed the default appearance of the close button
 ### Fixed
 - Fixed a bug where the same widget did not work on layers other than the first one
 - Fixed 1px gap appearing in some aspect ratios in `StoryReader`
 - Fixed bug with setting IAM opacity

## [3.4.12](https://cdn.inappstory.com/sdk/v3.4.12/dist/js/IAS.js) (2025-04-28)
### Added
- Added support user defined slider range for mode `lock to ticks` (instead of fixed 1 - 10)
### Fixed
- Fixed a bug with the story viewing duration statistics when opening a game from story and then returning to story
- Fixed the behavior where story slides switch when clicking on the product card

## [3.4.11](https://cdn.inappstory.com/sdk/v3.4.11/dist/js/IAS.js) (2025-04-23)
### Added
- Added support for new `products` widget

## [3.4.10](https://cdn.inappstory.com/sdk/v3.4.10/dist/js/IAS.js) (2025-04-22)
### Added
- Added `showSharePage()` method
### Changed
- `SharePage` class mark as deprectaed
  
## [3.4.9](https://cdn.inappstory.com/sdk/v3.4.9/dist/js/IAS.js) (2025-04-18)
### Added 
- Added `mountPoint` field for `StoriesList`
### Fixed
- Fixed a bug with resetting the scrollbar settings when called `inAppStoryManager.destroy()` and `StoryReader` was open
### Changed
- Improved functionality for tracking the removal of a mount point from the DOM without explicitly calling `destroy()` method on the feed

## [3.4.8](https://cdn.inappstory.com/sdk/v3.4.8/dist/js/IAS.js) (2025-04-17)
### Added 
- Added a timeout for the case when there is no mount point in the DOM at the time the feed instance is created
  
## [3.4.7](https://cdn.inappstory.com/sdk/v3.4.7/dist/js/IAS.js) (2025-04-17)
### Fixed 
- Several consecutive calls to `destroy()` on an already destroyed feed resulted in other feeds being deleted
- When calling `destroy()` immediately after creating a feed, the feed was not removed from the DOM
  
## [3.4.6](https://cdn.inappstory.com/sdk/v3.4.6/dist/js/IAS.js) (2025-04-17)
### Fixed 
- Creating a new feed instance resulted in deleting the previous one
- Destroying the current feed after creating a new one resulted in deleting all feeds
  
## [3.4.5](https://cdn.inappstory.com/sdk/v3.4.5/dist/js/IAS.js) (2025-04-15)
### Added 
- Added support `authUrl` in `GameReader`
### Fixed 
- Fixed flickering of text elements on mobile devices
- Fixed click on button event emitting
- Fixed feed height jump when loading feed
- Removed MobX warning messages
- Fixed IAM text flickering

## [3.4.4](https://cdn.inappstory.com/sdk/v3.4.4/dist/js/IAS.js) (2025-04-08)
### Fixed 
- Fixed a bug when calling `destroy()` and re-creating an InAppStoryManager instance
- Added exception `IasInAppStoryManagerReferenceError` for the case when `destroy()` is called on InAppStoryManager and then some other InAppStoryManager method is called
- Fixed `language` validation error when `lang` parameter is omitted
- Fixed a bug when removing the story feed mount point from the DOM

## [3.4.3](https://cdn.inappstory.com/sdk/v3.4.3/dist/js/IAS.js) (2025-04-07)
### Fixed 
- Fixed the mechanism for sending statistics in preview mode

## [3.4.2](https://cdn.inappstory.com/sdk/v3.4.2/dist/js/IAS.js) (2025-04-02)
### Fixed 
- Fixed display of games on mobile devices

## [3.4.1](https://cdn.inappstory.com/sdk/v3.4.1/dist/js/IAS.js) (2025-04-01)
### Added
- Added `ias.legacy.umd.js` bundle for to support legacy browsers
- Added tag filtering. Tags must meet the following requirements:
    1. Length: from `1` to `50` characters.
    2. First character: `letter (any language)`, `number` or `_`.
    3. Other characters: `letters`, `numbers`, `_`, `-`.
- Added support for [`custom tags`](./in-app-messaging.md) in IAM
### Fixed
- Fixed bug with reloading IAM after network error
- Fixed bug with IAM display in `Safari < 14`
- Fixed a bug with starting the story timeline after opening the game from another game
- Fixed `getParser()` is not a function error
### Changed
- Improved display of games in widescreen mode
- `GameReader` event `gameEvent` has been renamed to `eventGame`
 
## [3.4.0](https://cdn.inappstory.com/sdk/v3.4.0/dist/js/IAS.js) (2025-03-18)
### Added
- Added support for multiple widgets on one story
- Added support for IAM appearance settings
### Fixed
- Fixed a bug with story font sizes when changing the screen size or orientation
### Changed
- Updated package dependencies
- Reduced bundle size

## [3.3.0](https://cdn.inappstory.com/sdk/v3.3.0/dist/js/IAS.js) (2025-03-11)
### Fixed
- Fixed bug with reloading `GameReader` 
### Changed
- Removed `effector` NPM dependency
- Improved performance of `StoryReader` & `StoryList`

## [3.2.0-rc.1](https://cdn.inappstory.com/sdk/v3.2.0-rc.1/dist/js/IAS.js) (2025-02-25)
### Added
- Added [`close()`](./in-app-messaging.md#type-declarations) method for in app messaging
- Added IAM events priority support

## [3.2.0-rc.0](https://cdn.inappstory.com/sdk/v3.2.0-rc.0/dist/js/IAS.js) (2025-02-24)
### Added
- Added support for [in app messaging](./in-app-messaging.md) (IAM)
### Changed
- `StoryManager` has been renamed to `InAppStoryManager`
- Now, readers are directly embedded into the application page, seamlessly integrating into the DOM. See [migration guide](./migrations.md#migration-guide-to-3xx). 

## [2.17.4](https://cdn.inappstory.com/sdk/v2.17.4/dist/js/IAS.js) (2025-03-12)
### Fixed
- Fixed flickering of text elements on mobile devices
  
## [2.17.3](https://cdn.inappstory.com/sdk/v2.17.3/dist/js/IAS.js) (2025-03-04)
### Added
- `userLogout()` method into `StoryManager`.

## [2.17.2](https://cdn.inappstory.com/sdk/v2.17.2/dist/js/IAS.js) (2025-02-24)
### Fixed
- Fixed error `TypeError: Cannot read properties of undefined (reading 'callMethod')` if the feed is initialized in parallel with the opening of the story reader
- Fixed a bug with the loss of the scrollbar when trying to open an already open story reader
### Changed
- An attempt to reopen the reader without closing it results in an `IasStoryReaderOpenError` exception being thrown.
- Calling `showOnboardingStories` no longer throws an `EmptyOnboardingStoryList` exception if there are no stories to display.

## [2.17.1](https://cdn.inappstory.com/sdk/v2.17.1/dist/js/IAS.js) (2025-02-14)
### Fixed
- Fixed error `TypeError: Cannot read properties of undefined (reading 'callMethod')` when calling `setUserId` immediately

## [2.17.0](https://cdn.inappstory.com/sdk/v2.17.0/dist/js/IAS.js) (2025-02-07)
### Fixed
- Fixed a bug with double tapping on the input field in the ask a question widget on IOS
- Fixed a bug with flickering stories with videos
- Fixed a bug with resetting widget states for different user IDs for the same feed
### Changed
- Links in the list of story cards have been replaced with block elements for improvement SEO

## [2.16.6](https://cdn.inappstory.com/sdk/v2.16.6/dist/js/IAS.js) (2025-02-04)
### Fixed
- Fixed bug with appearance of a scroll when opening `GameReader` if the page has scrollable content
- Fixed bug with `feedImpression` & `visibleAreaUpdated` in `v2.16.5`

## [2.16.5](https://cdn.inappstory.com/sdk/v2.16.5/dist/js/IAS.js) (2025-01-21)
### Added
- Added `userIdSign` story manager config parameter
### Fixed
- Fixed a bug with the changing width of story feed cards when loading the feed for the first time

## [2.16.4](https://cdn.inappstory.com/sdk/v2.16.4/dist/js/IAS.js) (2025-01-17)
### Added
- Added [`autoScrollOnStoryClose`](./feeds.md#customization) option to control auto scroll to invisible story card when closing the story reader

### Fixed
- Fixed a bug causing story cards to become unclickable on some mobile devices until the feed is scrolled
### Changed
- The default appearance settings for the stories list have been changed. The changes affected the properties `card.variant`, `card.border`, `card.height` and `card.title`.

## [2.16.3](https://cdn.inappstory.com/sdk/v2.16.3/dist/js/IAS.js) (2025-01-16)
### Fixed
- Fixed onboarding stories order with tags
- Fixed sending statistics at the time of document upload
- Fixed displaying the reload button on top of the dot lottie animation when a game loading error occurs

## [2.16.2](https://cdn.inappstory.com/sdk/v2.16.2/dist/js/IAS.js) (2024-12-06)
### Added
- Added share panel customization. See share panel [customization guide](./share-panel.md)
- Added VOD loading error handling with the ability to reload story
- Added `done` state for the copy button in the sharing panel of the story slide
### Fixed
- Fixed a bug where, during a long loading of story media resources, you can start changing slides by timeout when you lose focus and then focus on the story tab.
- Fixed a bug that caused the story to freeze when loading media resources unsuccessfully and then swiping between stories
- Fixed a bug where a blank image could be shared on iOS

## [2.16.1](https://cdn.inappstory.com/sdk/v2.16.1/dist/js/IAS.js) (2024-12-05)
### Added
- Added barcode widget support

## [2.16.0](https://cdn.inappstory.com/sdk/v2.16.0/dist/js/IAS.js) (2024-11-28)
### Added
- Added the ability to share text along with an image
### Fixed
- Handle lottie animation load error
### Changed
- SDK subdomain changed to CDN. Now instead of `https://sdk.domain-placeholder` use `https://cdn.domain-placeholder`.

## [2.15.2](https://cdn.inappstory.com/sdk/v2.15.2/dist/js/IAS.js) (2024-11-21)
### Fixed
- Fixed bug with `SharePage` when passing a story string identifier

## [2.15.1](https://cdn.inappstory.com/sdk/v2.15.1/dist/js/IAS.js) (2024-11-20)
### Fixed
- Fixed bug with `showStory()` when passing a story string identifier

## [2.15.0](https://cdn.inappstory.com/sdk/v2.15.0/dist/js/IAS.js) (2024-11-13)
### Fixed
- Bug with displaying the share button when opening the story reader for the first time
- Bug with hidden timeline in a story with one slide
- Video loader blinking
- Bug with show story from game
### Added
- Added support for the feature of opening a game from another game
- Disabling `pull-to-refresh` when opening a story reader and game reader on mobile devices
- Added game reader [`borderRadius`](./games.md#appearance) option
- Added timeline customization feature
- Errors notification with [`showStoryFailed`](./events.md) event
### Changed
- If the aspect ratio of the viewport on the desktop is less than `310/480`, then the story reader is displayed by the same way as on mobile devices
- Composite HTTP requests have been replaced with regular ones
- Methods `showOnboardingStories()`, `showStory()`, `showStoryOnce()` of `StoryManager` throw errors

## [2.14.5](https://cdn.inappstory.com/sdk/v2.14.5/dist/js/IAS.js) (2024-11-06)
### Fixed
- Fixed bug with pointer events on story slides

## [2.14.4](https://cdn.inappstory.com/sdk/v2.14.4/dist/js/IAS.js) (2024-10-09)
### Fixed
- Fixed storage of game data in GameReader
### Added
- Added "Next" button to the voting widget

## [2.14.3](https://cdn.inappstory.com/sdk/v2.14.3/dist/js/IAS.js) (2024-10-04)

### Fixed
- Fixed error `failed to execute fetch` associated with with non ISO-8859-1 user agent header encoding

## [2.14.2](https://cdn.inappstory.com/sdk/v2.14.2/dist/js/IAS.js) (2024-10-03)

### Added
- Added a feature to close a story by clicking on a button, image or using the swipe up gesture.

## [2.14.1](https://cdn.inappstory.com/sdk/v2.14.1/dist/js/IAS.js) (2024-09-23)

### Added
- Added stack feed [load events](./stack-feed.md#adding-a-custom-loader)

## [2.14.0](https://cdn.inappstory.com/sdk/v2.14.0/dist/js/IAS.js) (2024-09-16)

### Added
- Added RTL compatible display of stories feed and readers
- Added RTL compatible values ​​for properties `closeButtonPosition`, `sliderAlign`, `textAlign` (values `left` and `right` marked as `deprecated`).

## [2.13.1](https://cdn.inappstory.com/sdk/v2.13.1/dist/js/IAS.js) (2024-09-13)

### Fixed
- Fixed a bug with widget event that caused the application to crash when opening a story via `storyManager.showStory()`
- Fixed a bug due to which feed coverage statistics for the stack feed were not sent

## [2.13.0](https://cdn.inappstory.com/sdk/v2.13.0/dist/js/IAS.js) (2024-09-05)

### Added
- Added full VoD (Video on Demand) support

### Fixed 
- Fixed behavior of the timeline on mobile devices in stories with widgets with layers when swiping the story
- Fix share complete on mobile devices

## [2.12.6](https://cdn.inappstory.com/sdk/v2.12.6/dist/js/IAS.js) (2024-08-30)
- Fixed CSP error when using `strict-dynamic` directive

## [2.12.5](https://cdn.inappstory.com/sdk/v2.12.5/dist/js/IAS.js) (2024-08-20)

### Added

- Add `cardInsideTop` value for `title.position` parameter of story list card. See description [`title.position`](./feeds.md#preview-card).

## [2.12.4](https://cdn.inappstory.com/sdk/v2.12.4/dist/js/IAS.js) (2024-07-29)

### Fixed
- Change safe area insets background color for mobile devices, when the viewport aspect ratio by height is more than 1.85.

## [2.12.3](https://cdn.inappstory.com/sdk/v2.12.3/dist/js/IAS.js) (2024-07-19)

### Added 
- Added a background image for stories with videos. The video poster is used as a background.

### Fixed
- Fixed a bug with the appearance of a white border around the game reader when starting the game

## [2.12.2](https://cdn.inappstory.com/sdk/v2.12.2/dist/js/IAS.js) (2024-07-17)

### Fixed
- Fixed the value of `feed_id` field of the widget event
- Fixed order of favorite stories

## [2.12.1](https://cdn.inappstory.com/sdk/v2.12.1/dist/js/IAS.js) (2024-07-12)

### Added
- Added widget events to `<StoryManager>` [public events](./events.md)

## [2.12.0](https://cdn.inappstory.com/sdk/v2.12.0/dist/js/IAS.js) (2024-06-28)

### Added
- Added Lottie animation player for game reader.
- Added support for full screen games.
- Added support for IETF BCP 47 language tags.

### Fixed
- The logic for correcting the aspect ratio of the story reader for mobile devices has been changed
  
## [2.11.5](https://cdn.inappstory.com/sdk/v2.11.5/dist/js/IAS.js) (2024-06-26)

### Fixed
- Fixed bug with blinking story layers
- Fixed bug with opening story from stacked story feed
- Fixed bug with the timeline after opening a story with a widget affecting the duration
  
## [2.11.4](https://cdn.inappstory.com/sdk/v2.11.4/dist/js/IAS.js) (2024-06-20)

### Fixed
- Optimized work with multiple `<AppearanceManager>` instances
- Fixed a bug with opening onboarding story
  
## [2.11.3](https://cdn.inappstory.com/sdk/v2.11.3/dist/js/IAS.js) (2024-06-17)

### Fixed
- Fixed a bug due to which list controls do not work on mobile devices
- Fixed a bug due to which the `hasShare` parameter was ignored
- Fixed bugs with sharing on mobile devices
  
## [2.11.2](https://cdn.inappstory.com/sdk/v2.11.2/dist/js/IAS.js) (2024-06-06)

### Fixed
- Fixed a bug where the story timeline remained static and did not display the progress of viewing story
  
## [2.11.1](https://cdn.inappstory.com/sdk/v2.11.1/dist/js/IAS.js) (2024-04-24)

### Fixed
- Disabled screen lock feature on tablet devices in landscape mode
- Removed text label from the screen lock 
- Fixed behavior where when switching between stories, animations on different layers overlap each other
- Fixed behavior where the story timer starts after selecting an answer in the widget, but stops working when switching between browser tabs
- Improved validation of telephone input in the "Ask a Question" widget
- Added default input when there is no mask corresponding to the country code in the "ask a question" widget
  
## [2.11.0](https://cdn.inappstory.com/sdk/v2.11.0/dist/js/IAS.js) (2024-04-01)

### Added
- Added stacked story list view [`<StackedStoryList>`](./stack-feed.md)
- Added `gameEvent` event to [games](./games.md#eventgame)
- Added `showStoryOnce()` method to [`StoryManager`](./single-story.md)
  
## [2.10.8](https://cdn.inappstory.com/sdk/v2.10.8/dist/js/IAS.js) (2024-03-27)

### Fixed
- Fixed a bug with displaying favorite story previews in the favorite card when changing the aspect ratio
- Fixed a bug with `StoryReader` buttons displaying when using multiple `AppearanceManager` ​​instances

## [2.10.7](https://cdn.inappstory.com/sdk/v2.10.7/dist/js/IAS.js) (2024-03-20)

### Added

- Added `disableDeviceId` option for [`StoryManagerConfig`](./how-to-get-started.md#configuration)
- Added `defaultListLength` and `favoriteListLength` fields for `StoryManager` [public events](./events.md) payload

### Fixed
- Layering story cards in the favorite reader when the aspect ratio set in the project is different from 1

## [2.10.6](https://cdn.inappstory.com/sdk/v2.10.6/dist/js/IAS.js) (2024-02-29)

### Added

- Added `backdrop` option for [`GameReaderOptions`](./games.md#appearance)
- Added a limit on the number of characters entered in the "Ask a question" widget
- Added scroll view for "Ask a question" widget

### Fixed
- Display of "opened" status for story cards with games and deeplinks on click
- Bug with displaying timeline on story with the "disable timeline" option
- Close all opened readers on `setUserId()` method called 

## [2.10.5](https://cdn.inappstory.com/sdk/v2.10.5/dist/js/IAS.js) (2024-02-19)

### Added
- Update StoryManager to fit UgcEditorConfigurable interface (add method `getNonce()`)

## [2.10.5](https://cdn.inappstory.com/sdk/v2.10.5/dist/js/IAS.js) (2024-02-19)

### Added
- Added StoryManager internal method for support CSP in UGCEditor

## [2.10.4](https://cdn.inappstory.com/sdk/v2.10.4/dist/js/IAS.js) (2024-02-07)

### Fixed
- Fixed bug with `openGame()` method from [v2.10.3](#2103-2024-02-06)

## [2.10.3](https://cdn.inappstory.com/sdk/v2.10.3/dist/js/IAS.js) (2024-02-06)

### Added

- Added [`navigation`](./story-view.md#story-navigation-options) option for customizing navigation buttons for switching stories in [`StoryReader`](./story-view.md#options)

## [2.10.2](https://cdn.inappstory.com/sdk/v2.10.2/dist/js/IAS.js) (2024-01-31)

### Fixed

- Added support deprecated `MediaQueryList` [`addListener()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener) method for `setOptionsOverrideByMediaQuery()`
- Fixed error reading `scrollWidth` property of undefined in `StoriesList`

## [2.10.1](https://cdn.inappstory.com/sdk/v2.10.1/dist/js/IAS.js) (2024-01-26)

### Fixed

- Fixed a bug where the UGC card was displayed regardless of the stories feed configuration
- Fixed incorrect behavior of feed coverage statistics in [v2.10.0](#2100-2024-01-18)
- Refresh user data for widgets on slide in story repeat action

## [2.10.0](https://cdn.inappstory.com/sdk/v2.10.0/dist/js/IAS.js) (2024-01-18)

### Added

- Added story list [`direction`](./feeds.md#customization) parameter;
- Added a compensating frame when the viewport aspect ratio by height is more than 1.85

### Fixed

- Using `setTextZoom` value in Android WebView when determining story feed height;
- Preventing request for missing splash screen for games from the game center;
- Replacing the scroll model from CSS transform with native in the story list

## [2.9.4](https://cdn.inappstory.com/sdk/v2.9.4/dist/js/IAS.js) (2023-12-25)

### Fixed

- Fixed opening the game from the story with the "hide in reader" flag

## [2.9.3](https://cdn.inappstory.com/sdk/v2.9.3/dist/js/IAS.js) (2023-11-09)

### Fixed

- Bug with incorrect operation and display of story feed controls when resizing the viewport
- Bug with collecting feed coverage statistics before drawing a story feed with a session aspect ratio

## [2.9.2](https://cdn.inappstory.com/sdk/v2.9.2/dist/js/IAS.js) (2023-11-07)

### Added

- New social share buttons;
- Preview for sharing a screenshot of a slide;
- Support for phone, email and plain text input fields in the question widget;
- New share panel [options](./share-panel.md#customization) for customization copy and download buttons;

### Fixed

- Minimization the size of SVG social share icons;
- Update Twitter (X) logo icon;

## [2.9.1](https://cdn.inappstory.com/sdk/v2.9.1/dist/js/IAS.js) (2023-10-31)

### Fixed

- fixed UGCEditor initialization;

## [2.9.0](https://cdn.inappstory.com/sdk/v2.9.2/dist/js/IAS.js) (2023-10-25)

### Added

- The `ugcPayload` field for all events where there is a UGC story with payload. See story manager [events](./events.md);
- The `setFilter()` method for UGC stories filtering. See [example](../../ugc-guides/web-ugc.md#ugcstorieslist-reload-example);
- Support for props in UGC stories. See [example](../../ugc-guides/web-ugc.md#react-ugcsdk-example).
- `visibleAreaUpdated` event to collect statistics on visible areas of story cards in the feed. See story manager [events](./events.md);
- [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) support `nonce` attribute for game center
- `story.stat_title` for field title of story event object. See story manager [events](./events.md);

## [2.8.10](https://cdn.inappstory.com/sdk/v2.8.10/dist/js/IAS.js) (2023-10-16)

### Fixed

- Display story resources;

## [2.8.9](https://cdn.inappstory.com/sdk/v2.8.9/dist/js/IAS.js) (2023-10-16)

### Added

- [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) support unsafe-eval and unsafe-inline for style and script;

### Fixed

- Improve performance and accuracy of `feedImpression` statistics;

## [2.8.8](https://cdn.inappstory.com/sdk/v2.8.8/dist/js/IAS.js) (2023-10-6)

### Added

- [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) support for slide screenshot share;

## [2.8.7](https://cdn.inappstory.com/sdk/v2.8.7/dist/js/IAS.js) (2023-10-6)

### Added

- Ability to use lazy loading of story list covers. See `coverLazyLoading` parameter in [`<StoriesCardOptions>`](feeds.md#preview-card);
