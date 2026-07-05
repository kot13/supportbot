# How to change widget design

Once you finish the process of basic integration, you will need to customize the Stories to better fit your brand. <br/>
There are many ways of customizing InAppStory widget appearance and some of the possibilities are mentioned in this article.

For a visual overview of design capacities in stories check out our [UIKit](<https://www.figma.com/design/CYa0LDjTiHNXaaV8edozEu/%5BINAPPSORY%5D-UI-Kit-(ver-1.0.0)?t=82vY2Q8by59wWjXK-0>) for designers.

## List customization

### Skeleton animation (List Placeholder)

InAppStory provides a way to create a custom loading animation for the story list.

Guides on how to do that:

- [Android](../../sdk-guides/android/list-placeholder.md)
- [iOS](../../sdk-guides/ios/list-placeholder.md)
- [JavaScript](../../sdk-guides/js-sdk/feeds.md#custom-loader)

## Cell customization

### Default approach

Default story cells allow you to change some of their characteristics without implementing custom cells.
You can change properties such as:

- Shape (requires [custom cells](#custom-approach) in Android and iOS SDKs)
- Cell height
- Title
- Font
- Border color
- Cover
- Gradient

More cell appearance parameters are listed here: [Android](../../sdk-guides/android/appearance.md#storieslist-customization), [iOS](../../sdk-guides/ios/appearance.md#list-customization), [JavaScript](../../sdk-guides/js-sdk/feeds.md#preview-card), [React Native](../../sdk-guides/react-native/appearance.md#custom-story-cell)

### Custom approach

If you cannot achieve your cell design goals with default cells, you should create your own custom story cells with your own implementation. <br/> Here are the implementation guides and tips:

- [Android](../../sdk-guides/android/appearance.md#fully-custom-cells)
- [iOS](../../sdk-guides/ios/appearance.md#fully-custom-cells)
- [JavaScript](../../sdk-guides/js-sdk/feeds.md#preview-card)
- [React Native](../../sdk-guides/react-native/appearance.md#custom-story-cell)

## Story covers

### Static covers

Cover images are formed in 2 sizes by default - 220x220 and 440x440.
If you want to use the large size you need to set high quality cover in Appearance settings.

- [Android](../../sdk-guides/android/appearance.md#instance-appearance-parameters): set `csCoverQuality` value to `2`;
- [iOS](../../sdk-guides/ios/appearance.md#list-customization): set `coverQuality` to .high

### Video cover

It is possible to add a video cover in a story. To learn how to do that, follow [this guide](https://console.domain-placeholder/docs/stories-creation) in the point 7 - "Setting a cover", but instead of pressing on "Cover image" you will have to press on "Cover video". Before uploading make sure that the video meets the conditions listed in [this article](https://console.domain-placeholder/docs/size-limitations).

If you are encountering issues with the cover display, check whether your video satisfies the mentioned constraints: if it doesn't - format your video to the correct format, or if it does - contact our tech-support and send the problematic video to the specialist with the mention of the SDK version that you have in use.

#### Android

Android SDK allows to use video covers by default.

If you decided to implement [fully custom cells](/sdk-guides/android/appearance#fully-custom-cells) - method [setVideo](/sdk-guides/android/appearance#istorieslistitem) is responsible for handling video covers. Debug it to find the problem, and if you are meeting difficulties - contact our tech-support and attach the piece of code with the [IStoriesListItem](/sdk-guides/android/appearance#istorieslistitem) implementation specifically with the mention method implemented.

#### iOS

iOS SDK allows to use video covers by default.

If you use [custom cell implementation](#custom-approach) make sure that the `StoryCellProtocol` is implemented. You can learn more about parameters and properties of this protocol [**here**](/sdk-guides/ios/reference#storycellprotocol).

`setVideoURL` is responsible for handling the video cover.

#### Web & React Native

JS, React and React Native SDKs support the work of video covers by default.

## Reader customization

You can control a few parameters in the story reader, such as:

- Like/dislike, share, favorite and close button images
- Close button position
- Loader
- Gradient behind the story
- Scroll style

Usage of these and more parameters are listed there:

- [Android](../../sdk-guides/android/appearance.md#storiesreader-customization)
- [iOS](../../sdk-guides/ios/appearance.md#reader-customization)
- [JavaScript](../../sdk-guides/js-sdk/story-view.md#options)
- [React](../../sdk-guides/react-sdk/story-view.md#options)
- [React Native](../../sdk-guides/react-native/appearance.md#story-reader-appearance)
