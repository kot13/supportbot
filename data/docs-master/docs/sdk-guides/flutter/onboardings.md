# Onboardings

The library supports work with onboarding stories.

## Usage

```dart
void onOnboardingsTap() {
  IASOnboardingsHostApi().show(limit: 10);
}
```

## Callbacks

To listen for callbacks from onboardings implement `OnboardingLoadCallbackFlutterApi`

```dart
class _MyAppState extends State<MyApp> implements OnboardingLoadCallbackFlutterApi {
  @override
  void initState() {
    super.initState();
    OnboardingLoadCallbackFlutterApi.setUp(this);
  }

  @override
  void dispose() {
    OnboardingLoadCallbackFlutterApi.setUp(null);
    super.dispose();
  }

  @override
  void onboardingLoad(int count, String feed) {
    print('$runtimeType.onboardingLoad($count, $feed)');
  }

  @override
  void onboardingLoadError(String feed, String? reason) {
    print('$runtimeType.onboardingLoad($feed, $reason)');
  }
}  
```