# Story Sharing

Story sharing allows users of your app to share a link to a story on social media and other external platforms.

## Configuring the Share Page

First, developers need to **create a separate page on the website** where they will integrate and configure one of InAppStory’s web-based SDKs.

You can use either the JavaScript or React SDK, depending on your preference:

- [JS](../../sdk-guides/js-sdk/how-to-get-started.md)
- [React](../../sdk-guides/react-sdk/how-to-get-started.md)

Each time a user clicks a story share link, they will be redirected to this page. Once the page receives a storyID, it must display the web version of the story in the reader by calling showStory(storyID), an SDK method that opens a story by its ID.

- [JS](../../sdk-guides/js-sdk/single-story.md)
- [React](../../sdk-guides/react-sdk/single-story.md)

## Admin panel setup

1. Assign an address to this page so users can view the story there:
   > Example adress: `https://example.com/story/*`.

2. In the project settings in the Admin panel, the Manager must activate the **sharing functionality** by enabling the **Allow share** switch and specifying the address of the newly created page, for example:
`https://example.com/story/{story}`, where `{story}` is the story ID.

![](/images/SharingActivation.png)

## Icon activation

Developers must then enable the sharing functionality in the code:

- [Android](../../sdk-guides/android/favorites.md#share)
- [iOS](../../sdk-guides/ios/favorites.md#share), include in [panelSettings](../../sdk-guides/ios/favorites.md#panelsettings)
- [JS](../../sdk-guides/js-sdk/share-panel.md)
- [React](../../sdk-guides/react-sdk/story-view.md#action-bar)
- [React Native](../../sdk-guides/react-native/appearance.md#likes-share-favorites)
- [Flutter](../../sdk-guides/flutter/appearance-manager.md#reader-buttons)


After completing all the steps above, the <img src="/images/SharingIcon.png"/> icon will appear in the lower story panel. Users who open a story and click this button will be able to share it on social media or copy the story link: `https://example.com/story/{story}`.