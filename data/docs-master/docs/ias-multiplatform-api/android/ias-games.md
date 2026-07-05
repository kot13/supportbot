# IASGames

Class is used to load and open [games](/sdk-guides/android/games.md) from Game center (by game's id). Can be called from InAppStoryAPI:

```kotlin
val gamesApi = inAppStoryApi.games
```

## Methods

To open game from GC by id:

```kotlin
fun open(
    context: Context, 
    gameId: String
)
```

To close gameReader externally:

```kotlin
fun close()
```

To add [`GameReaderCallback`](/sdk-guides/android/events.md#gamereader):

```kotlin
fun callback(gameReaderCallback: GameReaderCallback)
```