# Story and Game readers presentation

## Story Reader

By default story reader shows in new activity. In some cases it can be necessary to change this
behaviour (for example: if you need to show specific screen at any time of app usage and be able to
return to stories or another screens). In that case started from 1.18.0 you can open stories screen
as a fragment:

```kotlin
fun setStoriesReaderPresentationMode(storiesFragmentTag: String, fragmentContainerId: Int) {
    InAppStoryManager.getInstance()?.openStoriesReader = object : IOpenStoriesReader {
        override fun onOpen(context: Context?, bundle: Bundle) {
            if (context !is FragmentActivity) return
            val fragmentManager =
                context.supportFragmentManager //or you can pass here your own fragment manager.
            val t: FragmentTransaction = fragmentManager.beginTransaction()
                .add(
                    fragmentContainerId,
                    StoriesMainFragment.newInstance(bundle, context),
                    storiesFragmentTag
                )
            t.addToBackStack(storiesFragmentTag)
            t.commit()
        }

        override fun onHideStatusBar(context: Context?) {
            TODO("Not yet implemented")
        }

        override fun onRestoreStatusBar(context: Context?) {
            TODO("Not yet implemented")
        }

        override fun onShowInFullscreen(context: Context?) {
            TODO("Not yet implemented")
            //Now SDK doesn't use this method. It can be changed in future versions. 
            // It is better to use adapter instead of interface
        }

        override fun onRestoreScreen(context: Context?) {
            TODO("Not yet implemented")
            //Now SDK doesn't use this method. It can be changed in future versions. 
            // It is better to use adapter instead of interface
        }
    }
}
```

In methods `onHideStatusBar`/`onRestoreStatusBar` and `onShowInFullscreen`/`onRestoreScreen` you can
manage system bars of your parent activity.

Instead of `IOpenStoriesReader` you can use it's adapter class `IOpenStoriesReaderAdapter`.

```kotlin
fun setStoriesReaderPresentationMode(storiesFragmentTag: String, fragmentContainerId: Int) {
    InAppStoryManager.getInstance()?.openStoriesReader = object : IOpenStoriesReaderAdapter() {
        override fun onOpen(context: Context?, bundle: Bundle) {
            if (context !is FragmentActivity) return
            val fragmentManager =
                context.supportFragmentManager
            val t: FragmentTransaction = fragmentManager.beginTransaction()
                .add(
                    fragmentContainerId,
                    StoriesMainFragment.newInstance(bundle, context),
                    storiesFragmentTag
                )
            t.addToBackStack(storiesFragmentTag)
            t.commit()
        }
    }
}
```

## Game Reader

By default game reader shows in new activity or in dialog fragment in case of tablet devices.
Started from 1.18.0 you can open game screen as a fragment:

```kotlin
fun setGameReaderPresentationMode(gameFragmentTag: String, fragmentContainerId: Int) { 
//fragmentContainerId can be the same with as stories reader's.
    InAppStoryManager.getInstance()?.openGameReader = object : IOpenGameReader {
        override fun onOpen(context: Context?, bundle: Bundle) {
            if (context !is FragmentActivity) return
            val fragmentManager =
                context.supportFragmentManager //or you can pass here your own fragment manager.
            val t: FragmentTransaction = fragmentManager.beginTransaction()
                .add(
                    fragmentContainerId,
                    GameMainFragment().apply {
                        arguments = bundle
                    },
                    gameFragmentTag
                )
            t.addToBackStack(gameFragmentTag)
            t.commit()
        }

        override fun onHideStatusBar(context: Context?) {
            TODO("Not yet implemented")
            //Now SDK doesn't use this method. It can be changed in future versions. 
            // It is better to use adapter instead of interface
        }

        override fun onRestoreStatusBar(context: Context?) {
            TODO("Not yet implemented")
            //Now SDK doesn't use this method. It can be changed in future versions. 
            // It is better to use adapter instead of interface
        }

        override fun onShowInFullscreen(context: Context?) {
            TODO("Not yet implemented")
        }

        override fun onRestoreScreen(context: Context?) {
            TODO("Not yet implemented")
        }
    }
}
```

In methods `onHideStatusBar`/`onRestoreStatusBar` and `onShowInFullscreen`/`onRestoreScreen` you can
manage system bars of your parent activity.

Instead of `IOpenGameReader` you can use it's adapter class `IOpenGameReaderAdapter`.

```kotlin
fun setGameReaderPresentationMode(storiesFragmentTag: String, fragmentContainerId: Int) {
    InAppStoryManager.getInstance()?.openGameReader = object : IOpenGameReaderAdapter() {
        override fun onOpen(context: Context?, bundle: Bundle) {
            if (context !is FragmentActivity) return
            val fragmentManager =
                context.supportFragmentManager //or you can pass here your own fragment manager.
            val t: FragmentTransaction = fragmentManager.beginTransaction()
                .add(
                    fragmentContainerId,
                    GameMainFragment().apply {
                        arguments = bundle
                    },
                    gameFragmentTag
                )
            t.addToBackStack(gameFragmentTag)
            t.commit()
        }
    }
}
```