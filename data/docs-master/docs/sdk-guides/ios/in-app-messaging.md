---
title: "In-App-Messaging (<1.28.0)"
---

Starting from version 1.25.0, `In-App-Messaging` was added to the SDK.

This documentation provides a detailed guide on how to use the InAppMessaging (IAM) module, which allows you to manage in-app messages (such as banners, notifications, etc.) in your application. The module provides methods for preloading messages, displaying them, and handling related events.

## Showing

### Showing by id

In order to display the message on the screen, you must initialize the SDK ([SDK initialization](how-to-get-started.md#basic-initialization)) and call the `InAppStory.shared.showInAppMessageWith(id: <String>, ...) -> CancellationToken?` method.

```Swift
class IAMController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        // SDK initialization
        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, tags: <tags array>))
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        InAppStory.shared.showInAppMessageWith(id: <messageID>) { show in
            // the show parameter indicates whether the InAppMessage screen has been displayed
        }
    }
}
```

> **Remark**  
> Starting from version 1.27.0, the method returns `CancellationToken?` which allows cancelling the operation. For more details, see [Cancellation of actions](cancellation-of-actions.md).

### Showing by event name

To display a message for a specific event, you must call the `InAppStory.shared.showInAppMessageWith(event: <String>, ...) -> CancellationToken?` method.

```Swift
class IAMController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        // SDK initialization
        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, tags: <tags array>))
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        InAppStory.shared.showInAppMessageWith(event: <eventName>) { show in
            // the show parameter indicates whether the InAppMessage screen has been displayed
        }
    }
}
```

> **Remark**  
> Starting from version 1.27.0, the method returns `CancellationToken?` which allows cancelling the operation. For more details, see [Cancellation of actions](cancellation-of-actions.md).

## Preloading

For faster display of `InAppMessages` on the screen, it is possible to load their data in advance. To do this, call the `InAppStory.shared.preloadInAppMessages()` method in advance and wait for it to execute.

> **Pay attention**
>
> In order for the preload to be successful, the SDK must be initialized beforehand.

##### Data preloading, can be done on SplashScreen

```Swift
class SplashScreenControllr: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, tags: <tags array>))
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        InAppStory.shared.preloadInAppMessages { result in
            switch result {
                case .success:
                // data download was successful
                break
                case .failure:
                // problems occurred during the download
                break
            }
        }
    }
}
```

It is also possible to limit the message display if it is not preloaded. To do this, specify the `onlyPreloaded = true` parameter in the `InAppStory.shared.showInAppMessageWith(...)` method of showing the message. In this case, the `InAppMessage` screen will not be shown and the closure will return `false`.

```Swift
class IAMController: UIViewController {
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        InAppStory.shared.showInAppMessageWith(id: <messageID>, onlyPreloaded: <Bool>) { show in
            // the show parameter indicates whether the InAppMessage screen has been displayed
        }
    }
}
```

### Preload by ids

To preload messages that have already been displayed and when the frequency limit is exhausted or are not in the date range to be displayed, you need to call the preload method with a list of id's to be preloaded. In this case, all available messages will be preloaded, and if there are no messages with the specified id in the list of available messages, they will be added to the list.

```Swift
class SplashScreenControllr: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, tags: <tags array>))
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        InAppStory.shared.preloadInAppMessagesBy(ids: Array<String>?) { result in
            switch result {
                case .success:
                // data download was successful
                break
                case .failure:
                // problems occurred during the download
                break
            }
        }
    }
}
```

## Tags

For InAppMessages, you can use tags for more precise control over the display of messages.

> **Pay attention**
>
> The same limitations are set for the list of tags as for showing stories. [more](tags.md)

In order to perform preloading with known tags, it is necessary when calling the `preloadInAppMessages` method, to specify the list of tags, by which messages should be received

```Swift
class SplashScreenControllr: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, tags: <tags array>))
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        InAppStory.shared.preloadInAppMessagesBy(tags: Array<String>?) { result in
            switch result {
                case .success:
                // data download was successful
                break
                case .failure:
                // problems occurred during the download
                break
            }
        }
    }
}
```

To combine showing a message by event and a specific tag, you must specify a list of required tags when calling the `showInAppMessageWith(event:)` method

```Swift
class IAMController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        // SDK initialization
        InAppStory.shared.initWith(serviceKey: <api-key>, settings: Settings(userID: <userID>, tags: <tags array>))
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        InAppStory.shared.showInAppMessageWith(event: <eventName>, tags: Array<String>?) { show in
            // the show parameter indicates whether the InAppMessage screen has been displayed
        }
    }
}
```

## Closures

To keep track of screen showing and closing, closures have been added, similar to stories in the InAppStory class

`inAppMessageWillShow: (() -> Void)` - called when the InAppMessage screen is shown;
`inAppMessageDidClose: (() -> Void)` - called when the InAppMessage screen has closed;

Also, the `InAppStory.shared.onActionWith` closure will be called to track user actions within the message (see [link-handling](link-handling.md#simple-link-handling) for details)

To receive notifications, a separate closure `InAppStory.shared.inAppMessagesEvent` has been started. The `InAppStory.shared.failureEvent` closure is used to track errors.

See below for a description of the events.

## Events

To keep track of `InAppMessages` events, a separate child object `IASEvent.IAMessage` has been introduced

- `IASEvent.IAMessage.preloaded(messages: Array<InAppMessageData>)` - is called when the `InAppMessage` data preload was successful:

  - `messages` - preloaded messages data;

- `IASEvent.IAMessage.show(iamData: InAppMessageData)` - is called when the `InAppMessage` screen has been displayed:
  - `iamData` - data about the shown `InAppMessage` ;
- `IASEvent.IAMessage.close(iamData: InAppMessageData)` - is called when the `InAppMessage` screen has been closed;
  - `iamData` - data about the shown `InAppMessage`;
- `IASEvent.IAMessage.clickOnButton(iamData: InAppMessageData, link: String)` - сlick on the button in the message with additional parameters:
  - `iamData` - data about the shown `InAppMessage`;
- `IASEvent.IAMessage.widgetEvent(iamData: InAppMessageData, name: String, data: Dictionary<String, Any>?)` - action in widget with parameters:
  - `iamData` - data about the shown `InAppMessage`;
  - `name` - name of widget;
  - `data<Dictionary<String, Any>?>` - activated widget data., [detailed data fields](/glossarium/statistics/stories-widget-events.md);

To track errors, `inAppMessageFailure` has been added to the `IASEvent.Failure` event.

- `IASEvent.Failure.inAppMessageFailure(message: String)` - session error;  
  Reasons:
  - _any errors from InAppMessage_;
