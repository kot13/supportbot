# Widget “Goods”

:::warning
This widget will be removed in future versions of SDK, use the "Products" widget from the InAppStory console instead.
:::

In stories you can add the Goods widget. It can be represented as a horizontal list of items.

> **Attention!**<br/>
> If you want to use the widget you must set `setGoodsWidgetOptions` interface in
> common [`AppearanceManager`](./feeds.md) instance.

## GoodsWidgetOptions

### Properties

| Variable                       | Type   | Required | Default     | Description                                                                                                                      |
| ------------------------------ | ------ | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| goodsCard.mainTextColor        | string | No       | #000000     | Main text CSS valid [color](https://developer.mozilla.org/ru/docs/Web/CSS/color_value)                                           |
| goodsCard.oldPriceTextColor    | string | No       | #CCCCCC     | Old price CSS valid text [color](https://developer.mozilla.org/ru/docs/Web/CSS/color_value)                                      |
| goodsCard.imageBackgroundColor | string | No       | transparent | Cell image CSS valid background [color](https://developer.mozilla.org/ru/docs/Web/CSS/color_value)                               |
| goodsCard.imageCornerRadius    | string | No       | 8           | Cell image corner radius, `px`                                                                                                   |
| goodsCard.titleFont            | string | No       |             | Cell title CSS valid [font](https://developer.mozilla.org/ru/docs/Web/CSS/font)                                                  |
| goodsCard.subtitleFont         | string | No       |             | Cell subtitle CSS valid [font](https://developer.mozilla.org/ru/docs/Web/CSS/font)                                               |
| goodsCard.priceFont            | string | No       |             | Cell price CSS valid [font](https://developer.mozilla.org/ru/docs/Web/CSS/font)                                                  |
| goodsCard.oldPriceFont         | string | No       |             | Cell old price CSS valid [font](https://developer.mozilla.org/ru/docs/Web/CSS/font)                                              |
| goodsList.closeBackgroundColor | string | No       | #000000     | Close CSS valid background [color](https://developer.mozilla.org/ru/docs/Web/CSS/color_value)                                    |
| goodsList.closeImage           | string | No       |             | Close image svg source                                                                                                           |
| goodsList.substrateColor       | string | No       | #FFFFFF     | Goods substrate CSS valid [color](https://developer.mozilla.org/ru/docs/Web/CSS/color_value)                                     |
| goodsList.substrateHeight      | string | No       | 200         | Goods substrate height, `px`                                                                                                     |
| goodsList.dimColor             | string | No       | #808080     | Widget backdrop CSS valid [color](https://developer.mozilla.org/ru/docs/Web/CSS/color_value)                                     |
| goodsList.renderingType        | string | No       | default     | Widget rendering type `"default"                                                                                                 | "customCard"` |
| goodsWidgetRenderingType       | string | No       | default     | Widget rendering type `"default"                                                                                                 | "customCard"` |
| loader.default.color           | string | No       | gray        | Default loader primary color. Valid CSS [color](https://developer.mozilla.org/ru/docs/Web/CSS/color_value). Default - white      |
| loader.default.accentColor     | string | No       | transparent | Default loader accent color. Valid CSS [color](https://developer.mozilla.org/ru/docs/Web/CSS/color_value). Default - transparent |
| loader.custom                  | string | No       |             | Svg source                                                                                                                       |

### Methods

| Method                 | Required | Description                                                                                                                   |
| ---------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| openGoodsWidgetHandler | Yes      | This method is **required**! In this method, you can make a request to get the goods                                          |
| getCardHtml            | No       | This method is used only if you have set `goodsWidgetRenderingType = "customCard"` and returns the HTML code of the good card |
| itemClickHandler       | No       | Callback for the click event on the good card                                                                                 |

```ts
interface GoodsWidgetOptions {
  goodsWidgetRenderingType?: 'default' | 'customCard'; // DEPRECATED
  goodsList: GoodsListOptions;
  goodsCard: GoodsCardOptions;
  openGoodsWidgetHandler: (goods: Good[]) => Promise<Good[]>;
  getCardHtml?: (good: Good, index: number) => string;
  itemClickHandler?: (good: Good) => void;
  loader?: {
    default?: {
      color?: string;
      accentColor?: string;
    };
    custom?: string;
  };
}

interface Goods {
  imgSrc?: string;
  sku: string;
  title: string;
  subTitle: string;
  price: string;
  oldPrice: string;
  rawData: any;
}

interface GoodsCardOptions {
  mainTextColor?: string;
  oldPriceTextColor?: string;
  imageBackgroundColor?: string;
  imageCornerRadius?: number;
  titleFont?: string;
  subtitleFont?: string;
  priceFont?: string;
  oldPriceFont?: string;
}

interface GoodsListOptions {
  renderingType?: 'default' | 'customCard';
  closeBackgroundColor: string;
  closeImage?: string;
  substrateHeight?: number;
  substrateColor?: string;
  dimColor?: string;
}

interface GoodsCardOptions {
  mainTextColor?: string;
  oldPriceTextColor?: string;
  imageBackgroundColor?: string;
  imageCornerRadius?: number;
  titleFont?: string;
  subtitleFont?: string;
  priceFont?: string;
  oldPriceFont?: string;
}

interface GoodsListOptions {
  renderingType?: 'default' | 'customCard';
  closeBackgroundColor: string;
  closeImage?: string;
  substrateHeight?: number;
  substrateColor?: string;
  dimColor?: string;
}
```

## Example

```ts
const appearanceManager = new window.IAS.AppearanceManager();

appearanceManager.setGoodsWidgetOptions({
  goodsWidgetRenderingType: 'default',
  goodsList: {
    renderingType: 'default',
    substrateHeight: 200,
    closeBackgroundColor: 'gray',
  },
  goodsCard: {
    titleFont: 'bold 1rem "TT Commons"',
    priceFont: 'bold 1rem "TT Commons"',
    oldPriceFont: 'bold 1rem "TT Commons"',
    imageBackgroundColor: '#0C62F3',
  },
  itemClickHandler: (goods) => console.log(goods.sku),
  openGoodsWidgetHandler: (goodsList) =>
    Promise.resolve(
      goodsList.map((goods) => ({
        ...goods,
        title: 'Title',
        subTitle: 'Description',
        price: '999',
        oldPrice: '1999',
      })),
    ),
});
```
