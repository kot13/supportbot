# Feeds
The `StoryList` component allows you to display a feed of stories on your website. Use this module to integrate interactive stories into your user interface.

## Quick start
![Story Feed](./images//storyFeed.png)

```tsx
import { StoryList, StoryManagerConfig, IASContainer, storyManager } from "@inappstory/react-sdk"

export const App = () => {
    const storyManagerConfig: StoryManagerConfig = {
      apiKey: "{projectToken}",
    };

    <IASContainer config={storyManagerConfig}>
        <StoryList feedSlug="default" />
    </IASContainer>
}
```

## Customization

### StoriesList options

| Variable               | Type    | Description                                                                                      |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| card                   | object  | [Slider card item options](#preview-card)                                                        |
| layout                 | object  | [Slider layout options](#layout)                                                                 |
| sidePadding            | number  | Slider side padding, `px`. Default 20                                                            |
| topPadding             | number  | Slider top padding, `px`. Default 20                                                             |
| bottomPadding          | number  | Slider bottom padding, `px`. Default 20                                                          |
| bottomMargin           | number  | Slider bottom margin, `px`. Default 17                                                           |
| navigation             | object  | [Slider navigation options](#navigation-options)                                                 |
| direction              | string  | Slider direction. Can be `horizontal` or `vertical` (for vertical slider). Default `horizontal`. |
| autoScrollOnStoryClose | boolean | Auto scroll to invisible card when closing the story reader, `px`. Default true                  |


### Layout

`layout` property controls the slider.

| Variable        | Type               | Description                                                                                    |
| --------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| height          | number &#124; null | Slider total height, `px`. `0` - for auto height. Default `0`                                  |
| backgroundColor | string             | Default `transparent`                                                                          |
| sliderAlign     | string             | Horizontal align slider inside widget, variants: `start`, `center` and `end`. Default `start`. |

### Preview card

Using `card` property you can fully customize the look of your preview cards.

| Variable         | Type                 | Description                                                                                                                                                                                                                                                                                                                                                            |
| ---------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title            | object               | See below                                                                                                                                                                                                                                                                                                                                                              |
| title.display    | boolean              | Determines whether to show the title or not                                                                                                                                                                                                                                                                                                                            |
| title.position   | string               | Title position. <br/> Variants: `cardInsideTop` (inside card, at top), `cardInsideBottom` (inside card, at bottom), `cardOutsideTop` (above the card) and `cardOutsideBottom`(under the card). Default - `cardInsideBottom`<br/> Note when using the `cardOutsideTop` or `cardOutsideBottom` option you must manually specify a [slider layout height](#layout) value. |
| title.textAlign  | string               | Text in title horizontal align, variants: `start`, `center` and `end`. Default `start`.                                                                                                                                                                                                                                                                                |
| title.lineClamp  | number               | Numbers of text lines. Default `4`.                                                                                                                                                                                                                                                                                                                                    |
| title.padding    | number &#124; string | Number, `px` eq for all sides. <br/>String - valid css, for customizing each side. Default `10.6`                                                                                                                                                                                                                                                                      |
| title.font       | string               | CSS valid font [value](https://developer.mozilla.org/en-US/docs/Web/CSS/font). Override font. <br/>Default `normal 1rem InternalPrimaryFont` where InternalPrimaryFont - primary font, loaded in [project settings](https://console.domain-placeholder).                                                                                                               |
| gap              | number               | Space between cards, `px`. Default `10`                                                                                                                                                                                                                                                                                                                                |
| height           | number               | Card height, `px`. Default `178`                                                                                                                                                                                                                                                                                                                                       |
| variant          | string               | Card style, one of `circle`, `quad`, `rectangle`. Default `rectangle`                                                                                                                                                                                                                                                                                                  |
| border           | object               | See below                                                                                                                                                                                                                                                                                                                                                              |
| border.radius    | number               | Card border radius, `px`. Default `21`                                                                                                                                                                                                                                                                                                                                 |
| border.color     | string               | Card border color, valid css. Default `black`                                                                                                                                                                                                                                                                                                                          |
| border.width     | number               | Card border width, `px`. Default `2`                                                                                                                                                                                                                                                                                                                                   |
| border.gap       | number               | Space between card and border, `px`. Default `5`                                                                                                                                                                                                                                                                                                                       |
| border.gradient  | string               | [Card gradient border](#preview-card-gradient-border). Default  `null`                                                                                                                                                                                                                                                                                                 |
| boxShadow        | string &#124; null   | Card box-shadow, valid css value. Default `null`                                                                                                                                                                                                                                                                                                                       |
| dropShadow       | string &#124; null   | Card drop-shadow, valid css value. Example - `1px 2px 8px rgba(34, 34, 34, 0.3)`. Default `null`.                                                                                                                                                                                                                                                                      |
| opacity          | number               | Card opacity. Default `null`                                                                                                                                                                                                                                                                                                                                           |
| mask             | object &#124; null   | [Card mask](#preview-card-mask) - overlay between card image and title. Default `null`                                                                                                                                                                                                                                                                                                       |
| svgMask          | object &#124; null   | [Options for card overlay with svg](#preview-card-svg-mask)                                                                                                                                                                                                                                                                                                                               |
| opened           | object &#124; null   | Contain keys: `border`, `boxShadow`, `opacity`, `mask` <br/>Apply this values (if current value not null) on card in `opened` state. Default all values null                                                                                                                                                                                                           |
| coverQuality     | string               | Quality for stories list covers, variants `medium`, `high`. If not set - sdk uses `high` image quality. <br/> Default `high`.                                                                                                                                                                                                                                          |
| coverLazyLoading | boolean              | Determines whether to use lazy loading of stories list covers. <br/> Default `false`.                                                                                                                                                                                                                                                                                  |

#### Preview card gradient border

You have the ability to set a gradient border for your preview cards.

| Parameter                   | Type    | Default                | Description                                                                                                                                                                                                                                                      |
| --------------------------- | ------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| card.border.gradient        | string? | transparent            | Border background, CSS valid [gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient) or [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)                                                                                      |
| card.border.width           | number  | 2                      | Card gradient border width, `px`                                                                                                                                                                                                                                 |
| card.opened.border.gradient | string? | `card.border.gradient` | Border background, CSS valid [gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient) or [color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) in `opened` card state. The default value is the value set in `card.border.gradient` |
| card.opened.border.width    | number  | 2                      | Card gradient border width in `opened` card state, `px`                                                                                                                                                                                                          |

```tsx
<StoryList options={{
      card: {
      border: {
        gradient: "linear-gradient(37deg, red, blue)",
        width: 3
      },
      opened: {
        border: {
          gradient: "red",
          width: 3
        }
      }
    }
  }} />
```

#### Preview card mask

An overlay between card image and title.
Can be a solid color:

```tsx
<StoryList options={{
    card: {
      mask: {
        color: "rgba(0,0,0,.3)";
      }
    }
}} />
```

Or a linear gradient

```tsx
<StoryList options={{
  card: {
    mask: {
        linearGradient: [
          {
            direction: "to bottom",
            points: [
              "rgba(0, 0, 0, 0) 48.74%",
              "rgba(255, 0, 0, 0.6) 75.3%",
              "rgba(255, 0, 0, 0.6) 100%",
            ],
          },
        ];
      }
  }
}} />
```

#### Preview card SVG mask

You can use **SVG masks** to create custom card overlay effects, like in the example below:

![Card SVG Mask Example](/images/SvgMaskedSample.png)

---

**Options**

The `svgMask` property allows you to configure card and overlay masks.

| Property        | Type                    | Description                                                            |
| --------------- | ----------------------- | ---------------------------------------------------------------------- |
| **cardMask**    | string?                 | The base card SVG mask. Default: `null`.                               |
| **overlayMask** | `Array<OverlayMaskItem>` | An array of overlay masks applied on top of the card. Default: `null`. |

**OverlayMaskItem**

Each overlay mask item supports the following fields:

| Property       | Type    | Description                                                                                                               |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| **mask**       | string? | The SVG mask source. Default: `null`.                                                                                     |
| **background** | string? | A CSS color or any [CSS background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) option. Default: `null`. |

---

**Important Notes ⚠️**

- The **SVG mask must match the size and shape** of the card.  
- The **transparent part of the mask cuts out** the content beneath it.  
- Always include the following attributes in the `<svg>` tag:  
  ```html
  width="100%" height="auto" xmlns="http://www.w3.org/2000/svg"
  ```

---

**Example**

```tsx
<StoryList options={{
    card: {
      svgMask: {
        cardMask: `<svg width="100%" height="auto" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 140C108.66 140 140 108.66 140 70C140 56.1 135.95 43.14 128.96 32.25C126.22 35.17 122.32 37 118 37C109.72 37 103 30.28 103 22C103 17.68 104.83 13.78 107.76 11.04C96.86 4.05 83.9 0 70 0C31.34 0 0 31.34 0 70C0 108.66 31.34 140 70 140Z" fill="#B6B6B6"/>
    </svg>`,
        overlayMask: [
          {
            mask: `<svg width="100%" height="auto" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
    <path d="M128 22C128 27.52 123.52 32 118 32C112.48 32 108 27.52 108 22C108 16.48 112.48 12 118 12C123.52 12 128 16.48 128 22Z" fill="#B6B6B6"/>
    </svg>`,
            background: "#F2473D",
          },
        ],
      },
    }
}} />
```
---

| Card Mask                          | Overlay Mask                             |
| ---------------------------------- | ---------------------------------------- |
| ![Card Mask](/images/CardMask.png) | ![Overlay Mask](/images/OverlayMask.png) |

### Navigation options

By default, controls are displayed as round buttons with arrow icons on the edges of the slider.
Use the `navigation` property to control it.

| Variable                | Type    | Description                              |
| ----------------------- | ------- | ---------------------------------------- |
| showControls            | boolean | Enable slider controls. Default `false`  |
| controlsSize            | number  | Button size, `px`. Default `48`          |
| controlsBackgroundColor | string  | CSS valid color value. Default `#ffffff` |
| controlsColor           | string  | CSS valid color value. Default `#000000` |

## Custom loader

```tsx
enum LoadStatus {
    loading = "Loading",
    success = "LoadSuccess",
    fail = "LoadFail"
}

export const App = () => {
    const [loadStatus, setLoadStatus] = useState<LoadStatus>(LoadStatus.loading);

    const onLoadStart = () => {
        console.log("LOADING START");
        setLoadStatus(LoadStatus.loading);
    };

    const onLoadEnd = (loadStatus: StoryListLoadStatus) => {
        if (loadStatus.defaultListLength > 0 || loadStatus.favoriteListLength > 0) {
            setLoadStatus(LoadStatus.success);
        } else {
            setLoadStatus(LoadStatus.fail);
        }

        if (loadStatus.error != null) {
            console.error({
                name: loadStatus.error.name,
                networkStatus: loadStatus.error.networkStatus,
                networkMessage: loadStatus.error.networkMessage
            });
        } else {
            console.log("LOADING SUCCESS", loadStatus);
        }
    };

    return <IASContainer config={{}}>
            <div style={{
                    opacity: 0,
                    height: 0,
                    transition: `opacity 0.5s ease-in-out`,
                    ...(loadStatus === LoadStatus.success ? {
                        height: "auto",
                        opacity: 1
                    } : {})
                }}
            > 
                <StoryList feedSlug="default" onLoadStart={onLoadStart} onLoadEnd={onLoadEnd} />
            </div>
    </IASContainer>
}
```

## Reload stories

You can use the story list API to reload the feed. For example, after changing tags:

```tsx
import { StoryList, IASContainer, StoryListApi } from "@inappstory/react-sdk";

export const App = () => {
    const [tags, setTags] = useState<string[]>([]);
    const storyListRef = useRef<StoryListApi | null>(null);

    useEffect(() => {
        storyListRef.current?.reload() // Reload stories after tags changed
    }, [tags])

    useEffect(() => {
        setTags(['new-tag'])
    }, [])

    return <IASContainer config={{ apiKey: "{projectToken}", tags }}>
        <StoryList ref={storyListRef} feed="default" />
    </IASContainer>
```

## Custom story card

You can customize the appearance of the story card

```tsx
<StoryList
    options={storyListOptions}
    feedSlug="default"
    storyCardView={(storyCard) => {
            return <div>{storyCard.title}</div>
    }}              
/>
```

**`StoryCard`** properties 

| Field             | Type                                 | Description                                                |
| ----------------- | ------------------------------------ | ---------------------------------------------------------- |
| `id`              | number                               | Unique identifier of the story                             |
| `title`           | string                               | Title of the story                                         |
| `titleColor`      | string                               | Color of the title in HEX format                           |
| `backgroundColor` | string                               | Background color of the card in HEX format                 |
| `background`      | `{ color: string; gradient: boolean }` | Background configuration of the card                       |
| `favorite`        | boolean                              | Indicates if the story is marked as favorite               |
| `like`            | number                               | Number of likes the story has received                     |
| `deeplink`        | string?                              | Deeplink URL for navigation when the card is clicked       |
| `hideInReader`    | boolean?                             | Whether the story should be hidden in the reader           |
| `gameInstance`    | `{ id?: string }` \| undefined         | Details of the game instance, if the story is a game       |
| `hasAudio`        | boolean?                             | Indicates if the story contains audio                      |
| `isFavoriteCard`  | boolean                              | Whether this card represents a favorite stories collection |
| `isUgcCard`       | boolean                              | Whether this is a User Generated Content (UGC) card        |
| `isOpened`        | boolean                              | Whether the story is currently opened/being viewed         |
| `videoCoverSrc`   | string?                              | URL of the video cover (if available)                      |

**`StoryCard`** methods

- `getAspectRatio(variant: StoriesListCardViewVariant): number`  
  Calculates the aspect ratio of the card based on the specified view variant.

- `getImageSrcByCoverQuality(coverQuality: StoriesListCardCoverQuality): string | undefined`  
  Returns the image URL in the requested quality or `undefined` if not available.

- `onClick(index?: number): void`  
  Handles click interaction with the story card, optionally with the card's position index.

## Custom favorite card 

You can customize the appearance of the favorite card 

```tsx
<StoryList
    options={storyListOptions}
    feedSlug="default"
    favoriteCardView={({ favoriteStories }) => {
                        return (
                            <div>
                                {favoriteStories.map(favoriteStory => {
                                    const imageSrc = favoriteStory.getImageSrcByCoverQuality("medium");
                                    const height = 100;
                                    return (
                                        <div key={favoriteStory.id}>
                                            {favoriteStory.title}
                                            <img width={favoriteStory.getAspectRatio("rectangle") * height} height={height} src={imageSrc} />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }}
/>
```

## Custom story list controls 

You can customize story feed controls

```tsx
<StoryList
    options={storyListOptions}
    feedSlug="default"
    navigationView={(navigation) => {
            return <div>
            <button onClick={navigation.onPrev}>Назад</button>
            <button onClick={navigation.onNext}>Вперед</button>
        </div>
    }}              
/>
```

You can also use default styles:

```tsx
<StoryList
    options={storyListOptions}
    feedSlug="default"
    navigationView={(navigation) => {
        return <div className={navigation.defaultStyles["stories-list-controls"] + " " + navigation.defaultStyles[navigation.slider.direction]}>
                    <button className={navigation.defaultStyles["control-start"] + " " + navigation.reachStart} onClick={navigation.onPrev}>Назад</button>
                    <button className={navigation.defaultStyles["control-end"] + " " + navigation.reachEnd} onClick={navigation.onNext}>Вперед</button>
                </div>
    }}              
/>
```

> **Note**: You can determine whether the beginning or end of the story feed has reached using the flags `reachStart` and `reachEnd` respectively.

The full interface of the passed `navigation` object is shown below:

| Variable               | Type                       | Description                                                         |
| ---------------------- | -------------------------- | ------------------------------------------------------------------- |
| defaultStyles          | object                     | Set of default CSS classes                                          |
| reachStart             | boolean                    | Takes `true` when the list reaches its beginning (initial position) |
| reachEnd               | boolean                    | Takes `true` when the list reach last story card                    |
| onPrev                 | function                   | Prev button click handler                                           |
| onNext                 | function                   | Next button click handler                                           |
| slider.currentPosition | number                     | Current offset of story list                                        |
| slider.direction       | "horizontal" \| "vertical" | Current story list scroll direction                                 |  |
| slider.viewport        | DOMRect                    | Current story list viewport                                         |

## Grid view 

The `<StoryList>` supports a Grid View mode, providing users with a visually engaging way to browse their favorite stories. The Grid View is responsive and adapts to different screen sizes and orientations, ensuring a consistent experience across devices such as desktops, tablets, and smartphones.

To enable the Grid View display mode you need to use the `direction` property from [stories list options](#storieslist-options). See the example below.

```tsx
import { StoryList, IASContainer, storyManager } from "@inappstory/react-sdk"

export const App = () => {
   return (
      <IASContainer config={{ apiKey: "{projectToken}" }}>
            <StoryList feedSlug="default" options={{
                direction: "vertical",
                layout: { height: 300 /* Height of story list */ }
            }} />
      </IASContainer>
}
```

## Making Responsive

This guide demonstrates how to create a responsive story list using the `@inappstory/react-sdk` package by leveraging the `useMediaQuery` hook. This approach allows you to adjust the appearance of story cards based on the screen size, enhancing the user experience across different devices.

### Implementing `useMediaQuery`

First, let's create the `useMediaQuery` hook that will be used to detect screen sizes:

```ts
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const updateMatches = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener('change', updateMatches);
    return () => {
      mediaQueryList.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}
```

It's important to note that this is just one way to implement `useMediaQuery`. There are various other approaches and libraries that offer similar functionality, such as:

- **`react-responsive`**: A popular library that provides hooks and components to manage media queries in React.
- **`useMedia`**: A hook from the `usehooks-ts` library that offers a simple and intuitive way to work with media queries.
- **Custom Implementations**: You can also create your own version of `useMediaQuery` tailored to specific requirements, potentially adding features like caching, SSR support, or more complex query management.

Feel free to explore these alternatives and choose the one that best fits your project's needs.

### Usage Example
Now, we can use the `useMediaQuery` hook to make the story list responsive:

```tsx
import React from "react";
import { StoryList, IASContainer } from "@inappstory/react-sdk";
import { useMediaQuery } from './useMediaQuery'; // Import the useMediaQuery hook

export const App = () => {
    // Determine if the device is a desktop based on screen width
    const isDesktop = useMediaQuery('(min-width: 1024px)');

    // Set story list options based on screen size
    const storyListOptions = isDesktop ? {
        card: { height: 178 }
    } : { 
        card: { height: 100 }
    };

    return (
        <IASContainer config={{
                apiKey: "{projectToken}" // Replace with your project token
            }}>
            <StoryList
                options={storyListOptions}
                feedSlug="default"
            />
        </IASContainer>
    );
};
```

### Explanation

- **`useMediaQuery`**: This custom hook is used to detect the screen size. In this example, it checks if the screen width is at least 1024 pixels (`min-width: 1024px`), which indicates a desktop device.

- **`storyListOptions`**: Depending on whether the device is a desktop or a mobile, the height of the story cards is adjusted. For desktop screens, the card height is set to 178px, while for smaller screens (like mobile devices), it is set to 100px.

### Why Use `useMediaQuery`?

Using the `useMediaQuery` hook provides a straightforward way to create responsive UIs that adapt to different screen sizes. This ensures that your content is optimally displayed on both desktop and mobile devices, enhancing the user experience.

## Events

```ts
import { storyManager } from "@inappstory/react-sdk"

storyManager.on("feedImpression", (payload) => console.log(payload));
```
---

- [`feedImpression`](#feedimpression)
- [`visibleAreaUpdated`](#visibleareaupdated)
- [`clickOnStory`](#clickonstory)

### `feedImpression`
**Description:** Triggered after stories appear in the viewport.

**Payload:**

| Field     | Type   | Description                                                            |
| --------- | ------ | ---------------------------------------------------------------------- |
| `feed`    | string | Feed name.                                                             |
| `stories` | array  | Array of stories `{ id: number; title: string; slidesCount: number }`. |

---

### `visibleAreaUpdated`
**Description:** Triggered when the visible area of stories is updated in the viewport.

**Payload:**

| Field     | Type   | Description                                                            |
| --------- | ------ | ---------------------------------------------------------------------- |
| `feed`    | string | Feed name.                                                             |
| `stories` | array  | Array of stories `{ id: number; title: string; slidesCount: number }`. |

---

### `clickOnStory`
**Description:** Triggered when a user clicks on a story card in the slider list.

**Payload:**

| Field                | Type    | Description                                |
| -------------------- | ------- | ------------------------------------------ |
| `id`                 | number  | Story ID.                                  |
| `title`              | string? | Story title.                               |
| `slidesCount`        | number? | Number of slides in the story.             |
| `feed`               | string? | Feed name where the story belongs.         |
| `source`             | string? | Story source.                              |
| `filter`             | object  | Applied filters.                           |
| `ugcPayload`         | object  | UGC-related payload.                       |
| `defaultListLength`  | number  | Default list length.                       |
| `favoriteListLength` | number  | Favorite list length.                      |
| `index`              | number  | Index of the story in the list.            |
| `isDeeplink`         | boolean | Whether the story was opened via deeplink. |
| `url`                | string? | Deeplink URL.                              |

---