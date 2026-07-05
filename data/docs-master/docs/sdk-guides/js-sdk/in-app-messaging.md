# In-App-Messaging (IAM)

Starting from JS SDK `3.2.0-rc.0` `IAM` was added to the InAppStory SDK.

This documentation provides a detailed guide on how to use the InAppMessaging (IAM) module, which allows you to manage in-app messages (such as banners, notifications, etc.) in your application. The module provides methods for preloading messages, displaying them, and handling related events.

## Usage Examples

### Example 1: Displaying a Message by ID

```ts
try {
    const messageId = "{your-message-id}";
    const inAppMessaging = inAppStoryManager.inAppMessaging;

    // Subscribe to the "close" event
    inAppMessaging.on("close", () => {
        console.log("Message closed");
    });

    // Subscribe to the "widgetEvent" event
    inAppMessaging.on("widgetEvent", payload => {
        console.log("Widget event:", payload);
    });

    // Display the message by ID
    const message = await inAppMessaging.showMessageById(messageId);
    console.log("Message displayed:", message);
} catch (error) {
    console.error("Error displaying message:", error);
}
```
### Example 2: Displaying a Message by event

```ts
try {
    const messageEvent = `{your-message-event}`
    const inAppMessaging = inAppStoryManager.inAppMessaging;
    // Display the message by event name
    const message = await inAppMessaging.showMessageByEvent(messageEvent);
    console.log("Message displayed:", message);
} catch (error) {
    console.error("Error displaying message:", error);
}
```
### Example 3: Handling a Button Click

```ts
try {
    const messageId = "{your-message-id}";
    const inAppMessaging = inAppStoryManager.inAppMessaging;
    // Subscribe to the "clickOnButton" event
    inAppMessaging.on("clickOnButton", ({ id, index, url, elementId }) => {
        console.log("Button clicked:", { id, index, url, elementId });
        // Additional actions, such as navigating to the URL
    });
    // Display the message by ID
    const message = await inAppMessaging.showMessageById(messageId);
    console.log("Message displayed:", message);
} catch (error) {
    console.error("Error displaying message:", error);
}
```

### Example 4: Abort show message operation

```ts
try {
    const messageId = "{your-message-id}";
    const inAppMessaging = inAppStoryManager.inAppMessaging;
    const controller = new AbortController();
    const signal = controller.signal;

    // Abort IAM loading
    setTimeout(() => {
      controller.abort();
    })

    // Display the message by ID
    const message = await inAppMessaging.showMessageById(messageId, { signal });
    console.log("Message displayed:", message);
} catch (error) {
    console.error("Error displaying message:", error);
}
```

## Message Display Conditions

### `showMessageById`

To successfully execute `showMessageById`, the following conditions must be met:

- **All other readers must be closed**  
  Ensure that other readers, such as `StoryReader` and `GameReader`, are not active.

- **Preloading is required (if applicable)**  
  If `showOnlyIfLoaded === true`, the message must be preloaded using `preload()`.

- **Display limit is not exceeded**  
  If a display limit is set, the message must not surpass the allowed number of displays.

- **Only one open message**  
  Only one IAM can be shown at a time
---

### `showMessageByEvent`

To successfully execute `showMessageByEvent`, the following conditions must be met:

- **Preloading is required (if applicable)**  
  If `showOnlyIfLoaded === true`, the message must be preloaded using `preload()`.

- **Frequency limit is not exceeded**  
  The message cannot be shown more frequently than the defined `FrequencyLimit`.

- **Within allowed display time range**  
  The current time must fall within the permitted display period.

- **Only one open message**  
  Only one IAM can be shown at a time

## Possible Errors

During the execution of `showMessageById` and `showMessageByEvent`, the following errors may occur:

### Errors Specific to `showMessageById`
- **`IamNotFoundByIdError`**  
  Occurs if no message is found for the specified ID.

### Errors Specific to `showMessageByEvent`
- **`IamFrequencyLimitError`**  
  Occurs if the frequency limit is exceeded.

- **`IamCheckDisplayTimeRangeError`**  
  Occurs if the opening time is outside the allowed range.

- **`IamNotFoundByEventError`**  
  Occurs if no message is found for the specified event.

### Common Errors (Applicable to Both Methods)
- **`IamOtherReaderIsOpenError`**  
  Occurs if other readers (e.g., `StoryReader`, `GameReader`) are not closed.
  
- **`IamShowOnlyIfLoadedError`**  
  Occurs if preloading is not performed when `showOnlyIfLoaded == true`.

- **`IamMessageLimitExceededError`**  
  Occurs if the display limit for the message is exceeded.

- **`IamNotFoundLimitError`**  
  Occurs if no matching limit is found for the message.

