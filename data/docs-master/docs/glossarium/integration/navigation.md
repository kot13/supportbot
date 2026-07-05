# Navigation from stories

Stories allow link transitions, be it outside resources or inside the app.

The workflow goes like this:

1. A user presses on a button/swipe-up/image with a link in story;
2. The SDK sends the link embedded in the pressed control into the app;
3. App redirects a user according to the link.

By default, SDK will try to open links in the format that they were embedded into an element.

To modify this behaviour (for example, if you want to modify a link based on whether user has your application installed on their device) you will need to **override default link handling behaviour**.

### Android

Callback `callToAction` is responsible for link handling in the Android SDK.
If the callback wasn't overriden, the SDK will try to open a link in the new browser window.
To override this behaviour refer to [this guide](/sdk-guides/android/link-handling).
You will need to explicitly define what operations must be done on a link and how do you want to open it.

You can also keep the default behaviour and extend it. Follow [this guide](/sdk-guides/android/link-handling#extend-default-behaviour) to learn how to do this.

### iOS

Refer to the [link processing guide](/sdk-guides/ios/link-handling).

### Web

In order to configure link handling in the JS SDK, you need to override the [storyLinkClickHandler](https://docs.inappstory.com/sdk-guides/js-sdk/link-handling.md#link-handling).
