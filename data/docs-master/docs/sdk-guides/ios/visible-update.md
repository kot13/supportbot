import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Tracking coverage

<Tabs>
<TabItem value="uikit" label="UIKit">

In **v1.22.1** the new closure `onVisibleAreaUpdated: ((_ items: [VisibleStoryItem]) -> Void)` was added to the `StoryView` to track scopes. It is called every time the feed scrolling stops. This closure passes a list of data about the stories shown. Read more about the available data in the `VisibleStoryItem` object [here](reference.md#visiblestoryitem).

> **Pay Attention**
> 
> As of version 1.22.10, the closure `onVisibleAreaUpdated` - only works if StoryView is added to superview and it is added to the screen.

```swift
class ViewController: UIViewController {

    var storyView: StoryView!

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.

        // creation of a StoryView instance
        storyView = StoryView(frame: CGRect(x: 0, y: 80, width: UIScreen.main.bounds.width, height: 120), feed: "", favorite: false)
        // specify the target for displaying stories
        storyView.target = self
        // specifying the method to call onVisibleAreaUpdated
        storyView.onVisibleAreaUpdated = updateVisibleArea(_:)
        // add StoryView to the screen
        self.view.addSubview(storyView)
        // start the internal library logic
        storyView.create()
    }
}

extension ViewController {
    func updateVisibleArea(_ items: [VisibleStoryItem]) {
        // is called when the StoryView scroll is finally stopped
        // from VisibleStoryItem you can get data about the stories
        // that have been shown display percentage accumulates and
        // in the final call the values for a story for the whole scroll time are given out
    }
}
```

If the `StoryView` is in a scrollable area, such as a `UIScrollView`, no on-screen visibility updates will be recorded when the container is scrolled and `onVisibleAreaUpdated` will not be called. For this situation, you need to call the display updates yourself using the `updateVisibleArea()` method.

The easiest way to track the display of cells when scrolling the parent `ScrollView` is to implement the `scrollViewDidScroll` delegate method and call `collectVisibleAreaData()` in it. With this method, the `collectVisibleAreaData()` method will be called on every scroll tick, collect and process the data about cell display. At the end of scrolling, the `updateVisibleArea()` method should be called, after which the `onVisibleAreaUpdated` closure will be called, which will transfer the data about the displayed cells.

```swift
class ViewController: UIViewController {

    var scrollView: UIScrollView!
    var storyView: StoryView!

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        // ...

        // creation of a UIScrollView instance
        scrollView = UIScrollView(frame: CGRect(x: 0, y: 80, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height))
        scrollView.contentSize = CGSize(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height * 2)
        scrollView.delegate = self
        // add UIScrollView to the screen
        self.view.addSubview(scrollView)

        // creation of a StoryView instance
        storyView = StoryView(frame: CGRect(x: 0, y: 80, width: UIScreen.main.bounds.width, height: 120), feed: "", favorite: false)
        // specify the target for displaying stories
        storyView.target = self
        // specifying the method to call onVisibleAreaUpdated
        storyView.onVisibleAreaUpdated = updateVisibleArea(_:)
        // add StoryView to the scrollView
        self.scrollView.addSubview(storyView)
        // start the internal library logic
        storyView.create()
    }
}

extension ViewController {
    func updateVisibleArea(_ items: [VisibleStoryItem]) {
        // is called when the StoryView scroll is finally stopped
        // from VisibleStoryItem you can get data about the stories that have been shown
        // display percentage accumulates and in the final call the values for a story for the whole scroll time are given out
    }
}

extension ViewController: UIScrollViewDelegate {
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        // update the data of the displayed cells when scrolling
        storyView.collectVisibleAreaData()
    }

    func scrollViewDidEndDragging(_ scrollView: UIScrollView, willDecelerate decelerate: Bool) {
        // method call to get the data of the cells shown, after which, the closure `updateVisibleArea` will be called
        storyView.updateVisibleArea()
    }
}
```

To better track cell display, you can refine the `updateVisibleArea` call, not only to end finger scrolling, but also to end the `ScrollView` scroll animation. This requires adding two more `UIScrollViewDelegate` delegate methods, for _ending the animation_ and _kinetic scrolling_.

```swift
extension ViewController: UIScrollViewDelegate {
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        // update the data of the displayed cells when scrolling
        storyView.collectVisibleAreaData()
    }

    func scrollViewDidEndDragging(_ scrollView: UIScrollView, willDecelerate decelerate: Bool) {
        // if the finger scrolling was completed without kinetic effect,
        // call the update of cell display data
        // if with kinetics, then wait for the end of animation
        // in the `scrollViewDidEndDecelerating` method.
        if !decelerate {
            // method call to get the data of the cells shown, after which, the closure `updateVisibleArea` will be called
            storyView.updateVisibleArea()
        }
    }

    func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) {
        // stopping kinetic scrolling
        storyView.updateVisibleArea()
    }

    func scrollViewDidEndScrollingAnimation(_ scrollView: UIScrollView) {
        // stop normal scroll animation
        storyView.updateVisibleArea()
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

In **v1.22.1** the new closure `onVisibleAreaUpdated: ((_ items: [VisibleStoryItem]) -> Void)` was added to the `StoryView` to track scopes. It is called every time the feed scrolling stops. This closure passes a list of data about the stories shown. Read more about the available data in the `VisibleStoryItem` object [here](reference.md#visiblestoryitem).

> **Pay Attention**
> 
> As of version 1.22.10, the closure `onVisibleAreaUpdated` - only works if StoryListView is added to superview and it is added to the screen.

If the `StoryListView` is in a scrollable area, such as a `ScrollView`, no on-screen visibility updates will be recorded when the container is scrolled and `onVisibleAreaUpdated` will not be called. For this situation, you need to call the display updates yourself using the `updateVisibleArea()` method.

To collect display data while scrolling, you need to track this action and call `collectVisibleAreaData` on each tick of `ScrollView` movement, and call `onVisibleAreaUpdated` at the end of the scrolling to get the collected data in the `onVisibleAreaUpdated` closure.

```swift
struct SwiftUIView: View {
    @State var updateVisibleArea: () -> Void = {}
    @State var collectVisibleAreaData: () -> Void = {}

    var body: some View {
        ScrollView {
            VStack {
                StoryListView()
                    .onVisibleAreaUpdated { items in
                        // is called when the StoryView scroll is finally stopped
                        // from VisibleStoryItem you can get data about the stories that have been shown
                        // display percentage accumulates and in the final call the values for a story for the whole scroll time are given out
                    }
                    .updateVisibleArea { update in
                        self.updateVisibleArea = update
                    }
                    .collectVisibleAreaData { collect in
                        self.collectVisibleAreaData = collect
                    }
                    .frame(width: 320, height: 120)
            }
            // ...
        }
    }

    // ScrollView scroll processing
    private func scrollViewDidScroll() {
        // the method starts the logics of spore and data processing of the cell readings
        collectVisibleAreaData()
    }

    // ScrollView scroll animation termination in any scenario
    private func scrollViewDidEndScrolling() {
        // call of the updateVisibleArea() method will start the logic of
        // calculating visible storis and upon its completion
        // the onVisibleAreaUpdated closure will be called.
        updateVisibleArea()
    }
}
```

</TabItem>
</Tabs>