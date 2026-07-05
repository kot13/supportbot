# Lottie animation

Starting from SDK version 1.24.1,  you can set a custom Lottie animation on the game's splashscreen when loading games in the InAppStorySDK. To do this, you need to:

1. Load Lottie animation in the “Splash screen (lottie)” field in the InAppStory console, when setting up a game,;
2. Connect Airbnb's Lottie library to the project at least version 4.4.1 from [repository](https://github.com/airbnb/lottie-ios);
3. Connect the `IASLottie` bridge library to the project;

After these steps are completed, the loaded animation will appear on the splash screen of the game. If the animation in the first step was not loaded, the old `ActivityIndicator` will be displayed with loading percentages.

## Limitations and properties

### Files & Animations

1. Currently, only .lottie animation file is supported. 
2. In the file there can be only one animation (if the file has more than one animation, only the first one will be played).  
3. Animation type (loop or progress) is taken from the animation manifest (be careful when loading animations in the console).
4. At the moment, animations in the application can not be controlled and are played according to the internal logic:
  1. loop animation - is played in a loop until the game is fully loaded;
  2. progress animation - displays loading progress in percentages and playback occurs frame by frame, relative to the percentage of loading (the best solution is to use animation with a duration of 100 frames);


## Installation

| IASLottie version | Build version | iOS version |
| ----------------- | ------------- | ----------- |
| 0.2.0             | 88            | >= 12.0     |

Version of the library can be obtained from the parameter `IASLottie.IASLottieVersion`

### CocoaPods

[CocoaPods](https://cocoapods.org) is a dependency manager for Cocoa projects.
Follow instructions on their website for seamless installation.
To integrate InAppStory into your Xcode project using CocoaPods, specify it in your `Podfile`:

```ruby
# UIKit
use_frameworks!
pod 'IASLottie', :git => 'https://github.com/inappstory/ios-lottie', :tag => '0.2.0'
```

### Carthage

[Carthage](https://github.com/Carthage/Carthage) is a decentralized dependency manager that builds your dependencies and provides you with binary frameworks. To integrate InAppStory into your Xcode project using Carthage, specify it in your `Cartfile`:

```swift
//UIKit
dependencies: [
    .package(url: "https://github.com/inappstory/ios-lottie", .exact("0.2.0"))
]
```

### XCode SPM installation
Alternatively, you can add an InAppStory via XCode:

1. First click on the project;
2. Select "*Add Package Dependencies...*";
3. In the "*Enter Package URL*" field, specify the URL of this repository;
4. Select package ias-ios-spm;
5. Set "*Dependecy rule*" to "*Exact Version*" and specify the version required for installation;
6. Click the "*Add Package*" button and wait for the installation to take place.

### Manual installation

Download `IASLottie.xcframework` from the repository. Connect in the project settings on the _General_ tab.