# Appearance

## Custom Story Cell

To render custom cells, add `renderCell` function to `StoriesList`

```tsx
<StoriesList
  ...props
  renderCell={(story) => {
    return <Text>{story.storyID}</Text>;
  }}
/>
```

## Story Reader Appearance

```ts
storyManager.setOverScrollToClose(value);
storyManager.setSwipeToClose(value);
storyManager.setTimerGradientEnable(value);
storyManager.setCloseButtonPosition(value);
storyManager.setScrollStyle(value);
storyManager.setPresentationStyle(value);
storyManager.setReaderBackgroundColor(value);
storyManager.setReaderCornerRadius(value);
```

| Appearance method        | value                                                                               |
|--------------------------|-------------------------------------------------------------------------------------|
| setOverScrollToClose     | `boolean`                                                                         |
| setSwipeToClose          | `boolean`                                                                          |
| setTimerGradientEnable   | `boolean`                                                                          |
| setCloseButtonPosition   | `StoryReaderCloseButtonPosition.LEFT`, `StoryReaderCloseButtonPosition.RIGHT`           |
| setScrollStyle           | `StoryReaderSwipeStyle.FLAT`, `StoryReaderSwipeStyle.COVER`, `StoryReaderSwipeStyle.CUBE` |
| setPresentationStyle     | "crossDissolve", "modal", "zoom"                                                    |
| setReaderBackgroundColor | `string`                                                                             |
| setReaderCornerRadius    | `number`                                                                              |

## Likes, Share, Favorites

```ts
storyManager.setHasLike(value);
storyManager.setHasShare(value);
storyManager.setHasFavorites(value);
```

## Custom Icons

1. Add images to your project assets

2. Configure required InAppStorySDK icons before showing stories:

```ts
storyManager.setLikeImage(image, activeImage);
storyManager.setDislikeImage(image, activeImage);
storyManager.setFavoriteImage(image, activeImage);
storyManager.setShareImage(image, activeImage);
storyManager.setSoundImage(image, activeImage);
storyManager.setCloseReaderImage(image);
storyManager.setRefreshImage(image);
storyManager.setRefreshGoodsImage(image);
storyManager.setCloseGoodsImage(image);
```

`image` and `activeImage` parameters are the names of the images in your assets folder.

```ts
storyManager.setLikeImage('like', 'likeSelected');
```