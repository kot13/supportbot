# Reference

## InAppStory closures

- `InAppStoryDelegate`
- `StoryViewDelegateFlowLayout`
- `GoodsDelegateFlowLayout`.

 delegate methods have been carried over as closures of the `InAppStory` class:

```swift
// InAppStoryDelegate closures

// called after the contents are updated for stories type
public var storiesDidUpdated: ((_ isContent: Bool, _ storyType: StoriesType) -> Void)? = nil
// called by action in Reader
public var onActionWith: ((_ target: String, _ type: ActionType, _ storyType: StoriesType?) -> Void)? = nil

// called before the reader will show (optional)
public var storyReaderWillShow: ((_ storyType: StoriesType) -> Void)? = nil
// called after closing the story reader (optional)
public var storyReaderDidClose: ((_ storyType: StoriesType) -> Void)? = nil

//called when the favorite cell has been selected (optional)
public var favoriteCellDidSelect: (() -> Void)? = nil
// called after UGC editor cell is tapped in stories list
public var editorCellDidSelect: (() -> Void)? = nil

// get goods items from parent app with closure
public var getGoodsObject: ((_ skus: Array<String>, _ complete: @escaping GoodsComplete) -> Void)? = nil
// selected goods item in widget, with object sent in
public var goodItemSelected: ((_ item: GoodsObjectProtocol, _ storyType: StoriesType?) -> Void)? = nil

// StoryViewDelegateFlowLayout closures
// returns the cell size for the list
public var sizeForItem: (() -> CGSize)? = nil
// returns padding from the edges of the list for cells
public var insetForSection: (() -> UIEdgeInsets)? = nil
// the spacing between successive rows or columns of a section
public var minimumLineSpacingForSection: (() -> CGFloat)? = nil
// the spacing between successive items of a single row or column
public var minimumInteritemSpacingForSection: (() -> CGFloat)? = nil

// GoodsDelegateFlowLayout closures
// returns the cell size for the list
public var goodsSizeForItem: (() -> CGSize)? = nil
// returns padding from the edges of the list for cells
public var goodsInsetForSection: (() -> UIEdgeInsets)? = nil
// the spacing between successive rows or columns of a section
public var goodsMinimumLineSpacingForSection: (() -> CGFloat)? = nil
```

Due to the transfer of logic from delegates to closures, the `StoryListView` and `StoryListUGCView` list interfaces were updated. Closures were removed from the initialization methods. The closures were moved to variables that can be called from an instance of the class.

<details>
  <summary><b>Code example</b></summary>
  
### ContentView.swift - old

```swift
struct ContentView: View
{
    var body: some View {
        VStack(alignment: .leading) {
            StoryListView(feed: <String?>,
                          isFavorite: <Bool>,
                          panelSettings: <PanelSettings>?,
                          isEditorEnabled: <Bool>,
                          onUpdated: <((Bool) -> Void)?>,
                          onAction: <((String, ActionType) -> Void)?>,
                          onDismiss: <(() -> Void)?>,
                          favoritesSelect: <(() -> Void)?>,
                          getGoodsObjects: <((Array<String>, (Result<Array<GoodsObjectProtocol>, GoodsFailure>) -> Void) -> Void)?>,
                          selectGoodsItem: <((GoodsObjectProtocol) -> Void)?>,
                          refresh: <Binding<Bool>>)
            Spacer()
        }
    }
}
```

### ContentView.swift - new

```swift
struct ContentView: View
{
    var body: some View {
        VStack(alignment: .leading) {
            StoryListView(feed: <String?>,
                          isFavorite: <Bool>,
                          panelSettings: <PanelSettings>?,
                          isEditorEnabled: <Bool>,
                          refresh: <Binding<Bool>>)
                .onUpdate { isContent, storyType in
                    // called when the list is updated
                }
                .willAppear({ storyType in
                    // called before reader's screen
                })
                .onDismiss({ storyType in
                    // called after reader screen is closed
                })
                .onAction { target, type, storyType in
                    // called if an action has occurred in the story
                }
                .favoriteDidSelect {
                    // is called when the favorite cell has been clicked
                }
                .editorDidSelect {
                    // called when the editor cell was clicked
                }
                .getGoodsObject { skus, complete in
                    // called to get the list of goods
                }
                .goodItemSelected { item, storyType in
                    // called when an item in a widget is selected
                }
            Spacer()
        }
    }
}
```

</details>

## Protocols

### InAppStoryDelegate

