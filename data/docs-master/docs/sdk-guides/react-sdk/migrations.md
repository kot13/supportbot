# Migrations
## Migration guide to 1.8.0-rc.2
Removed `clickOnButton` event. Use [`w-link`](./link-handling.md#2-handling-via-w-link-widgetevent) widget event

## Migration guide to 1.6.0
Previously, Video on Demand (VoD) was bundled with `@inappstory/react-sdk`. Now, it’s decoupled into a separate plugin (`@inappstory/react-sdk/plugins/videoOnDemand`) for better flexibility and bundle optimization.  

### Changes Overview  
| **Before (Legacy)**                       | **After (Plugin)**                                    |
| ----------------------------------------- | ----------------------------------------------------- |
| VoD automatically included in `react-sdk` | VoD must be explicitly imported and initialized       |
| No control over bundle size               | Reduced core bundle size (VoD loads only when needed) |

### Step-by-Step Migration

1. Install Updated Dependencies
Ensure you’re using the latest versions:
`npm install @inappstory/react-sdk@latest`
2. Add the VoD Plugin
Import and initialize the plugin in your app’s entry file (e.g., `App.tsx`):

```tsx
import { StoryManager } from "@inappstory/react-sdk";
import IasVideoOnDemandPlugin from "@inappstory/react-sdk/plugins/videoOnDemand";

// Initialize the plugin
StoryManager.use(IasVideoOnDemandPlugin);
```

3. Verify Behavior
- ✅ **Progressive loading**: Confirm videos start playing before full download completes  
- 🐢 **Slow network testing**: Use Chrome DevTools throttling (e.g. "Slow 3G") to simulate weak connections  
- ⚠️ **Error checking**: Verify no console warnings about missing VoD dependencies appear  


## Migration guide react-sdk to 0.4.3
The values `left` and `right` ​​of properties `closeButtonPosition`, `sliderAlign`,  `textAlign` are replaced with RTL compatible `start` and `end` respectively.

## Migration guide from react-sdk 0.2.x to 0.3.x 

react-sdk 0.3.x no longer uses `<AppearanceManager>` and `<StoryManager>` instances. 
Instead, you just need to pass the config and the necessary options to `<IASContainer>` and `<StoryList>`

1. Upgrade to the latest reactr-sdk:

   ```bash
   npm install "@inappstory/react-sdk@^0.3.0"
   ```

2. Pass option objects directly to `<IASContainer>` and `<StoryList>` instead of `<AppearanceManager>` methods

      🚫
      ```ts
      new AppearanceManager()
               .setCommonOptions(commonOptions)
               .setStoriesListOptions(storiesListOptions)
               .setStoryReaderOptions(storyReaderOptions)
      ```

      ✅
      ```tsx
      <IASContainer config={...} commonOptions={commonOptions} storyReaderOptions={storyReaderOptions}>
         <StoryList options={storiesListOptions}>
      </IASContainer>
      ```

3. Instead of creating an instance of the `<StoryManager>`, you must export this instance directly from the package `@inappstory/react-sdk`

      🚫
      ```ts
      const storymanager = new StoryManager();
      ```

      ✅
      ```ts
      import { storyManager } from "@inappstory/react-sdk";
      ```
4. To pass the config, use the `<IASContainer>` component instead of `<StoryManager>`
      ✅
      ```tsx
       <IASContainer config={{ apiKey: "{projectToken}" }} />
      ```
