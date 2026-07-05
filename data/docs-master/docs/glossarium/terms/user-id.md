import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# User ID

User ID is a **unique identifier** of the user in the project, used when application interacts with the InAppStory SDK.
It is used for tracking user interactions with stories, which ones they opened or reacted otherwise to.

## What to do with User IDs

During the initialization of the InAppStory SDK the User ID must be specified in the initialization code.

### Android example

```kotlin
fun createInAppStoryManager(
    apiKey: String,
    context: Context,
    userId: String
): InAppStoryManager {
    return InAppStoryManager.Builder()
        .apiKey(apiKey)
        .context(context)
        .userId(userId) // <-- put userID here
        .create()
}
```

### iOS example

<Tabs>
<TabItem value="uikit" label="UIKit">

```swift
import UIKit
import InAppStorySDK

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        InAppStory.shared.initWith(
            serviceKey: <api-key>,
            settings: Settings(
                userID: <userID>, //put userID here
                tags: <tags array>))
        return true
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

```swift
import SwiftUI
import InAppStorySDK_SwiftUI

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        InAppStory.shared.initWith(
            serviceKey: <api-key>,
            settings: Settings(
                userID: <userID>, //put userID here
                tags: <tags array>))
        return true
    }
}
```

</TabItem>
</Tabs>

### WEB example

```js
const inAppStoryManagerConfig = {
  apiKey: "{project-integration-key}",
  userId: "{user-identifier}", // usually - hash from real user identifier
};
```

> If you decide to enter a ready-made string as userID the SDK will count statistics only for the specified ID.

:::warning
**Do not** use personal data (phones, emails, passport data) as a user identifier. <br/> userID must be a string not longer than 255 bytes.
:::

For more information about setting the userID you can refer to these guides:

- [Android](/sdk-guides/android/user-settings)
- [iOS](/sdk-guides/ios/user-settings)
- [JS](/sdk-guides/js-sdk/user-settings)
- [React](/sdk-guides/react-sdk/user-settings)
- [Flutter](/sdk-guides/flutter/user-settings)

After initializing the SDK in the app, user with the associated identifier will appear in **"Auditory"** section in the [console](https://console.domain-placeholder).

## Device ID

If the SDK is unable to retrieve User ID from the app it will create a unique Device ID for user identification.

This Device ID cannot be used for features of InAppStory like personalization and targeting.

## User signature

User signature is a way of user authentication in InAppStory, and a way to make sure that your userID is legit, and has not been tampered with.

1. Go to the console Settings -> Security;
2. Find the "Sign userID in SDK" toggle and turn it on;
   ![](/images/userSign.png)

:::warning
After you do this - SDK will require a signature to start, and will not initialize otherwise. Every userID passed without a signature will be considered fake, so older versions of your application that don't pass the signature will not be able to use the SDK API.
::: 3. Pick a preferred hashing algorithm; 4. Provide a Secret string in the "Secret" field; 5. Use this Secret and chosen hashing algorithm sign the userID. This operation has to be done on the backend, nobody should have access to the value of the Secret; 6. The value, the signed userID that you get in result has to be passed at SDK initialization along with `userID`, in the `userSign` field (name may vary across platforms).

Developers guide on providing a signature:

- [Android](/sdk-guides/android/user-settings#user-sign)
- [iOS](/sdk-guides/ios/user-settings#sign-user)
- [JS](/sdk-guides/js-sdk/user-settings#user-identifier-signature-hmac-authentication)

Here's an example of possible signature realization on the backend: [https://www.tutorialspoint.com/php/php_function_hash_hmac.htm](https://www.tutorialspoint.com/php/php_function_hash_hmac.htm)
