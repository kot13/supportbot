# Available targeting methods

InAppStory provides two ways of story targeting - [tags](#targeting-with-tags) and [segments](#targeting-with-segments).
Both of these methods have their advantages in different cases.

**Tags** are a great way to target specific users based on their _characteristics_. By assigning tags to different stories, you can ensure that the right content is shown to the right audience. For example, if you have a story about a new product launch, you can assign tags such as _"interested in technology"_ to target users who are likely to be interested in the product.

**Segments**, on the other hand, allow you to target users based on their interactions with the stories or target already configured user groups. This method is particularly useful when you want to target a specific group of users who have shown a certain level of engagement or behavior. Using segments, you can easily categorize users into different groups such as _"active users"_ or _"premium users"_, for example.

While segments provide more granular targeting, tags offer a broader approach that can be effective when you want to reach a wider audience.
Depending on your specific marketing goals and campaign objectives, you can choose to leverage tags or segments, or a combination of both, to maximize the impact of your stories.

## Targeting with tags

Tags are used to target groups based on any attribute tracked in the app. They are suitable for targeting based on demographic characteristics, interests, geolocation, etc.

To start working with tags, you need to determine how the app will collect the necessary tags that correspond to the user and store them in an array of strings.

> **Example set of tags:** ["Glasgow", "Authorized", "LeftReview"]

If recieved values match with tag names in the console the SDK will recognize them as tags, and will display stories associated with the tag.

### Step-by-step

1. Create the tag in the console. Go to **Project Settings -> Tags -> Create a tag**.
2. Assign the tag to a story in Story **Settings -> Targeting** in the **"Tags and segments"** field.
3. The app should pass an array of tags associated with the user in the SDK.

### Implementation

Follow these guides to learn how to pass tags in the SDK:

1. [Android](/sdk-guides/android/tags);
2. [iOS](/sdk-guides/ios/tags);
3. [JS](/sdk-guides/js-sdk/tags);
4. [React](/sdk-guides/react-sdk/tags)
5. [React-Native](/sdk-guides/react-native/tags);
6. [Flutter](/sdk-guides/flutter/in-app-story-manager): use the `setTags(List<String> tags)` method.

## Targeting with segments

Segments are used for targeting pre-defined groups of users (in the format of a .csv file consisting of a set of IDs) and targeting based on user interactions with stories (views, likes/dislikes, etc.).

Segments do not require any additional modifications. You just need to create a segment in "**Tools -> Segments -> Create**", configure the conditions, and assign the segment to stories similar to tags.

For more details on creating segments, refer to this link: [Segments Constructor](https://console.domain-placeholder/docs/segments-constructor)
