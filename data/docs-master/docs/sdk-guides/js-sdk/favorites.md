# Favorite feed

The Favorite feed allows users to easily access and manage stories they've marked as favorites. When a user adds a story to their favorites, it is saved in this list, providing quick and convenient access to their preferred content.

## Customization `StoryFavoriteReader`

The favorite stories reader can be customized to fit the specific needs and preferences of your application

| Variable              | Type   | Description                                                                                                                                                                                                                                                                                                      |
| --------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title.content         | string | Title text. Default value - "Favorite".                                                                                                                                                                                                                                                                          |
| title.color           | string | CSS valid color value. Default `white`                                                                                                                                                                                                                                                                           |
| title.font            | string | CSS valid font [value](https://developer.mozilla.org/en-US/docs/Web/CSS/font). Override font. <br/>Default `normal 1.4rem/1.2 InternalPrimaryFont` where InternalPrimaryFont - primary font, loaded in [project settings](https://console.domain-placeholder). In some cases you will need to connect fonts manually |
| title.backgroundColor | string | StoryFavoriteReader header bg color. CSS valid color value. Default `#333333`.                                                                                                                                                                                                                                   |
| closeButtonPosition   | string | Close button position, one of `start`, `end`. Default `end`.                                                                                                                                                                                                                                                     |
| closeButton           | object | Override close button svg icon. (Override value from `commonOptions`)                                                                                                                                                                                                                                            |
| headerTopOffset       | number | Header top offset, `px` (with save bg color). Default `0`.                                                                                                                                                                                                                                                       |
| bottomOffset          | number | Bottom offset, `px` (with save bg color). Default `0`.                                                                                                                                                                                                                                                           |
| backgroundColor       | number | StoryFavoriteReader body bg color. CSS valid color value. Default `#333333`.                                                                                                                                                                                                                                     |

```ts
import { AppearanceManager } from "@inappstory/js-sdk";

const appearanceManager = new AppearanceManager();
appearanceManager.setStoryFavoriteReaderOptions({
    title: {
        content: "Favorites"
    }
})
```