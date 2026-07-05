import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Banners place

Starting with SDK version 1.26.0, banner display functionality has been added.

## Initialization

To embed the banner widget into your application, you must first initialize the SDK (if it has not been initialized previously with other functionality). SDK initialization is covered in the [Basic initialization](how-to-get-started.md#basic-initialization) section.

<Tabs>
<TabItem value="uikit" label="UIKit">

Banners can be added as `StoryView`:

```Swift
var bannersView: IASBannersView!

override func viewDidLoad() {
    super.viewDidLoad()
        
    bannersView = IASBannersView(placeID: <String> = "default", 
                                 appearance: <IASBannersAppearance> = .init(), 
                                 frame: <CGRect> = .zero)
        
    view.addSubview(bannersView)
    
    bannersView.create() // beginning of the widget's internal logic
}
```

After calling the `create()` method, the internal logic for opening a session and obtaining a list of banners will start. You can track the loading of banners in the `bannersDidUpdated` closure (see description below).

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

Banners can be added as `StoryListView`:

```SwiftUI
struct ContentView: View
{
    var body: some View {
        VStack(alignment: .leading) {
            IASBannersListView(id: <String?>,
                          appearance: <IASBannersAppearance>)
                /// when initializing IASBannersListView, you should specify its size,
                /// otherwise it will stretch to the whole screen
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            Spacer()
        }
    }
}
```

After initializing `IASBannersListView`, the internal logic for opening a session and obtaining a list of banners is launched. You can track the loading of banners in the `onUpdate` callback (see description below).

</TabItem>
</Tabs>

> **Please note**
> 
> Prior to version 1.28.6, the first call to the `create()` method cached the data received from the server, and subsequent calls—even for new `IASBannersView` instances—retrieved data from the cache
>
> Starting with version 1.28.6, the `create()` method always fetches the banner list from the server unless preload banners place has been called. Read more about preloading here [read here](#preloading)

## Customization

To change the appearance of banners, use the `IASBannersAppearance` object:

```Swift
struct IASBannersAppearance {
   let shouldLoop: Bool // if banner place is looped, default = true
   let sideInset: CGFloat // which part (in dp) of other banners will be shown with current, default = 0.0
   let leadingInset: CGFloat // setting the cast parameter for indentation (if not specified, it is taken from sideInset)
   let trailingInset: CGFloat // setting the cast parameter for indentation (if not specified, it is taken from sideInset)
   let interItemSpacing: CGFloat // distance (in dp) between banners, default = 8.0
   let cornerRadius: CGFloat // radius (in dp) of banners, default = 16.0
}
```

<Tabs>
<TabItem value="uikit" label="UIKit">

This object must be set when initializing the banner widget. Once set, it cannot be changed. If you need to change the appearance of the widget, you must create a new instance of it.

```Swift
var bannersView: IASBannersView!

override func viewDidLoad() {
    super.viewDidLoad()
    
    let bannersAppearance = IASBannersAppearance(shouldLoop: false,
                                                 sideInset: 24.0,
                                                 interItemSpacing: 16.0,
                                                 cornerRadius: 8.0)
                                                 
    bannersView = IASBannersView(appearance: bannersAppearance)
        
    view.addSubview(bannersView)
    
    bannersView.create()
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

This object must be set when initializing the banner widget. Once set, it cannot be changed. If you need to change the appearance of the widget, you must create a new instance of it.

```SwiftUI
struct ContentView: View
{
    let bannersAppearance = IASBannersAppearance(shouldLoop: false,
                                                 sideInset: 24.0,
                                                 interItemSpacing: 16.0,
                                                 cornerRadius: 8.0)
                                                 
    var body: some View {
        VStack(alignment: .leading) {
            IASBannersListView(appearance: bannersAppearance)
                /// when initializing IASBannersListView, you should specify its size,
                /// otherwise it will stretch to the whole screen
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            Spacer()
        }
    }
}
```

</TabItem>
</Tabs>

## Preloading

To make Banners place showing faster, you can preload banners data by placeID. Call `InAppStory.shared.preloadBanners(placeID: String, complete: @escaping (Result<Bool, Error>) -> Void)` and wait for completion.

> **Pay attention**  
> Preloading is only possible after SDK initialization.

### Basic preloading (for example, on a Splash Screen)

```Swift
InAppStory.shared.preloadBanners(placeID: <placeID>) { result in
    switch result {
    case .success:
        // Data was loaded
        break
    case .failure:
        // Loading error
        break
    }
}
```

> **Please note**  
> After preloading a banner place, all instances of the `IASBannersView` object with a preloaded `placeID` will retrieve data only from the cache. To update the data in the list, you must either call the `refresh()` method or trigger the preload again.

## Actions

To track the actions of the banner widget, you need to subscribe to the closures:

<Tabs>
<TabItem value="uikit" label="UIKit">

- `bannersDidUpdated: <(_ isContent: <Bool>, _ count: <Int>, _ listHeight: <CGFloat>) -> Void>` -  called when the banner list is updated, for example, when first loaded, after calling `create()` or `refresh()` to update the list:
	- `isContent: <Bool>` - a parameter showing whether there is content in the widget;
	- `count: <Int>` - a parameter showing how many items are in the list (can be used for dot control navigation);
	- `listHeight: <CGFloat>` - the height of the widget relative to its width and the calculated size of the largest banner;
- `onActionWith: (_ target: <String>) -> Void`: called when an action occurs inside the banner, such as clicking a button with a link;
	- `target: <String>` - link obtained as a result of clicking a button in the banner;
- `bannersDidScroll: (_ index: <Int>) -> Void`: called when the banner list is scrolled. This can be a swipe through the list, scrolling by an internal timer, or by external methods (described below);
	- `index: <Int>` - the index to which the banner list has scrolled (can be used for dot control navigation);

```Swift
extension ViewController {
    func observers() {
        bannersView.bannersDidUpdated = { isContent, count, listHeight in
            // banner list updated
            // skeleton or preloader (if present) can be removed
            // banner container height can be updated using the listHeight parameter
        }
        
        bannersView.onActionWith = { target in
            // an action was performed
            // here you can process the link
            // that came in the target parameter
        }
        
        bannersView.bannersDidScroll = { index in
            // list of banners has been updated
            // dot control navigation can be updated
        }
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

- `onUpdate(_ bannersDidUpdte: <(_ isContent: <Bool>, _ count: <Int>, _ listHeight: <CGFloat>) -> Void>)` -  called when the banner list is updated, for example, during the first load, after calling `create()` or `refresh()` to update the list:
	- `isContent: <Bool>` - a parameter showing whether there is content in the widget;
	- `count: <Int>` - a parameter showing how many items are in the list (can be used for dot control navigation);
	- `listHeight: <CGFloat>` - the height of the widget relative to its width and the calculated size of the largest banner;
- `onAction(_ action: (_ target: <String>) -> Void)`: called when an action occurs inside the banner, for example, clicking a button with a link;
	- `target: <String>` - the link obtained as a result of clicking on a button in the banner;
- `didScroll(_ didScroll: (_ index: <Int>) -> Void)`: called when the banner list is scrolled. This can be a swipe through the list, scrolling by an internal timer, or by external methods (described below);
	- `index: <Int>` - the index to which the banner list has scrolled (can be used for dot control navigation);

```SwiftUI
struct ContentView: View
{
    let bannersAppearance = IASBannersAppearance(shouldLoop: false,
                                                 sideInset: 24.0,
                                                 interItemSpacing: 16.0,
                                                 cornerRadius: 8.0)
                                                 
    var body: some View {
        VStack(alignment: .leading) {
            IASBannersListView(appearance: bannersAppearance)
                .onUpdate { isContent, count, height in
                    print("Content is \(isContent)")
                }
                .onAction { target in
                    print("Target: \(target), Type: \(type)")
                }
                .didScroll { index in
                    print("Did scroll to index: \(index)")
                }
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            Spacer()
        }
    }
}
```

</TabItem>
</Tabs>

## Navigation

<Tabs>
<TabItem value="uikit" label="UIKit">

To control the display and movement of banners, you can use methods to flip to the nearest ones or jump to a specific index:

- `showNext()` - used to jump to the next banner in the list;
- `showPrevious()` - used to go to the previous banner in the list;
- `showBannerWith(index: <Int>)` - used to go to a specific banner by index (can be used for dot control navigation);

```Swift
extension ViewController {
    func nextButtonTouch() {
        bannersView.showNext()
    }
    
    func previosButtonTouch() {
        bannersView.showPrevious()
    }
    
    func dotControlTouch(with index: Int) {
        bannersView.showBannerWith(index: index)
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

To control the display and movement of banners, you can use methods for flipping to the nearest or moving to a specific index obtained from closures:

- `showNext(_ showNext: @escaping ((_ showNext: @escaping () -> Void) -> Void)) -> IASBannersListView` - used to move to the next banner in the list;
- `showPrevious(_ showPrevious: @escaping ((_ showPrevious: @escaping () -> Void) -> Void)) -> IASBannersListView` - used to move to the previous banner in the list;
- `showWithIndex(_ showWithIndex: @escaping ((_ showWithIndex: @escaping (_ index: Int) -> Void) -> Void)) -> IASBannersListView` - used to navigate to a specific banner by index (can be used for dot control navigation);

```SwiftUI
struct ContentView: View
{
    @State private var showNextBanner: () -> Void = {}
    @State private var showPreviousBanner: () -> Void = {}
    @State private var showBannerWithIndex: (_ index: Int) -> Void = { _ in }
    
    let bannersAppearance = IASBannersAppearance(shouldLoop: false,
                                                 sideInset: 24.0,
                                                 interItemSpacing: 16.0,
                                                 cornerRadius: 8.0)
                                                 
    var body: some View {
        VStack(alignment: .leading) {
            IASBannersListView(appearance: bannersAppearance)
                .showNext { showNexBanner in
                    self.showNextBanner = showNexBanner
                }
                .showPrevious { showPreviousBanner in
                    self.showPreviousBanner = showPreviousBanner
                }
                .showWithIndex { showWithIndex in
                    self.showBannerWithIndex = showWithIndex
                }
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            Spacer()
            HStack {
                Button {
                    self.showPreviousBanner()
                } label: {
                    Image(systemName: "arrow.left.circle")
                        .imageScale(.large)
                        .font(.system(size: 16.0))
                        .foregroundColor(.white)
                }
                .frame(maxWidth: 40, maxHeight: 40)
                .cornerRadius(20)
                Spacer()
                Button {
                    self.showNextBanner()
                } label: {
                    Image(systemName: "arrow.right.circle")
                        .imageScale(.large)
                        .font(.system(size: 16.0))
                        .foregroundColor(.white)
                }
                .frame(maxWidth: 40, maxHeight: 40)
                .cornerRadius(20)
            }
        }
    }
}
```

</TabItem>
</Tabs>

Similarly, there are methods for controlling playback in banners that control the internal page-turning timer.

<Tabs>
<TabItem value="uikit" label="UIKit">

- `pause()` - stops the internal timer (the timer will restart upon any user interaction with the banner);
- `resume()` - resumes the logic of the internal timers;

```Swift
extension ViewController {
    func disappearController() {
        bannersView.pause()
    }
    
    func appearController() {
        bannersView.resume()
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

- `pause(_ pause: @escaping ((_ pause: @escaping () -> Void) -> Void)) -> IASBannersListView` - stops the internal timer (the timer will restart upon any user interaction with the banner);
- `resume(_ resume: @escaping ((_ resume: @escaping () -> Void) -> Void)) -> IASBannersListView` - resumes the logic of internal timers;

```SwiftUI
struct ContentView: View
{
    @State private var pauseBanners: () -> Void = {}
    @State private var resumeBanners: () -> Void = {}
    
    let bannersAppearance = IASBannersAppearance(shouldLoop: false,
                                                 sideInset: 24.0,
                                                 interItemSpacing: 16.0,
                                                 cornerRadius: 8.0)
                                                 
    var body: some View {
        VStack(alignment: .leading) {
            IASBannersListView(appearance: bannersAppearance)
                .pause { pause in
                    self.pauseBanners = pause
                }
                .resume { resume in
                    self.resumeBanners = resume
                }
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            Spacer()
            HStack {
                Button {
                    self.pauseBanners()
                } label: {
                    Image(systemName: "pause")
                        .imageScale(.large)
                        .font(.system(size: 16.0))
                        .foregroundColor(.white)
                }
                .frame(maxWidth: 40, maxHeight: 40)
                .cornerRadius(20)
                Spacer()
                Button {
                    self.resumeBanners()
                } label: {
                    Image(systemName: "play")
                        .imageScale(.large)
                        .font(.system(size: 16.0))
                        .foregroundColor(.white)
                }
                .frame(maxWidth: 40, maxHeight: 40)
                .cornerRadius(20)
            }
        }
    }
}
```

</TabItem>
</Tabs>

## Events

For banners, a new subobject `IASBanner` has been added to the `IASEvent` object (for more details, see the [Events](events.md) section).

- `IASEvent.IASBanner.bannersLoaded(placeID: String? = nil)` - the list of banners has loaded, `IASBannersView` is ready to work (fires every time the list is loaded, and also on refresh).
    - `placeID ` - banners place identifier;
- `IASEvent.IASBanner.show(bannerData: IASBannerData)` - called when a banner is displayed on the screen.
    - `bannerData ` - containing a brief description of the selected banner;
- `IASEvent.IASBanner.preloaded(placeID: String, banners: Array<IASBannerData>)` - called when a banners is preloaded by place.
    - `placeID ` - banners place identifier;
    - `bannerData ` - containing a brief description of the selected banner;
- `IASEvent.IASBanner.widgetEvent(bannerData: IASBannerData, name: String, data: Dictionary<String, Any>?)`
    - `bannerData ` - containing a brief description of the selected banner;
    - `name` - name of widget;
    - `data<Dictionary<String, Any>?>` - activated widget data, [detailed data fields](/glossarium/statistics/stories-widget-events.md);

