import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Screen presenting

## Overview

To display the stories reader in the application, the library defines the topmost screen in the application hierarchy and displays the reader using the `present` method.

If you want to display a new screen without closing the stories reader and to be able to return to the stories in the same state as before the transition, there is a method: `present(controller: for: with:)` in the `InAppStory` class. This method suspends internal logic for timers, counts stats and displays the transferred screen over the story.

:::warning[Attention!]
Brute force search of the reader in the screen hierarchy and showing it's own screen after specifying the reader as a parent is not desirable.
In this case, the reader logic will not take into account that the screen is not visible to the user and will continue to count statistics and time. Thus, under the screen shown, time-based slide switching will work and eventually the reader will close, closing the screen shown.
:::

To display a new screen, on top of the reader when a button is pressed in a story, you need to track that press, using the closure `onActionWith: ((_, _ , _ , _) -> Void)?`, and to call the `present(controller: for: with:)` method with the necessary presentation parameters.

<Tabs>
<TabItem value="uikit" label="UIKit">

```swift
class ViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // creation of a StoryView instance
        let storyView = StoryView(frame: CGRect(x: 0, y: 80, width: UIScreen.main.bounds.width, height: 120), feed: "", favorite: false)
        // specify the target for displaying stories
        storyView.target = self
        // assignment of a method that will be triggered by the event from stories
        storyView.onActionWith =  storiesAction(_:_:_:)
        // add StoryView to the scrollView
        self.view.addSubview(storyView)
        // start the internal library logic
        storyView.create()
    }
}

extension ViewController {
    // event handling from stories
    func storiesAction (_ target: String, _ type: ActionType, _ storyType: StoriesType) {
        // check that the event came from the button and has a certain target type
        if type == .button && target == "myapp://open_new_screen" {
            // create a new controller
            let newScreenController = UIViewController()
            // tell InAppStory to show a new screen on top of the reader
            InAppStory.shared.present(controller: newScreenController, for: .overCurrentContext, with: .coverVertical)
        }
    }
}
```

:::tip
Can be used with any [ActionType](reference.md#actiontype), the main thing is to be able to track which screen you want to show.
:::

It's also possible to not be tied to stories events at all and display, for example, the product screen when you click on its cell in the "Goods" widget. To do this, you need to track the click on the product and open the screen on that click. More at [Widget “Goods”](widget-goods.md).

```swift
class ViewController: UIViewController {
    var storyView: StoryView!

    override func viewDidLoad() {
        super.viewDidLoad()
        // creation of a StoryView instance
        storyView = StoryView(frame: CGRect(x: 0, y: 80, width: UIScreen.main.bounds.width, height: 120), feed: "", favorite: false)
        // specify the target for displaying stories
        storyView.target = self
        // сlosure to get the list of products
        storyView.getGoodsObject = getGoodsObject(_:_:)
        // tracking of a click on one of the products
        storyView.goodItemSelected = goodItemSelected(_:_:)
        // add StoryView to the scrollView
        self.view.addSubview(storyView)
        // start the internal library logic
        storyView.create()
    }
}

// get the list of products
func getGoodsObject(_ skus: [String], _ complete: GoodsComplete) {
    var items: Array<GoodsObjectProtocol> = []
    for sku in skus {
        items.append(GoodObject(sku: sku, title: "Title", subtitle: "Description", imageURL: nil, price: "999", oldPrice: "1999"))
    }

    complete(.success(items))
}

// tracking of a click on one of the products
func goodItemSelected (_ item: GoodsObjectProtocol, _ storyType: StoriesType) {
    // creating a controller to display detailed product information
    let goodsController = GoodsController()
    // transfer of product data to the controller
    goodsController.goodObject = (item as! GoodObject)
    // tell InAppStory to show a new screen on top of the reader
    InAppStory.shared.present(controller: goodsController)
}

```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

```swift
struct SwiftUIView: View {
    var body: some View {
        VStack {
            // initialize a StoryListView
            StoryListView()
                .onAction { target, type, storyType in
                    // check that the event came from the button and has a certain target type
                    if type == .button && target == "myapp://open_new_screen" {
                        // create a new controller
                        let newScreenController = UIViewController()
                        // tell InAppStory to show a new screen on top of the reader
                        InAppStory.shared.present(controller: newScreenController, for: .overCurrentContext, with: .coverVertical)
                    }
                }
                .frame(height: 120)
                .frame(maxWidth: .infinity)
        }
    }
}
```

:::tip
Currently, `InAppStory.shared.present` does not work with `SwiftUI.View` structs. In order to display a screen written in _SwiftUI_, you need to use a `UIHostingController`:
 <details>
   <summary><b>Code example</b></summary>

```swift
struct SwiftUIView: View {
    var body: some View {
        VStack {
            // setting the isListRefresh variable to track when StoryListView is initialized
            StoryListView()
                .onAction { target, type, storyType in
                    // check that the event came from the button and has a certain target type
                    if type == .button && target == "myapp://open_new_screen" {
                        // create a new controller
                        let newScreenController = UIHostingController(rootView: createNewView())
                        // tell InAppStory to show a new screen on top of the reader
                        InAppStory.shared.present(controller: newScreenController, for: .overCurrentContext, with: .coverVertical)
                    }
                }
                .frame(height: 120)
                .frame(maxWidth: .infinity)
        }
    }

    @ViewBuilder
    func createNewView() - some View {
        VStack {
            Text("New view")
        }
    }
}
```

 </details>
 :::

</TabItem>
</Tabs>
