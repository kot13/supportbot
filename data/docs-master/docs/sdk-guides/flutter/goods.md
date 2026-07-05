# Goods

## Default implementation

To integrate Goods in your stories, you need to:

1. Add "Goods" widget to a story in the console editor;
2. Set goods item appearance from `AppearanceManager`:

```dart
await AppearanceManager.instance.setGoodsItemAppearance(GoodsItemAppearance());
```

3. Realize method from `InAppStoryManager`:

```dart
void setUpSkus() {
  InAppStoryManager.instance.setGetSkusCallback((skus) async {
    // get goods info from your App
    getGoods();

    final listOfGoods = <GoodsItemData>[];
    for (var sku in skus) {
      final good = widget.goods.firstWhere(
            (element) => element.sku == sku,
        orElse: () =>
            GoodsItemDataDto(
              sku: sku,
              //item sku
              title: 'Title$sku',
              // item title for cell
              description: 'Desc$sku',
              // item subtitle for cell
              price: '${Random().nextInt(1000) + 500}',
              // item price value
              oldPrice: '${Random().nextInt(500)}', // item discount value
            ),
      );
      listOfGoods.add(
        GoodsItemData(
          sku: good.sku ?? '',
          price: good.price,
          oldPrice: good.oldPrice,
          image: good.image,
          description: good.description,
          title: good.title,
        ),
      );
    }
    return listOfGoods;
  });
}
```

## Customization

Using `GoodsItemAppearance` class you can customize appearance of Goods widget

### Parameters

| Name                    | Type   | Description                         |
|-------------------------|--------|-------------------------------------|
| itemBackgroundColor     | Color  | background color of item            |
| widgetBackgroundColor   | Color  | background color of widget          |
| itemMainTextColor       | Color  | goods item text color               |
| itemCornerRadius        | int    | goods item corner radius            |
| itemOldPriceTextColor   | Color  | goods item discount text color      |
| itemTitleTextSize       | int    | title text size                     |
| itemDescriptionTextSize | int    | description text size               |
| itemPriceTextSize       | int    | price text size                     |
| itemOldPriceTextSize    | int    | discount text size                  |
| widgetBackgroundHeight  | int    | height of Goods widget              |
| closeButtonImage        | String | path to icon asset (png, jpg, jpeg) |
| closeButtonColor        | Color  | color of default icon close button  |

## Events

To listen item selected callback, you need to add `IASGoodItemSelectedCallback` mixin to your state widget

```dart
class _ExampleState extends State<Example> with IASGoodItemSelectedCallback {
  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }

  @override
  Future<void> goodsItemSelected(GoodsItemDataDto item) async {
    // you can close story reader before action with good
    await InAppStoryManager.instance.closeReaders(); 
    // any code here
  }
}
```