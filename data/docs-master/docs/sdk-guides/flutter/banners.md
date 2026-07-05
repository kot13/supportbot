# Banners place

Starting with version 0.6.0, banner display functionality has been added to the SDK.

## Setting banners place

:::warning[Important]
Do not use `Padding` (or similar) widget with `BannerPlace` widget, this may cause visual bugs (e.g. banner cropping)
:::

Banners can be added with `BannerPlace` widget:

```dart
class BannersPage extends StatelessWidget {
  const BannersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: const Column(
        children: [
          BannerPlace(placeId: "placeId", height: 120),
        ],
      ),
    );
  }
}
```

## Load banners

Banners are loaded automatically, but if you need to load them for some event, set the `autoLoad` field to `false` and
then call method from `BannerPlaceManager` to load banners:

```dart
class BannersPage extends StatelessWidget {
  const BannersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: const Column(
        children: [
          BannerPlace(
            placeId: "placeId",
            height: 120,
            // setting auto load to false
            autoLoad: false,
          ),
          ElevatedButton(
              child: Text("Load"),
              ElevatedButton(
                onPressed: () async {
                  // Load banners
                  await BannerPlaceManager.instance.load(widget.bannerPlaceId);
                },
                child: Text('Load'),
              )
          ),
        ],
      ),
    );
  }
}
```

Additionally, you can preload banners:

```dart
Future<void> preloadBanners(String placeId) async {
  await BannerPlaceManager.instance.preload(placeId);
}
```

## Navigation

To control the display and movement of banners, you can use the methods of scrolling to the nearest ones or scrolling to
the specific index:

```dart
Future<void> scrollToNext() async {
  await BannerPlaceManager.instance.showNext();
}

Future<void> scrollToPrevious() async {
  await BannerPlaceManager.instance.showPrevious();
}

Future<void> scrollToIndex(int index) async {
  await BannerPlaceManager.instance.showByIndex(index);
}
```

Similarly, there are banner playback control methods that control the internal page turn timer:

* `pauseAutoscroll()` - stops the internal timer
* `resumeAutoscroll()` - resumes the logic of the internal timers

```dart
Future<void> pauseAutoscroll() async {
  await BannerPlaceManager.instance.pauseAutoscroll();
}

Future<void> resumeAutoscroll() async {
  await BannerPlaceManager.instance.pauseAutoscroll();
}
```

## Customization

### Banner Place appearance

`BannerPlace` widget can be customized with `bannerDecoration` (used when banner is loading) and `placeDecoration` (used
for customizing banner place):

```dart
class BannersPage extends StatelessWidget {
  const BannersPage({super.key});

  @override
  Widget build(BuildContext context) {
    final bannerPlaceholder = BannerDecoration(
      color: Colors.indigo, // color of background
      image: 'assets/icons/icon.png', // image asset
    );

    final bannerPlaceDecoration = BannerPlaceDecoration(
      bannerOffset: 16, // default = 0.0
      bannersGap: 20, // default = 8.0
      cornerRadius: 16, // default = 16.0
      loop: true, // default = true 
    );

    return Scaffold(
      appBar: AppBar(),
      body: Column(
        children: [
          BannerPlace(
            placeId: "placeId",
            height: 120,
            bannerDecoration: bannerPlaceholder,
            placeDecoration: bannerPlaceDecoration,
          ),
        ],
      ),
    );
  }
}
```

### Banner Place loader placeholder

You can display a loader placeholder by implementing `bannerPlaceLoaderBuilder` with `BannerPlacePlaceholder` or with
your own widget:

```dart
class BannersPage extends StatelessWidget {
  const BannersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Column(
        children: [
          BannerPlace(
            placeId: "placeId",
            height: 120,
            bannerPlaceLoaderBuilder: (context) {
              return const BannerPlacePlaceholder();
            },
          ),
        ],
      ),
    );
  }
}
```

## Events

`BannerPlace` has callback functions to listen for events from the widget:

```dart
class BannersPage extends StatefulWidget {
  const BannersPage({super.key});

  @override
  State<BannersPage> createState() => _BannersPageState();
}

class _BannersPageState extends State<BannersPage> {
  final _placeId = "placeId";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Column(
        children: [
          BannerPlace(
            placeId: _placeId,
            height: 120,
            onBannerScroll: (index) {
              // Do anything related
            },
            onActionWith: (bannerData, widgetEventName, widgetData) {
              // Do anything related
            },
            onBannerPlaceLoaded: (size, widgetHeight) {
              // Do anything related
            },
          ),
        ],
      ),
    );
  }
}

```

* `onBannerPlacePreloaded()` - triggered after banners are preloaded
* `onBannerPlacePreloadedError()` - triggered when banners preload failed
* `onActionWith(BannerData bannerData, String widgetEventName, Map<String, Object?>? widgetData)` - triggered after
  clicking on widgets, contains in banner
    * `BannerData` - containing a brief description of the selected banner;
    * `widgetEventName` - name of widget;
    * `widgetData` - activated widget
      data, [detailed data fields](https://docs.inappstory.ru/glossarium/statistics/stories-widget-events.md);
* `onBannerPlaceLoaded(int size, int widgetHeight)` - triggered after banners are loaded
* `onBannerScroll( int index)` - triggered when BannerPlace changing banner

:::tip
`onBannerPlaceLoaded(int size, int widgetHeight)` can be useful in cases where the banner size differs from the
BannerPlace size
:::

```dart
class BannersPage extends StatefulWidget {
  const BannersPage({super.key});

  @override
  State<BannersPage> createState() => _BannersPageState();
}

class _BannersPageState extends State<BannersPage> {
  double _bannerPlaceHeight = 120;
  final _placeId = "placeId";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: Column(
        children: [
          AnimatedSize(
            duration: Duration(milliseconds: 300),
            child: BannerPlace(
              placeId: _placeId,
              height: _bannerPlaceHeight,
              onBannerPlaceLoaded: (size, widgetHeight) {
                setState(() {
                  _bannerPlaceHeight = widgetHeight.toDouble();
                });
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

### Objects

```dart
class BannerData {
  String? id;
  String? bannerPlace;
  String? payload;
}
```