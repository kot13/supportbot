import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Cancellation of long-running actions

Starting from version 1.27.0, background long-running actions, such as loading onboardings, single stories and in-app messages, can be cancelled. To do this, you can use the `CancellationToken` object that is returned by methods of the actions listed above.

```Swift
final public class CancellationToken {
    public let id: String
    @discardableResult public func cancel() -> Bool
}
```

- `CancellationToken` is returned by methods: `showOnboardings`, `showStory`, `showStoryOnce`, `showInAppMessageWith`
- The `cancel()` method returns `Bool`:
   - `true` - cancellation applied (display hasn't started yet)
   - `false` - cancellation not applied (display has already started or token was already cancelled)
- Token ID is available through the `id: String` property (UUID) for tracking and logging

## Examples

All cancellable methods now return an optional `CancellationToken` value that allows cancelling the operation

<Tabs>
<TabItem value="uikit" label="UIKit">

```Swift
@discardableResult func showOnboardings(...) -> CancellationToken?

@discardableResult func showStoryOnce(...) -> CancellationToken?
@discardableResult func showStory(...) -> CancellationToken?

@discardableResult func showInAppMessageWith(id: <String>, ...) -> CancellationToken?
@discardableResult func showInAppMessageWith(event: <String>, ...) -> CancellationToken?
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

```Swift
func onboardingStories(..., cancellationToken: Binding<CancellationToken?>? = nil, ...) -> some View
func singleStory(..., cancellationToken: Binding<CancellationToken?>? = nil, ...) -> some View 
```

</TabItem>
</Tabs>

`CancellationToken` is an optional value and can be `nil`. This happens when the operation, by internal logic, was not started. For example, when the conditions for display were not met, such as:

- initialization settings
- tag length
- userID length
- etc.

A token is required for cancellation. The token is returned by display methods and should be stored in a class or structure property. You can cancel manually (for example, when closing the screen or by timeout).

<Tabs>
<TabItem value="uikit" label="UIKit">

```Swift
import UIKit
import InAppStorySDK

class ViewController: UIViewController {
    private var cancellationToken: CancellationToken?
    
    // Example 1: Show onboarding with cancellation capability
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        showOnboarding() // Show onboarding
        // or
        showOnboardingWithTimeout() // Show onboarding with timeout
    }
    
    func showOnboarding() {
        cancellationToken = InAppStory.shared.showOnboardings(
            from: self
        ) { [weak self] show in
            if show {
                print("Onboarding displayed")
            } else {
                print("Onboarding not displayed")
            }
            self?.cancellationToken = nil
        }
    }
    
    // Example 2: Show single story with cancellation capability
    func showStory() {
        cancellationToken = InAppStory.shared.showStory(
            with: "story_id_123",
            from: self
        ) { [weak self] show in
            if show {
                print("Story displayed")
            }
            self?.cancellationToken = nil
        }
    }
    
    // Example 3: Show IAM message with cancellation capability
    func showIAM() {
        cancellationToken = InAppStory.shared.showInAppMessageWith(
            event: "purchase_completed"
        ) { [weak self] show in
            if show {
                print("IAM message displayed")
            }
            self?.cancellationToken = nil
        }
    }
    
    // Cancel display (for example, when closing the screen)
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        // Cancel display if it hasn't started yet
        if let token = cancellationToken {
            let wasCancelled = token.cancel()
            if wasCancelled {
                print("Display cancelled before showing")
            } else {
                print("Display has already started, cancellation not applied")
            }
            cancellationToken = nil
        }
    }
    
    // Example 4: Cancel by timer (if loading takes too long)
    func showOnboardingWithTimeout() {
        cancellationToken = InAppStory.shared.showOnboardings(
            from: self
        ) { [weak self] show in
            self?.cancellationToken = nil
        }
        
        // Cancel after 5 seconds if display hasn't started yet
        DispatchQueue.main.asyncAfter(deadline: .now() + 5) { [weak self] in
            if let token = self?.cancellationToken {
                let wasCancelled = token.cancel()
                if wasCancelled {
                    print("Display cancelled by timeout")
                }
                self?.cancellationToken = nil
            }
        }
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

```Swift
import SwiftUI
import InAppStorySDK_SwiftUI

struct ContentView: View {
    @State private var showOnboarding = false
    @State private var showStory = false
    @State private var cancellationToken: CancellationToken?
    
    var body: some View {
        VStack(spacing: 20) {
            Button("Show onboarding") {
                showOnboarding = true
            }
            
            Button("Show story") {
                showStory = true
            }
            
            Button("Cancel display") {
                cancellationToken?.cancel()
                cancellationToken = nil
            }
            .disabled(cancellationToken == nil)
        }
        // Example 1: Onboarding with automatic cancellation on close
        .onboardingStories(
            isPresented: $showOnboarding,
            cancellationToken: $cancellationToken,
            onDismiss: {
                print("Onboarding closed")
            }
        )
        // Example 2: Single story with automatic cancellation on close
        .singleStory(
            storyID: "story_id_123",
            isPresented: $showStory,
            cancellationToken: $cancellationToken,
            onDismiss: {
                print("Story closed")
            }
        )
    }
}
```

</TabItem>
</Tabs>

