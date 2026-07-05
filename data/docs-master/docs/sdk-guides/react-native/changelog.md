# Changelog

## 0.27.1 (2026-05-20)

### Added

- Added missing IAM events

## 0.27.0 (2026-05-14)

### Added

- In-app messaging
- Added CoverQuality in common options in AppearanceManager

## 0.26.3 (2025-12-04)

### Bug Fixes

- Android: remove deprecated UGCEditor (with unnecessary media read permissions)

## 0.26.2 (2025-12-02)

### Bug Fixes

- Android: correct loading stories for any feed slug (not only for default feed slug)
- events: don't allow subscribe on events absented in native module

## 0.26.1 (2025-08-11)

### Bug Fixes

- iOS: update ias-sdk to 1.25.13 (fix data for clickOnStory statistic event)

## 0.26.0 (2025-08-08)

### Bug Fixes

- correct process defaultMuted true value

### Features

- events: add clickOnStory event
- events: add field slidesCount to showSlide and showStory events
- exampleApp: update for new sdk version

## 0.25.0 (2025-07-24)

### Bug Fixes

- exampleApp: android build on RN v0.74.2

### Features

- exampleApp: add icons overload example
- StoriesList: add onLoadStart and onLoadEnd call for favoritesOnly StoriesList

## 0.24.0 (2025-07-16)

### Bug Fixes

- events: add missing favoriteListLength field to onLoadEnd event

### Features

- StoryListUI: add new renderFavoriteCell: RenderFavoriteCell render props

## 0.23.0 (2025-03-07)

### Features

- add userIdSign to API
- Android: update ias-sdk to 1.20.9 (ability to override appVersion and appBuild)
- iOS: update ias-sdk to 1.24.15 (new feature - userId sign)
- remove deprecated StoriesListOptions.card.title.color and StoriesListOptions.title options

## 0.22.0 (2025-02-12)

### Bug Fixes

- Android/FavoriteCell: add missed fun onFavoriteCell in InappstorySdkModule class

### Features

- add customStyles?: StyleProp prop to StoriesListFavoriteCardOptions

## 0.21.1 (2025-01-17)

### Bug Fixes

- useEvents: do (init = false) in unmount of useEvents hook

## 0.21.0 (2025-01-17)

### Features

- Android: update ias-sdk to 1.20.7 (NPE fixes)

## 0.20.0 (2024-12-16)

### Bug Fixes

- types: remove unused field svgMask from StoriesListCardOptions

### Features

- add ability to change `appVersion` and `appBuild` via `StoryManagerConfig.appVersion`
- add additional prop options (type - `{isFirstItem, isLastItem}`) to `renderCell` render-prop
- Android: update ias-sdk to 1.20.4 (ability to override `appVersion` and `appBuild`)
- iOS: update ias-sdk to 1.24.9 (ability to override `appVersion` and `appBuild`)

## 0.19.0 (2024-11-20)

### Features

- Android: updated ias-sdk to 1.20.3 (`timelineHide`, `timelineColor`)
- iOS: updated ias-sdk to 1.24.8 (`timelineHide`, `timelineColor`)

## 0.18.0 (2024-10-14)

### Bug Fixes

- added `{fontSize; fontWeight; fontFamily; lineHeight; }` to `StoriesListCardOptions` type
- Android/CarouselCardVideoCover: use `useTextureView` true for ability to change card opacity
- StoriesCarousel/FlatList: changing onViewableItemsChanged on the fly is not supported

### Features

- Android: fix Android InAppStory native sdk with v1.20.1
- iOS: update example app with v1.24.3
- podspec: fix ios InAppStory native sdk with v1.24.3
- StoryManager/Settings: remove setSandbox from Public API, sandbox now is always false
