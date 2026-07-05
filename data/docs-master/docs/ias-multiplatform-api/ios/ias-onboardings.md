# OnboardingsAPI

Class is used to load and show onboarding feed in story reader. Can be called from InAppStoryAPI:

```Swift
let onboardingsAPI = InAppStoryAPI.shared.onboardingsAPI
```

## Methods

To load [onboarding](/sdk-guides/ios/onboardings.md) feed:

```Swift
func showOnboarding(
    feed: String = "onboarding",
    limit: Int = 0,
    with tags: [String]? = nil,
    with panelSettings: PanelSettings? = nil,
    complete: @escaping (_ show: Bool) -> Void
)
```