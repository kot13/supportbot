# StoryListAPI

Class is used for communication between list widgets and `IAS IOS SDK`. To work with StoryListAPI, you need to initialize an instance of the class:

```Swift
let storyListAPI = StoryListAPI(feed: <feed>, isFavorite: <isFavorite>)
```

## Methods

To run the internal logic and get a list of storis:

```Swift
func getStoriesList()
```

To refresh the list and cached data:

```Swift
func refresh(_ feed: String? = nil)
```

To open story reader for concrete list/feed

```Swift
func selectStoryCellWith(id: String)
```

To notify SDK about list items was shown on a screen (to start image caching and gather statistic):

```Swift
func setVisibleWith(storyIDs: Array<String>)
```

To notify SDK about cell favorite item was shown on a screen (to start image caching):

```Swift
func setVisibleFavorite()
```

## CallBacks (closures)

```Swift
typealias StoryUpdateHandler = (_ data: StoryCellData) -> Void
typealias StoriesListUpdateHandler = (_ list: Array<StoryCellData>, _ favorite: Array<SimpleFavoriteData>?, _ feed: String) -> Void
typealias FavoriteUpdateHandler = (_ data: Array<SimpleFavoriteData>?) -> Void
typealias ScrollHandler = (_ index: Int) -> Void
```

A notification that the storis data has been updated (For example, it has been read or added to favorites):
```Swift
var storyUpdate: StoryUpdateHandler?
```

Notification that the list data has been updated:
```Swift
var storyListUpdate: StoriesListUpdateHandler?
```

Notification that the favorites list data has been updated:
```Swift
var favoritesUpdate: FavoriteUpdateHandler?
```

Notification that the list should be scrolled to a story with an index:
```Swift
var scrollUpdate: ScrollHandler?
```