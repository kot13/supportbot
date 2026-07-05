# FilePicker

Starting with version **1.23.3** of `InAppStorySDK`, games can use the functionality of adding photos and videos from the device. To get data from the iOS photo library, it is necessary to connect `IASFilePicker.xcframework` to the project.

| IASFilePicker version | Build version | iOS version |
| --------------------- | ------------- | ----------- |
| 0.1.1                 | 34            | >= 11.0     |

Version of the library can be obtained from the parameter `IASFilePickerVersion`

:::tip[Note]
 For IASFilePicker to work, there is no need to import the package anywhere.  
 It is enough to add it to the project, InAppStorySDK will detect its presence and use it.
:::

### CocoaPods

[CocoaPods](https://cocoapods.org) is a dependency manager for Cocoa projects.
Follow instructions on their website for seamless installation.
To integrate InAppStory into your Xcode project using CocoaPods, specify it in your `Podfile`:

```ruby
# UIKit
use_frameworks!
pod 'IASFilePicker', :git => 'https://github.com/inappstory/ios-filepicker.git', :tag => '0.1.1'
```

### Carthage

[Carthage](https://github.com/Carthage/Carthage) is a decentralized dependency manager that builds your dependencies and provides you with binary frameworks. To integrate InAppStory into your Xcode project using Carthage, specify it in your `Cartfile`:

```ogdl
# UIKit
github "inappstory/ios-filepicker" ~> 0.1.1
```

### Swift Package Manager

The [Swift Package Manager](https://swift.org/package-manager/) is a tool for automating the distribution of Swift code and is integrated into the `swift` compiler. It is in early development, but InAppStory does support its use on supported platforms.

Once you have your Swift package set up, adding InAppStory as a dependency is as easy as adding it to the `dependencies` value of your `Package.swift`.

```swift
//UIKit
dependencies: [
    .package(url: "https://github.com/inappstory/ios-filepicker.git", .exact("0.1.1"))
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

Download `IASFilePicker.xcframework` from the repository. Connect in the project settings on the *General* tab.

## Privacy

The camera and photo library in iOS requires **Privacy** to be specified in the project's `Info.plist`.

To work with the photo library, you must specify a key:

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Description shown in the system permission window</string>
```

A key must be specified for the camera to work:

```xml
<key>NSCameraUsageDescription</key>
<string>Description shown in the system permission window</string>
```

If it is necessary to work with video, it is necessary to specify the key for microphone operation for correct work of video recording:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>Description shown in the system permission window</string>
```
