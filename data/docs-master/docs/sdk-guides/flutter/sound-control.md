# Sound control

Stories may include videos with sound playback enabled. For these cards, a sound toggle button appears in the bottom
panel. By default, audio playback is turned off.

### Control

Sound is disabled by default in stories. You can enable it by calling `changeSound(bool enabled)` from
`InAppStoryManager`:

```dart
 Future<void> changeSound(bool enabled) async {
  await InAppStoryManager.instance.changeSound(enabled);
}
```

### Button customization

To change the sound button icons, you need to set the images in the
`setSoundIcon(String iconPath, String selectedIconPath)` method from `AppearanceManager`.

:::warning
SDK does not support working with SVG files.
Use png, jpg or jpeg files.
Make sure icons fit 24x24 px.
:::

```dart
Future<void> changeSoundIcon() async {
  final soundOffIcon = 'assets/icons/ic_sound_off.png';
  final soundOnIcon = 'assets/icons/ic_sound_on.png';
  await AppearanceManager.instance.setSoundIcon(soundOffIcon, soundOnIcon);
}
```