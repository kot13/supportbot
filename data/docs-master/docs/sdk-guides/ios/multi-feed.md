import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Multi-feed

In SDK v1.15.0 multi-feed functional was added.  
This functionality allows to split list views into multiple feeds without using tags.

## Default

By default, the list shows a feed created in the console called "Main", to display it there is no need to specify `feed: <String>` when initializing the list.

<Tabs>
<TabItem value="uikit" label="UIKit">

#### ViewController.swift

```swift
...

var storyView: StoryView!

override func viewDidLoad() {
    super.viewDidLoad()

    storyView = StoryView() /// initialize StoryView with default feed
    storyView.target = self /// set target for showing Reader

    view.addSubview(storyView) /// add object to the view

    storyView.create() /// running internal logic
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

#### ContentView.swift

```swift
struct ContentView: View
{
    var body: some View {
        /// ...
        StoryListView() /// initialize StoryListView with default feed
            .frame(height: 120)
            .frame(maxWidth: .infinity)
        /// ...
    }
}
```

</TabItem>
</Tabs>

## Custom feed

Before you can set feeds in an app, you need to create them in the console.

<Tabs>
<TabItem value="uikit" label="UIKit">

To set a separate feed in the list, you need to specify `feed: <String>` when initializing the `StoryView`:

#### ViewController.swift

```swift
...

var storyView: StoryView!

override func viewDidLoad() {
    super.viewDidLoad()

    storyView = StoryView(feed: "CustomFeed") /// initialize StoryView with custom feed id
    storyView.target = self /// set target for showing Reader

    view.addSubview(storyView) /// add object to the view

    storyView.create() /// running internal logic
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

To set a separate feed in the list, you need to specify `feed: <String>` when initializing the `StoryListView`:

#### ContentView.swift

```swift
struct ContentView: View
{
    var body: some View {
        /// ...
        StoryListView(feed: "CustomFeed") /// initialize StoryListView with custom feed id
            .frame(height: 120)
            .frame(maxWidth: .infinity)
        /// ...
    }
}
```

</TabItem>
</Tabs>

## Several feeds

You can optionally add multiple feeds to one or more controllers. This requires initializing multiple StoryView instances with different `feed: <String>`. Also, you can leave one list with an empty `feed: <String>`, and specify the necessary ones in the next one.

<Tabs>
<TabItem value="uikit" label="UIKit">

#### MainController.swift

```swift
...

var mainStoryView: StoryView!

/// main controller with default stories feed
override func viewDidLoad() {
    super.viewDidLoad()

    mainStoryView = StoryView() //initialize StoryView with default feed
    mainStoryView.target = self //set target for showing Reader

    view.addSubview(mainStoryView) //add object to the view

    mainStoryView() //running internal logic
}
```

#### AboutController.swift

```swift
...

var aboutStoryView: StoryView!

/// controller with stories from feed with id "AboutFeed"
override func viewDidLoad() {
    super.viewDidLoad()

    aboutStoryView = StoryView(feed: "AboutFeed") /// initialize StoryView with feed for "About" screen
    aboutStoryView.target = self /// set target for showing Reader

    view.addSubview(aboutStoryView) /// add object to the view

    aboutStoryView() /// running internal logic
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

#### MainView.swift

```swift
/// main view with default stories feed
struct MainView: View
{
    var body: some View {
        /// ...
        StoryListView() /// initialize StoryListView with default feed
            .frame(height: 120)
            .frame(maxWidth: .infinity)
        /// ...
    }
}
```

#### AboutView.swift

```swift
/// view with stories from feed with id "AboutFeed"
struct AboutView: View
{
    var body: some View {
        /// ...
        StoryListView(feed: "AboutFeed") /// initialize StoryListView with feed for "About" screen
            .frame(height: 120)
            .frame(maxWidth: .infinity)
        /// ...
    }
}
```

</TabItem>
</Tabs>

## Feeds in Onboardings

Various feeds can also be used in onboarding. See more in [OnboardingStory](onboardings.md)
