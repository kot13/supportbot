# FeedStoriesWidget

The `FeedStoriesWidget` is a widget that displays a feed of stories.

```dart
class FeedExample extends StatelessWidget {
  const FeedExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // other widgets
        FeedStoriesWidget(
          feed: '<your feed id>',
        ),
      ],
    );
  }
}
```

### Parameters

| Parameter        | Required | Description                                            |
|------------------|----------|--------------------------------------------------------|
| feed             | yes      | The identifier of the feed to fetch stories from.      |
| controller       | no       | Optional controller to manage the feed.                |
| height           | no       | Specifies the height of the widget. Defaults to 120.0. |
| decorator        | no       | Optional decorator for customizing the appearance.     |
| loaderBuilder    | no       | Optional builder for the loading widget.               |
| errorBuilder     | no       | Optional builder for the error widget.                 |
| storyBuilder     | no       | Optional builder for individual story widgets.         |
| favoritesBuilder | no       | Optional builder for the favorites widget.             |
| storiesLoaded    | no       | Called when stories are loaded in the widget.          |

## FeedStoryDecorator

The `FeedStoryDecorator` is a class that provides a way to customize the appearance of the stories in the feed. It
applies its parameters to the default story builder, or you can use it in your own builder.

```dart
class FeedExample extends StatelessWidget {
  const FeedExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // other widgets
        FeedStoriesWidget(
          feed: '<your feed id>',
          decorator: const FeedStoryDecorator(
            storyPadding: 12.0,
            feedPadding: EdgeInsets.only(top: 4.0),
            loaderAspectRatio: 1 / 1,
            borderRadius: BorderRadius.all(Radius.circular(10.0)),
            textFontSize: 14.0,
            textPadding: EdgeInsets.all(8.0),
            borderColor: Colors.deepPurple,
            borderWidth: 2.0,
            borderPadding: 4.0,
          ),
        ),
      ],
    );
  }
}
```

### Parameters

| Variable             | Type                 | Default                                                                                               | Description                                                            |
|----------------------|----------------------|-------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| borderRadius         | BorderRadiusGeometry | BorderRadius.all(Radius.circular(8)),                                                                 | Border radius for the story widget                                     |
| feedPadding          | EdgeInsetsGeometry   | EdgeInsets.all(0.0)                                                                                   | Padding for the list of stories                                        |
| textPadding          | EdgeInsetsGeometry   | EdgeInsets.all(4.0)                                                                                   | Padding for text in the list of stories                                |
| storyPadding         | double               | 8.0                                                                                                   | Padding between stories in the list                                    |
| textFontSize         | double               | 12.0                                                                                                  | Text font size                                                         |
| loaderAspectRatio    | double               | 1 / 1                                                                                                 | Loader aspect ratio, used in default loader                            |
| favouriteAspectRatio | double               | 1 / 1                                                                                                 | Favorites item aspect ratio in list, used in default favorites builder |
| loaderDecorator      | LoaderDecorator      | baseColor: Color.fromARGB(255, 224, 224, 224)<br/> highlightColor: Color.fromARGB(255, 158, 158, 158) | Used to customize loader                                               |
| foregroundDecoration | BoxDecoration        | LinearGradient                                                                                        | Used to customize placeholder                                          |
| showBorder           | bool                 | true                                                                                                  | Enables border around story, that indicates story has been opened      |
| borderWidth          | double               | 1.0                                                                                                   | Width of border                                                        |
| borderPadding        | double               | 2.0                                                                                                   | Padding between border and story content                               |
| borderColor          | Color                | Colors.black87                                                                                        | Color of border                                                        |
| textStyle            | TextStyle            | null                                                                                                  | Text style in the story list                                           |
| scrollPhysics        | ScrollPhysics        | null                                                                                                  | Scroll physics in story list                                           |
| animateScrollToItems | bool                 | false                                                                                                 | Animate scroll to last viewed stories in story list                    |
| scrollCurve          | Curve                | Curves.easeInOut                                                                                      | Curve for scroll animation                                             |
| scrollDuration       | Duration             | Duration(milliseconds: 300)                                                                           | Scroll animation duration                                              |

## Builders

The `FeedStoriesWidget` has four builders:

1. `storyBuilder`: A builder that creates a widget for each story in the feed;

```dart
class FeedExample extends StatelessWidget {
  const FeedExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        FeedStoriesWidget(
          feed: '<your feed id>',
          storyBuilder: (story, decorator) {
            // Additional customization for the story widget
            return CustomStoryBuilder(
              story,
              onStoryTap: (story) {
                // Custom action on story tap
                print('Story tapped: ${story.title}');
              },
            );
          },
        ),
      ],
    );
  }
}

class CustomStoryBuilder extends BaseStoryBuilder {
  const CustomStoryBuilder(super.story, {super.key, super.onStoryTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onTap(story),
      child: Stack(
        children: [
          Positioned.fill(
            // use the StoryContentWidget to display the story content
            child: StoryContentWidget(story: story),
          ),
          const Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black87,
                  ],
                ),
              ),
            ),
          ),
          Align(
            alignment: Alignment.bottomLeft,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                story.title,
                style: TextStyle(
                  color: story.titleColor,
                  fontSize: 14,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
```

2. `loaderBuilder`: A builder that creates a widget for the loading state of the feed. To implement a custom loader, see
   instructions [here](list-placeholders.md);

3. `errorBuilder`: A builder that creates a widget for the error state of the feed, by default it shows
   `SizedBox.shrink()` widget;

4. `favoritesBuilder`: A builder that creates a widget for the favorites stories in the feed;

## Callbacks

To receive event when stories are loaded you can use `storiesLoaded` callback:

```dart
class FeedExample extends StatelessWidget {
  const FeedExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        FeedStoriesWidget(
          feed: '<your feed id>',
          storiesLoaded: (size, feed) {
            print('Stories loaded: $size');
          },
        ),
      ],
    );
  }
}
```

More stories callbacks can be found in the [Events](events.md) section.

## FeedStoriesController

You can use `FeedStoriesController` to force reload the feed stories:

```dart
class FeedExample extends StatelessWidget {
  FeedExample({super.key});

  final feedStoriesController = FeedStoriesController();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        FeedStoriesWidget(
          feed: '<your feed id>',
          controller: feedStoriesController,
        ),
        ElevatedButton(
          onPressed: () async => await feedStoriesController.fetchFeedStories(),
          child: const Text('Reload'),
        ),
      ],
    );
  }
}
```

### Methods

* `fetchFeedStories()` - reloads the feed stories;
