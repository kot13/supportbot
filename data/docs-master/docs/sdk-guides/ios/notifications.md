---
title: NotificationCenter (<1.23.0)
---

## Events

### Events for loading the list of stories

- `StoriesLoaded` - the list of stories has loaded, `StoryView` is ready to work (fires every time the list is loaded, and also on refresh). The `userInfo` contains the fields `count` - number of stories and `feed` - story feed identifier;
- `UGCStoriesLoaded` - the list of UGC stories has loaded, `StoryUGCView` is ready to work (fires every time the list is loaded, and also on refresh). The `userInfo` contains the fields `count` - the number of stories and `stories<Array<Dictionary<String, Any>>>` - an array of dictionaries containing a brief description of uploaded stories;
  - `stories` - each object in the list contains fields `id` - story id, `title` - title, `tags` - tags, `slidesCount` - number of slides, `ugcPayload<Dictionary<String, Any>>` - payload set at the creation of a story in the editor.

### Events triggered after interacting with stories

Standard fields for all notification calls from story for `userInfo` are: `id`, `title`,`tags`, `slidesCount`, `feed`. If a user-created UGC feed is loaded, the `ugcPayload<String(JSON)>` field comes in addition.

- `ClickOnStory` - click on story in the list with additional parameters:
  - place where the click came from (`list` or `favorite`);
- `ShowStory` - display of the story reader with additional parameters:
  - `source` - place where the showing came from (`direct`, `onboarding`, `list` or `favorite`);
  - `action` - how the story is shown:
    - `open` - opening a story (onboarding, single);
    - `auto` - auto transition to the next story after finishing the current (timer on a last slide has expired);
    - `swipe` - the transition via left/right swipe in the reader;
    - `tap` - transition to the next story after a tap on the last slide of current story;
    - `custom` - opening a story from another story via button on the slide.
- `CloseStory` - closing story with additional parameters:
  - `index` - index of the slide from which the closure occurred,
  - `action` - closing action (`swipe`, `click`, `auto` or `custom`),
  - `source` - place where the closing came from (`direct`, `onboarding`, `list` or `favorite`);
- `ClickOnButton` - click on the button in the story with additional parameters:
  - `index` - index of the slide from which the get link,
  - `link` - string link;
- `ShowSlide` - show slide with additional parameters:
  - `index` - index of the slide that now show;
  - `payload` - information from console parameters;
- `LikeStory` - story like with additional parameters:
  - `index` - index of the slide on which "like" was pressed,
  - `value` - value of "like" position (`true` - is like, `false` - isn't like);
  - `DislikeStory` - story dislike with additional parameters:
  - `index` - index of the slide on which "dislike" was pressed,
  - `value` - value of "dislike" position (`true` - is dislike, `false` - isn't dislike);
- `FavoriteStory` - adding story to favorites with additional parameters:
  - `index` - index of the slide on which "favorite" was pressed,
  - `value` - value of "favorite" position (`true` - is favorite, `false` - isn't favorite);
- `ClickOnShareStory` - pushing the share button with additional parameters:
  - `index` - index of the slide on which "share" was pressed;
- `StoryWidgetEvent` - action in widget with parameters:
  - `index` - the index of the slide where the widget is located,
  - `widgetName` - name of widget,
  - `data<Dictionary<String, Any>?>` - activated widget data, [detailed data fields](/glossarium/statistics/stories-widget-events.md);
  - `payload` - information from console parameters;

### Events coming from the game

- `StartGame` - opening the reader with a game with additional parameters:
  - `index` - index of the slide on which game starts;
- `CloseGame` - closing the reader with a game with additional parameters:
  - `index` - index of the slide on which game closes;

## Errors

In error notifications, `userInfo` also comes in the form of a dictionary `["errorMessage": <Error_message_string>]`

- `SessionFailure` - session error;  
  Reasons:
  - _session opening error;_
  - _authorization key was not specified correctly;_
  - _access is blocked;_
- `StoryFailure` - error in story;  
  Reasons:
  - _error loading stories list (onboarding/single/tape);_
  - _problems with decoding data from the server;_
- `CurrentStoryFailure` - error when loading full story information;  
  Reasons:
  - _getting data for a specific story;_
  - _setting/deleting likes, favorites, sharings;_
- `NetworkFailure` - network error;  
  Reasons:
  - _no internet connection;_
- `RequestFailure` - аn error occurred when requesting the server;
  - `statusCode` - the server returned a statuscode;
