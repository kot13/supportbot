import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Tags

:::warning[Pay attention]
There are several limitations on the list of tags that can be passed to the InAppStorySDK:

1. tags can only contain letters, digits, underscores, and dashes; 
2. the final string joined by a comma and translated to URLEncoded must not exceed 3999 bytes.

:::

<Tabs>
<TabItem value="uikit" label="UIKit">

1. Tags can be set at the time of initializing the library with setting `userID`:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library settings object
    let settings = Settings(userID: <String>, tags: <Array<String>>)

    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>, settings: settings)

    return true
}
```

2. Tags can be set with user settings after initializing the library through the `settings` parameter:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    return true
}
```

3. Also, tags can be added or removed in portions after creating the `StoryView`. You need to update the list so the changes can take effect (see [refresh](refresh.md))

:::tip
Onboarding can also be displayed depending on tags, but you don't need to call `refresh()` on the list to update it.
:::

#### ViewController.swift

```swift
var storyView: StoryView!

override func viewDidLoad() {
    super.viewDidLoad()

    storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0)) //initialize StoryView
    view.addSubview(storyView) //add object to the view

    storyView.create() //running internal logic
}

func addTags() {
    InAppStory.shared.addTags(<Array<String>>) //add tag list

    storyView.refresh() //updating story list
}

func removeTags() {
    InAppStory.shared.removeTags(<Array<String>>) //delete tag list

    storyView.refresh() //updating story list
}
```

:::tip
When adding or changing tags, it's a good idea to make sure they're up to date before calling `refresh()`.
 You can also call `refresh()` right after the tag update methods.
:::

4. In **v1.22.1** the tag list can be refreshed immediately when the `refresh(newTags: <Array<String>>? = nil)` method is called.

#### ViewController.swift

```swift
var storyView: StoryView!

override func viewDidLoad() {
    super.viewDidLoad()

    storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0)) //initialize StoryView
    view.addSubview(storyView) //add object to the view

    storyView.create() //running internal logic
}

func updateTags() {
    storyView.refresh(newTags: <Array<String>>) //updating story list
}
```

:::tip
The new tag list works the same way as the `setTags(<Array<String>>)` method in [InAppStory class](inappstory.md#methods). In this case, all set tags before `refresh` will be overwritten.
:::

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

SwiftUI updating and changing the tag list is done similarly to the UIKit version.  
In **v1.22.1** `StoryListView` has an added method that gives closure to refresh, which can be assigned `@State` to a `View` structure variable and called when needed. Also, when using this method, you can update the list of stories with a new tags list.  
See more about refresh [here](refresh.md).

```swift
struct SwiftUIView: View {
    // refresh closure, which will be called from SwiftUIView
    @State var refreshStoriesList: (_ feed: String?, _ tags: Array<String>?) -> Void = {_, _ in}

    var body: some View {
        VStack {
            // initialization of StoryListView with feed name equal to 'old_feed'
            StoryListView(feed: "old_feed")
                .refresh { refresh in
                    // assignment of the refresh method to the local closure
                    refreshStoriesList = refresh
                }
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            Button {
                // calling local closure of refreshStoriesList with tags list
                refreshStoriesList(nil, ["newTag_1", "newTag_2"])
            } label: {
                Text("Update tags")
            }
        }
    }
}

```

</TabItem>
</Tabs>
