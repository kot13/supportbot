# In-App Messaging (SwiftUI) — examples

This document contains practical examples of integrating In-App Messages (IAM) into a SwiftUI app.

It is assumed that the SDK is already [initialized](/sdk-guides/ios/how-to-get-started#basic-initialization). For a detailed API description, see [In-App Messaging (current implementation)](in-app-messaging-v2).

> **Pay Attention**
>
> In SwiftUI, it is important to define in advance **where** in the hierarchy the IAM container will live (via `.inAppMessageContainer()`),
> otherwise, when showing IAM without `targetView`, the SDK will not be able to select a `UIView` container.

## IAM containers: how the `UIView` container is selected

IAM must always be “embedded” into a specific `UIView` container (in SDK terms — `targetView`).
In SwiftUI, the container is created automatically via the `.inAppMessageContainer()` modifier (or `.inAppMessageContainer(id:)` for multiple containers).

Also, starting with SDK version 1.28.6, the `ignoreSafeArea: Bool = false` parameter has been added to the modifier. When set to `true`, this parameter allows you to ignore the SafeArea and stretch the container to full screen, bypassing the system’s navigation bar and bottom bar.

### Container selection priority

When showing IAM, the SDK selects the container using the following logic (from higher priority to lower priority):

1. **`inAppMessageWillShow`**  
   If the closure returns a `UIView`, it is used as the container (overrides everything else).

2. **`targetView`, passed into `showInAppMessageWith(...)`**  
   This is an explicit container selection (usually used in UIKit or when you already have a `UIView`).

3. **SwiftUI-container by default**  
   The `UIView` registered via `.inAppMessageContainer()` (stored inside the SDK as the “current” container).

> **Warning**
>
> If none of the conditions above are met (nil from `inAppMessageWillShow`, no `targetView` passed, and no SwiftUI container registered),
> IAM will not be shown and you will see an error like `InAppMessage cannot be shown without targetView.`.

### Why containers are needed in SwiftUI

The container is a “layer” where the SDK adds the IAM reader (a UIKit view). In SwiftUI it allows you to:

- **control the area** of presentation (which screen and which content IAM appears above)
- **have multiple presentation points** (named containers) and choose the right one
- handle **hit-testing** correctly: IAM is tappable where the reader content exists, and in transparent areas touches should go to the UI beneath it

### Example: two containers and dynamic selection in `inAppMessageWillShow`

This approach is useful if you want to choose the presentation location “depending on the situation” (for example, depending on the current tab),
while not passing `UIView` around.

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct IAMDynamicContainerExample: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            Color.white
                .overlay(Text("Home"))
                .inAppMessageContainer(id: "home_container")
                .tag(0)

            Color.white
                .overlay(Text("Profile"))
                .inAppMessageContainer(id: "profile_container")
                .tag(1)
        }
        .onAppear {
            InAppStory.shared.inAppMessageWillShow = { _, _, _ in
                let id = (selectedTab == 0) ? "home_container" : "profile_container"
                // Return the UIView container with the required id — it will have priority.
                return IAMContainerRegistry.shared.container(forID: id)
            }
        }
    }
}
```

> **Pay Attention**
>
> The example above demonstrates the principle. In a real project it is usually more convenient to assign `inAppMessageWillShow`
> once (for example, at app startup) and read the “current screen/tab” from shared app state.

---

## 1. Minimal example: container + show IAM by id

Below is an example screen that registers an IAM container and shows a message by id.

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct IAMMinimalScreen: View {
    @State private var token: CancellationToken?

    var body: some View {
        VStack(spacing: 12) {
            Button("Show IAM by id") {
                token = InAppStory.shared.showInAppMessageWith(id: "<message_id>") { shown in
                    print("IAM shown:", shown)
                }
            }

            Button("Cancel") {
                token?.cancel()
                token = nil
            }
        }
        .padding()

        // Container for IAM (non-toast types)
        .inAppMessageContainer()
    }
}
```

> **Warning**
>
> If you call `showInAppMessageWith(...)` before SwiftUI has mounted the View with `.inAppMessageContainer()`,
> the container may not be registered yet. In that case, the show attempt may end with `false` or a container error.
> This typically happens when you show “immediately” in `onAppear` / right after navigation.

---

