# Options

Starting from version **1.7.6**, the SDK supports additional configuration options.

## Description

`options` is represented as a `Record<string, string>`, where each key corresponds to an option name and each value represents the option’s value.

At the moment, the SDK includes one predefined option — `pos`.

```ts
/**
 * The field is responsible for passing user-defined or widget-specific variables
 * (for example, the "products" widget).
 */
options?: {
    /**
     * Point of sale identifier
     */
    pos?: string;
} & Record<string, string>;
```

:::warning
**Important:**
For options to work correctly, they must be configured and approved on the backend side.  
Otherwise, setting them will not have any effect.  
:::

## Example

```tsx
<IASContainer
  config={{
    apiKey: "{projectToken}",
    options: {
      pos: "your-pos",
      yourCustomOption: "your-custom-option-value"
    }
  }}
/>
```

It is recommended to set the `options` **after initializing the SDK** and **before opening any reader for the first time**.  
Changing the options while a reader is active will **not** cause the values to update reactively.  

If you need to filter the feed stream output or display onboarding messages (InAppMessages) based on the options, make sure to set them **before launching** these components.

## Updating Options

In scenarios where you need to switch users or re-filter the stories feed using new parameters, update the options and then manually refresh the feed.

```tsx
export const App = () => {
  const [options, setOptions] = useState<Record<string, string>>({});
  const storyListRef = useRef<StoryListRef>(null);

  useEffect(() => {
    // Reload stories after options have changed
    storyListRef.current?.reload();
  }, [options]);

  useEffect(() => {
    setOptions({
      pos: "your-pos",
      yourCustomOption: "your-custom-option-value"
    });
  }, []);

  return (
    <IASContainer
      config={{
        apiKey: "{projectToken}",
        options
      }}
    >
      <StoryList ref={storyListRef} feed="default" />
    </IASContainer>
  );
};
```
