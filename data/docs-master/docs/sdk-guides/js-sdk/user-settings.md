# User settings

## Overview
This document provides guidelines on setting and managing the user identifier (`userId`) in the InAppStory JS SDK. It also explains how to log out a user and handle identifier length constraints.

### Example:
```ts
import { AppearanceManager, InAppStoryManager } from "@inappstory/js-sdk";

const inAppStoryManagerConfig = {
  apiKey: "{project-integration-key}",
  userId: "{user-identifier}",
};

const inAppStoryManager = new InAppStoryManager(inAppStoryManagerConfig);
const appearanceManager = new AppearanceManager();
const storiesList = new inAppStoryManager.StoriesList(
  "#stories_widget",
  appearanceManager,
  {
    feed: "default",
  }
);
```

## Setting User Identifier
You can dynamically update the user identifier by calling `setUserId()`.

### Example:
```javascript
inAppStoryManager.setUserId("new-user-id");
```

## Logging Out
To log out a user, you can set an empty string as the `userId` or use the `userLogout()` method.

### Example:
```javascript
// Logout using setUserId
inAppStoryManager.setUserId("");

// Logout using userLogout (syntactic sugar)
inAppStoryManager.userLogout();
```

## User Identifier Length Constraint
The maximum allowed length for `userId` is **255 bytes**. If the identifier exceeds this limit, it cause errors.

### Recommendations:
- Ensure that `userId` does not exceed **255 bytes**.
- Use a concise and unique identifier (e.g., UUID, hashed email, or user ID from your authentication system).

## Device ID and Exception Handling
If the configuration includes the parameter `disableDeviceId: true` and `userId` is not provided, an exception will be thrown.

### Example:
```javascript
const inAppStoryManagerConfig = {
  apiKey: "{project-integration-key}",
  disableDeviceId: true,
};

const inAppStoryManager = new InAppStoryManager(inAppStoryManagerConfig); // This will throw an exception
```

## User Identifier Signature (HMAC Authentication)
The `userIdSign` parameter is used to provide an HMAC signature for verifying the authenticity of the user.

### Example:
```javascript
const inAppStoryManagerConfig = {
  apiKey: "{project-integration-key}",
  userId: "{user-identifier}",
  userIdSign: "{hmac-signature}",
};

const inAppStoryManager = new InAppStoryManager(inAppStoryManagerConfig);
```

This ensures that the provided `userId` is authenticated and has not been tampered with.

---

By following these guidelines, you can effectively manage user identification within the InAppStory SDK and ensure smooth user session handling.