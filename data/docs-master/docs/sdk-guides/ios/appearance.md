import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Appearance

## Cell customization

### Customization through properties

Customization through properties changes the appearance of a standard cell with fixed rounding and border thickness. Sizes also apply to the favorites cell.
To change the appearance, shape and behavior of a cell, you need to create your own cell. The cell should implement `StoryCellProtocol` and `FavoriteCellProtocol`, described in more detail [here](#fully-custom-cells).

1. Initialize InAppStory in the project:

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

2. Customize the appearance of the cell through parameters:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    ...

    // customization of appearance
    InAppStory.shared.showCellTitle = true //title display

    InAppStory.shared.cellBorderColor = .purple //border color around an unopened cell

    // cell's border radius
    // to create a circle, you need to specify half the cell size.
    // at this sample - is 75.0
    InAppStory.shared.cellBorderRadius = 16.0 // default value

    InAppStory.shared.cellFont = UIFont.systemFont(ofSize: 12.0) //title font (you can specify your own by first connecting it to the project)

    InAppStory.shared.coverQuality = .high // quality of cover images
}
```

<Tabs>
<TabItem value="uikit" label="UIKit">

3. Initialize `StoryView` in `ViewController`:

#### ViewController.swift

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    let storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0)) //StoryView initialization
    view.addSubview(storyView) //adding an object to a view

    storyView.create() //running internal logic
}
```

4. It is also necessary to add `StoryViewDelegateFlowLayout` and implement it:

#### ViewController.swift

```swift

...

override func viewDidLoad() {
    super.viewDidLoad()

    storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0)) //StoryView initialization
    storyView.deleagateFlowLayout = self //defining a list display delegate

    view.addSubview(storyView) //adding an object to a view

    storyView.create() //running internal logic
}
...
// Implementing StoryViewDelegateFlowLayout Methods
func sizeForItem() -> CGSize
{
    return CGSize(width: 160.0, height: 160.0) //cell size
}

func insetForSection() -> UIEdgeInsets
{
    return UIEdgeInsets(top: 4.0, left: 4.0, bottom: 4.0, right: 4.0) //padding from the edges of the StoryView
}

func minimumLineSpacingForSection() -> CGFloat
{
    return 4.0 //vertical padding between cells
}

func minimumInteritemSpacingForSection() -> CGFloat
{
    return 4.0 //horizontal padding between cells
}

```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

3. Initialize `StoryListView` into `View` and set closures to set cell sizes and indents:

#### ContentView.swift

```swift
struct ContentView: View
{
    var body: some View {
        StoryListView()
            /// returns the cell size for the list
            .itemsSize {
                CGSize(width: 100, height: 100)
            }
            /// returns padding from the edges of the list for cells
            .edgeInserts {
                UIEdgeInsets(top: 8, left: 8, bottom: 8, right: 8)
            }
            /// the spacing between successive rows or columns of a section
            .lineSpacing {
                8
            }
            /// the spacing between successive items of a single row or column
            .interitemSpacing {
                8
            }
            .frame(height: 116.0)
    }
}
```

</TabItem>
</Tabs>

### Fully custom cells

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

<Tabs>
<TabItem value="uikit" label="UIKit">

2. Initialize `StoryView` in `ViewController`:

#### ViewController.swift

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    let storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0)) //StoryView initialization
    view.addSubview(storyView) //adding an object to a view

    storyView.create() //running internal logic
}
```

3. It is also necessary to add `StoryViewDelegateFlowLayout` and implement it:

#### ViewController.swift

```swift
...
override func viewDidLoad() {
    super.viewDidLoad()

    storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0)) //StoryView initialization
    storyView.deleagateFlowLayout = self //defining a list display delegate

    view.addSubview(storyView) //adding an object to a view

    storyView.create() //running internal logic
}
...
// implementing StoryViewDelegateFlowLayout methods
func sizeForItem() -> CGSize
{
    return CGSize(width: 160.0, height: 160.0) //cell size
}

