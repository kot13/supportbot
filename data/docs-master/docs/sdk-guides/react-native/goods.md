# Goods

To use goods widget, add a function that returns products to the `getGoodsObject`:

```ts
storyManager.getGoodsObject((skus) => {
  //TODO: return array of Goods
  return skus.map((sku) => ({
    sku: sku, //item sku
    title: 'title of ' + sku, //item title for cell
    subtitle: 'subtitle of ' + sku, //item subtitle for cell
    imageURL: '', //image url for cell
    price: Number(Math.random() * 1000).toFixed(2), //price value for cell
    oldPrice: Number(Math.random() * 1000).toFixed(2),
  }));
});
```

After goods item is selected:

```ts
storyManager.on('goodItemSelected', (payload: any) => {
   // User selected payload.sku SKU
});
```