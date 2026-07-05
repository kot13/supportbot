# Multi-feed

Each feed is an instance of a `StoriesList`. If you want to display multiple feeds (on one or more
screens) you just have to create one as many `StoriesList` instances.

### If Views are initialized via markup

```kotlin
val storiesList1 = findViewById<StoriesList>(R.id.stories_list_1)
storiesList1.setFeed("feed1");
storiesList1.loadStories()

val storiesList2 = findViewById<StoriesList>(R.id.stories_list_2)
storiesList2.setFeed("feed2");
storiesList2.loadStories()
```

### If Views are initialized via code

```kotlin
val storiesList1 = StoriesList(context)
storiesList1.setFeed("feed1")
addView(storiesList1)

val storiesList2 = StoriesList(context)
storiesList2.setFeed("feed2")
addView(storiesList2)

storiesList1.loadStories();
storiesList2.loadStories();
```
