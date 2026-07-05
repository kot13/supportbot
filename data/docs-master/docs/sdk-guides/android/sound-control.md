# Sound control

The method `InAppStoryManager.getInstance().soundOn(boolean isSoundOn)` flag is responsible for on/off sound playback in stories (`true` - sound is on, `false` – sound is off).

### Turn on / off sound at runtime

```kotlin
InAppStoryManager.getInstance().soundOn(true);
```

### Turn on / off sound by default

By default after `InAppStoryManager` initialization sound is turned off. It can be changed in the `constants.xml`

```xml
<bool name="defaultMuted">true</bool>
```
