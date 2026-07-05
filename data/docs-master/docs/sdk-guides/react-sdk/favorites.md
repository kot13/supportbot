# Favorite feed

The Favorite feed allows users to easily access and manage stories they've marked as favorites. When a user adds a story to their favorites, it is saved in this list, providing quick and convenient access to their preferred content.

## Customization

The favorite feed can be customized to fit the specific needs and preferences of your application

```tsx
// App.tsx
import { IASContainer, StoryList } from "@inappstory/react-sdk"
import { FavoriteStoryListModal } from "./FavoriteStoryListModal/FavoriteStoryListModal"

export const App = () => {
    const [isOpenFavoriteStoryList, setIsOpenFavoriteStoryList] = useState(false)

    return <IASContainer config={{}}>
            <StoryList  feedSlug="default" onFavoriteCardClick={() => setIsOpenFavoriteStoryList(true) } />
            <FavoriteStoryListModal open={isOpenFavoriteStoryList} onClose={() => setIsOpenFavoriteStoryList(false)} />
        </IASContainer>
}
                
```

```tsx
// FavoriteStoryListModal.tsx
import "./favoriteStoryList.scss"
import { IASContainer, FavoriteStoryList } from "@inappstory/react-sdk"

export const FavoriteStoryListModal = ({
  open,
  onClose
}: { 
    open: boolean, 
    onClose: () => void 
}) => {

  return open ? <IASContainer config={{}}>
    <div className="container">
    <div className="header">
      <p className="title">Favorite</p>
      <button onClick={onClose} className="header__close-btn">Закрыть</button>
    </div>
    <div className="favorite-story-list">
      <FavoriteStoryList />
    </div>
  </div>
  </IASContainer> : null
}
```

```scss
/* favoriteStoryList.scss */

.container {
    position: fixed;
    left: 0px;
    top: 0px;
    padding: 0px;
    border: 0px;
    z-index: 10;
    width: 100%;
    height: 100%;
    color-scheme: auto;
    background: #333333;
    display: flex;
    flex-direction: column;
}

.header {
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    background: #333333;
    position: relative;
    z-index: 100;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .14), 0 2px 1px -1px rgba(0, 0, 0, .12), 0 1px 3px 0 rgba(0, 0, 0, .2);

    .title {
        margin: {
            top: 1rem;
            bottom: 1rem;
        };
        font-size: 1.2em;
        @media (min-width: 640px) {
            margin: {
                top: 25px;
                bottom: 25px;
            };
        }

        color: white;
        font-weight: normal;
        font-size: 1.4rem;
        line-height: normal;
    }
}

.header__close-btn {
    border: 0;
    padding: 0;
    background: transparent;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1140;
    pointer-events: all;
    cursor: pointer;
    outline: none;
    right: 10px;

    &:focus {
        outline: none;
    }

    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    svg {
        overflow: visible;
    }
}

.favorite-story-list {
    padding: 50px;
    width: 100%;
}
```
## Grid view 

The `<FavoriteStoryList>` also supports the [Grid View](./feeds.md#grid-view) display mode, as it is a variant implementation of the basic `<StoryList>`.
See the example below.

```tsx
import { FavoriteStoryList, IASContainer, storyManager } from "@inappstory/react-sdk"

export const App = () => {
   return (
      <IASContainer config={{ apiKey: "{projectToken}" }}>
            <FavoriteStoryList feedSlug="default" options={{
                direction: "vertical",
                layout: { height: 300 /* Height of story list */ }
            }} />
      </IASContainer>
}
```