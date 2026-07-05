# SingleStoryAPI

Class is used to show story reader with a [single story](/sdk-guides/ios/single-story.md)
called by id. Can be called from InAppStoryAPI:

```Swift
let singleStoryAPI = InAppStoryAPI.shared.singleStoryAPI
```

## Methods

To show single story in reader by id

```Swift
func showStory (
    with storyID: String,
    with panelSettings: PanelSettings? = nil,
    complete: @escaping (_ show: Bool) -> Void
)
```

To show single story in reader by id if wasn't show already for current user

```Swift
func showStoryOnce (
    with storyID: String,
    with panelSettings: PanelSettings? = nil,
    complete: @escaping (_ show: Bool) -> Void
)
```