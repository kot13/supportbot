# Appearance

## AppearanceManager

This singleton class is used to manage the appearance of the Story Reader.

To call any method, you need to get an instance of this class:

```dart
  await AppearanceManager.instance.methodName();
```

## Story Reader customization

#### Change appearance of story reader:

1. [Close button position](#close-button-position)
2. [Timer gradient](#reader-timer-gradient)
3. [Reader background](#reader-background)
4. [Reader corner radius](#reader-corner-radius)
5. [Reader presentation style](#reader-presentation-style)
6. [Reader scroll style](#reader-scroll-style)
7. [Reader navigation bar color (Android)](#reader-navigation-bar-color-android)

### Close button position

In the story reader, you can control the position of the close button. Available positions:

- `Position.topLeft`
- `Position.topRight`
- `Position.bottomLeft`
- `Position.bottomRight`

```dart
Future<void> changeCloseButtonPosition(Position position) async {
  await AppearanceManager.instance.setClosePosition(position);
}
```

### Reader timer gradient

To Enable/disable Timer gradient:

```dart
Future<void> enableTimerGradient() async {
  await AppearanceManager.instance.setTimerGradientEnable(true);
}
```

Get state:

```dart

final Future<bool> timerGradientEnabledFuture = AppearanceManager.instance.getTimerGradientEnable();
```

Set gradient with colors and locations:

```dart
Future<void> changeColor() async {
  const gradient = LinearGradient(
      colors: [Colors.purple, Colors.amber], stops: [0.1, 0.3]);

  await AppearanceManager.instance.setTimerGradient(
    colors: gradient.colors.map((it) => it.value).toList(),
    locations: gradient.stops ?? [],
  );
}
```

### Reader background

To change the background color of story reader:

```dart
Future<void> setBackgroundColor(Color color) async {
  await AppearanceManager.instance.setReaderBackgroundColor(color);
}
```

### Reader corner radius

```dart
Future<void> setCornerRadius() async {
  await AppearanceManager.instance.setReaderCornerRadius(16);
}
```

### Reader presentation style

Available reader presentation styles:

- `PresentationStyle.zoom`
- `PresentationStyle.modal`
- `PresentationStyle.fade`

```dart
Future<void> setReaderPresentationStyle(PresentationStyle style) async {
  await AppearanceManager.instance.setReaderPresentationStyle(style);
}
```

### Reader scroll style

Available reader scroll styles:

- `ScrollStyle.flat`
- `ScrollStyle.cover`
- `ScrollStyle.cube`

```dart
Future<void> setReaderScrollStyle(ScrollStyle style) async {
  await AppearanceManager.instance.setReaderScrollStyle(style);
}
```

### Reader navigation bar color (Android)

To change color of the story reader navigation bar in Android devices, call `setNavBarColor` method:

```dart
Future<void> changeNavBarColor() async {
  await AppearanceManager.instance.setNavBarColor(Colors.blueGrey);
}
```

Also, you can set color in dark mode:

:::warning[Please note]
If the `darkColor` parameter is not specified, the SDK uses the color from the first parameter
:::

```dart
Future<void> changeNavBarColor() async {
  await AppearanceManager.instance.setNavBarColor(Colors.blueGrey, darkColor: Colors.lightGreen);
}
```

## Reader buttons

### Show/hide buttons

To show or hide buttons for story reader, you can use these methods:

- likes/dislikes

```dart
Future<void> enableLikeButtons(bool enabled) async {
  await AppearanceManager.instance.setHasLike(true);
}
```

- favorite

```dart
Future<void> enableFavoritesButton(bool enabled) async {
  await AppearanceManager.instance.setHasFavorites(true);
}
```

- share

```dart
Future<void> enableShareButton(bool enabled) async {
  await AppearanceManager.instance.setHasShare(true);
}
```

### Changing icons

The bottom panel icons of story reader can be replaced by images
from [assets](https://docs.flutter.dev/ui/assets/assets-and-images).
Each button has two states: normal and selected.

:::warning
SDK does not support working with SVG files.
Use png, jpg or jpeg files.
Make sure icons fit 24x24 px
and [resolution-aware](https://docs.flutter.dev/ui/assets/assets-and-images#resolution-aware) .
:::

| Method            | Params                                   | Description         |
|-------------------|------------------------------------------|---------------------|
| `setLikeIcon`     | String iconPath, String selectedIconPath | Sets like icons     |
| `setDislikeIcon`  | String iconPath, String selectedIconPath | Sets dislike icons  |
| `setFavoriteIcon` | String iconPath, String selectedIconPath | Sets favorite icons |
| `setShareIcon`    | String iconPath, String selectedIconPath | Sets share icons    |
| `setCloseIcon`    | String iconPath                          | Sets close icon     |
| `setSoundIcon`    | String iconPath, String selectedIconPath | Sets sound icon     |

#### Usage

```dart
Future<void> changeCloseIcon() async {
  final assetPath = 'assets/icons/ic_close.png';
  await AppearanceManager.instance.setCloseIcon(assetPath);
}
```

## Cover quality

To change the story list covers image quality, use `setCoverQuality` method:

```dart
Future<void> changeCoverQuality() async {
  await AppearanceManager.instance.setCoverQuality(CoverQuality.High);
}
```

If not set—the SDK will use medium image quality. Available CoverQuality variations:

```dart
enum CoverQuality {
  Medium,
  High
}
```

## Goods item appearance

To customize appearance of goods items (v1), call `setGoodsItemAppearance()` method. More info
in [Goods](goods.md#customization) section.