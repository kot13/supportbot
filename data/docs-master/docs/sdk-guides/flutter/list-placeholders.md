# List Placeholders

## Loader placeholder

If you want to customize the placeholder when loading the list of stories, you can specify the `loaderBuilder` parameter
in the `FeedStoriesWidget` widget or use built-in loader.

### Example

```dart
// Example with built-in loader
// In this example, the DefaultLoaderWidget uses FeedStoryDecorator fields to customize the loader
class FeedExample extends StatelessWidget {
  FeedExample({super.key});

  final feedDecorator = FeedStoryDecorator(
    borderRadius: BorderRadius.circular(12),
  );

  @override
  Widget build(BuildContext context) {
    return FeedStoriesWidget(
      feed: "<your_feed_id>",
      decorator: feedDecorator,
      loaderBuilder: (context) {
        return DefaultLoaderWidget(decorator: feedDecorator);
      },
    );
  }
}
 ```

## Error placeholder

In some cases, the list of stories may fail to load. To show user a custom error message, you can use the `errorBuilder`
parameter of `FeedStoriesWidget` widget.

### Example

```dart
class FeedExample extends StatelessWidget {
  FeedExample({super.key});

  final feedController = FeedStoriesController();

  @override
  Widget build(BuildContext context) {
    return FeedStoriesWidget(
      feed: "<your_feed_id>",
      controller: feedController,
      errorBuilder: (context, error) {
        return Column(
          children: [
            Text("Oops! Something went wrong: $error"),
            ElevatedButton(
              onPressed: () => feedController.fetchFeedStories(),
              child: const Text("Retry"),
            ),
          ],
        );
      },
    );
  }
}
```