# Placeholders

Placeholders allow you to dynamically substitute text and image values inside stories.  
This is useful when the content should depend on user data, settings, or external parameters.

---

## Text placeholders

With `placeholders` you can replace text markers inside stories.  
Each placeholder is a `key → value` pair.

```ts
placeholders?: Record<string, string>;
```

**Example:**

```ts
const inAppStoryManagerConfig = {
    apiKey: "{projectToken}",
    placeholders: {
      "user-name": "Alex",
      "city": "New York"
    }
}
```

Inside the story, the markers `user-name` and `city` will be replaced with the provided values.

---

## Image placeholders

If the story contains placeholders for images, you can substitute them via `imagePlaceholders`.

```ts
imagePlaceholders?: Record<string, string>;
```

**Example:**

```ts
const inAppStoryManagerConfig = {
    apiKey: "{projectToken}",
    imagePlaceholders: {
      "profile-photo": "https://example.com/images/user123.png",
      "promo-banner": "https://example.com/images/sale.png"
    }
  }
```

Now your images will be used in place of the placeholders in the story.

---

## Updating placeholders

In addition to setting placeholders during initialization,  
you can update them dynamically using the SDK API.  

### Update text placeholders

```ts
inAppStoryManager.setPlaceholders({
  "user-name": "Alex",
  "city": "New York",
});
```

### Update image placeholders

```ts
inAppStoryManager.setImagePlaceholders({
  "profile-photo": "https://example.com/images/user456.png",
  "promo-banner": "https://example.com/images/new-sale.png"
});
```

---

## Example

```ts
import { AppearanceManager, InAppStoryManager } from "@inappstory/js-sdk";

const inAppStoryManagerConfig = {
  apiKey: "{project-integration-key}",
  placeholders: {
    "user-name": "Alex",
    "city": "New York",
    "bonus-points": "150"
  },
  imagePlaceholders: {
    "profile-photo": "https://example.com/images/user123.png",
    "promo-banner": "https://example.com/images/sale.png"
  }
};

const inAppStoryManager = new InAppStoryManager(inAppStoryManagerConfig);
const appearanceManager = new AppearanceManager();

```