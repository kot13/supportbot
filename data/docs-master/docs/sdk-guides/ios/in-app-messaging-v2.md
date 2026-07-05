# In-App Messaging (>1.28.0)

Starting from version 1.25.0, the SDK includes the **In-App Messaging (IAM)** module for showing interactive messages inside the app.

Starting from version 1.28.0, the SDK introduced changes to the **In-App Messaging (IAM)** module: the API interface was updated ([migration guide](migrations.md#iam-migration-sdk-1280)) and a new IAM presentation type was added: toast.

This document describes the **current implementation**: showing by ID and by event, container selection via the `inAppMessageWillShow` callback, presentation types (`IAMPresentType`), SwiftUI and UIKit integration, preloading, tags, and events.

> **Pay attention**  
> Before using IAM, you must complete [SDK initialization](../../sdk-guides/ios/how-to-get-started.md#basic-initialization). Without initialization, show and preload calls will not work.

## Showing messages

### Showing by ID

To show a message by a known identifier, call:

- **UIKit:** `InAppStory.shared.showInAppMessageWith(id: <messageID>, targetView: <UIView?>, ...)`
- **SwiftUI (with the default container):** `InAppStory.shared.showIAMWith(id: <messageID>, ...)`  
  Or call `showInAppMessageWith(id: targetView: ...)` and pass `targetView` from your container.

The `targetView` parameter defines the container (the area of the screen) where the IAM will be rendered. If you do not pass `targetView`, the SDK uses the container returned by `inAppMessageWillShow`, or a container registered via the SwiftUI modifier (see below).

```Swift
// Example: UIKit, show inside the current screen container
class IAMController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        InAppStory.shared.initWith(serviceKey: "<api-key>", settings: Settings(userID: "<userID>", tags: ["tag"]))
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // Container is the controller's view; you can pass any UIView
        InAppStory.shared.showInAppMessageWith(id: "<messageID>", targetView: view) { show in
            // show == true if the IAM screen was actually displayed
        }
    }
}
```

> **Remark**  
> The method returns `CancellationToken?`, which allows cancelling the show operation. See [Cancellation of actions](../../sdk-guides/ios/cancellation-of-actions.md) for details.

### Showing by event name

To show a message bound to an event:

- **UIKit:** `InAppStory.shared.showInAppMessageWith(event: <eventName>, targetView: <UIView?>, tags: <[String]?>, ...)`
- **SwiftUI:** `InAppStory.shared.showIAMWith(event: <eventName>, inContainer: <containerID>, tags: <[String]?>, ...)`

When calling by event, you can pass a list of tags to filter messages.

```Swift
// Example: show by event with tags
InAppStory.shared.showInAppMessageWith(
    event: "welcome",
    targetView: containerView,
    tags: ["onboarding"]
) { show in
    // show indicates whether the message was shown successfully
}
```



## Container and presentation type

IAM can be displayed in different styles: full screen, bottom sheet, pop-up, or toast. The presentation type is configured in the dashboard and is passed to the app via a callback **before** the message is shown.

### `inAppMessageWillShow` callback

Before each IAM presentation attempt, the SDK calls:

```Swift
InAppStory.shared.inAppMessageWillShow = { id, event, presentType in
    // id - message identifier
    // event - event name (if showing by event), otherwise nil
    // presentType - presentation type: .fullScreen, .bottomSheet, .popUp, .toast
    return nil  // or UIView - the container where the IAM should be shown
}
```

- **Return value:** `UIView?`
  - If you return a **non-nil** `UIView`, the message will be shown **exactly in it** (any `targetView` passed to `showInAppMessageWith` is ignored).
  - If you return **nil**, the SDK uses `targetView` from the show call, or the container registered via `.inAppMessageContainer()` (for example, in SwiftUI).

> **Pay attention**  
> The callback is called **always** when the SDK attempts to show an IAM, regardless of whether `targetView` was passed to `showInAppMessageWith`. This allows you to centrally decide where to show the message (for example, show toasts in a separate overlay window above the entire app, and show other types in the current screen container).

### `IAMPresentType` presentation type

Public enum available in the `inAppMessageWillShow` signature:

| Value          | Description (general)   |
|----------------|-------------------------|
| `fullScreen`   | Full-screen presentation |
| `bottomSheet`  | Bottom sheet (modal)     |
| `popUp`        | Pop-up window            |
| `toast`        | Toast message            |

Based on `presentType`, the app can, for example, return a view from a separate overlay window for `toast` in `inAppMessageWillShow`, and return `nil` for other types so the standard screen container is used.



## Closing

When the IAM screen closes, the SDK calls:

```Swift
InAppStory.shared.inAppMessageDidClose = {
    // Update UI, hide overlay window, etc.
}
```

If you show toasts in a separate window (by returning your own `UIView` from `inAppMessageWillShow`), this callback is a convenient place to hide that window.


## SwiftUI integration

### Default container

The **`.inAppMessageContainer()`** modifier registers the current SwiftUI View as an IAM container. The message will be displayed on top of exactly this View.

```Swift
struct MainView: View {
    var body: some View {
        content
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .inAppMessageContainer()  // IAM is displayed on top of this area
    }
}
```

When you call `showInAppMessageWith` without `targetView` (or `showIAMWith` without specifying a container), and `inAppMessageWillShow` returns `nil`, the SDK uses the container registered via `.inAppMessageContainer()`.

### Named containers

If the app has multiple screens with different zones for IAM, you can register **named containers** and specify where to show the message:

```Swift
// Register a container with an identifier
SomeView()
    .inAppMessageContainer(id: "settings_screen")

// Show IAM in a specific container
InAppStory.shared.showIAMWith(id: "<messageID>", inContainer: "settings_screen") { show in
    // ...
}
```

The **`IAMDefaultContainerID`** constant corresponds to the container registered via `.inAppMessageContainer()` without parameters. The `showIAMWith(id:inContainer:)` and `showIAMWith(event:inContainer:)` methods use `IAMDefaultContainerID` by default.

### `showIAMWith` methods (SwiftUI)

Convenience wrappers for showing inside a selected container without working with `UIView` directly:

```Swift
// Show by ID in the default container
InAppStory.shared.showIAMWith(id: "<messageID>") { show in }

// Show by ID in a named container
InAppStory.shared.showIAMWith(id: "<messageID>", inContainer: "my_container") { show in }

// Show by event, with tags
InAppStory.shared.showIAMWith(event: "welcome", tags: ["onboarding"]) { show in }
```

Internally, they obtain the `UIView` from the container registry and call the standard `showInAppMessageWith(targetView: ...)`.



## Preloading

To make IAM open faster, you can preload message data. Call `InAppStory.shared.preloadInAppMessages(...)` (or the corresponding API method) and wait for completion.

> **Pay attention**  
> Preloading is only possible after SDK initialization.

### Basic preloading (for example, on a Splash Screen)

```Swift
InAppStory.shared.preloadInAppMessages { result in
    switch result {
    case .success:
        // Data was loaded
        break
    case .failure:
        // Loading error
        break
    }
}
```

### Restrict showing to preloaded messages only

In show methods you can pass **`onlyPreloaded: true`**. Then, if the message data has not been loaded yet, the IAM will not be shown and `completion` will receive `false`.

```Swift
InAppStory.shared.showInAppMessageWith(
    id: "<messageID>",
    targetView: view,
    onlyPreloaded: true
) { show in
    // show == false if the message was not in cache
}
```

### Preloading by ID list

To preload specific messages by identifiers, use the overload with the `ids` parameter:

```Swift
InAppStory.shared.preloadInAppMessages(ids: ["id1", "id2"]) { result in
    // ...
}
```



## Tags

IAM supports tags, which allow you to control more precisely which messages to show. Tag list limitations are the same as for stories (see [tags](../../sdk-guides/ios/tags.md)).

### Preloading by tags

When calling preloading, you can specify the tags by which to fetch messages:

```Swift
InAppStory.shared.preloadInAppMessages(tags: ["promo", "welcome"]) { result in
    switch result {
    case .success: break
    case .failure: break
    }
}
```

### Show by event with tags

When showing by event, you can pass a list of tags to filter:

```Swift
InAppStory.shared.showInAppMessageWith(
    event: "welcome",
    targetView: view,
    tags: ["onboarding", "first_launch"]
) { show in }
```



## Events and callbacks

### Main callbacks

- **`inAppMessageWillShow`** - called before showing IAM; allows returning a custom container (`UIView`) and receiving the presentation type (`IAMPresentType`).
- **`inAppMessageDidClose`** - called after the IAM screen is closed.

User actions inside the message (opening links, etc.) are handled via `InAppStory.shared.onActionWith` (see [link-handling](../../sdk-guides/ios/link-handling.md#simple-link-handling) for details).

### IAM events: `inAppMessagesEvent`

For detailed tracking of IAM events, use the separate callback **`InAppStory.shared.inAppMessagesEvent`**. The child type **`IASEvent.IAMessage`** is available with the following cases:

- **`preloaded(messages: [InAppMessageData])`** - IAM data preloading succeeded.
- **`show(iamData: InAppMessageData)`** - the IAM screen was displayed.
- **`close(iamData: InAppMessageData)`** - the IAM screen was closed.
- **`clickOnButton(iamData: InAppMessageData, link: String)`** - button click inside the message with the given parameters.
- **`widgetEvent(iamData: InAppMessageData, name: String, data: [String: Any]?)`** - widget action (see widget event documentation for widget name and payload: [widget events](../../glossarium/statistics/stories-widget-events.md)).

Errors are handled via **`InAppStory.shared.failureEvent`**. For IAM, the case **`IASEvent.Failure.inAppMessageFailure(message: String)`** was added to represent an In-App Message related error.



## Quick summary

| Task | Recommended approach |
|--------|----------------------|
| Show IAM by ID in the current screen (UIKit) | `showInAppMessageWith(id: targetView: view, ...)` |
| Show IAM by ID (SwiftUI) | `.inAppMessageContainer()` on the View + `showIAMWith(id: ...)` |
| Show IAM in a selected container (SwiftUI) | `.inAppMessageContainer(id: "id")` + `showIAMWith(..., inContainer: "id")` |
| Toasts above the entire app | In `inAppMessageWillShow`, when `presentType == .toast`, return your `UIView` (for example, from an overlay window); in `inAppMessageDidClose`, hide that window. |
| Callback registration | Assign `inAppMessageWillShow` and `inAppMessageDidClose` before the first IAM show (for example, after SDK initialization). |
| Preloading | `preloadInAppMessages` / `preloadInAppMessages(ids:)` / `preloadInAppMessages(tags:)` after initialization. |

Additional integration examples for UIKit and SwiftUI (including toast overlay) are provided in separate example documents.
