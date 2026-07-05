# FAQ

## Logger implementation

To obtain a detailed list of events, requests and errors from native iOS/Android SDK, you can implement a custom
logger after initializing SDK:

```dart
 Future<void> initSdk() async {
  await _inAppStoryPlugin.initWith(apiKey, userId);
  InAppStoryManager.instance.logger = IASLogger.create(
    onDebugLog: (tag, message) {
      print('$tag: $message');
    },
    onErrorLog: (tag, message) {
      print('$tag: $message');
    },
    printToConsole: true,
  );
}
```

## Build failure

Sometimes incorrect Gradle cache, Pub cache or Cocoapods cache cause errors when building an application:

```
// ...
e: file:///.../inappstory_plugin-0.5.0/android/src/main/kotlin/com/inappstory/inappstory_plugin/adaptors/IASSdkModuleAdaptor.kt:26:46 Unresolved reference 'IASStatisticsManagerAdaptor'.
e: file:///.../inappstory_plugin-0.5.0/android/src/main/kotlin/com/inappstory/inappstory_plugin/adaptors/IASSdkModuleAdaptor.kt:32:42 Unresolved reference 'IASSingleStoryAdaptor'.
// ...
```

To fix these errors, you need to run the following commands in your project directory:

1. Clearing build directory

```shell
flutter clean
```

2. Deleting pub cache (it will redownload every package)

```shell
flutter pub cache repair 
```

3. Deleting `Podfile.lock`

```shell
cd ios && rm Podfile.lock && cd ../
```

4. (optional) Deleting `pubspec.lock`

```shell 
rm pubspec.lock
```

5. Fetching dependencies

```shell
flutter pub get
```

6. Fetching pods

```shell
cd ios && pod install --repo-update && cd ../
```

If you still experience build failure, please [create a new issue](https://github.com/inappstory/flutter-sdk/issues/new)
in
our repository.