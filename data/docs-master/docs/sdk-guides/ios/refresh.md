import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Refresh

## Simple refresh

<Tabs>
<TabItem value="uikit" label="UIKit">

To refresh the list of stories call `refresh()` from `StoryView`. For example, if you need to implement the _"Pull to refresh"_ functionality.

The data for the list corresponding to the current user session and the list of tags will be re-requested when calling `refresh()` .

:::tip[Related articles]
New v1.22.1 signature allows to pass new `feed` and `tags` to the `refresh()` method.
Usage examples are listed here:

- [Change user](user-settings.md#change-user)
- [Change tags](tags.md)
  :::

#### ViewController.swift

```swift
...
var storyView: StoryView!

override func viewDidLoad() {
    super.viewDidLoad()
    //initialize StoryView
    storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0))
    //add object to the view
    view.addSubview(storyView)

    //running internal logic
    storyView.create()
}

// handling a refresh event, e.g. from a button or PullToRefresh
func refresh() {
    // refresh StoryView
    storyView.refresh()
}
...
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

SwiftUI uses the binding variable `refresh` to refresh the list, which is set when the `StoryListView` is initialized.

```swift
struct SwiftUIView: View {
    @State var isListRefresh: Bool = false

    var body: some View {
        VStack {
            // setting the isListRefresh variable to track when StoryListView is initialized
            StoryListView(refresh: $isListRefresh)
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            Button {
                // changing the isListRefresh variable when the button is pressed
                isListRefresh.toggle()
            } label: {
                Text("Refresh")
            }
            // disabling the button if `isListRefresh == true`, to avoid repeated switching
            .disabled(isListRefresh)
        }
    }
}
```

</TabItem>
</Tabs>

## Refresh with feed and tags update

<Tabs>
<TabItem value="uikit" label="UIKit">

Before **v1.22.1** it was possible to update the feed list to a new feed only by recreating `StoryView`.

In **v1.22.1**, `newFeed: <String?> = nil` and `newTags: <Array<String>?> = nil` parameters were added to the `refresh()` method to refresh stories feed and tags.

To update the stories feed list you need to specify the **name** of the feed you want to update to.

You can also update the **list of tags** for the feed.

#### ViewController.swift

```swift
...
var storyView: StoryView!

override func viewDidLoad() {
    super.viewDidLoad()
    //initialize StoryView
    storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0))
    //add object to the view
    view.addSubview(storyView)

    //running internal logic
    storyView.create()
}

// receiving an event to change the feed in the list of stories
func refresh(feed: String) {
    // StoryView refresh with change of feed name
    storyView.refresh(newFeed: feed)
}

// receiving an event to change the feed and tag list in the list of stories
func refresh(feed: String, tags: Array<String>) {
    // StoryView refresh with change of feed name and tags list
    storyView.refresh(newFeed: feed, newTags: tags)
}
...
```

:::tip
1. If you leave the parameters unset or pass `nil` the list will be updated as usual.
2. The new tag list works the same way as the `setTags(<Array<String>>)` method in [InAppStory class](inappstory.md#methods). In this case, all set tags before `refresh` will be overwritten.

:::

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

Before **v1.22.1** it was possible to update the feed list to a new feed only by recreating `StoryListView`. In **v1.22.1**, `StoryListView` has an added method that gives closure to refresh, which can be assigned `@State` to a `View` structure variable and called when needed. Also, when using this method, you can update the list of stories with a new feed or set of tags.

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
                // calling local closure of refreshStoriesList with new feed and tags data
                refreshStoriesList("new_feed", ["newTag_1", "newTag_2"])
            } label: {
                Text("Refresh")
            }
        }
    }
}

```

:::warning[Attention!]
There is no way to set default value and parameters in closure. In order not to change the values of `feed` and `tags` when refreshing, it is necessary to set these parameters to `nil`: `refreshStoriesList(nil,nil)`.
:::

</TabItem>
</Tabs>
