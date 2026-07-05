import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Games

In version 1.22.0 we added the ability to open games not from stories. The `InAppStory.shared.openGame(...)` and `InAppStory.shared.closeGame()` methods were added for this functionality, as well as a closure to track game completion `InAppStory.shared.gameComplete`.

- `openGame(with game:<Game>, complete: ((_ opened: Bool) -> Void)? = nil)` - open game with `Game` object and closure indicating if game screen was opened;
- `closeGame()` - closing the game screen;
- `gameComplete: ((_ data: <String>, _ result: <Dictionary<String, Any>?>, _ url: <String?>) -> Void)` - the closure is called when the game is over;
  - `data` - data from the game, set in the console;
  - `result` - the results of the game session;
  - `url` - link for the transition (for example, deepLink, set in the console);


:::warning[Please note]
As of version 1.27.x closure `gameComplete` is **deprecated**.
:::

<Tabs>
<TabItem value="uikit" label="UIKit">

#### ViewController.swift

```swift
class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        /// Do any additional setup after loading the view.
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        /// closure is called when the game screen is closed
        /// can be called when the game is terminated, closed by the user or developer
        /// deprecated from 1.27.0
        InAppStory.shared.gameComplete = { data, results, url in
            /// do something with the data from game
        }
    }
    
    @IBAction func showGame(sender: UIButton) {
        InAppStory.shared.openGame(with: Game(id: "1"), from: self) { opened in
            /// the closure is called after processing the possibility of launching the game
            /// if all went well and the game opened on the screen, `opened = true`
            /// otherwise,` opened = false` (e.g. failed to load the archive with the game)
        }
    }
}
```

</TabItem>
<TabItem value="swiftui" label="SwiftUI">

#### ContentView.swift
  
```swift
struct ContentView: View {
    var body: some View {
            VStack(alignment: .leading) {
                Button("Open game") {
                    // opening the game
                    InAppStory.shared.openGame(with: Game(id: "1")) { opened in
                        // if the game is not opened, a notification can be displayed for the user
                        if ! opened {
                            self.showErrorAlert()
                        }
                    }
                }
                Spacer()
            }
            .onAppear {
                /// deprecated from 1.27.0
                InAppStory.shared.gameComplete = { data, results, url in
                    // do something with the data
                }
            }
        }
}
```

</TabItem>
</Tabs>

## Preload games

In version 1.24.0, the game preloading feature was introduced.

#### Automatic Preloading

To enable automatic game preloading, follow these steps:

1. In the game settings console, check the "*Preload the game on users' devices, if possible*" option for the games you want to preload. This will inform the server which games need to be preloaded.
2. In the application, open a session by invoking any `InAppStorySDK` method that initiates a session, such as creating a story feed, displaying single stories, or onboarding stories.

#### Manual Preloading

To enable manual game preloading, follow these steps:

1. Mark the desired games for preloading in the console.
2. In the application, specify the key and settings for `InAppStory`.
3. Invoke the preloading method to start the process.

These steps will ensure the correct setup and execution of game preloading in your application.

```swift
func preloadGames() {
    InAppStory.shared.initWith(serviceKey: <api-key>, 
                               settings: Settings(userID: <userID>, tags: <tags array>))
    InAppStory.shared.preloadGames()
}
```

## Animations game loading

Starting from version 1.24.0, you can display Lottie animations during game loading instead of the standard `ActivityIndicator` with percentages. You can read more about working with Lottie animations [here](lottie-animation.md).


## Game Object

Game object with an id.

### Parameters

- `id` - game id obtained from the console `<String?>`;

## Events

To receive events from games, you must subscribe to trigger closure:

```swift
InAppStory.shared.gameEvent: ((_ event: IASEvent.Game) -> Void)
```

More information and event descriptions can be found [here](events.md#games-events)