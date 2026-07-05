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

```tsx
<IASContainer
  config={{
    apiKey: "{projectToken}",
    placeholders: {
      "user-name": "Alex",
      "city": "New York"
    }
  }}
/>
```

Inside the story, the markers `user-name` and `city` will be replaced with the provided values.

---

## Image placeholders

If the story contains placeholders for images, you can substitute them via `imagePlaceholders`.

```ts
imagePlaceholders?: Record<string, string>;
```

**Example:**

```tsx
<IASContainer
  config={{
    apiKey: "{projectToken}",
    imagePlaceholders: {
      "profile-photo": "https://example.com/images/user123.png",
      "promo-banner": "https://example.com/images/sale.png"
    }
  }}
/>
```

Now your images will be used in place of the placeholders in the story.

---

## Example

```tsx
import { IASContainer } from "@inappstory/react-sdk";

export const App = () => {
  return (
    <IASContainer
      config={{
        apiKey: "{projectToken}",
        placeholders: {
          "user-name": "Alex",
          "city": "New York",
          "bonus-points": "150"
        },
        imagePlaceholders: {
          "profile-photo": "https://example.com/images/user123.png",
          "promo-banner": "https://example.com/images/sale.png"
        }
      }}
    />
  );
};
```

In this example:  
- In the story, `user-name`, `city`, and `bonus-points` are replaced with user data.  
- Images are replaced with the user’s avatar and a promotional banner.  