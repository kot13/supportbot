# Call To Action

:::warning[Attention!]
`Call To Action` is general callback and parameters are nullable (due to native SDK limitations). If you want to listen
specific events from story reader, please implement `IASCallbacks` mixin (see [Events](events.md) section)
:::

To receive events from story reader, IAM, etc. you can add a listener to `InAppStoryManager`:

```dart
Future<void> addCTACallback() async {
  InAppStoryManager.instance.addCallToActionCallback(
        (slideData, url, clickAction) {
      //do anything related
    },
  );
}
```

To remove callback from `InAppStoryManager` call `removeCallToActionCallback`:

```dart
Future<void> CTACallback() async {
  final callback = (SlideDataDto? slideData, String? url, ClickActionDto? clickAction) {
    //do anything related
  };
  InAppStoryManager.instance.addCallToActionCallback(callback);

  // Remove callback
  InAppStoryManager.instance.removeCallToActionCallback(callback);
}
```

Also, you can add `IASCallToActionCallback` mixin in a `State` class of a `StatefulWidget`.

```dart
class SimpleFeedExample extends StatefulWidget {
  const SimpleFeedExample({super.key});

  @override
  State<SimpleFeedExample> createState() => _SimpleFeedExampleState();
}

class _SimpleFeedExampleState extends State<SimpleFeedExample> with IASCallToActionCallback {

  @override
  void callToAction(SlideDataDto? slideData, String? url, ClickActionDto? clickAction) {
    // Do anything related
  }
}
```

:::warning[Attention!]
Using `IASCallToActionCallback` mixin and `addCallToActionCallback` in `InAppStoryManager` at the same time may cause
errors.
:::