:::warning
InAppStoryDelegate is **deprecated** in versions 1.22.0 and above. It is necessary to use [InAppStory closures](#inappstory-closures).
:::

- `storiesDidUpdated(isContent: <Bool>, from storyType: <StoriesType>, storyView: <StoryView>?)` - called after the contents are updated for stories type \<[StoriesType](#storiestype)>;
- `storyReader(actionWith target: <String>, for type: <ActionType>, from storyType: <StoriesType>, storyView: <StoryView>?)` - called after a link is received from stories with the interaction type _\<[ActionType](#actiontype)>_ and _\<[StoriesType](#storiestype)>_;
- `storyReaderWillShow(with storyType: <StoriesType>, storyView: <StoryView>?)` - called before the reader will show _(optional)_;
- `storyReaderDidClose(with storyType: <StoriesType>, storyView: <StoryView>?)` - called after closing the story reader _(optional)_;
- `favoriteCellDidSelect()` - called when the favorite cell has been selected _(optional)_;
- `getGoodsObject(with skus: <Array<String>>, complete: <GoodsComplete>)` - get goods items from parent app with closure, _\<[GoodsComplete](#goodscomplete)>_;
- `goodItemSelected(_ item: <Any>, with storyType: <StoriesType>, storyView: <StoryView>?)` - selected goods item in widget, with object sent in `getGoodsObject(...)`

### GoodsDelegateFlowLayout

:::warning
GoodsDelegateFlowLayout is **deprecated** in versions 1.22.0 and above. It is necessary to use [InAppStory closures](#inappstory-closures).
:::

Methods of delegate, like in `UICollectionViewDelegateFlowLayout`:

- `sizeForItemAt() -> <CGSize>` - returns the cell size for the list;
- `insetForSection() -> <UIEdgeInsets>` - returns padding from the edges of the list for cells;
- `minimumLineSpacingForSection() -> <CGFloat>` - the spacing between successive rows or columns of a section;

### StoryViewDelegateFlowLayout

:::warning
StoryViewDelegateFlowLayout is **deprecated** in versions 1.22.0 and above. It is necessary to use [InAppStory closures](#inappstory-closures).
:::

Methods of delegate, like in `UICollectionViewDelegateFlowLayout`:

- `sizeForItemAt() -> <CGSize>` - returns the cell size for the list;
- `insetForSection() -> <UIEdgeInsets>` - returns padding from the edges of the list for cells;
- `minimumLineSpacingForSection() -> <CGFloat>` - the spacing between successive rows or columns of a section;
- `minimumInteritemSpacingForSection() -> <CGFloat>` - the spacing between successive items of a single row or column;

### PlaceholderProtocol

- `isAnimate: <Bool> { get }` - returns the state of the animation
- `start` - start animation
- `stop` - stop animation

### DownloadPlaceholderProtocol

- `func setProgress(progress: Double)` - setting the progress value (0.0 - 1.0)

### StoryCellProtocol

- `reuseIdentifier: <String> { get }` - returns cell reuse identifier;
- `nib: <UINib?> { get }` - returns the nib of the cell's visual representation;
- `storyID: <String!> { get set }` - cell's story id;
- `setTitle(_ text: <String>)` - story title;
- `setImageURL(_ url: <URL>)` - image url for cover;
- `setVideoURL(_ url: <URL>)` - video url for animated cover;
- `setOpened(_ value: <Bool>)` - set new state if story is opened;
- `setHighlight(_ value: <Bool>)` - set new state if story cell if highlighted;
- `setBackgroundColor(_ color: <UIColor>)` - background color of cell;
- `setTitleColor(_ color: <UIColor>)` - title color of cell;
- `setSound(_ value: Bool)` - does the story have sound;
- `setUGCPayload(_ payload: Dictionary<String, Any>)` - payload transfer for UGC stories;

### GoodsObjectProtocol

- `sku: <String!> { get set }` - product sku, more at [GoodsObject](#goodsobject);

### GoodsCellProtocol

- `reuseIdentifier: <String> { get }` - returns cell reuse identifier;
- `nib: <UINib?> { get }` - returns the nib of the cell's visual representation;
- `setGoodObject(_ object: <Any>!)` - object that comes from `getGoodsObject(...)`;

### FavoriteCellProtocol

- `reuseIdentifier: <String> { get }` - returns cell reuse identifier;
- `nib: <UINib?> { get }` - returns the nib of the cell's visual representation;

- `favoritesCount: Int { get set }` - total count of stories in favorites;
- `setHighlight(_ value: <Bool>)` - set new state if story cell if highlighted;
- `setImages(_ urls: <Array<URL?>>)` - a list of addresses of the first four images stories in favorites;
- `setImagesColors(_ colors: <Array<UIColor?>>)` - a list of background colors of the first four stories in favorites;
- `setBackgroundColor(_ color: <UIColor>)` - main background color of a cell;

### EditorCellProtocol

- `reuseIdentifier: <String> { get }` - returns cell reuse identifier;
- `nib: <UINib?> { get }` - returns the nib of the cell's visual representation;

## Closure

### GoodsComplete

:::warning
InAppStoryDelegate is **deprecated** in versions 1.22.0 and above. It is necessary to use [InAppStory closures](#inappstory-closures).
:::

Closure for contine `getGoodsObject(...)` method in _InAppStoryDelegate_ - `(Result<Array<Any>, GoodsFailure>) -> Void`

## Enum

### ListDirection

Direction of scrolling stories list, individual for each list

- `horizontal(rows: Int)` - horizontal scrolling with the number of lines, the default is 1;
- `vertical(colums: Int)` - vertical scrolling with the number of columns, the default is 3;

### ScrollStyle

Story transition animation style in reader:

- `.flat` - usual, one after another, like UIScrollView;
- `.cover` - covered with next slide;
- `.depth` - covered with next slide with previos slide alpha;
- `.cube` - in the form of a 3D cube;

### PresentationStyle

Reader display animation style:

- `.crossDissolve` - showing reader from transparency;
- `.modal` - modal reader display;
- `.zoom` - display reader from list's cell;

### ClosePosition

Position of the close button on the card in the reader:

**Renamed from version 1.25.0**

- *`.left` - to the left of the timers (renamed at 1.25.0);*
- *`.right` - to the right of the timers (renamed at 1.25.0);*
- *`.bottomLeft` - on the left under the timers (renamed at 1.25.0);*
- *`.bottomRight` - on the right under the timers (renamed at 1.25.0);*

**Since version 1.25.0**

- `.leading` - leading by story card, at the timer level
- `.trailing` - trailing by story card, at the timer level
- `.leadingBottom` - leading by story card, under the timer level
- `.trailingBottom` - trailing by story card, under the timer level

### ActionType

The action by which the link was obtained:

- `.button` - push the button;
- `.swipe` - swipe up slide;
- `.game` - link from Game;
- `.deeplink` - deeplink from cell.

### StoriesType

The action by which the link was obtained:

- `.list(feed: <String>?)` - type for StoryView, `feed` - id stories list;
- `.single` - type for single story reader;
- `.onboarding(feed: <String>)` - type for onboarding story reader, `feed` - id stories list.

### Quality

Quality of cover images in cells

- `.medium`;
- `.high`.

### GoodsFailure

Failure that return in `Result` from `getGoodsObject(...)` closure

- `.refresh` - show refresh button in the _GoodsView_;
- `.close` - close _GoodsView_.

## Objects

### Settings

#### Parameters

- `userID` - unique user identifier `<String>`;
- `sign` - user id signature for security `<String>`;
- `tags` - list of tags for content filtering `<Array\<String>>`;
- `placeholders` - list of text placeholders for content personalization `Dictionary<String, String>`;
- `imagesPlaceholders` - list of image placeholders for content personalization `Dictionary<String, String>`;
- `lang` - sets the language used in widgets, notifications, game text elements `<String>`. The format must match the system format in order to correctly create a `Locale` object by identifier (*en-EN* | *ar-SA*);

:::warning
When setting a new `Settings` object in InAppStory, if the previous `userID`, `sign` and `lang` parameters are not equal to what they were before, a new session will be opened, which will result in updating feeds and closing all readers.
:::

### PanelSettings

#### Parameters

- `like` - displaying the bottom bar with likes (should be enabled in the console) `<Bool>`;
- `favorites` - displaying the bottom bar with favorites (should be enabled in the console) `<Bool>`;
- `share` - displaying the bottom panel with sharing (should be enabled in the console) `<Bool>`;

### TimersGradient

#### Parameters

- `colors` - array of gradient colors `<Array<UIColor>>`;
- `startPoint` - start point of gradient `<CGPoint>`;
- `endPoint` - end point of gradient `<CGPoint>`;
- `locations` - smooth gradient location `<Array<Double>`;
- `height` - the height of the gradient from the top edge of the story `<Double>`;

### WidgetStory

#### Parameters

- `id` - unique identifier of story `<String>`;
- `title` - story title `<String>`;
- `image` - link to cover image `<String>`;
- `color` - background color of the story in HEX format `<String>`;

### GoodsObject

Default product object that implements the protocol [GoodsObjectProtocol](#goodsobjectprotocol)

#### Parameters

- `sku: <String!>` - sku product;
- `title: <String?>` - product title;
- `subtitle: <String?>` - product description;
- `imageURL: <URL?>` - link to the product image;
- `price: <String?>` - current price of the product;
- `oldPrice: <String?>` - old price of the product;

### CustomGoodsView

To create your own goods widget, you need to inherit from CustomGoodsView.

#### Parameters

- `setSKUItems(_ items: Array<String>)` - set SKUs of goods from InAppStory reader;
- `setReaderFrame(_ frame: CGRect)` - set StoryReader frame;
- `final close()` - needs call from _superclass_, for close widget;
- `final goodsItemClick(with sku: <String>)` - send statistic in SDK;

### EditorCellSettings

To change the appearance of the UGC editor cell, use this object.

#### Parameters

- `backgroundColor` - background color of the cell `<UIColor>`
- `iconColor` - tint color of the icon in the cell `<UIColor>`
- `iconImage` - custom icon `<UIImage>`

### VisibleStoryItem

#### Parameters

- `storyId` - id of the shown story _\<Int>_
- `index` - index of the story in the list *\<Int>*
- `title` - title of the story _\<String?>_  
- `feed` - the feed in which the story is located _\<String>_  
- `tags` - list of tags of stories _\<Array\<String>>_  
- `slidesCount` - number of slides in the story *\<Int>*
- `visiblePercents` - area shown on the screen from the storis cell in percent *\<Double>*
