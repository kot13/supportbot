# Changelog

## iOS

### v1.3.4

- updated work with queues for obtaining assets;
- stability improvements for iOS 18.2;

### v1.3.3

- stability improvements;

### v1.3.2

- fixed crash when downloading broken files;
- stability improvements;

### v1.3.1

- Fixed locking of file deletion in AssetsPicker when maximum number of assets is selected;
- The preview screen has been fixed to display an alert when the asset limit is reached;
- Fixed an issue with closing the editor when exiting AssetsPicker without selected files;
- Editor version 1.2.2 has been released;

### v1.3.0

- The process of working with local files has been moved from the editor (WKWebView) to the native part of the SDK;
- The process of uploading data to the console has been moved from the editor (WKWebView) to the native part of the SDK;
- Changed work with data and files loaded into the editor (WKWebView);
- Editor version 1.2.1 has been released;
- Improved handling of errors when uploading and processing files (No network, conversion error, etc.)
- Stability improved;

> **Pay attention!**
>
> For InAppStorySDK_UGC v1.3.0 to work correctly, InAppStorySDK version 1.22.3+ must be installed.

### v1.2.4

- Conflicts resolved;
- Stability improvements;

### v1.2.3

- Stability improvements;

### v1.2.2

- Stability improvements;
- Camera, microphone and photo library resolutions updated;

### v1.2.1

- The dynamic setting of the size restriction of the selection;
- Added BW filter for inaccessible assemblies in the picker;

### v1.2.0

1. UGC editor localization depending on the device locale

2. Since version 1.2.0 of the UGC editor, it is now possible to select multiple resources to load when creating storis. This functionality also depends on the project settings in the console.

3. In the UGC editor camera added the ability to take photos and videos without leaving the screen. In order to take a photo, you need to tap on the button. To remove the video, you need to hold down the button.  

> **Note** <br/>
> The editor itself can prohibit this behavior, and video will be shot only for the widget "video", and photos only for "image".
