# Favorites

If you use favorites, use `onFavoriteCell` event that fires when user clicks on a favorites cell:

```ts
storyManager.on('onFavoriteCell', () => {
  //Navigate to favorites screen
});
```

To display favorite stories, pass `favoritesOnly` to `<StoriesList/>`

```tsx
<StoriesList favoritesOnly={true} />
```