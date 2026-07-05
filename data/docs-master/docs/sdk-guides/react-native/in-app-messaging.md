# In-App Messaging

Starting from `0.27.0` version the `In-App-Messaging` (IAM) feature is available in the React Native SDK. This feature
allows you to display in-app messages (such as banners, notifications, etc.) in your application.

The module provides methods for preloading messages, displaying them, and handling related events.

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

## Showing messages

### Showing by ID

To show IAM by identifier call `storyManager.showIAMById(<messageId>, ...)`

```ts
await storyManager.showIAMById(
  "<iamId>",
  false, // onlyPreloaded true/false
  null,
);
```

> **Remark**  
> Last parameter allows cancelling the operation. For more details,
> see [Cancellation of actions](cancellation-of-actions.md).

### Showing by event name

To show IAM by event call `storyManager.showIAMByEvent(<eventId>, ...)`

```ts
await storyManager.showIAMByEvent(
  "<iamEvent>",
  false, // onlyPreloaded true/false
  null,
);
```

> **Remark**  
> Last parameter allows cancelling the operation. For more details,
> see [Cancellation of actions](cancellation-of-actions.md).

## Preloading

To preload in-app messages, you can use the `storyManager.preloadIAM(...)` method. This method allows you to
preload all messages or preload specific messages by passing its ids and tags.

```ts
await manager.preloadIAM(["<iamId>", "<iamId2>"], ["<tag>", "<tag2>"]);
```

## Events

Use `storyManager.on()` to listen events from In-App Messaging:

```ts
storyManager.on(eventName, (payload) => {
  console.log(eventName, payload);
});
```

### Available IAM events

| Event name              | Payload                                                    |
| ----------------------- | ---------------------------------------------------------- |
| showInAppMessage        | `{ id: int, title: String, event: String }`                |
| closeInAppMessage       | `{ id: int, title: String, event: String }`                |
| inAppMessageWidgetEvent | `{ data: Object, name: String, inAppMessageData: Object }` |
