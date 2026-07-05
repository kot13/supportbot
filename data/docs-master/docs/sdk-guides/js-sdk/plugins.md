# Plugins Integration and Usage

## Overview of the Plugin System
The plugin system in the `@inappstory/js-sdk` library allows you to add and use additional features for managing stories. The plugin integration process is straightforward, enabling you to quickly extend the functionality of your application.

## Plugin Integration

To integrate a plugin, follow these steps:

1. Import the plugin from the `@inappstory/js-sdk/plugins` module.
2. Use the `InAppStoryManager.use()` method to register the plugin.

**Example:**
```ts
import { InAppStoryManager } from "@inappstory/js-sdk"
import AnyPlugin from "@inappstory/js-sdk/plugins/anyPlugin";

InAppStoryManager.use(AnyPlugin, options);
```

## DotLottie Plugin

The `DotLottie` plugin is currently the only available built-in plugin in the `@inappstory/js-sdk`. It introduces support for `.lottie` animations using the `@lottiefiles/dotlottie-web` package. This plugin is ideal for those who require `.lottie` functionality and offers a smaller core bundle size for applications that don't need this feature.

### Key Features
- **Reduced Bundle Size:** By using `DotLottie`, the core SDK size can be minimized for applications that do not need `.lottie` functionality in `GameReader`.

### Integrating DotLottie

To use the `DotLottie` plugin, you need to specify the WebAssembly (WASM) file URL required by the `@lottiefiles/dotlottie-web` package. By default, it uses the following URL:  
`https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.38.2/dist/dotlottie-player.wasm`.

```ts
import { InAppStoryManager } from "@inappstory/js-sdk"
import IasDotLottiePlugin from "@inappstory/js-sdk/plugins/dotLottie";

InAppStoryManager.use(IasDotLottiePlugin, {
  wasmUrl: "https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@0.38.2/dist/dotlottie-player.wasm"
});
```

## Video on Demand Plugin  

The **Video on Demand (VoD)** plugin adds support for streaming large video files in `@inappstory/js-sdk`. It solves the problem of slow loading times for large videos, especially on weak connections, by enabling progressive playback (similar to streaming services).  

### Key Features  
- **Optimized Video Loading:** Videos start playing before fully loading, reducing wait time for users.  
- **Large File Support:** Ideal for high-quality videos and long recordings.  
- **Bandwidth Efficiency:** Users only download the portion of the video they watch.  

### Usage  

To enable the VoD plugin, add it to `InAppStoryManager`:  

```ts
import { InAppStoryManager } from "@inappstory/js-sdk";
import IasVideoOnDemandPlugin from "@inappstory/js-sdk/plugins/videoOnDemand";

InAppStoryManager.use(IasVideoOnDemandPlugin);