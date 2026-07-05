# FilePicker (≥1.18.3)

Starting from v1.18.3 in games you can use custom FilePicker to upload files in games if game
supports this feature.

## Installation

In the project `build.gradle` (app level) in the `dependencies` section add:

```gradle
 implementation `com.github.inappstory.android-sdk-utils:iasfilepicker:1.0.2`
```

After this custom FilePicker automatically will be used in games.

## ProGuard

If your project uses `ProGuard` obfuscation, and `IAS Utils` with version up to 1.0.1 - add following rules to
proguard config file:

```gradle
-keep class com.inappstory.utils.** {
 *;
}
```

In later `IAS Utils` versions (1.0.2 and higher) there is no need to change proguard config file, all rules will
be uploaded from `consumer-rules.pro`.

## Changelog

## 1.0.2 (3)

- Updated consumer-rules.pro.

## 1.0.1 (2)

- Remove IAS SDK dependency.

## 1.0.0 (1)

- First release. You can use this version with only with IAS SDK v1.18.2
