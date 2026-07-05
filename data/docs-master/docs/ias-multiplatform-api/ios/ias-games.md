# GamesAPI

Class is used to load and open [games](/sdk-guides/ios/games.md) from Game center (by game's id). Can be called from InAppStoryAPI:

```Swift
let gamesAPI = InAppStoryAPI.shared.gamesAPI
```

## Methods

To open game from GC by id:

```Swift
func openGame(
    with game: Game,
    notificationInfo: Dictionary<String, Any>? = nil,
    complete: ((_ opened: Bool) -> Void)? = nil
)
```

To close gameReader externally:

```Swift
func closeGame()
```

## CallBacks (closures)

Reader with game will show

```Swift
var gameReaderWillShow: (() -> Void)?
```

Reader with game did close 

```Swift
var gameReaderDidClose: (() -> Void)?
```

Game complete with data (optional)

```Swift
var gameComplete: ((_ data: String, 
                    _ result: Dictionary<String, Any>?, 
                    _ url: String?) -> Void)?
```