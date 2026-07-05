# LRU cache

The `cache` parameter has been added to the SDK configuration and is designed to control the **LRU cache for media resources** (images, videos and other binary data).  
This cache is used when the standard HTTP cache is unavailable (e.g., in limited WebView environments) and enables **prefetching** and **faster access** to stored resources.

---

## What is LRU cache?

`LRU` (Least Recently Used) is a cache management algorithm that removes the least recently accessed items when the cache reaches its maximum size.
This ensures that the most frequently or recently used resources remain available for fast retrieval, while older or rarely used ones are automatically evicted to free up space.

In this SDK, the LRU cache mechanism ensures optimal use of local storage (memory or IndexedDB) for storing media resources, improving performance and reducing network requests.

---

## Properties

| Field             | Type                        | Default        | Description                                                                                                                                      |
| ----------------- | --------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`type`**        | `"memory"` \| `"indexeddb"` | `"indexeddb"`  | Type of cache storage. <br/>• `memory` — in-memory caching (fast but temporary). <br/>• `indexeddb` — persistent BLOB-based cache using IndexedDB. |
| **`maxSize`**     | `number`                    | `20`           | Maximum cache size (in bytes or number of elements, depending on implementation).                                                                |
| **`ttl`**         | `number`                    | `0` (infinite) | Resource lifetime in the cache (in seconds). After expiration, resources may be refreshed or overwritten.                                        |
| **`debug`**       | `boolean`                   | `false`        | Enables cache operation logging (useful for debugging).                                                                                          |
| **`concurrency`** | `number`                    | `5`            | Maximum number of parallel requests for loading or caching.                                                                                      |
| **`prefetch`**    | `boolean`                   | `true`        | Indicates whether resources should be prefetched (e.g., before stories are displayed).                                                           |

---

## How It Works

- The cache is implemented using **BLOB objects**.  
- **IndexedDB** is used for persistent storage (when `type: "indexeddb"` is selected).  
- If IndexedDB is unavailable or `type: "memory"` is used, data is stored in process memory.  
- When `prefetch` is enabled, the SDK automatically preloads media resources to minimize latency during story display.

---

## Example

```ts
 import { IASContainer } from "@inappstory/js-sdk";

 const inAppStoryManager = new window.IAS.InAppStoryManager({
    apiKey: "{projectToken}",
    cache: {
      type: "indexeddb",
      maxSize: 100,
      ttl: 3600, // 1 hour
      debug: true,
      concurrency: 5,
      prefetch: true,
    },
  };)
```

---

## Recommendations

- Use `indexeddb` for persistent storage and offline access.  
- Set `ttl` if periodic cache updates are needed.  
- Enable `debug` only in development mode (may affect performance).  
- Tune `concurrency` to optimize performance under heavy load.  
- Enable `prefetch` to improve UX on slow networks.

---

## Purpose

This caching mechanism provides:
- Reliable SDK operation in environments without standard HTTP caching.  
- Faster content display through local resource storage.  
- Offline access to media assets.  
- Reduced network load on repeated requests.
