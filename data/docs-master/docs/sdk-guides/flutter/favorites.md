# Favorites

SDK provides a way to show favorite stories in your application. Just call
`AppearanceManagerHostApi().setHasFavorites(true)` method after initializing SDK. It turns on the favorites in story
feed. There are two ways to show: in story feed and in own favorite feed.

## Favorites in story feed

By default, favourites are shown at the end of the story feed. To override this behavior, you can use
`favoritesBuilder`:

```dart
class _MyHomePageState extends State<MyHomePage> {
  final initialization = InappstoryPlugin().initWith(
      '<your api key>', '<user id>', false);

  final feedDecorator = const FeedStoryDecorator(
    favouriteAspectRatio: 7 / 10,
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme
            .of(context)
            .colorScheme
            .inversePrimary,
        title: Text(widget.title),
      ),
      body: Column(
        children: [
          FeedStoriesWidget(
            feed: feed,
            height: 200,
            controller: feedStoriesController,
            favoritesBuilder: (favorites) {
              return YourFavoritesImtplementation(
                favorites: favorites,
                feedDecorator: feedDecorator,
              );
            },
            decorator: feedDecorator,
          ),
        ],
      ),
    );
  }
}
```

## Show favorite feed

In some cases, you may want to show a separate feed with favorite stories. To do this, you can use the
`FavoriteStoriesFeedWidget`:

```dart
class FavoritesFeedExample extends StatelessWidget {
  const FavoritesFeedExample({super.key});

  @override
  Widget build(BuildContext context) {
    return FavoriteStoriesFeedWidget(
      feed: '<your feed id>',
    );
  }
}
```

### Parameters and Builders

`FavoriteStoriesFeedWidget` has same [parameters](feed-stories-widget.md#parameters) as `FeedStoriesWidget`:

| Parameter  | Required | Description                                            |
|------------|----------|--------------------------------------------------------|
| feed       | yes      | The identifier of the feed to fetch stories from.      |
| controller | no       | An optional controller to manage the feed.             |
| height     | no       | Specifies the height of the widget. Defaults to 120.0. |
| decorator  | no       | An optional decorator for customizing the appearance.  |

And it has the same [builders](feed-stories-widget.md#builders):

1. `storyBuilder`: A builder that creates a widget for each story in the feed;
2. `loaderBuilder`: A builder that creates a widget for the loading state of the feed. To implement a custom loader, see
   instructions [here](list-placeholders.md);
3. `errorBuilder`: A builder that creates a widget for the error state of the feed, by default it shows
   `SizedBox.shrink()` widget;