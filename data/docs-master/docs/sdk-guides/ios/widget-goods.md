# Widget “Goods”

## Default GoodsWidget

For the default integration of the `GoodsWidget` you need to:

1. Add the "Goods" widget to a story in the [console editor](https://console.domain-placeholder);
2. Realize two methods from `InAppStoryDelegate`:

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

#### ViewController.swift

```swift
...
extension ViewController: InAppStoryDelegate
{
    //get goods object from parent app
	func getGoodsObject(with skus: Array<String>, complete: @escaping GoodsComplete)
    {
        // get goods info from your App
        ...

        var goodsArray: Array<GoodObject> = []

        for item in goodsInfos {
            let goodObject = GoodObject(sku: <String>, //item sku
                                        title: <String>?, //item title for cell
                                        subtitle: <String>?, //item subtitle for cell
                                        imageURL: <URL>?, //image url for cell
                                        price: <String>?, //price value for cell
                                        discount: <String>?) //discount value for cell
            goodsArray.append(goodObject)
        }

        complete(.success(goodsArray))

        //if the list could not be retrieved or a network error occurred while retrieving,
        //you must call complete(.failure(.close or .refresh))
    }

    //item selection handler
    func goodItemSelected(_ item: Any, with storyType: StoriesType)
    {
        InAppStory.shared.closeReader {
            //event handling and product display in the application
        }
    }
}
```

## Customization

InAppStory has three ways to customize the `GoodsWidget`:

- Customize the default cell - [Appearance customization](#appearance-customization);
- Create a custom cell - [Custom cell](#custom-cell);
- Implement a fully custom widget on the application side - [Full widget override](#full-widget-override).

### Appearance customization

Appearance customization works similar to the stories list.

1. You will need to initialize `InAppStory` in the project:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    //library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    return true
}
```

2. Then customize the appearance of a cell and widget through parameters:

### Parameters

| Name                       | Type                                                               | Description                                 |
| -------------------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| goodsCellMainTextColor     | \<UIColor>                                                         | Default goods item cell text color.         |
| goodsCellDiscountTextColor | \<UIColor>                                                         | Default goods item cell discount text color |
| goodCellTitleFont          | \<UIFont>                                                          | Default goods item cell title font          |
| goodCellSubtitleFont       | \<UIFont>                                                          | Default goods item cell subtitle font.      |
| goodCellPriceFont          | \<UIFont>                                                          | Default goods item cell price font          |
| goodCellDiscountFont       | \<UIFont>                                                          | Default goods item cell discount font       |
| goodsCloseBackgroundColor  | \<UIColor>                                                         | Close button background color               |
| goodsSubstrateColor        | \<UIColor>                                                         | Backround color under goods list            |
| refreshGoodsImage          | \<UIImage>                                                         | Images for refresh button                   |
| goodsCloseImage            | \<UIImage>                                                         | Images for close button                     |
| goodCell                   | \<[GoodsCellProtocol](reference.md#goodscellprotocol)>             | Custom cell, should implement the protocol  |
| goodsView                  | \<[CustomGoodsView](reference.md#customgoodsview)>                 | Custom goods view, should inherit from      |
| goodsDelegateFlowLayout    | \<[GoodsDelegateFlowLayout](reference.md#goodsdelegateflowlayout)> | Should implement the protocol               |

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    ...

    // customization of appearance
    InAppStory.shared.goodsCellMainTextColor: UIColor     = .black //color of cell labels
    InAppStory.shared.goodsCellDiscountTextColor: UIColor = .red //color of discount label

    //fonts of cell's labels
    InAppStory.shared.goodCellTitleFont: UIFont    = UIFont.systemFont(ofSize: 14.0, weight: .medium)
    InAppStory.shared.goodCellSubtitleFont: UIFont = UIFont.systemFont(ofSize: 12.0)
    InAppStory.shared.goodCellPriceFont: UIFont    = UIFont.systemFont(ofSize: 14.0, weight: .medium)
    InAppStory.shared.goodCellDiscountFont: UIFont = UIFont.systemFont(ofSize: 14.0, weight: .medium)

    //background color of close button
    InAppStory.shared.goodsCloseBackgroundColor: UIColor  = .white
    //goods list background color
    InAppStory.shared.goodsSubstrateColor: UIColor        = .white

    //image for refresh button
    InAppStory.shared.refreshGoodsImage: UIImage = UIImage(named: "refreshIcon")!
    //image for close button
    InAppStory.shared.goodsCloseImage: UIImage   = UIImage(named: "goodsClose")!
}
```

3. Then initialize `StoryView` in `ViewController`:

#### ViewController.swift

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    let storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0)) //StoryView initialization
    view.addSubview(storyView) //adding an object to a view

    storyView.create() //running internal logic
}
```

4. It is also necessary to add `GoodsDelegateFlowLayout` and implement it:

#### ViewController.swift

```swift
...
override func viewDidLoad() {
    ...

    InAppStory.shared.goodsDelegateFlowLayout = self //defining a list display delegate
}

