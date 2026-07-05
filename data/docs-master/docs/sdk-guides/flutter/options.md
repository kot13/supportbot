# Options

Starting from version 0.6.0, additional options can be added to the SDK.

## Description

Options are represented as a `Map<String, String>`, where the key is the name of the option to which the value is
assigned.

Currently, the SDK provides only one predefined key: `OptionKeys.pointOfSale`.

```dart
class OptionKeys {
  static const pointOfSale = 'pos';
}
```

If necessary, you can set your own key-value pairs:

```dart

final Map<String, String> options = {
  OptionKeys.pointOfSale: "first_pos",
  "showOnboarding": "true",
};
```

## Setting options

In order for the options to work correctly, it is recommended to set them after initializing the SDK using
`InAppStoryManager`:

```dart
Future<void> initSDK(String apiKey, String userId) async {
  await InAppStoryPlugin().initWith(apiKey, userId);

  final options = {
    OptionKeys.pointOfSale: "first_pos",
    "showOnboarding": "true",
  };

  await InAppStoryManager.instance.setOptions(options);
}
```

## Change options in runtime

If you need to change the options in runtime, you need to set a new `Map<String, String>` with updated data in
`InAppStoryManager`:

```dart
Future<void> setCustomOptions(Map<String, String> customOptions) async {
  await InAppStoryManager.istance.setOptions(customOptions);
}
```