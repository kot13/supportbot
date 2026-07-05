# Events

To subscribe to events, use `storyManager.on` or `storyManager.once`

```ts
storyManager.on(eventName, (payload) => {
  console.log(eventName, payload);
});
```

| Event Name        | Payload                                                   |
|-------------------|-----------------------------------------------------------|
| storiesLoaded     | `{}`                                                        |
| ugcStoriesLoaded  | `{}`                                                        |
| clickOnStory      | `{id: String, feed: String, index: Number}`                 |
| showStory         | `{id: String, feed: String, action: String}`                |
| closeStory        | `{id: String, feed: String, index: Number, action: String}` |
| showSlide         | `{id: String, index: Number}`                               |
| likeStory         | `{id: String, feed: String, value: Boolean}`                |
| dislikeStory      | `{id: String, feed: String, value: Boolean}`                |
| favoriteStory     | `{id: String, feed: String, value: Boolean}`                |
| clickOnShareStory | `{}`                                                        |
| storyWidgetEvent  | `{id: String, feed: String, name: String, data: String }`   |

## Feed Events

| Event                 | Payload                |
|-----------------------|------------------------|
| storyListUpdate       | `{stories: [StoryData]}` |
| storyUpdate           | StoryData              |
| favoritesUpdate       | `{}`                     |  
| favoriteCellDidSelect | `{}`                     |
| editorCellDidSelect   | `{}`                     |
| favoritesUpdate       | `{}`                     |  

## Reader events

| Event               | Payload                                |
|---------------------|----------------------------------------|
| storyReaderWillShow | `{type: String}`                         |
| storyReaderDidClose | `{type: String}`                         |
| storiesDidUpdated   | `{isContent: String, storyType: String}` |
| scrollUpdate        | `{index: String}`                        |  

## Failure events

| Event               | Payload                               |
|---------------------|---------------------------------------|
| sessionFailure      | `{message: String}`                     |
| storyFailure        | `{message: String}`                     |
| currentStoryFailure | `{message: String}`                     |
| networkFailure      | `{message: String}`                     |
| requestFailure      | `{message: String, statusCode: String}` |

## Game Events

| Event              | Payload                                                     |
|--------------------|-------------------------------------------------------------|
| startGame          | `{id: String, gameID: String}`                                |
| closeGame          | `{id: String, gameID: String}`                                |
| eventGame          | `{id: String, gameID: String, name: String, payload: Object}` |
| gameFailure        | `{id: String, gameID: String, message: String}`               |
| gameReaderWillShow | `{}`                                                          |
| gameReaderDidClose | `{}`                                                          |
| gameComplete       | `{data: Object, result: String, url: String}`                 |

## Goods events

| Event            | Payload       |
|------------------|---------------|
| goodItemSelected | `{sku: String}` |

## Share events

| Event        | Payload |
|--------------|---------|
| customShare  | `{}`      |
| onActionWith | `{}`      |
