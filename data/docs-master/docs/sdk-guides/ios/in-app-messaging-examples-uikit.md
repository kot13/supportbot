# In-App Messaging (UIKit) — examples

This document provides examples of integrating In-App Messaging (IAM) into a **UIKit** app: from a minimal show flow to displaying toast IAM in a separate window above the entire UI.

It is assumed that the SDK is already [initialized](/sdk-guides/ios/how-to-get-started#basic-initialization). For a detailed API description, see [In-App Messaging (current implementation)](in-app-messaging-v2).

## 1. Minimal example: show IAM from a UIView

The simplest option is to show IAM within the current screen area by passing the controller’s `view` as the container.

```Swift
import UIKit
import InAppStory

final class SomeViewController: UIViewController {

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        // Container is this controller's view.
        // IAM will be rendered on top of it.
        InAppStory.shared.showInAppMessageWith(id: "your-message-id", targetView: view) { [weak self] show in
            // show == true if the message was actually displayed
            if show {
                // you can update UI after showing
            }
        }
    }
}
```

Showing by **event** instead of ID:

```Swift
InAppStory.shared.showInAppMessageWith(
    event: "welcome",
    targetView: view,
    tags: ["onboarding"]  // optional: tag filter
) { show in
    // show indicates whether it was shown successfully
}
```

> **Pay attention**  
> In UIKit there is no default container. If you do not pass `targetView` and do not return a view from `inAppMessageWillShow`, IAM **will not** be shown. You must either pass `targetView` explicitly or return a container in `inAppMessageWillShow`.

## 2. Show IAM and track showing/closing

The **`inAppMessageWillShow`** and **`inAppMessageDidClose`** callbacks allow reacting to an upcoming show and to closing the IAM screen (update UI, log, hide overlay, etc.).

Example: assign callbacks after SDK initialization and show via a button.

```Swift
import UIKit
import InAppStory

final class IAMDemoViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Assign callbacks once (for example, after SDK initialization
        // or when the screen loads).
        InAppStory.shared.inAppMessageWillShow = { id, event, presentType in
            print("IAM will show, id: \(id), presentType: \(presentType)")
            // Return nil — the container will be taken from targetView
            // passed to showInAppMessageWith.
            return nil
        }

        InAppStory.shared.inAppMessageDidClose = {
            print("IAM did close")
        }
    }

    @IBAction func showIAMTapped() {
        InAppStory.shared.showInAppMessageWith(id: "your-message-id", targetView: view) { [weak self] show in
            if !show {
                // The message was not shown
                // (no data, cancelled, etc.)
                self?.showAlert(message: "Failed to show IAM")
            }
        }
    }

    private func showAlert(message: String) {
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}
```

> **Pay attention**  
> `inAppMessageWillShow` is called **always** when the SDK attempts to show IAM, regardless of whether `targetView` was passed. If you return your own `UIView` from the closure, it becomes the container (see section 4 with toast in a separate window).

## 3. Using CancellationToken

The **`showInAppMessageWith(id:...)`** and **`showInAppMessageWith(event:...)`** methods return **`CancellationToken?`**. You can store it and call **`cancel()`** to cancel the scheduled show (for example, when leaving the screen or on a repeated tap).

```Swift
import UIKit
import InAppStory

final class IAMWithCancelViewController: UIViewController {

    /// Token for the current IAM show request.
    /// Cancel it when leaving the screen or before starting a new show.
    private var showIAMToken: CancellationToken?

    @IBAction func showIAMTapped() {
        // Cancel the previous request
        // if showing has not started yet.
        showIAMToken?.cancel()

        showIAMToken = InAppStory.shared.showInAppMessageWith(
            id: "your-message-id",
            targetView: view
        ) { [weak self] show in
            self?.showIAMToken = nil
            if show {
                print("IAM shown")
            } else {
                print("IAM not shown (possibly cancelled or no data)")
            }
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        // When leaving the screen, cancel any pending show
        // so IAM does not appear above another screen.
        showIAMToken?.cancel()
        showIAMToken = nil
    }
}
```

Checking the cancellation result:

```Swift
let token = InAppStory.shared.showInAppMessageWith(id: "id", targetView: view) { show in
    // If cancelled before showing begins, completion may not be called
    // or show == false
}

// Later, for example in deinit or by a timer:
if token?.cancel() == true {
    print("Show cancelled")
} else {
    // Token already used or cancellation is not possible
    // (show is already in progress)
}
```

> **Warning**  
> After the IAM screen has started presenting, cancellation may not affect what is shown. `cancel()` is effective only until the moment the SDK actually starts the presentation.

## 4. Show toast IAM via a separate window

To display IAM with the **toast** presentation type above the entire app (navigation, modal screens), you can use your own **`UIWindow`** with an elevated `windowLevel`. In the **`inAppMessageWillShow`** callback, return the view of this window for `presentType == .toast`; return `nil` for other types so the normal container is used.

Below is a simplified approach: a window class with “transparent” hit-testing (touches outside the IAM content pass to the app below the window) and a manager that plugs into SDK callbacks.

### 4.1. Window and view that passes touches through

The window is created once. The root view returns `nil` during hit-testing when the touch lands on an “empty” area (the root view itself) so events pass to the main app.

```Swift
import UIKit

/// A window above the entire app for displaying IAM (for example, toasts).
/// Touches in the “empty” area are passed through to the main app.
final class IAMOverlayWindow: UIWindow {

    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        // Delegate to the root view (IAMPassthroughView)
        // so touches outside IAM go to the main app.
        guard let passthrough = rootViewController?.view as? IAMPassthroughView else {
            return super.hitTest(point, with: event)
        }
        let localPoint = passthrough.convert(point, from: self)
        return passthrough.hitTest(localPoint, with: event)
    }
}

/// A view that passes touches “through itself”
/// if no subview handled the point.
/// Used as the overlay window root view: the IAM (reader) area handles touches,
/// everything else goes down.
final class IAMPassthroughView: UIView {

    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        let hit = super.hitTest(point, with: event)
        // If the touch hit this view itself — pass through (nil),
        // otherwise return the hit subview.
        return hit == self ? nil : hit
    }
}

/// Root controller for the overlay window: its view is IAMPassthroughView
/// (for correct hit-testing in the window).
final class IAMOverlayRootViewController: UIViewController {

    override func loadView() {
        view = IAMPassthroughView()
    }
}
```

### 4.2. Window provider: create and show/hide

The provider stores a single window, returns a container view (where the SDK embeds IAM) on demand, and can hide the window.

```Swift
import UIKit

/// Creates and manages an overlay window for IAM.
/// Does not depend on InAppStory — UIKit only.
final class IAMOverlayWindowProvider {

    /// The single overlay window.
    /// Reused for subsequent toast shows.
    private var window: IAMOverlayWindow?
    /// Root view of the window (IAMPassthroughView).
    /// The SDK embeds IAM into it; weak to avoid retaining the window unnecessarily.
    private weak var containerView: IAMPassthroughView?

    /// Returns the view container where the SDK will embed IAM.
    /// The window is created on the first call; subsequent calls show the existing one.
    func makeContainerView() -> UIView {
        // If the window was already created — just show it again
        // and return the same container.
        if let existing = containerView {
            window?.isHidden = false
            window?.isUserInteractionEnabled = true
            return existing
        }

        // Find the active app scene (iOS 13+).
        // Without a scene the window will not work correctly in multi-window mode.
        guard let scene = UIApplication.shared.connectedScenes
            .compactMap({ $0 as? UIWindowScene })
            .first(where: { $0.activationState == .foregroundActive }),
              let windowScene = scene as UIWindowScene? else {
            // No active scene (for example, before iOS 13 or non-standard lifecycle) —
            // create the window using the screen bounds.
            let overlayWindow = IAMOverlayWindow(frame: UIScreen.main.bounds)
            return setupWindow(overlayWindow)
        }

        // Create a window attached to the scene
        // and align its frame with the scene coordinate space.
        let overlayWindow = IAMOverlayWindow(windowScene: windowScene)
        overlayWindow.frame = windowScene.coordinateSpace.bounds
        return setupWindow(overlayWindow)
    }

    /// Configures the provided window: root controller with IAMPassthroughView,
    /// window level, transparency. Stores references and returns the container.
    private func setupWindow(_ overlayWindow: IAMOverlayWindow) -> UIView {
        // Root controller with view = IAMPassthroughView —
        // touches outside IAM will pass “through” the window.
        let rootVC = IAMOverlayRootViewController()
        rootVC.view.backgroundColor = .clear

        overlayWindow.rootViewController = rootVC
        // Window above the main app content,
        // but below system alerts.
        overlayWindow.windowLevel = .alert - 1
        overlayWindow.backgroundColor = .clear
        overlayWindow.isHidden = false
        overlayWindow.isUserInteractionEnabled = true

        window = overlayWindow
        containerView = rootVC.view as? IAMPassthroughView
        return rootVC.view
    }

    /// Hides the overlay window and disables interaction.
    /// Call when IAM closes (for example, from inAppMessageDidClose).
    func dismiss() {
        window?.isUserInteractionEnabled = false
        window?.isHidden = true
    }
}
```

### 4.3. Hooking into the SDK: only toasts go to the overlay

In **`inAppMessageWillShow`**, return the overlay container only for **`.toast`**; for other types return `nil`. In **`inAppMessageDidClose`**, hide the overlay.

```Swift
import UIKit
import InAppStory

/// Connects the overlay window to the SDK: toasts are shown in the overlay,
/// other IAM types are shown in the passed container.
final class IAMOverlayManager {

    static let shared = IAMOverlayManager()
    private let provider = IAMOverlayWindowProvider()

    private init() {}

    /// Call once after SDK initialization (or at app start).
    /// Registers inAppMessageWillShow and, if needed, inAppMessageDidClose.
    func setup() {
        InAppStory.shared.inAppMessageWillShow = { [weak self] _, _, presentType in
            guard let self = self else { return nil }
            if presentType == .toast {
                return self.provider.makeContainerView()
            }
            // Not a toast — ensure overlay is hidden;
            // container will be taken from targetView or the default container.
            self.provider.dismiss()
            return nil
        }
    }

    /// Hide the overlay.
    /// Call from inAppMessageDidClose if you use a shared close callback.
    func dismissOverlay() {
        provider.dismiss()
    }
}
```

Assign callbacks after initialization (for example, in `AppDelegate` or a root controller):

```Swift
// After InAppStory.shared.initWith(...)
IAMOverlayManager.shared.setup()

InAppStory.shared.inAppMessageDidClose = {
    IAMOverlayManager.shared.dismissOverlay()
}
```

Showing IAM by ID or event works as usual; toasts will automatically go to the overlay window, other types go to the passed `targetView` or the default container.

```Swift
// In any controller — a toast (if the message is configured as toast in the dashboard)
// will be shown in the overlay window.
InAppStory.shared.showInAppMessageWith(id: "toast-message-id", targetView: view) { show in
    // ...
}
```

> **Pay attention**  
> The overlay window should be the root for the IAM container. Do not add extra nested views between the window and the view returned by `makeContainerView()`, otherwise hit-testing for touch pass-through may work incorrectly.

> **Warning**  
> If the app recreates `UIWindowScene` or uses multiple scenes, there may be no active scene during the first `makeContainerView()` call. In that case you can delay showing the toast or use a fallback (for example, a window without a scene), depending on the minimum iOS version and the app architecture.

## See also

- [In-App Messaging (current implementation)](in-app-messaging-v2) - full API and container description.
- [IAM migration from 1.27 to 1.28](/sdk-guides/ios/migrations#iam-migration-sdk-1280) - changes when upgrading.
- [Cancellation of actions](/sdk-guides/ios/cancellation-of-actions) - cancelling SDK operations.
