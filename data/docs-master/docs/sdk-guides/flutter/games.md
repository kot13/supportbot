# Games

The library supports running games.

## Usage

### To run game

```dart
void openGame() async {
  await IASGamesHostApi().openGame('<game id>');
}
```

### To close game

```dart
void closeGame() async {
  await IASGamesHostApi().closeGame();
}
```

## Preload games

If you want to preload games by yourself (f.e. in case if your app doesn't use any stories), you can call next method:

```dart
void preloadGames() async {
  await IASGamesHostApi().preloadGames();
}
```

## Callbacks

To listen to callbacks from games you need to implement `IASGameReaderCallback` mixin and override callbacks listed
below:

:::warning[Please note]
`finishGame` callback is `Deprecated`, use `closeGame` instead. 
:::

```dart
class _MyAppState extends State<MyApp> with IASGameReaderCallback {
  @override
  void startGame(ContentDataDto? gameData) {
    print('startGame ${gameData?.contentType.toString()}');
  }

  @override
  void closeGame(ContentDataDto? gameData) {
    print('closeGame');
  }

  @override
  void eventGame(ContentDataDto? contentData, String? gameId, String? eventName,
      Map<String?, Object?>? payload) {
    print('event game');
  }

  @override
  void gameError(ContentDataDto? gameData, String? message) {
    print('gameError');
  }
}
```
