# Logger

## Initialization

To get logs from SDK, you need to set `InAppStoryManager.logger` with instance of  `InAppStoryManager.IASLogger` interface:

```kotlin
class IASLoggerImpl : InAppStoryManager.IASLogger {
    override fun showELog(tag: String, message: String?) {
        Log.d("IAS_SDK_LOG", "${tag ?: "IAS_SDK_EMPTY_TAG"} ${message ?: ""}")

    }

    override fun showDLog(tag: String, message: String?) {
        Log.d("IAS_SDK_LOG", "${tag ?: "IAS_SDK_EMPTY_TAG"} ${message ?: ""}")
    }
}

fun setLogger() {
    InAppStoryManager.logger = IASLoggerImpl()
}
```

By default SDK has its own implementation of logger
```kotlin
private class IASDefaultLoggerImpl : InAppStoryManager.IASLogger {
    override fun showELog(tag: String, message: String?) {
        Log.d(tag, message.orEmpty())

    }

    override fun showDLog(tag: String, message: String?) {
        Log.d(tag, message.orEmpty())
    }
}
```

## Common tags
SDK Logger has special tags for different situations.
Started from 1.23.x you can find next tags:

For `showELog`:
- `IAS_SDK_Error` - in case of any error (wrong data, inconsistent state, internal errors) that stops action process. 

For `showDLog`
- `IAS_SDK_Warn` - in case of any error, that does not stops action process
- `IAS_SDK_GetJS_Story` - WebView to SDK interactions in stories
- `IAS_SDK_CallJS_Story` - SDK to WebView interactions in stories
- `IAS_SDK_Console_Story` - WebView console logs in stories
- `IAS_SDK_Game_Loading` - Game loading process logs
- `IAS_SDK_GetJS_Game` - WebView to SDK interactions in Games
- `IAS_SDK_Console_Game` - WebView console logs in Games
- `IAS_SDK_CallJS_IAM` - logs for SDK to WebView interactions in In-App Messages
- `IAS_SDK_Console_IAM` - WebView console logs in In-App Messages
- `IAS_SDK_CallJS_Banner` - SDK to WebView interactions in banners
- `IAS_SDK_Console_Banner` - WebView console logs in banners
- `IAS_SDK_Network` - logs from any API or files requests
- `IAS_SDK_Cancel_Token` - all logs about cancel token