func insetForSection() -> UIEdgeInsets
{
    return UIEdgeInsets(top: 4.0, left: 4.0, bottom: 4.0, right: 4.0) //padding from the edges of the StoryView
}

func minimumLineSpacingForSection() -> CGFloat
{
    return 4.0 //vertical padding between cells
}

func minimumInteritemSpacingForSection() -> CGFloat
{
    return 4.0 //horizontal padding between cells
}

```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

2. Initialize `StoryListView` in `View`:

#### ContentView.swift

```swift
struct ContentView: View
{
    var body: some View {
        StoryListView()
            .frame(height: 116.0)
    }
}
```

3. Set closures to set cell sizes and indents:

#### ContentView.swift

```swift
struct ContentView: View
{
    var body: some View {
        StoryListView()
            /// returns the cell size for the list
            .itemsSize {
                CGSize(width: 100, height: 100)
            }
            /// returns padding from the edges of the list for cells
            .edgeInserts {
                UIEdgeInsets(top: 8, left: 8, bottom: 8, right: 8)
            }
            /// the spacing between successive rows or columns of a section
            .lineSpacing {
                8
            }
            /// the spacing between successive items of a single row or column
            .interitemSpacing {
                8
            }
            .frame(height: 116.0)
    }
}
```

</TabItem>
</Tabs>

4. For the list cell, create the class that will implement the `StoryCellProtocol` protocol:

#### CustomStoryCell.swift

```swift
class CustomStoryCell: UICollectionViewCell
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

    // id of story
    var storyID: String!
}

// implementation of the StoryCellProtocol
extension CustomStoryCell: StoryCellProtocol
{
    func setTitle(_ text: String) {
        // title of the cell
    }

    func setImageURL(_ url: URL) {
        // image url for cover
    }

    func setVideoURL(_ url: URL) {
        // video url for animated covers
    }

    func setOpened(_ value: Bool) {
        // set new state if story is opened
    }

    func setHighlight(_ value: Bool) {
        // set new state if story cell is highlighted
    }

    func setBackgroundColor(_ color: UIColor) {
        // set background color of the cell
    }

    func setTitleColor(_ color: UIColor) {
        // set title color of the cell
    }

    func setSound(_ value: Bool) {
        // does the story has sound on
    }

    // optional method StoryCellProtocol protocol
    func setUGCPayload(_ payload: Dictionary<String, Any>) {
    	 // if the list contains UGC stories created by users,
    	 // then payload value set during stories creation in UGC editor is passed to the method.
    }
}
```

:::warning[Please note]
If you change the shape of a cell, such as rounding the edges or creating a round cell, the cell dimensions may not match the final cell dimensions when created and reused. In order to prevent "crawling" of the dimensions, you can additionally update the form in the `func layoutSubviews()` method.

```swift
override func layoutSubviews() {
    super.layoutSubviews()
       
    if playerLayer != nil {
        playerLayer.frame = CGRect(x: 0.0, y: 0.0, width: videoView.frame.width, height: videoView.frame.height)
    }
       
    imageView.layer.cornerRadius = (frameView.frame.width / 2.0) - 4
    roundView.layer.cornerRadius = (frameView.frame.width / 2.0) - 4
    frameView.layer.cornerRadius = frameView.frame.width / 2.0
}
```
:::

5. If the _favorite_ functionality is enabled in the application, create a class that will implement the `FavoriteCellProtocol` protocol:

#### CustomFavoriteCell.swift

```swift
class CustomFavoriteCell: UICollectionViewCell
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

// implementation of the FavoriteCellProtocol
extension StoryFavoriteCell: FavoriteCellProtocol
{
    func setImages(_ urls: Array<URL?>) {
        // a list of addresses of the first four images stories in favorites
    }

    func setImagesColors(_ colors: Array<UIColor?>) {
        // a list of background colors of the first four stories in favorites
    }

    func setHighlight(_ value: Bool) {
        // set new state if story cell if highlighted
    }

