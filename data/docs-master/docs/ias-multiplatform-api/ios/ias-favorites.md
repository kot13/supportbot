# FavoritesAPI

Class is used to remove stories from favorites with external way (f.e. by a button on a list
widget's item). Can be called from InAppStoryAPI:

```Swift
let favoritesAPI = InAppStoryAPI.shared.favoritesAPI
```

## Methods

To remove single story from favorite by id:

```Swift
func removeFromFavorites(with storyID: String)
```

To remove all stories from favorites:

```Swift
func removeAllFavorite()
```