- **`IamMessageOpenError`**  
  Occurs if the message is already open

## Customization
You can customize the IAM display using the `options.appearance` property.

### Stacking context

You can change the z-index property of the IAM reader as shown in the example below. Since v3.8.6

```js
inAppMessaging.showMessageById(messageId, { appearance: { zIndex: 10000 }});
```

### Toast width

You can change the maximum width of the toast. Since v3.12.0

```js
inAppMessaging.showMessageById(messageId, { appearance: { toast: { width: 640 } }});
```

## Events

{/* ### `loaded`

Triggered when messages are successfully loaded.

**Payload:**
```ts
{
    messages: IamMessage[];
}
```

- **`messages`** – An array of loaded messages.
 */}
### `widgetEvent`

Triggered when an event occurs within a widget.

**Payload:**
```ts
{
    message: IamMessage;
    name: string;
    data: Record<string, any>;
}
```

- **`message`** – The related message.
- **`name`** – The name of the event.
- **`data`** – Additional event data.

### `close`

Triggered when a message is closed.

**Payload:**
```ts
{
    message: IamMessage;
}
```

- **`message`** – The message that was closed.

### `clickOnButton`

Triggered when a user clicks on a button within a message.

**Payload:**
```ts
{
    id: number;
    index: number;
    url: string;
    elementId: string;
}
```

- **`id`** – The unique identifier of the button.
- **`index`** – The index of the button within the message.
- **`url`** – The URL associated with the button (if applicable).
- **`elementId`** – The ID of the UI element associated with the button.

## Type Declarations

This section contains the types and interfaces used in the In-App Messaging system.

### Enum `IamMessageType`

`IamMessageType` is an enum that describes the message types supported by the system.

```ts
enum IamMessageType {
    BottomSheet = 1,  // BottomSheet message type
    Modal = 2,        // Modal message type
    Fullscreen = 3,    // Fullscreen message type
    Toast = 4 // Toast. Since 3.9.0
}
```

- **`BottomSheet`** – A message type that appears at the bottom of the screen.
- **`Modal`** – A modal window message type.
- **`Fullscreen`** – A message type that occupies the entire screen.

### Interface `IamMessage`

`IamMessage` is an interface that describes the structure of a message.

```ts
interface IamMessage {
    id: number;               // Unique identifier for the message
    campaignName: string;     // The name of the campaign
    type: IamMessageType;     // The type of the message, see `IamMessageType`
}
```
- **`id`**: A unique identifier for the message.
- **`campaignName`**: The name of the campaign associated with the message.
- **`type`**: The type of the message (a value from the [`IamMessageType`](#enum-iammessagetype) enum).

### Interface `InAppMessaging`

`InAppMessaging` is an interface that defines methods for interacting with the in-app messaging system.

```ts
interface InAppMessaging {
    get activeMessage(): IamMessage | null;
    get isLoaded(): boolean;
    get isLoading(): boolean;
    get isOpened(): boolean;

    close(): Promise<void>; // Close IAM message reader
    preload(options?: { tags?: string[] }): Promise<IamMessage[]>;                               // Preloads messages
    showMessageById(messageId: number, options?: { showOnlyIfLoaded?: boolean; signal?: AbortSignal; appearance?: { zIndex?: number, toast?: { width?: number } }}): Promise<IamMessage>; // Shows a message by ID
    showMessageByEvent(eventName: string, options?: { showOnlyIfLoaded?: boolean, tags?: string[]; signal?: AbortSignal; appearance?: { zIndex?: number, toast?: { width?: number } }}): Promise<IamMessage>; // Shows a message by event name
    on(eventName: string, listener: (...args: any[]) => void): this;  // Adds an event listener
    once(eventName: string, listener: (...args: any[]) => void): this; // Adds a one-time event listener
    off(eventName: string, listener: (...args: any[]) => void): this;  // Removes an event listener
}
```
**Properties**

- **`activeMessage`**: Current open IAM
- **`isLoaded`**: Indicating that IAMs are preloaded
- **`isLoading`**: Indicating that IAMs are loading
- **`isOpened`**: Indicating that IAM are opened

**Methods**

- **`preload`**: Preloads the messages and returns a promise with an array of `IamMessage` objects.
- **`showMessageById`**: Displays a message by its unique ID. Optionally, it will only show the message if it has already been loaded.
- **`showMessageByEvent`**: Displays a message triggered by a specific event name. Optionally, it will only show the message if it has already been loaded.
- **`on`**: Adds an event listener for a specific event.
- **`once`**: Adds a one-time event listener for a specific event.
- **`off`**: Removes an event listener for a specific event.
