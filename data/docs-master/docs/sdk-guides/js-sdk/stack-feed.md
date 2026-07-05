# Stack Feed

This feed looks like a feed cell with the dotted outline.

## Example

```js
const inAppStoryManager = new window.IAS.InAppStoryManager(inAppStoryManagerConfig);
const stackedStoryList = new inAppStoryManager.StackedStoryList(appearanceManager, { feed: "default" });

const renderStackedStoryCard = () => {
    const storyCard = document.getElementById("story-card");
    const imageContainer = storyCard.querySelector(".story-card__image");
    const image = storyCard.querySelector(".story-card__image img");
    const title = storyCard.querySelector(".story-card__title");
    const segmentedProgress = storyCard.querySelector(".story-card-step-progress");
    let topStackedStory = null;

    stackedStoryList.on("update", stackedStory => {
        topStackedStory = stackedStory;
        title.innerText = stackedStory.title;
        renderCover(stackedStory.cover);
        renderProgress();
    });

    const renderCover = ({ imageSrc, backgroundColor }) => {
        imageContainer.innerHTML = "";
        imageContainer.style.backgroundColor = backgroundColor;
        if (!imageSrc) return;
        const image = document.createElement("img");
        image.src = imageSrc;
        imageContainer.appendChild(image);
    };

    const renderProgress = () => {
        segmentedProgress.innerHTML = "";
        for(const stackedStory of stackedStoryList.stories) {
            const progressSegment = document.createElement("div")
            progressSegment.classList.add("story-card-step-progress__item")
            if(stackedStory.isOpened) progressSegment.classList.add("story-card-step-progress__item_opened")
            segmentedProgress.appendChild(progressSegment)
        }
    }

    storyCard.addEventListener("click", () => {
        stackedStoryList.showStory(topStackedStory)
    })
}

renderStackedStoryCard();
```

```html
<div id="story-card" class="story-card">
    <div class="story-card__inner">
        <div class="story-card__mask"></div>
        <div class="story-card__image"></div>
        <div class="story-card__title"></div>
    </div>
    <div class="story-card-step-progress"></div>
</div>
```

```css
.story-card {
    margin-top: 15px;
    position: relative;
    cursor: pointer;
    border-radius: 26px;
    width: 178px;
    height: 178px;
    padding: 4px;
}

.story-card_border {
}

.story-card .story-card__inner {
    position: relative;
    width: 100%;
    height: 100%;
}

.story-card .story-card__inner .story-card__image {
    width: 100%;
    height: 100%;
    border-radius: 21px;
}

.story-card .story-card__inner .story-card__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 21px;
    overflow: hidden;
}

.story-card .story-card__inner .story-card__title {
    color: white;
    position: absolute;
    bottom: 16px;
    left: 16px;
    z-index: 2;
    display: -webkit-box;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.story-card .story-card__inner .story-card__mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background-color: rgba(34, 34, 34, 0.3);
    opacity: 1;
    border-radius: 21px;
}

.story-card .story-card-step-progress {
    display: flex;
    margin-top: 6px;
}

.story-card .story-card-step-progress .story-card-step-progress__item {
    display: flex;
    flex: 1;
    height: 2px;
    background-color: #0c62f3;
}

.story-card .story-card-step-progress .story-card-step-progress__item:not(:last-child) {
    margin-right: 4px;
}

.story-card .story-card-step-progress .story-card-step-progress__item_opened {
    background-color: rgba(34, 34, 34, 0.3);
}
```

## Public methods

```ts
interface StackedStoryList {
    (
        appearanceManager: AppearanceManager,
        options: { feed?: string | number }
    ): StackedStoryList;

     /**
     * Reload stacked story list
     */
    reload(): void

     /**
     * Destroy stacked story list
     */
    destroy(): void;

     /**
     * Open story reader with passed story 
     */
    showStory(story: StackFeedStory): void
}

interface StackFeedStory {
    id: number
    title: string
    titleColor: string
    hasAudio: boolean
    hasSwipeUp: boolean
    isOpened: boolean
    cover: StoryCover
    deeplink?: string
    gameInstanceId: string | undefined;
    hideInReader = false
}

interface StoryCover {
    feedCoverSrc?: string
    imageSrc?: string
    videoSrc?: string
    backgroundColor?: string
}
```

## Adding a Custom Loader

To add a loader to the list of stories, you can use the events provided by the `StackedStoryList` object. These events allow you to manage the loading states, such as when content starts loading and when it finishes.

### Example:

- **`startLoad`** — triggers when new stories start loading. You can use this event to display the loader.
- **`endLoad`** — triggers when the loading is complete. Use this event to hide the loader.

### Example code:

```js
const inAppStoryManager = new window.IAS.InAppStoryManager(storyManagerConfig);
const stackedStoryList = new inAppStoryManager.StackedStoryList(appearanceManager, { feed: "default" });

// Show the loader when loading starts
stackedStoryList.on("startLoad", () => {
  // Your code to show the loader
});

// Hide the loader when loading finishes
stackedStoryList.on("endLoad", () => {
  // Your code to hide the loader
});
```

## Events

### Event: 'update'

- `update` `<StackedStory>` - fired upon stacked story list updated.
  
### Event: 'startLoad'
- `startLoad` `<void>` - fired upon stacked story list start loading.
  
### Event: 'endLoad'
- `endLoad` `<void>` - fired upon stacked story list end loading.
