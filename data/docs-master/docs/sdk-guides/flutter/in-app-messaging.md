# In-App-Messaging

Starting from `0.3.0`, the `In-App-Messaging`(IAM) feature is available in the Flutter SDK. This feature allows you to
display in-app messages (such as banners, notifications, etc.) in your application.

The module provides methods for preloading
messages, displaying them, and handling related events.

:::tip[Note]
If you have troubles with closing IAM in Android devices by pressing back button or using back gesture,
please add `android:enableOnBackInvokedCallback="true"` to `AndroidManifest.xml` file:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application>
        <activity
                android:name=".MainActivity"
                android:enableOnBackInvokedCallback="true">
        </activity>
    </application>
</manifest>
```
:::

## Show In-App Message

### By Message ID

To show an in-app message by its ID, you can use the `IASInAppMessagesHostApi().showById(...)` method.

```dart
Future<void> showInAppMessage(String id) async {
  await IASInAppMessagesHostApi().showById(id);
}
```

### By Event

To show a message for a specific event, you must call the `IASInAppMessagesHostApi().showByEvent(...)` method.

```dart
Future<void> showInAppMessage(String event) async {
  await IASInAppMessagesHostApi().showByEvent(event);
}
```

## Preload In-App Messages

To preload in-app messages, you can use the `IASInAppMessagesHostApi().preload()` method. This method allows you to
preload all messages or preload specific messages by passing its ids.

```dart
Future<void> preloadInAppMessages(List<String>? messageIds) async {
  await IASInAppMessagesHostApi().preloadMessages(ids: messageIds);
}
 ```

It is also possible to limit the message display if it is not preloaded. To do this, specify the `onlyPreloaded = true`
parameter in the `IASInAppMessagesHostApi.showById(...)` or `IASInAppMessagesHostApi.showByEvent(...)` methods of
showing the message. In this case, the InAppMessage screen will not be shown.

```dart
Future<void> showInAppMessageById(String id) async {
  await IASInAppMessagesHostApi().showById(id, onlyPreloaded: true);
}

Future<void> showInAppMessageByEvent(String event) async {
  await IASInAppMessagesHostApi().showByEvent(event, onlyPreloaded: true);
}
```

## Events

To receive events from the In-App Messaging module, you can implement the `IASInAppMessageCallback` mixin and set up
your listener.

```dart
class InAppMessageWidget extends StatefulWidget {
  const InAppMessageWidget({super.key});

  @override
  State<InAppMessageWidget> createState() => _InAppMessageWidgetState();
}

class _InAppMessageWidgetState extends State<InAppMessageWidget>
    with IASInAppMessageCallback {
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        IASInAppMessagesHostApi().showById("<id>");
      },
      child: const Text("Show In-App Message"),
    );
  }

  @override
  void onShowInAppMessage(InAppMessageDataDto? inAppMessageData) {
    print("IAM: onShowInAppMessage: ${inAppMessageData?.id}");
  }

  @override
  void onCloseInAppMessage(InAppMessageDataDto? inAppMessageData) {
    print("IAM: onCloseInAppMessage: ${inAppMessageData?.id}");
  }

  @override
  void onInAppMessageWidgetEvent(InAppMessageDataDto? inAppMessageData,
      String? name, Map<String?, Object?>? data) {
    print("IAM: onInAppMessageWidgetEvent: ${inAppMessageData?.id}");
  }
}
```

### Event List

- `onShowInAppMessage(InAppMessageDataDto? inAppMessageData)` - Called when the in-app message is shown:
    - `inAppMessageData` - The data of the in-app message that was shown;
- `onCloseInAppMessage(InAppMessageDataDto? inAppMessageData)` - Called when the in-app message is closed:
    - `inAppMessageData` - The data of the in-app message that was shown;
- `onInAppMessageWidgetEvent(InAppMessageDataDto? inAppMessageData,
      String? name, Map<String?, Object?>? data)` - Called when the in-app message widget event is triggered:
    - `inAppMessageData` - The data of the in-app message that was shown;
    - `name` - The name of widget;
    - `data` - widget data detail;

```dart
class InAppMessageDataDto {
  /// The unique identifier of the in-app message.
  int id;

  /// The title of the in-app message, or `null` if not available.
  String? title;

  /// The event associated with the in-app message, or `null` if not available.
  String? event;
}
```