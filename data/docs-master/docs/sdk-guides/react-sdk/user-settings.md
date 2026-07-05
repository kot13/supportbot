# User settings

## Overview
This document provides guidelines on setting and managing the user identifier (`userId`) in the InAppStory React SDK. It also explains how to log out a user and handle identifier length constraints.

### Example:
```javascript
import { StoryList, StoryManagerConfig, IASContainer } from "@inappstory/react-sdk";
import { useEffect, useState } from "react";

export const App = () => {
    const [userId, setUserId] = useState();

    const signin = () => {
        setTimeout(() => {
            setUserId("new_user_id");
        }, 1000);
    };

    useEffect(() => {
        signin();
    }, []);

    const storyManagerConfig: StoryManagerConfig = {
        apiKey: "{projectToken}",
        userId,
    };

    return (
        <IASContainer config={storyManagerConfig}>
            <StoryList feedSlug="default" />
        </IASContainer>
    );
};
```

## Setting User Identifier
You can dynamically update the user identifier by modifying the `userId` state.

### Example:
```javascript
setUserId("new-user-id");
```

## Logging Out
To log out a user, set an empty string as the `userId`.

### Example:
```javascript
setUserId("");
```

## User Identifier Length Constraint
The maximum allowed length for `userId` is **255 bytes**. If the identifier exceeds this limit, it may cause unexpected behavior or errors.

### Recommendations:
- Ensure that `userId` does not exceed **255 bytes**.
- Use a concise and unique identifier (e.g., UUID, hashed email, or user ID from your authentication system).

## Device ID and Exception Handling
If the configuration includes the parameter `disableDeviceId: true` and `userId` is not provided, an exception will be thrown.

### Example:
```javascript
const storyManagerConfig: StoryManagerConfig = {
    apiKey: "{projectToken}",
    disableDeviceId: true,
};

// This will throw an exception when passed to IASContainer
```

## User Identifier Signature (HMAC Authentication)
The `userIdSign` parameter is used to provide an HMAC signature for verifying the authenticity of the user.

### Example:
```javascript
const storyManagerConfig: StoryManagerConfig = {
    apiKey: "{projectToken}",
    userId: "{user-identifier}",
    userIdSign: "{hmac-signature}",
};
```

This ensures that the provided `userId` is authenticated and has not been tampered with.

---

By following these guidelines, you can effectively manage user identification within the InAppStory SDK and ensure smooth user session handling.