## 2. Show IAM by event (and optionally by tags)

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct IAMEventScreen: View {
    var body: some View {
        Button("Show IAM by event") {
            InAppStory.shared.showInAppMessageWith(event: "my_event") { shown in
                print("IAM shown by event:", shown)
            }
        }
        .padding()
        .inAppMessageContainer()
    }
}
```

If you need to filter candidates by tags, pass `tags`:

```swift
InAppStory.shared.showInAppMessageWith(event: "my_event", tags: ["tag_a", "tag_b"]) { shown in
    print("IAM shown by event+tags:", shown)
}
```

---

## 3. Tracking IAM events (show/close/click/widgetEvent)

The SDK provides two levels of feedback:

- `inAppMessageWillShow` / `inAppMessageDidClose` — show lifecycle
- `inAppMessagesEvent` — events inside IAM (show, close, clicks, widget events)

Registration example:

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

final class IAMCallbacks: ObservableObject {
    func setup() {
        InAppStory.shared.inAppMessageWillShow = { id, event, presentType in
            print("willShow:", id, event as Any, presentType)
            return nil
        }

        InAppStory.shared.inAppMessageDidClose = {
            print("didClose")
        }

        InAppStory.shared.inAppMessagesEvent = { event in
            print("iamEvent:", event)
        }
    }
}

struct IAMCallbacksScreen: View {
    @StateObject private var callbacks = IAMCallbacks()

    var body: some View {
        Text("IAM callbacks registered")
            .onAppear { callbacks.setup() }
            .inAppMessageContainer()
    }
}
```

> **Pay Attention**
>
> `inAppMessageWillShow` is called before showing and can return a `UIView?` container which will have priority.
> This is useful when you want to override the container dynamically.

---

## 4. Multiple containers in SwiftUI and targeting by containerID

If you want to show IAM in a specific part of the UI (for example, inside a tab), use named containers:

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct IAMMultiContainerRoot: View {
    var body: some View {
        TabView {
            IAMTab(title: "Home", containerID: "home_container")
                .tabItem { Text("Home") }

            IAMTab(title: "Profile", containerID: "profile_container")
                .tabItem { Text("Profile") }
        }
    }
}

struct IAMTab: View {
    let title: String
    let containerID: String

    var body: some View {
        VStack(spacing: 12) {
            Text(title)

            Button("Show IAM in this tab") {
                InAppStory.shared.showIAMWith(
                    id: "<message_id>",
                    inContainer: containerID
                ) { shown in
                    print("shown:", shown)
                }
            }
        }
        .padding()
        .inAppMessageContainer(id: containerID)
    }
}
```

---

## 5. Toast presentation above the entire app (SwiftUI + overlay window)

For `.toast`, you typically need presentation above navigation and modals.
Recommended scheme:

- `.toast` → show via a separate overlay (see `in-app-messaging-v2`)
- other types (`fullScreen`, `bottomSheet`, `popUp`) → show in the standard `.inAppMessageContainer()` container

High-level SwiftUI example:

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct AppRoot: View {
    var body: some View {
        MainContent()

            // Container for non-toast IAM
            .inAppMessageContainer()

            // Toast overlay (example: your host app modifier)
            .iamOverlayToast()
    }
}
```

> **Warning**
>
> If you use a custom `UIWindow` for toast, make sure its hit-testing
> correctly handles the case when another controller (for example, a game) is presented above that window,
> otherwise the new UI may become non-interactive.

---

## 6. CancellationToken: cancel IAM presentation

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct IAMCancelScreen: View {
    @State private var token: CancellationToken?

    var body: some View {
        VStack(spacing: 12) {
            Button("Show (async)") {
                token = InAppStory.shared.showInAppMessageWith(id: "<message_id>") { shown in
                    print("shown:", shown)
                }
            }

            Button("Cancel show") {
                token?.cancel()
                token = nil
            }
        }
        .padding()
        .inAppMessageContainer()
    }
}
```

More about information about action cancellation [here](cancellation-of-actions).

## See also

- [In-App Messaging (current implementation)](in-app-messaging-v2) - full API and container description.
- [IAM migration from 1.27 to 1.28](/sdk-guides/ios/migrations#iam-migration-sdk-1280) - changes when upgrading.
- [Cancellation of actions](/sdk-guides/ios/cancellation-of-actions) - cancelling SDK operations.