...
// Implementing GoodsDelegateFlowLayout Methods
func sizeForItem() -> CGSize
{
    return return CGSize(width: 158.0, height: 224.0) //cell size
}

func insetForSection() -> UIEdgeInsets
{
    return UIEdgeInsets(top: 0.0, left: 8.0, bottom: 0.0, right: 8.0) //padding from the edges of the StoryView
}

func minimumLineSpacingForSection() -> CGFloat
{
    return 8.0 //vertical padding between cells
}

```

## Custom cell

1. You need to initialize `InAppStory` in the project:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    //library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    return true
}
```

2. Then initialize `StoryView` in `ViewController`:

#### ViewController.swift

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    let storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0)) //StoryView initialization
    view.addSubview(storyView) //adding an object to a view

    storyView.create() //running internal logic
}
```

3. It is also necessary to add `GoodsDelegateFlowLayout` and implement it:

#### ViewController.swift

```swift
...
override func viewDidLoad() {
    ...

    InAppStory.shared.goodsDelegateFlowLayout = self //defining a list display delegate
}

...
// Implementing GoodsDelegateFlowLayout Methods
func sizeForItem() -> CGSize
{
    return return CGSize(width: 130.0, height: 130.0) //cell size
}

func insetForSection() -> UIEdgeInsets
{
    return UIEdgeInsets(top: 0.0, left: 8.0, bottom: 0.0, right: 8.0) //padding from the edges of the StoryView
}

func minimumLineSpacingForSection() -> CGFloat
{
    return 8.0 //vertical padding between cells
}

```

4. For the list cell, create a class that implements the `GoodsCellProtocol` protocol:

#### CustomGoodsCell.swift

```swift
class CustomGoodsCell: UICollectionViewCell
{
    // cell reuse identifier
    static var reuseIdentifier: String {
        return String(describing: self)
    }

    // nib of the cell's visual representation,
    // if the cell was created only in the code, it is necessary to return nil
    static var nib: UINib? {
        return UINib(nibName: String(describing: self), bundle: Bundle(for: self))
    }
}

// implementation of the GoodsCellProtocol
extension CustomGoodsCell: GoodsCellProtocol
{
    func setGoodObject(_ object: Any!)
    {
        //this method accepts any object that the developer passed
        //to the delegate method getGoodsObject(...)
        //from this object you can fill the contents of the cell
    }
}
```

> **Attention!**  
> The library does not have access to the custom cell, except for the implementation of the `GoodsCellProtocol ` protocol. To display the actual information and avoid duplicate thumbnails, it is necessary to clean the images and colors with each call of the `setGoodObject` methods.

5. It is necessary to specify cell data for an instance of the `InAppStory`:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    ...

    //set custom cell class
    InAppStory.shared.goodCell = CustomGoodsCell()
}
```

## Full widget override

The Goods Widget can be completely replaced with a custom implementation. It must be remembered that the library does not have an access to it and works with the widget only through the [CustomGoodsView](reference.md#customgoodsview) methods.

1. You need to initialize InAppStory in the project:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    //library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    return true
}
```

2. Should create a class that inherits `CustomGoodsView`:

#### ViewController.swift

```swift
class GoodsView: CustomGoodsView
{
    override func setSKUItems(_ items: Array<String>)
    {
        super.setSKUItems(items)

        //setting the SKU list received from the library components
    }

    override func setReaderFrame(_ frame: CGRect)
    {
        super.setReaderFrame(frame)

        //setting the size and position of the reader from which the widget was shown
    }

    func selectGoodsItem()
    {
        // send selected item SKU for statistics
        super.goodsItemClick(with: <String>)
    }
}
```

To close the widget, for example, when tapping on an empty space, you need to call `close()` on the _superclass_.

If you want to close the reader, for example, after a tap on one of the products, you can call `InAppStory.shared.closeReader()`. This method will close any open reader shown on the screen, as well as all its child screens.

3. It is necessary to specify custom view data for an instance of the `InAppStory`:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    ...

    //set custom goods view class
    InAppStory.shared.goodsView = GoodsView()
}
```

4. Then you can implement the handling of your widget's actions.

## Detail screen presenting

If you need to show a screen with a detailed product description, but you don't want to close the stories, you can use the `InAppStory.shared.present(controller: for: with:)` method. For more details and sample code, see [Screen presenting](screen-presenting.md).
