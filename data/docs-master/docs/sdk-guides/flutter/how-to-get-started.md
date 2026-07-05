import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# How to get started

## Installation

Add the dependency in your app's `pubspec.yaml`.

```yaml
dependencies:
  inappstory_plugin: ^0.7.12
```

Or run this command:

```
flutter pub add inappstory_plugin
```

### Android Requirements

1. Make sure you update your Android SDK versions in `app/build.gradle`.

```gradle
minSdkVersion = 23
compileSdkVersion = 34
targetSdkVersion = 34
```

2. Initialize Android SDK in your `Application` class.

:::warning
Without this, the library will not work on Android devices
:::

<Tabs>
<TabItem value="kotlin" label="Kotlin">

```kotlin
package com.example.yourapp

import android.app.Application
import com.inappstory.inappstory_plugin.InAppStoryPlugin

class ExampleApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // init SKD
        InAppStoryPlugin.initSDK(this)
    }
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
package com.example.yourapp;

import android.app.Application;

import com.inappstory.inappstory_plugin.InAppStoryPlugin;

class ExampleApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        // init SKD
        InAppStoryPlugin.initSDK(this);
    }
}
```

</TabItem>
</Tabs>

3. Extend your `MainActivity` class from `InAppStoryActivity`.

<Tabs>
<TabItem value="kotlin" label="Kotlin">

```kotlin
package com.example.yourapp;

import com.inappstory.inappstory_plugin.activity.InAppStoryActivity

class MainActivity : InAppStoryActivity()
```

</TabItem>
<TabItem value="java" label="Java">

```java
package com.example.yourapp;

import com.inappstory.inappstory_plugin.activity.InAppStoryActivity;

class MainActivity extends InAppStoryActivity {
}
```

</TabItem>
</Tabs>

4. Add `manifestPlaceholders` to your `app/build.gradle` file

```gradle
android {
    ...
    defaultConfig {
        ...
        manifestPlaceholders['applicationName'] = '<name of your custom application class>'
    }
}
```

### iOS Requirements

Make sure you run `pod install` or `pod install --repo-update` in the `ios` folder of your Flutter project.

## Basic initialization

Await the plugin return before the use of other API's.

```dart
Future<void> initSDK() async {
  await InAppStoryPlugin().initWith('<your api key>', '<user id>', locale: <locale>, cacheSize: CacheSize.medium);

  // ... any other calls to API
}
```

* Parameter `userId` can be empty.
* Parameter `locale` used to set up story reader in case, that you need right-to-left direction of interface. It is
  optional and must be created with region subtag (like `Locale('en', 'US')`). Otherwise, locale will
  be default en-US
* Parameter `cacheSize` is optional and used to changing space of caching stories files (images, videos) (works only on
  Android devices, default is `CacheSize.medium`)

```dart
CacheSize.small //equal to 15mb;
CacheSize.medium //equal to 110mb, uses by default;
CacheSize.large //equal to 210mb;
```

## Usage

To use the library, add `FeedStoriesWidget` to your widget tree.

```dart
class FeedExample extends StatelessWidget {
  const FeedExample({super.key});

  @override
  Widget build(BuildContext context) {
    return FeedStoriesWidget(
      feed: '<your feed id>',
    );
  }
}
```

## Full example

```dart
import 'package:flutter/material.dart';
import 'package:inappstory_plugin/inappstory_plugin.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final _inAppStoryPlugin = InAppStoryPlugin();

  final apiKey = '<your-api-key>';

  // can be empty
  final userId = '<user-id>';

  final feed = '<your-feed-id>';

  late final initialization = initSdk();

  Future<void> initSdk() async {
    await _inAppStoryPlugin.initWith(apiKey, userId);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('InAppStory Example'),
        ),
        body: FutureBuilder(
          future: initialization,
          builder: (context, initializationSnapshot) {
            if (initializationSnapshot.connectionState ==
                ConnectionState.done) {
              if (initializationSnapshot.hasError) {
                return const Text('SDK was not initialized');
              } else {
                return Column(
                  children: [
                    FeedStoriesWidget(
                      feed: feed,
                    ),
                  ],
                );
              }
            }
            return const Center(
              child: CircularProgressIndicator(),
            );
          },
        ),
      ),
    );
  }
}
```