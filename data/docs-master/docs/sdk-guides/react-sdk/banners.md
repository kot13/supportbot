# Banners

> The **Banners Plugin** for `@inappstory/react-sdk` provides a simple way to display banner placements on your website

---

## Table of Contents

1. [Overview](#overview)  
2. [Requirements](#requirements)  
3. [Integration](#integration)  
4. [Initialization](#initialization)  
5. [Usage](#usage)  
6. [Customization](#customization)  
7. [Events](#events)  
8. [Tips & Best Practices](#tips-and-best-practices)  
9.  [Errors & Debugging](#errors-and-debugging)  
10. [FAQ](#faq)  

---

## Overview

The Banners plugin allows you to:

- Embed **banners**.
- Manage display via **API or InAppStory Console**.
- Integrate **custom sliders** (e.g., Swiper.js).
- React to loading, error, and user interaction events.

---

## Requirements

| Platform           | Compatibility                   |
| ------------------ | ------------------------------- |
| JavaScript SDK     | `@inappstory/react-sdk@>=1.8.0` |
| SSR Support        | ❌ No support                    |
| TypeScript Support | ✅ Full                          |
| Browsers           | Modern ES6+ browsers            |

---

## Integration

```bash
npm install @inappstory/react-sdk
```

```ts
import { StoryManager, storyManager } from "@inappstory/react-sdk";
import BannersPlugin from "@inappstory/react-sdk/plugins/banners";

StoryManager.use(BannersPlugin);
/* storyManager.banners is now available */
```

---

## Initialization

### Using the Banner Carousel Component

```tsx
import React, { useState } from "react";
import {
  IasBannerCarousel,
  type BannerPlace,
  type BannerCarouselAppearance,
} from "@inappstory/react-sdk/plugins/banners";

type MyBannerPlaceProps = {
  placeId: string; // e.g., "homepage-top"
};

export function MyBannerPlace({ placeId }: MyBannerPlaceProps) {
  const [bannerPlace, setBannerPlace] = useState<BannerPlace | null>(null);
  const [appearance, setAppearance] = useState<BannerCarouselAppearance>({
    autoplay: true,
    autoplayDelay: 3000,
    gap: 16,
    navigation: { enabled: true },
    pagination: { enabled: true },
    banner: {
      borderRadius: 8,
    }
  });

  return (
    <IasBannerCarousel
      placeId={placeId}
      appearance={appearance}
      onReady={setBannerPlace}
      onLoadStart={() => {
        // loading started
      }}
      onLoadEnd={() => {
        // loading finished
      }}
      onLoadError={(err) => {
        // loading error
        console.error("Banners load error", err);
      }}
    />
  );
}
```

> ❗️`placeId` must match the ID from **InAppStory Console**.  
> ❗️Do not call `destroy()` on the banner place instance created by `<IasBannerCarousel />`. Component unmounting handles cleanup automatically.

---

## Usage

### Update Appearance

Preferred approach: update the `appearance` prop.  

```tsx
setAppearance((prev) => ({
  ...prev,
  gap: 24,
  banner: {
    borderRadius: 16
  },
  navigation: { enabled: false },
}));
```

Alternatively, update appearance imperatively (Not recommended, instead use React state management):

```ts
bannerPlace.updateAppearance({
  gap: 24,
  banner: {
    borderRadius: 16
  },
  navigation: { enabled: false },
});
```

### Pause/Resume Autoplay

```ts
bannerPlace.resume();
bannerPlace.pause();
```

### Reload Banners

```ts
await bannerPlace.reload();
```

### Navigation

Run transition to next slide.
```ts
bannerPlace.showNext();
```

Run transition to previous slide.
```ts
bannerPlace.showPrevious();
```

Run transition to the slide by index
```ts
bannerPlace.showByIndex(index: number, speed?: number);
```

### Access Banner List

```ts
const banners = bannerPlace.banners;
banners.forEach((b) => console.log(b.name));
```

---

## Customization

### Appearance Settings

The following appearance settings are supported:

| Parameter        | Type      | Description                                                    | Default Value |
| ---------------- | --------- | -------------------------------------------------------------- | ------------- |
| `loop`           | `boolean` | Enables continuous loop mode.                                  | `true`        |
| `gap`            | `number`  | Spacing between slides (in pixels).                            | `16`          |
| `autoplay`       | `boolean` | Enables automatic slide playback.                              | `false`       |
| `animationSpeed` | `number`  | Transition duration between slides (in ms).                    | `300`         |
| `navigation`     | `object`  | Navigation settings.                                           | —             |
| ↳ `enabled`      | `boolean` | Enables default navigation (prev/next buttons).                | `true`        |
| `pagination`     | `object`  | Pagination settings.                                           | —             |
| ↳ `enabled`      | `boolean` | Enables default pagination (slide indicators/dots).            | `true`        |
| `banner`         | `object`  | Banner settings.                                               | —             |
| ↳ `borderRadius` | `number`  | Banner corner rounding (in pixels).                            | `16`          |
| `direction`      | `string`  | List direction. Possible values: `row`, `column`. Since 1.8.0. | `row`         |
| `allowTouchMove` | `boolean` | Toggles touch on the list. Since 1.8.0                         | `true`        |

> Nested properties (`navigation.enabled`, `pagination.enabled`, `banner.borderRadius`) are indicated with `↳`.

### Custom Navigation Controls

```tsx
function BannerWithCustomNav({ placeId }: { placeId: string }) {
  const [bannerPlace, setBannerPlace] = useState<BannerPlace | null>(null);

  return (
    <div>
      {bannerPlace && <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button onClick={() => bannerPlace.showNext()}>Prev</button>
        <button onClick={() => bannerPlace.showPrevious()}>Next</button>
      </div>}

      <IasBannerPlace
        placeId={placeId}
        appearance={{ navigation: { enabled: false } }}
        onReady={setBannerPlace}
      />
    </div>
  );
}
```

Pagination CSS Custom Properties
```css
--ias-banners-pagination-inactive-color: hsla(0, 0%, 100%, 0.5)
--ias-banners-pagination-width: 8px
--ias-banners-pagination-height: 8px
```

### Custom Pagination Indicators

```tsx
function BannerWithCustomPagination({ placeId }: { placeId: string }) {
  const [bannerPlace, setBannerPlace] = useState<BannerPlace | null>(null);
  const [totalBullets, setTotalBullets] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

    const updateMeta = () => {
      setTotalBullets(bannerPlace.paginationBullets);
      setActiveIndex(bannerPlace.activeIndex);
    };

    const onLoadEnd = () => updateMeta();
    const onActiveIndexChange = () =>
      setActiveIndex(bannerPlace.activeIndex);

  useEffect(() => {
    if (!bannerPlace) return;
    updateMeta();
    bannerPlace.on("loadEnd", onLoadEnd);
    bannerPlace.on("activeIndexChange", onActiveIndexChange);

    return () => {
      bannerPlace.off("loadEnd", onLoadEnd);
      bannerPlace.off("activeIndexChange", onActiveIndexChange);
    };
  }, [bannerPlace]);

  return (
    <div>
      <IasBannerPlace
        placeId={placeId}
        appearance={{ pagination: { enabled: false } }}
        onReady={setBannerPlace}
      />

      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {bannerPlace && Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => bannerPlace.showByIndex(i)}
            aria-current={i === activeIndex}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              border: "1px solid #ccc",
              opacity: i === activeIndex ? 1 : 0.5,
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## Events
{/* 
### Events Overview */}

{/* This table provides a quick overview of all events supported by the banners 

| Event               | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `loadStart`         | fired when loading starts                                                |
| `loadEnd`           | fired when loading ends                                                  |
| `loadError`         | fired when loading fails                                                 |
| `activeIndexChange` | fired when the active banner changes                                     |
| `autoplayTimeLeft`  | fired before transition to the next slide after the duration has elapsed |
| `showBanner`        | fired when the banner is in the viewport and started.                    |
| `showBannerFailed`  | fired when the banner is in the viewport and error occurs on start.      |
| `bannerWidget`      | fired when when interacting with banner widgets                          |
 */}

### `loadStart`
**Description:** fired when loading starts.

_No payload._

---

### `loadEnd`
**Description:** fired when loading ends.

_No payload._

---

### `loadError`
**Description:** fired when loading fails.

_No payload._

---

### `activeIndexChange`
**Description:** fired when the active banner changes.

**Payload:**

| Field | Type   | Description                           |
| ----- | ------ | ------------------------------------- |
| —     | number | Index of the currently active banner. |

---

### `autoplayTimeLeft`
**Description:** fired before transition to the next slide after the duration has elapsed.

_No payload._

---

### `autoplayTimerTick`
**Description:** fired while autoplay timer tick.

**Payload:**

| Field         | Type   | Description                   |
| ------------- | ------ | ----------------------------- |
| `bannerIndex` | number | Banner index in banner place. |
| `currentTime` | number | Current progress.             |
| `totalTime`   | number | Total duration.               |
| `percents`    | number | Current progress in percents. |

---

### `showBanner`
**Description:** fired when the banner is in the viewport and started.

**Payload:**

| Field         | Type    | Description                              |
| ------------- | ------- | ---------------------------------------- |
| `id`          | string  | Banner identifier.                       |
| `bannerPlace` | string  | Banner place identifier.                 |
| `payload`     | string? | Optional additional banner payload data. |

---

### `showBannerFailed`
**Description:** fired when the banner is in the viewport and error occurs on start.

**Payload:**

| Field         | Type    | Description                              |
| ------------- | ------- | ---------------------------------------- |
| `id`          | string  | Banner identifier.                       |
| `bannerPlace` | string  | Banner place identifier.                 |
| `error`       | Error   | Error that occurred.                     |
| `payload`     | string? | Optional additional banner payload data. |

---

### `bannerWidget`
**Description:** fired when interacting with banner widgets.

**Payload:**

| Field             | Type                | Description                                 |
| ----------------- | ------------------- | ------------------------------------------- |
| `id`              | string              | Banner identifier.                          |
| `bannerPlace`     | string              | Banner place identifier.                    |
| `widgetEventName` | string              | Name of the widget event (e.g., "click").   |
| `widgetData`      | `Record<string, any>` | Arbitrary data related to the widget event. |
| `payload`         | string?             | Optional additional banner payload data.    |

Example (imperative API):

```ts
bannerPlace.on("loadEnd", () => console.log("Loaded"));
```

> When using `<IasBannerCarousel />`, prefer the `onLoadStart`, `onLoadEnd`, and `onLoadError` props.

---

## Tips and Best Practices

- Do not call `destroy()` for an instance created by `<IasBannerCarousel />`; unmounting the component disposes it automatically.
- Connect third-party sliders via `setSliderController()` for full UI/UX control.
- Use unique `placeId` values for analytics and A/B testing.
- Prefer updating `appearance` through the prop for declarative updates.

---

## Errors and Debugging

| Problem                | Cause                                | Solution                                                                    |
| ---------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| Banners not showing    | Invalid `placeId` or missing content | Check `placeId` and ensure banners are configured in the InAppStory Console |
| `loadError` fired      | Network error or empty configuration | Validate console content and network connection                             |
| `banners.length === 0` | No banners configured                | Fill the banner place in the InAppStory Console                             |

---

## FAQ

### Banners are not loading. What should I check?
Verify the `placeId` and ensure that the banner place contains active content in the InAppStory Console.

### Can I use multiple banner places on the same page?
Yes, you can render multiple `<IasBannerPlace placeId="..." />` components with different `placeId` values.

### Does it work with SSR/Next.js?
No, the plugin does not support SSR. In Next.js, load it on the client side:

```tsx
import dynamic from "next/dynamic";

const IasBannerPlace = dynamic(
  () => import("@inappstory/react-sdk/plugins/banners").then((module) => module.IasBannerPlace),
  { ssr: false }
);
```
