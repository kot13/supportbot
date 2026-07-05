# User settings

## Change user id

After creating and initializing the `StoriesList`, it may be necessary to replace the user in the
application.
For example - during registration or re-authorization.

To get this - you can use the `storyManager.setUserId` method.

```ts
const changeUserID = (userId: string | number) => {
    storyManager.setUserId(userId);
};
```
:::warning[Please note]
Do not use personal data (phones, emails, passport data) as a user identifier.
userID must be a string not longer than 255 bytes.
:::

All loaded `StoriesList` instances will be reloaded automatic and will show content for new user.

## User Identifier Signature (HMAC Authentication)

The `userIdSign` parameter is used to provide an HMAC signature for verifying the authenticity of the user.
This ensures that the provided `userId` is authenticated and has not been tampered with.

If the project needs to sign a user (console security setting), then the parameter `userIdSign` needs
to be passed with `userId` (works only from 0.23.0):

```ts
const storyManagerConfig: StoryManagerConfig = {
    apiKey,
    userId: '1',
    userIdSign: 'signForId_1'
};
const storyManager = new StoryManager(storyManagerConfig);
```

```ts
const changeUserID = (userId: string | number, userIdSign?: string) => {
    storyManager.setUserId(userId, userIdSign);
};
```

If only userSign was changed (in case if you pass same userId as current) `StoriesList` instances
still will be reloaded

## User logout

```ts
const userLogout = () => {
    storyManager.setUserId('');
};
```