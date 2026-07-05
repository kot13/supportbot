# Single Story

To show single story in reader by id

```dart
IASSingleStoryHostApi().show(storyId: story.id);
```

To show single story in reader by id if wasn't show already for current user

```dart
IASSingleStoryHostApi().showOnce(storyId: story.id);
```

## Callbacks

To listen callbacks of result show()/showOnce() implement `IShowStoryCallbackFlutterApi` and setUp your listener

```dart
class _WidgetState extends State<T> implements IShowStoryCallbackFlutterApi {
  @override
  void initState() {
    super.initState();
    IShowStoryCallbackFlutterApi.setUp(this);
  }

  @override
  void dispose() {
    IShowStoryCallbackFlutterApi.setUp(null);
    super.dispose();
  }

  @override
  void alreadyShown() => print('IShowStoryCallback.alreadyShown()');

  @override
  void onError() => print('IShowStoryCallback.onError()');

  @override
  void onShow() => print('IShowStoryCallback.onShow()');
}
```