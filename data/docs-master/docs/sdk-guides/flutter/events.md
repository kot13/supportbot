# Events

## Stories events

To receive events from Story Reader you can implement `IASCallbacks` mixin and setup your listener:

```dart
class FeedWidget extends StatefulWidget {
  const FeedWidget({super.key});

  @override
  State<FeedWidget> createState() => _FeedWidgetState();
}

class _FeedWidgetState extends State<FeedWidget> with IASCallbacks {
  @override
  Widget build(BuildContext context) {
    return FeedStoriesWidget(
      feed: '<your feed id>',
    );
  }

  @override
  void onShowStory(StoryDataDto? storyData) {}

  @override
  void onCloseStory(SlideDataDto? slideData) {}

// other callbacks
}
```

## Event list

- `onShowStory` - Called when the story reader is shown.

```dart
void onShowStory(StoryDataDto? storyData) {}
```

- `onCloseStory` - Called when the story reader is closed.

```dart
void onCloseStory(SlideDataDto? slideData) {}
```

- `onFavoriteTap` - Called when the favorite button is tapped.

```dart
void onFavoriteTap(SlideDataDto? slideData, bool isFavorite) {}
```

- `onShareStory` - Called when the share button is tapped.

```dart
@override
void onShareStory(SlideDataDto? slideData) {}
```

- `onLikeStoryTap` - Called when the like button is tapped.

```dart

@override
void onLikeStoryTap(SlideDataDto? slideData, bool isLike) {}
```

- `onDislikeStoryTap` - Called when the dislike button is tapped.

```dart
@override
void onDislikeStoryTap(SlideDataDto? slideData, bool isDislike) {}
```

- `onShowSlide` - Called when the slide is shown.

```dart
  @override
void onShowSlide(SlideDataDto? slideData) {}
```

- `onStoryWidgetEvent`- Called when a widget event occurs in a story.

```dart
@override
void onStoryWidgetEvent(SlideDataDto? slideData, Map<String?, Object?>? widgetData) {}
```

## Objects and Enums

### Enums used in methods

```dart
enum StoryTypeDto {
  COMMON,
  UGC;
}

enum SourceTypeDto {
  SINGLE,
  ONBOARDING,
  LIST,
  FAVORITE,
  STACK;
}
```

### Method's objects

```dart
class SlideDataDto {
  StoryDataDto? story;
  int index;
  String? payload;
}

class StoryDataDto {
  int id;
  String? title;
  String? tags;
  String? feed;
  SourceTypeDto? sourceType;
  int slidesCount;
  StoryTypeDto? storyType;
}
```