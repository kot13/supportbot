
# Banners

> The **Banners Plugin** for `@inappstory/js-sdk` provides a simple way to display banner placements on your website.

---

## Table of Contents

1. [Overview](#overview)
2. [Requirements](#requirements)
3. [Integration](#integration)
4. [Initialization](#initialization)
5. [Usage](#usage)
6. [Customization](#customization)
7. [Events](#events)
8.  [Tips & Best Practices](#tips-and-best-practices)
9.  [Errors & Debugging](#errors-and-debugging)
10. [FAQ](#faq)
## Overview

The Banners plugin allows you to:

- Embed **banners**.
- Manage display via **API or InAppStory Console**.
- Integrate **custom sliders** (e.g., Swiper.js).
- React to loading, error, and user interaction events.

---

## Requirements

| Platform           | Compatibility                |
| ------------------ | ---------------------------- |
| JavaScript SDK     | `@inappstory/js-sdk@>=3.7.0` |
| SSR Support        | ❌ No support                 |
| TypeScript Support | ✅ Full                       |
| Browsers           | Modern ES6+ browsers         |

---

## Integration

### Via NPM

```bash
npm install @inappstory/js-sdk
```

```ts
import { InAppStoryManager } from "@inappstory/js-sdk";
import IasBannersPlugin from "@inappstory/js-sdk/plugins/banners";

InAppStoryManager.use(IasBannersPlugin);
const inAppStoryManager = new InAppStoryManager(config);
/* You can now use inAppStoryManager.banners to access the banners API */
```

### Via CDN
The plugin is built into the SDK bundle

```html
<script>
const inAppStoryManager = new IAS.InAppStoryManager(config);
/* You can now use inAppStoryManager.banners to access the banners API */
</script>
```

---

## Initialization

### Mounting a Banner Carousel

The first step in SDK setup is to create and place the `<div id="your-mount-selector">` container in the body of your markup.<br/>
The `<div>` tag in this section identifies the location on the page where the js-sdk API will place the banners widget.

```ts
const bannerPlace = inAppStoryManager.banners.mountBannerCarousel(
  "#your-mount-selector", {
      placeId: "{your-place-id-from-ias-console}",
      appearance: {
        autoplay: true,
        gap: 16,
        banner: {
          borderRadius: 8
        }
      }
  }
);
```

> ❗ `placeId` must match the ID set in the `InAppStory Console`.

### Example

```html
<!DOCTYPE html>
<head>
  <meta charset="utf-8" />
  <script
      defer
      src="https://cdn.domain-placeholder/sdk/js-sdk-version-placeholder/dist/js/IAS.js"
    ></script>
</head>
  <body>
    <div id="ias-banner-place-widget"></div>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const inAppStoryManager = new IAS.InAppStoryManager({
          apiKey: "{project-integration-key}",
        });

         const bannerPlace = inAppStoryManager.banners.mountBannerCarousel(
                        "#ias-banner-place-widget", {
                            placeId: bannerPlaceId,
                            appearance: {}
                        }
                    );
      })
    </script>
  </body>
</html>
```

---

## Usage

### Update Appearance

You can update the appearance settings

```ts
bannerPlace.updateAppearance({
  gap: 24,
  navigation: { enabled: false },
  banner: {
    borderRadius: 16
  },
});
```

### Resume/Pause Autoplay

You can control the default slider implementation

```ts
bannerPlace.resume();
bannerPlace.pause();
```

### Reload Banners

You can reload the list of banners

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


### Destroy

After finishing using it, you should properly destroy the banner place to avoid memory leaks and other possible problems

```ts
bannerPlace.destroy();
```

### Access Banner List

You can access the list of banners for full customization

```ts
const banners = bannerPlace.banners;
banners.forEach(b => console.log(b.name));
```
---

## Customization

### Appearance settings

The following appearance settings are available for the banner place:

| Parameter        | Type      | Description                                                    | Default Value |
| ---------------- | --------- | -------------------------------------------------------------- | ------------- |
| `loop`           | `boolean` | Enables continuous loop mode (rearranges slides).              | `true`        |
| `gap`            | `number`  | Spacing between slides (in pixels).                            | `16`          |
| `autoplay`       | `boolean` | Enables automatic slide playback.                              | `false`       |
| `navigation`     | `object`  | Navigation settings.                                           | —             |
| ↳ `enabled`      | `boolean` | Enables default navigation (prev/next buttons).                | `true`        |
| `pagination`     | `object`  | Pagination settings.                                           | —             |
| ↳ `enabled`      | `boolean` | Enables default pagination (slide indicators/dots).            | `true`        |
| `banner`         | `object`  | Banner settings.                                               | —             |
| ↳ `borderRadius` | `number`  | Banner corner rounding (in pixels).                            | `16`          |
| `direction`      | `string`  | List direction. Possible values: `row`, `column`. Since 3.8.0. | `row`         |
| `allowTouchMove` | `boolean` | Toggles touch on the list. Since 3.8.0                         | `true`        |

> **Note:**  
> Nested properties (`navigation.enabled`, `pagination.enabled`, `banner.borderRadius`) are marked with `↳`.

### Custom Navigation Controls

You can create your own buttons and control the banner slider:

```ts
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');

nextBtn.addEventListener('click', () => {
  bannerPlace.showNext();
});

prevBtn.addEventListener('click', () => {
  bannerPlace.showPrevious();
});
```

### Custom Pagination Indicators

Render your own pagination dots or numbers, and synchronize them with the banner state:

```ts
const paginationContainer = document.getElementById('pagination');

function renderPagination() {
  paginationContainer.innerHTML = '';
  for (let i = 0; i < bannerPlace.paginationBullets; i++) {
    const dot = document.createElement('button');
    dot.textContent = (i + 1).toString();
    dot.classList.toggle('active', i === bannerPlace.activeIndex);

    dot.addEventListener('click', () => {
      bannerPlace.showByIndex(i);
    });

    paginationContainer.appendChild(dot);
  }
}

renderPagination();

// Update pagination UI on banner change
bannerPlace.on('loadEnd', renderPagination);
bannerPlace.on('activeIndexChange', renderPagination);
```

{/* ### Integrating External Sliders

The plugin supports custom slider implementations by setting a slider controller via `setSliderController()`:

```ts
const customSlider = {
  getTotalPages: () => swiper.slides.length,
  getActiveIndex: () => swiper.realIndex,
  start: () => swiper.autoplay.start(),
  stop: () => swiper.autoplay.stop(),
  toNextSlide: () => swiper.slideNext(),
  toPrevSlide: () => swiper.slidePrev(),
  slideTo: (index, speed = 300) => swiper.slideTo(index, speed),
  autoplay = {
        isPaused: () => swiper.autoplay.paused,
        resume: () => { swiper.autoplay.resume(); },
        pause: () => { swiper.autoplay.pause(); },
        start: () => { swiper.autoplay.start(); },
        stop: () => { swiper.autoplay.stop(); },
        setDelay(delay: number) { swiper.options.delay = delay } // The duration is set from the SDK and depends on the settings in the IAS console.
    };
};

bannerPlace.setSliderController(customSlider);
```

This lets you maintain full control over animations, autoplay, and user interaction while keeping banner data synchronized. */}
---

## Events

### `loadStart`
**Description:** Triggered when loading starts.

_No payload._

---

### `loadEnd`
**Description:** Triggered when loading ends.

_No payload._

---

### `loadError`
**Description:** Triggered when loading fails.

_No payload._

---

### `activeIndexChange`
**Description:** Triggered when the active banner changes.

**Payload:**

| Field | Type   | Description                           |
| ----- | ------ | ------------------------------------- |
| —     | number | Index of the currently active banner. |

---

### `autoplayTimeLeft`
**Description:** Triggered before transition to the next slide after the duration has elapsed.

_No payload._

---

### `autoplayTimerTick`
**Description:** Triggered while autoplay timer tick.

**Payload:**

| Field         | Type   | Description                   |
| ------------- | ------ | ----------------------------- |
| `bannerIndex` | number | Banner index in banner place. |
| `currentTime` | number | Current progress.             |
| `totalTime`   | number | Total duration.               |
| `percents`    | number | Current progress in percents. |

---

### `showBanner`
**Description:** Triggered when the banner is in the viewport and started.

**Payload:**

| Field         | Type    | Description                              |
| ------------- | ------- | ---------------------------------------- |
| `id`          | string  | Banner identifier.                       |
| `bannerPlace` | string  | Banner place identifier.                 |
| `payload`     | string? | Optional additional banner payload data. |

---

### `showBannerFailed`
**Description:** Triggered when the banner is in the viewport and error occurs on start.

**Payload:**

| Field         | Type    | Description                              |
| ------------- | ------- | ---------------------------------------- |
| `id`          | string  | Banner identifier.                       |
| `bannerPlace` | string  | Banner place identifier.                 |
| `error`       | Error   | Error that occurred.                     |
| `payload`     | string? | Optional additional banner payload data. |

---

### `bannerWidget`
**Description:** Triggered when interacting with banner widgets.

**Payload:**

| Field             | Type                | Description                                 |
| ----------------- | ------------------- | ------------------------------------------- |
| `id`              | string              | Banner identifier.                          |
| `bannerPlace`     | string              | Banner place identifier.                    |
| `widgetEventName` | string              | Name of the widget event (e.g., "click").   |
| `widgetData`      | `Record<string, any>` | Arbitrary data related to the widget event. |
| `payload`         | string?             | Optional additional banner payload data.    |

```ts
bannerPlace.on("loadEnd", () => console.log("Loaded"));
```

---

## Tips and Best Practices

- Always call `destroy()` to properly free resources.
- Connect third-party sliders via `setSliderController()` for full UI/UX control.
- Use unique `placeId` values for A/B testing and analytics.

---

## Errors and Debugging

| Problem                | Cause                               | Solution                                                                 |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| Banners not showing    | Invalid `placeId` or mount selector | Check mount selector and InAppStory console and ensure correct `placeId` |
| `loadError` triggered  | Network issue or no banners         | Validate InAppStory console content and connection                       |
| `banners.length === 0` | No banners configured               | Fill banner place in the InAppStory console                              |

---

## FAQ

### Banners are not loading, what should I do?

Check the browser console. Ensure the `placeId` is correct and that the banner place contains active content.

### Can I use multiple banner places on the same page?

Yes. You can create multiple `BannerPlace` instances with different selectors values.