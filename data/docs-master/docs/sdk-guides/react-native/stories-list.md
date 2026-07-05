# Stories List

## Usage

To use the library, create the `StoryService.ts` file, configure `storyManagerConfig` with your API key and adjust
`appearanceManager` styles:

```ts
import {
  AppearanceManager,
  StoriesListCardTitlePosition,
  StoriesListCardViewVariant,
  StoryManager,
  StoryReaderCloseButtonPosition,
  StoryReaderSwipeStyle,
  StoriesListCardTitleTextAlign,
  type StoryManagerConfig,
} from '@inappstory/react-native-sdk';

import { Linking } from 'react-native';
const storyManagerConfig: StoryManagerConfig = {
  apiKey: 'test-key',
  userId: '1',
  tags: [],
  placeholders: {
    username: 'Guest',
  },
  lang: 'en-US',
  defaultMuted: true,
};

//configure StoryManager
const createStoryManager = () => {
  const storyManager = new StoryManager(storyManagerConfig);
  //subscribe to events
  storyManager.on('clickOnStory', (payload: any) =>
    console.log('clickOnStory', { payload })
  );
  storyManager.on('showStory', (payload: any) =>
    console.log('showStory', { payload })
  );
  storyManager.on('closeStory', (payload: any) =>
    console.log('closeStory', { payload })
  );
  storyManager.on('showSlide', (payload: any) =>
    console.log('showSlide', { payload })
  );
  storyManager.on('likeStory', (payload: any) =>
    console.log('likeStory', { payload })
  );
  storyManager.on('dislikeStory', (payload: any) =>
    console.log('dislikeStory', { payload })
  );
  storyManager.on('favoriteStory', (payload: any) =>
    console.log('favoriteStory', { payload })
  );
  storyManager.on('shareStory', (payload: any) =>
    console.log('shareStory', { payload })
  );
  storyManager.on('shareStoryWithPath', (payload: any) =>
    console.log('shareStoryWithPath', { payload })
  );

  // btn handler
  storyManager.storyLinkClickHandler = (payload: any) => {
    console.log({ payload });
    if (payload.data.url != null) {
      Linking.openURL(payload.data.url);
    }
  };

  return storyManager;
};

// configure appearance
const createAppearanceManager = () => {
  return new AppearanceManager()
    .setCommonOptions({
      hasLike: true,
      hasLikeButton: true,
      hasDislikeButton: false,
      hasFavorite: true,
      hasShare: true,
    })
    .setStoriesListOptions({
      card: {
        title: {
          font: 'bold normal 14px/16px "InternalPrimaryFont"',
          padding: '0px 0 0 0',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: Platform.OS == 'ios' ? 'Bradley Hand' : 'Comic Sans',
          lineHeight: 13,
          lineClamp: 3,
          textAlign: StoriesListCardTitleTextAlign.LEFT,
          position: StoriesListCardTitlePosition.CARD_INSIDE_BOTTOM,
        },
        gap: 3,
        height: 150,
        variant: StoriesListCardViewVariant.RECTANGLE,
        border: {
          radius: 1,
          color: 'black',
          width: 2,
          gap: 1,
        },
        boxShadow: null,
        opacity: 1,
        mask: {
          color: 'rgba(34, 34, 34, 0.3)',
        },
        opened: {
          border: {
            radius: 0,
            color: 'red',
            width: 0,
            gap: 0,
          },
          boxShadow: null,
          opacity: 1,
          mask: {
            color: 'rgba(34, 34, 34, 0.1)',
          },
        },
      },
      favoriteCard: {
        title: {
          content: 'Saved',
        },
      },
      layout: {
        height: 0,
        backgroundColor: 'transparent',
      },
      sidePadding: 5,
      topPadding: 5,
      bottomPadding: 2,
      navigation: {
        showControls: false,
        controlsSize: 48,
        controlsBackgroundColor: 'white',
        controlsColor: 'black',
      },
    })
    .setStoryReaderOptions({
      closeButtonPosition: StoryReaderCloseButtonPosition.RIGHT,
      scrollStyle: StoryReaderSwipeStyle.FLAT,
      slideBorderRadius: 5,
    })
    .setStoryFavoriteReaderOptions({
      title: {
        content: 'Favorite',
        font: '1.6rem/1.4 InternalPrimaryFont',
        color: 'white',
      },
    });
};

export const storyManager = createStoryManager();

export const appearanceManager = createAppearanceManager();
```

# Display a feed

To display a feed use the `StoriesList` component. <br/>
`storiesListViewModel` allows to reload the story feed using `storiesListViewModel.current.reload()`.

```tsx
import { StoriesList } from '@inappstory/react-native-sdk';
import {
  type StoriesListViewModel,
} from '@inappstory/react-native-sdk';

const storiesListViewModel = React.useRef<StoriesListViewModel>();
const viewModelExporter = React.useCallback(
  (viewModel: StoriesListViewModel) =>
    (storiesListViewModel.current = viewModel),
  []
);

return <StoriesList
  storyManager={storyManager}
  appearanceManager={appearanceManager}
  feed={feedId}
  onLoadStart={onLoadStart}
  onLoadEnd={onLoadEnd}
  viewModelExporter={viewModelExporter}
/>;
```

## Vertical Stories list

To display items vertically, use `vertical=true`

```tsx
<StoriesList vertical={true} />
```