    func setBackgroundColor(_ color: UIColor) {
        // main background color of a cell
    }
}
```

:::warning[Attention!]
The library does not have an access to the custom cell, except for the implementation of the `FavoriteCellProtocol`. To display the actual information and to avoid duplicating thumbnails it is necessary to clean the images and colors with each call of the `setImages` and `setImagesColors` methods.
:::

<Tabs>
<TabItem value="uikit" label="UIKit">

6. It is necessary to specify cell data for an instance of the `StoryView` class:

#### ViewController.swift

```swift
override func viewDidLoad() {
    super.viewDidLoad()

    let storyView = StoryView(frame: CGRect(x: 0.0, y: 100.0, width: 320.0, height: 160.0)) //StoryView initialization

    storyView.deleagateFlowLayout = self //defining a list display delegate

    storyView.storyCell = CustomStoryCell() //custom list cell
    storyView.favoriteCell = CustomFavoriteCell() //custom favorite cell

    view.addSubview(storyView) //adding an object to a view

    storyView.create() //running internal logic
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

6. It is necessary to specify cell data for an instance of the `StoryListView` class:

#### ContentView.swift

```swift
struct ContentView: View
{
    var body: some View {
        StoryListView()
            /// custom list cell
            .setStoryCell(customCell: CustomStoryCell())
            /// custom favorite cell
            .setFavoriteCell(customCell: CustomFavoriteCell())
            /// returns the cell size for the list
            .itemsSize {
                CGSize(width: 100, height: 100)
            }
            /// returns padding from the edges of the list for cells
            .edgeInserts {
                UIEdgeInsets(top: 8, left: 8, bottom: 8, right: 8)
            }
            /// the spacing between successive rows or columns of a section
            .lineSpacing {
                8
            }
            /// the spacing between successive items of a single row or column
            .interitemSpacing {
                8
            }
            .frame(height: 116.0)
        }
}
```

</TabItem>
</Tabs>

## Cell video cover

Covers for cells can be rendered as video.

After customizing a cell using `StoryCellProtocol` (description in the [Cell customization](#cell-customization) section), you need to implement work with video, if necessary.

:::warning[Attention!]
1.  Caching video covers is carried out by the means of the library, and the address to the file (which is located in the local storage) goes to the implementation of the `setVideoURL(_ url: URL)` method.
2.  To prevent video covers from drowning out the sound of the background audio/video, you need to:

    - When opening the application and before creating the `StoryView`, set the `AVAudioSession` to the `.ambient` category
    - If you need to start audio/video in an application overlapping background audio playback from another application, specify the `.playback`/`.soloAmbient` category
    - Upon completion of audio/video playback, set the `AVAudioSession` to the `.ambient` category again.
    - Mode (`AVAudioSession.Mode`) and options (`AVAudioSession.CategoryOptions`), at the discretion of the developer.

:::

### Cover video example

#### CustomStoryCell.swift

```swift
import AVFoundation

class CustomStoryCell: UICollectionViewCell
{
    ...
    fileprivate let player = AVPlayer()
    fileprivate var playerLayer: AVPlayerLayer!

    // video container
    @IBOutlet weak var videoView: UIView!
    ...

    override func prepareForReuse() {
        super.prepareForReuse()

        ...
        // when reusing a cell, the container is hidden
        videoView.isHidden = true
    }

    override func awakeFromNib() {
        super.awakeFromNib()

        // creating a video layer and adding it to the container
        if playerLayer == nil {
            player.isMuted = true
            playerLayer = AVPlayerLayer(player: player)
            playerLayer.frame = videoView.frame
            playerLayer.videoGravity = .resizeAspectFill
            videoView.layer.addSublayer(playerLayer)
        }
    }

    override func layoutSublayers(of layer: CALayer) {
        super.layoutSublayers(of: layer)

        // update the video layer size
        if playerLayer != nil {
            playerLayer.frame = videoView.frame
        }
    }

    deinit {
        NotificationCenter.default.removeObserver(self)
    }
}

// implementation of the StoryCellProtocol
extension CustomStoryCell: StoryCellProtocol
{
    ...
    func setVideoURL(_ url: URL) {
        // setting a new element to the player by url
        player.replaceCurrentItem(with: AVPlayerItem(url: url))

        // creating an event handler to loop video
        NotificationCenter.default.removeObserver(self)
        NotificationCenter.default.addObserver(forName: .AVPlayerItemDidPlayToEndTime, object: player.currentItem, queue: .main) { [weak self] _ in
            guard let weakSelf = self, !weakSelf.videoView.isHidden else {
                return
            }

            weakSelf.player.seek(to: CMTime.zero)
            weakSelf.player.play()
        }

        // start playback
        player.play()

        // displaying a container in a cell
        videoView.isHidden = false
    }
    ...
}
```

### Custom video example

#### CustomStoryCell.swift

```swift
import AVFoundation

class CustomStoryCell: UICollectionViewCell
{
    ...
    // replace AVPlayerLayer
    fileprivate var videoDisplayLayer: AVSampleBufferDisplayLayer?

    // video container
    @IBOutlet weak var videoView: UIView!
    ...

    override func prepareForReuse() {
        super.prepareForReuse()

        ...
        // when reusing a cell, the container is hidden
        videoView.isHidden = true
        // stop all video activity from previos used
        stopAllVideoActivity()
    }

    override func layoutSublayers() {
        super.layoutSublayers()

        // update the video layer size
        videoDisplayLayer?.frame = videoView.bounds
    }
    
    override func willMove(toSuperview newSuperview: UIView?) {
        super.willMove(toSuperview: newSuperview)
        
        if newSuperview == nil {
            stopAllVideoActivity()
        }
    }

    deinit {
        stopAllVideoActivity
    }
}

// implementation of the StoryCellProtocol
extension CustomStoryCell: StoryCellProtocol
{
    ...
    func setVideoURL(_ url: URL) {
        stopAllVideoActivity()

        let playerLayer = IASVideoPlayerLayer()
        playerLayer.frame = videoView.bounds
        videoView.layer.addSublayer(playerLayer)
        playerLayer.play(url: url)

        videoDisplayLayer = playerLayer
        videoView.isHidden = false
    }
    ...
}

extension CustomStoryCell {
    ...
    func stopAllVideoActivity() {
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        if let playerLayer = videoDisplayLayer as? IASVideoPlayerLayer {
            playerLayer.stop()
        }
        videoDisplayLayer?.removeFromSuperlayer()
        CATransaction.commit()

        videoDisplayLayer = nil
    }
    ...
}
```

## List customization

### Parameters

| Name                | Type                                                    | Description                                         |
| ------------------- | ------------------------------------------------------- | --------------------------------------------------- |
| coverQuality        | \<[Quality](reference.md#quality)>                       | Quality of cover images in cells.                   |
| showCellTitle       | \<Bool>                                                 | Displays story titles in a cell                     |
| cellFont            | \<UIFont>                                               | Cell title font.                                    |
| cellBorderColor     | \<UIColor>                                              | Cell border color                                   |
| cellBorderOpenedColor     | \<UIColor>                                        | Cell border color after opening a story                                   |
| cellBorderRadius    | \<CGFloat>                                              | Radius of default cell borders.                     |
| cellGradientEnabled | \<Bool>                                                 | Displays shading on the bottom of the default cell. |
| editorCellSettings  | \<[EditorCellProtocol](reference.md#editorcellprotocol)> | Sets the cell view of the UGC editor                |

## Reader customization

#### Change the appearance of the reader:

1. [Close button position](#close-button-position)
2. [Timers shadow gradient](#timers-shadow-gradient)
3. [Changing icons in the bottom panel](#changing-icons-in-the-bottom-panel)
4. [Changing the preloader on unloaded cards](#changing-the-preloader-on-unloaded-cards)
5. [Presentation style](#presentation-style)
6. [Swipe animation](#swipe-animation)
7. [Timers gradient](#timers-gradient)

### Parameters

| Name                       | Type                                                                      | Description                                                         |
| -------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| placeholderElementColor    | \<UIColor>                                                                | Slide preloader color.                                              |
| placeholderBackgroundColor | \<UIColor>                                                                | Slide preloader background color.                                   |
| gamePlaceholderTint        | \<UIColor>                                                                | Default game loader tint color                                      |
| readerBackgroundColor      | \<UIColor>                                                                | Background color, `black` by default                                |
| readerCornerRadius         | \<CGFloat>                                                                | Corner radius of of stories cards, `16.0` by default                |
| timerGradientEnable        | \<Bool>                                                                   | Enables gradient shadow under timers in story                       |
| timerGradient              | \<TimersGradient>                                                         | Shadow gradient at the top of the story below the timers            |
| likeImage                  | \<UIImage>                                                                | Images for the like button                                          |
| likeSelectedImage          | \<UIImage>                                                                | Images for the selected like button                                 |
| dislikeImage               | \<UIImage>                                                                | Images for the dislike button                                       |
| dislikeSelectedImage       | \<UIImage>                                                                | Images for the selected dislike button                              |
| favoriteImage              | \<UIImage>                                                                | Images for favorites button                                         |
| favoriteSelectedImage      | \<UIImage>                                                                | Images for selected favorites button                                |
| shareImage                 | \<UIImage>                                                                | Images for sharing button                                           |
| shareSelectedImage         | \<UIImage>                                                                | Images for selected sharing button                                  |
| placeholderView            | \<[PlaceholderProtocol](reference.md#placeholderprotocol)>                 | Custom loader, implement the protocol beforehand                    |
| gamePlaceholderView        | \<[DownloadPlaceholderProtocol](reference.md#downloadplaceholderprotocol)> | Custom game loader with progress, implement the protocol beforehand |
| closeReaderImage           | \<UIImage>                                                                | Image for reader's close button. Recommended value `24pt`.          |
| closeButtonPosition        | \<[ClosePosition](reference.md#closeposition)>                             | The position of the close button relative to the timers.            |
| scrollStyle                | \<[ScrollStyle](reference.md#scrollstyle)>                                 | Animation style for slide transitions.                              |
| presentationStyle          | \<[PresentationStyle](reference.md#presentationstyle)>                     | Reader display style.                                               |

### Close button position

When initializing a library in an application, you can specify `closeButtonPosition`. The default is `.trailing`. There are 4 positions of the "Close" button in the library:

**Renamed from version 1.25.0**

- `right` - on the right, at the timer level
- `left` - to the left, at the timer level
- `bottomRight` - on the right, under the timer level
- `bottomLeft` - on the left, under the timer level

**Since version 1.25.0**

- `leading` - leading by story card, at the timer level
- `trailing` - trailing by story card, at the timer level
- `leadingBottom` - leading by story card, under the timer level
- `trailingBottom` - trailing by story card, under the timer level

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    // close button position
    InAppStory.shared.closeButtonPosition = <ClosePosition>

    return true
}
```

### Timers shadow gradient

When initializing the library in the application, you can change the shadow gradient display under the timers `TimersGradient`. Look for details [here](reference.md#timersgradient).

#### Defaults init parametrs

```swift
init(colors: Array<UIColor> = [UIColor(white: 0.0, alpha: 0.0), UIColor(white: 0.0, alpha: 0.3)],
     startPoint: CGPoint = CGPoint(x: 0.5, y: 1.0),
     endPoint: CGPoint = CGPoint(x: 0.5, y: 0.0),
     locations: Array<Double> = [0, 1],
     height: Double = 80.0)

```

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    // change timers gradient
    InAppStory.shared.timerGradient = <TimersGradient>

    return true
}
```

### Changing icons in the bottom panel

The bottom panel icons can be replaced with any images. Each button has 2 states, normal and highlighted. It is desirable to use the image size 24x24 pt.

To display the bottom panel with buttons, after initializing the library, specify the panel functionality and make sure that this functionality is available and enabled in the console. Next, indicate all the options for the required pictures.

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    InAppStory.shared.likePanel = <Bool> // enable button bar with likes
    InAppStory.shared.favoritePanel = <Bool> // enable button bar with favorites
    InAppStory.shared.sharePanel = <Bool> // enable button bar with sharing

    InAppStory.shared.likeImage = <UIImage>
    InAppStory.shared.likeSelectedImage = <UIImage>
    InAppStory.shared.dislikeImage = <UIImage>
    InAppStory.shared.dislikeSelectedImage = <UIImage>
    InAppStory.shared.favoriteImage = <UIImage>
    InAppStory.shared.favoriteSelectedImag = <UIImage>
    InAppStory.shared.shareImage = <UIImage>
    InAppStory.shared.shareSelectedImage = <UIImage>

    InAppStory.shared.closeReaderImage = <UIImage> // reader close button icon (24pt)

    // change sound icons
    InAppStory.shared.soundImage = <UIImage> // Sound on
    InAppStory.shared.soundSelectedImage = <UIImage> // Sound off

    return true
}
```

Starting with SDK version 1.25.9, you can use custom `UIView` implementing protocol `IconViewProtocol` to customize icons

#### IconViewProtocol

```swift
public typealias IconViewState = (selected: Bool, enabled: Bool)

public protocol IconViewProtocol: UIView {
    func update(state: IconViewState)
    
    var isHighlighted: Bool { get set }
}
```

To install custom icons, you need to override the closures in `InAppStory` and return `UIView` implementing protocol `IconViewProtocol` in it.

#### Closure list

```swift
public var likeIconView: (() -> IconViewProtocol)
public var dislikeIconView: (() -> IconViewProtocol)
public var favoriteIconView: (() -> IconViewProtocol)
public var shareIconView: (() -> IconViewProtocol)
public var soundIconView: (() -> IconViewProtocol)
public var closeReaderIconView: (() -> IconViewProtocol)
public var refreshIconView: (() -> IconViewProtocol)
```

When creating a custom UIView, it is necessary to specify two icons at once, for each state of the button selected and unselected.

#### Example of CustomIconView.swift implementation

```swift
class CustomIconView: UIView {
    var isHighlighted: Bool = false
    
    var isSelected: Bool = false
    var isEnabled: Bool = true
    
    fileprivate var unselectedImage: UIImage!
    fileprivate var selectedImage: UIImage?
    fileprivate var imageView: UIImageView!
    
    init(unselectedImage: UIImage, selectedImage: UIImage?) {
        self.unselectedImage = unselectedImage
        self.selectedImage = selectedImage
        
        super.init(frame: .zero)
        
        createUI()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

fileprivate extension CustomIconView {
    func createUI() {
        let image: UIImage
        
        if let selectedImage {
            image = isSelected ? selectedImage : unselectedImage
        } else {
            image = unselectedImage
        }
        
        imageView = UIImageView()
        imageView.contentMode = .center
        imageView.image = image.imageFlippedForRightToLeftLayoutDirection()
        imageView.alpha = isEnabled ? 1 : 0.5
        imageView.translatesAutoresizingMaskIntoConstraints = false
        
        addSubview(imageView)
                
        imageView.topAnchor.constraint(equalTo: self.topAnchor).isActive = true
        imageView.bottomAnchor.constraint(equalTo: self.bottomAnchor).isActive = true
        imageView.leadingAnchor.constraint(equalTo: self.leadingAnchor).isActive = true
        imageView.trailingAnchor.constraint(equalTo: self.trailingAnchor).isActive = true
    }
}

extension CustomIconView: IconViewProtocol {
    func update(state: IconViewState) {
        let image: UIImage
        
        if let selectedImage {
            image = state.selected ? selectedImage : unselectedImage
        } else {
            image = unselectedImage
        }
        
        imageView.image = image.imageFlippedForRightToLeftLayoutDirection()
        imageView.alpha = state.enabled ? 1 : 0.5
    }
}
```

:::tip[Note]
If RTL language group support is required, remember to call `.imageFlippedForRightToLeftLayoutDirection()` on the image.
:::

After implementing `CustomIconView`, you can specify them to be overridden in closures when setting up `InAppStory`:

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    InAppStory.shared.likePanel = <Bool> // enable button bar with likes
    InAppStory.shared.favoritePanel = <Bool> // enable button bar with favorites
    InAppStory.shared.sharePanel = <Bool> // enable button bar with sharing

	 // change like icons
    InAppStory.shared.likeIconView = {
        IASIconView(unselectedImage: UIImage(named: "likeImage")!,
                    selectedImage: UIImage(named: "likeSelectedImage")!)
    }
    // change dislike icons
    InAppStory.shared.dislikeIconView = {
        IASIconView(unselectedImage: UIImage(named: "dislikeImage")!,
                    selectedImage: UIImage(named: "dislikeSelectedImage")!)
    }
    // change favorite icons
    InAppStory.shared.favoriteIconView = {
        IASIconView(unselectedImage: UIImage(named: "favoriteImage")!,
                    selectedImage: UIImage(named: "favoriteSelectedImag")!)
    }
    // change share icons
    InAppStory.shared.shareIconView = {
        IASIconView(unselectedImage: UIImage(named: "shareImage")!,
                    selectedImage: UIImage(named: "shareSelectedImage")!)
    }
    // change sound icons
    InAppStory.shared.soundIconView = {
        IASIconView(unselectedImage: UIImage(named: "soundImage")!,
                    selectedImage: UIImage(named: "soundSelectedImage")!)
    }
    
    // reader close button icon (24pt)
    InAppStory.shared.closeReaderIconView = {
        IASIconView(unselectedImage: UIImage(named: "closeReaderImage")!,
                    selectedImage: nil)
    }
    
    // change refresh button icon
    InAppStory.shared.refreshIconView = {
        IASIconView(unselectedImage: UIImage(named: "refreshImage")!,
                    selectedImage: nil)
    }

    return true
}
```

### Changing the preloader on unloaded cards

During the first download and when swiping, a preloader may be displayed until the story content is loaded.

The animation of the preloader can be changed, for this you need to create a `UIView` and implement the `PlaceholderProtocol` protocol in it. After initializing the library, point it to the library.

#### CustomPlaceholderView.swift

```swift
class CustomPlaceholderView: UIView, PlaceholderProtocol
{
    var isAnimate: Bool {
        get {
            return <Bool> // animation state value
        }
    }

    func start() {
        // start animation
    }

    func stop() {
        // stop animation
    }
}
```

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    // seting custom placeholder view to InAppStory
    InAppStory.shared.placeholderView = CustomPlaceholderView(frame: CGRect(x: 0.0, y: 0.0, width: 100.0, height: 100.0))

    return true
}
```

### Presentation style

The reader can be shown in two types of animation:

- `crossDissolve` - alpha animation from 0 to 1;
- `modal` - showing the reader from the bottom of the screen;
- `zoom` - animation of zooming out from the story cell;

:::tip[Note]
Zoom animation works only for showing the reader from the list, for single stories and onboardings `.modal` animation is applied by default.
:::

Setting the type of animation is carried out after initializing the library in the application.

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    // setting reader animation style
    InAppStory.shared.presentationStyle = <PresentationStyle>

    return true
}
```

### Swipe animation

Scrolling through stories in the reader can be represented by several animations:

- `flat` - simple sequential tiling
- `cover` - overlapping the previous story with the next one with the effect of parallax
- `cube` - each story is on the side of the cube (like instagram)

Setting the type of animation is carried out after initializing the library in the application.

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    // setting swipe animation style
    InAppStory.shared.scrollStyle = <ScrollStyle>

    return true
}
```

### Timers gradient

If you need to remove the gradient at the top of the story (below the timers), you can use the `timerGradientEnable` parameter. By default, the gradient is on.

#### AppDelegate.swift

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool
{
    // library initialization
    InAppStory.shared.initWith(serviceKey: <String>)

    // settings can also be specified at any time before creating a StoryView or calling individual stories
    InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>>)

    // enable gradient shadow under timers
    InAppStory.shared.timerGradientEnable = <Bool>

    return true
}
```
