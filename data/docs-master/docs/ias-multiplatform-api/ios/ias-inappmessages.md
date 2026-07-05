# InAppMessagesAPI

Class is used to load and show InAppMessages. Can be called from InAppStoryAPI:

```Swift
let inappmessagesAPI = InAppStoryAPI.shared.inappmessagesAPI
```

For more information see [InAppMessages](/sdk-guides/ios/in-app-messaging.md)

## Methods

Method is used to preload all available InAppMessages:

```Swift
func preloadInAppMessages(complete: @escaping (Result<Bool, Error>) -> Void)
```

The method is used to preload all available InAppMessages, as well as to force loading of messages with specified ids:

```Swift
func preloadInAppMessagesBy(
	ids: Array<String>?, 
	complete: @escaping (Result<Bool, Error>) -> Void
)
```

Method to show messages by id. Enabled onlyPreloaded parameter prevents to show messages that have not been preloaded.

```Swift
func showInAppMessageWith(
	id: String, 
	onlyPreloaded: Bool = false, 
	completion: ((_ show: Bool) -> Void)? = nil
)
```

Method to show messages by events. Enabled onlyPreloaded parameter prevents to show messages that have not been preloaded.

```Swift
func showInAppMessageWith(
	event: String, 
	onlyPreloaded: Bool = false, 
	completion: ((_ show: Bool) -> Void)? = nil
)
```