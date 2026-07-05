# Reactions (Likes/Dislikes, Favorites)

InAppStory provides a way for your customers to leave reactions on stories, including _Likes/Dislikes_ and _Favorites_.
The process of implementation is the same for both options, so you can enable them at the same time.

Preparing these features to work takes a few steps. Follow them in the specified order.

## Enabling in the console

First and foremost, enable _Like/Dislike_ and _Favorite_ functionality in the [project settings](https://console.domain-placeholder).

<img src="/images/enable-reactions.png" alt="enable-reactions"/>

:::tip
You can enable both of them at once or just the option you need. Make sure to include the options you checked in the next step.
:::

## Enabling in the code

This step requires attention from the developers.
You need to enable said features in the code of your application.
Follow these guides on implementing for your platform:

**Android**

- [Likes/Dislikes](/sdk-guides/android/favorites#likesdislikes)
- [Favorites](/sdk-guides/android/favorites#favorites)

**iOS**

- [Likes/Dislikes](/sdk-guides/ios/favorites#like)
- [Favorites](/sdk-guides/ios/favorites#favorites)

**JS**

- [Enabling Likes/Dislikes, Favorites](/sdk-guides/js-sdk/story-view#options-1)

**React**

- [Enabling Likes/Dislikes, Favorites](/sdk-guides/react-sdk/story-view#options-1)

**Flutter**

- [Enabling Likes/Dislikes, Favorites](/sdk-guides/flutter/appearance-manager#reader-buttons)

**React Native**

- [Enabling Likes/Dislikes, Favorites](/sdk-guides/react-native/appearance#likes-share-favorites)

After enabling these options in the code you should see the same icons that you see in the console preview in your app:

<img src="/images/reactions-look.png" alt="reactions look"/>

## Customizing favorite cell (optional)

After enablig _Favorite_ functionality you should try adding a few stories to favorites. To do this, click on a favorite icon in the story reader so it becomes active.
Now you should see the favorite cell in the end of the feed.

<img src="/images/favorite-cell.png" alt="favorite-cell"/>

You can customize it too.
Look in these guides:

- [**Android**](/sdk-guides/android/appearance#favorite-cell-customization)

- [**iOS**](/sdk-guides/ios/appearance#customfavoritecellswift)

- [**JS**](/sdk-guides/js-sdk/favorites)

- [**React**](/sdk-guides/react-sdk/favorites)

- [**Flutter**](/sdk-guides/flutter/favorites)

## Singular tuning (optional)

You can turn off/on reactions for each individual story to allow only a part of these features to be used.

<img src="/images/enable-singularly.png" alt="enable-singularly"/>

:::warning
Reactions **must** be turned on in the [project settings](https://console.domain-placeholder) for this functionality to work.
:::
