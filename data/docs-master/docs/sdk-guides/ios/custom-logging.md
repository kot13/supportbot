# Custom logging

Starting with SDK version **1.24.16**, the ability to intercept logging within the SDK is added.

To get logs from SDK, you need to create a class that implements the `IASLoggerProtocol` protocol:

```swift
final class CustomLogger: IASLoggerProtocol {
    var level: Array<IASLogLevel> = [.all] // logging level
    
    // log data capture
    func log(object: IASLogObject) {
        print("Custom log: \(object.message ?? "empty")")
    }
}
```

Next, you must specify a new logger for `InAppStory` and enable logging:

```swift
func enableCustomLogger() {
    // logging enable
    InAppStory.shared.isLoggingEnabled = true
    // custom logger installation
    InAppStory.shared.logger = CustomLogger()
}
```

## Logging levels

There are several levels of logging, to display exactly the logs you need:

```swift
public enum IASLogLevel {
    case all       // all logs are enabled
    case initializ // initialization of SDK, list, readers, etc.
    case network   // logging requests
    case reader    // work of readers (stories, games)
    case js        // logs from WebView received from JS
    case profiling // profiling
    case cache     // cache logging
}
```
It is recommended to specify logging levels when initializing a custom logger

## LogObjects

The `log(object)` function receives an object during log output

```swift
public struct IASLogObject {
    public var message: String?
    public var warning: String?
    public var error:   String?
    public var cURL:    String?
    public var data:    IASLogData
}

public struct IASLogData {
    public var level:    IASLogLevel // logging level
    public var function: String      // function name where the call occurred
    public var line:     Int         // log call line number
}
```