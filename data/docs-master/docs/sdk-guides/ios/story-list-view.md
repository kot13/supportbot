# StoryListView (SwiftUI)

The main class for working with lists of stories with SwiftUI.

## Initialization

:::tip
If the _settings_ parameter was not specified for `InAppStory`, before initializing `StoryView`, it should be set:
```swift
InAppStory.shared.settings = Settings(userID: <String>, tags: <Array<String>?>)
```

:::

If the parameter `isFavorite: <Bool?>` is equal true, the list will be displayed favorite stories.

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
                /// when initializing StoryListView, you should specify its size,
                /// otherwise it will stretch to the whole screen
                .frame(height: 120)
                .frame(maxWidth: .infinity)
            Spacer()
        }
    }
}
```

:::warning
When initializing `StoryListView` it is necessary to specify its dimensions, otherwise it will stretch on the whole screen, in this case displaying and scrolling may not work as it is expected, because inside `StoryListView` there is `UICollectionView` and if it will be set the size of cells, it will try to cover them in the free space taking into account the indents.
:::

## Parameters

- `feed: <String?>` - optional id of stories feed. By default, this parameter is equal to an empty String and with this value it receives a default story feed from the server. If you don't plan to switch to multifeed at this time, don't specify a `feed: <String?>` when initializing the **StoryListView**. In this case, everything will work as before.
- `isFavorite: <Bool>` - if this parameter is equal true, the list will be displayed favorite stories. Default is _false_;
- `panelSettings ` - displaying the bottom bar (overwrite `InAppStory.shared.panelSettings`) \<_PanelSettings_>; ([Details](#panelsettings))
- `isEditorEnabled ` - displaying editor cell in sories lists; ([InAppStoryUGC](../../ugc-guides/ios-ugc.md))
- `refresh: <Binding<Bool>>` - binding `Bool` value that start refresh logic in list;

## Methods

- `onUpdate(_ storiesDidUpdated: (_ isContent: <Bool>, _ storyType: <StoriesType>) -> Void) -> StoryListView` - called after the contents are updated, more at [StoriesType](reference.md#storiestype);
- `onAction(_ onAction: ((_ target: <String>, _ type: <ActionType>, _ storyType: <StoriesType>) -> Void)) -> StoryListView` - called by action in Reader. First parameter is string URL from Story, second parameter action type, more at [ActionType](reference.md#actiontype), [StoriesType](reference.md#storiestype);
- `willAppear(_ willAppear: ((_ storyType: StoriesType) -> Void)) -> StoryListView` - called before reader's screen shown, more at [StoriesType](reference.md#storiestype);
- `onDismiss(_ onDismiss: ((_ storyType: StoriesType) -> Void)) -> StoryListView` - called after reader screen is closed, more at [StoriesType](reference.md#storiestype);
- `favoriteDidSelect(_ favoriteSelected: () -> Void) -> StoryListView` - called after favorite cell did selected;
- `editorDidSelect(_ editorSelected: () -> Void)  -> StoryListView` - called after editor cell did selected;
- `getGoodsObject(_ getGoodsObject: ((_ skus: Array<String>, _ complete: GoodsComplete) -> Void)) -> StoryListView` - called when library need goods items for widget. First parameter is array of goods' SKUs, the second parameter is a closure to which you need to pass objects of goods that implement the protocol `GoodsObjectProtocol`, more at [GoodsObjectProtocol](reference.md#goodsobjectprotocol);
- `goodItemSelected(_ goodItemSelected: (_ item: GoodsObjectProtocol, _ storyType: StoriesType) -> Void) -> StoryListView ` - called when goods item select in story reader, more at [GoodsObjectProtocol](reference.md#goodsobjectprotocol), [StoriesType](reference.md#storiestype);
- `refresh(_ refresh: @escaping ((_ refresh: (_ feed: String?, _ tags: Array<String>?) -> Void) -> Void)) -> StoryListView` - passes a closure that can be called to update the list of stories, more at [Refresh Sample](refresh.md#refresh-with-feed-and-tags-update);
- `onVisibleAreaUpdated(_ onVisibleAreaUpdated: (_ items: Array<VisibleStoryItem>) -> Void) -> StoryListView` - return the list of objects with Information about the shown stories, more at [Visible Update Sample](visible-update.md) & [VisibleStoryItem](reference.md#visiblestoryitem);;
- `collectVisibleAreaData(_ collect: ((_ collect: () -> Void) -> Void)) -> StoryListView` - collects information about the stories shown, more at [Visible Update Sample](visible-update.md);
- `updateVisibleArea(_ update: ((_ update: () -> Void) -> Void)) -> StoryListView` - collects information about the stories shown and causes a closure `onVisibleAreaUpdated`, more at [Visible Update Sample](visible-update.md);
- `itemsSize(_ size: CGSize) -> StoryListView` - set cell size in list;
- `edgeInserts(_ inserts: UIEdgeInsets) -> StoryListView` - set padding from the edges of the list for cells;
- `lineSpacing(_ spacing: CGFloat) -> StoryListView` - set the vertical padding between cells in a list;
- `interitemSpacing(_ spacing: CGFloat) -> StoryListView` - set horizontal padding between cells in a list;
  direction - list scrolling direction. The default value for the list is horizontal(rows: 1), for favorites, the default value vertical(colums: 3), more at [ListDirection](reference.md#listdirection);
- `setStoryCell(customCell: StoryCellProtocol) -> StoryListView` - set custom cell for list that realize _StoryCellProtocol_, more at [StoryCellProtocol](reference.md#storycellprotocol);
- `setFavoriteCell(customCell: FavoriteCellProtocol) -> StoryListView` - set custom favorite cell taht realize _FavoriteCellProtocol_, more at [FavoriteCellProtocol](reference.md#favoritecellprotocol);
- `setEditorCell(customCell: EditorCellProtocol) -> StoryListView` - set custom editor cell, should implement the protocol _EditorCellProtocol_, more at [EditorCellProtocol](reference.md#editorcellprotocol);

## PanelSettings

#### StoryListView

To configure the bottom panel with the display of favorites, likes and sharings buttons, it is necessary - when initializing _StoryListView_, specify the `panelSettings` parameter.

:::warning[Attention!]
To display buttons on the bottom panel, you must also enable this functionality in the console in the project settings.

```swift
struct SwiftUIView: View {
    var body: some View {
        VStack {
            // setting the panelSettings parameter with all buttons displayed
            StoryListView(panelSettings: PanelSettings(like: true, favorites: true, share: true))
            ...
        }
    }
}
```

:::
