# Widget “Goods”

You can add the **goods widget** in your stories. It can be represented as a horizontal list of items (default
implementation with RecyclerView) or you can fully customize it.

:::tip
If you want to use this widget you should set `csCustomGoodsWidget` interface in common `AppearanceManager` instance.
:::

#### Example

```kotlin
class GoodsItemData(
    val sku: String,
    val title: String?,
    val description: String?,
    image: String?,
    price: String?,
    raw: Any?
)

interface GetGoodsDataCallback {
    fun onSuccess(data: ArrayList<GoodsItemData>);
    fun onError()
    fun onClose() //Use if you want to close the goods widget
    fun itemClick(sku: String) //Use to send click statistic in custom widget
}

AppearanceManager.getCommonInstance().csCustomGoodsWidget(
    object : ICustomGoodsWidget() {
        override fun getWidgetView(context: Context): View {
            TODO("Not yet implemented")
        }

        override fun getItem(): ICustomGoodsItem {
            TODO("Not yet implemented")
        }

        override fun getWidgetAppearance(): IGoodsWidgetAppearance {
            TODO("Not yet implemented")
        }

        override fun getDecoration(): RecyclerView.ItemDecoration {
            TODO("Not yet implemented")
        }

        override fun getSkus(
            goodsItemView: View,
            skus: ArrayList<String>, 
            callback: GetGoodsDataCallback
        ) {
            //In this method you should always call
            //callback.onSuccess(ArrayList<GoodsItemData> data)
            //or callback.onError();
            TODO("Not yet implemented")
        }

        override fun onItemClick(
            goodsItemView: View,
            goodsItemView: View,
            goodsItemData: GoodsItemData,
            callback: GetGoodsDataCallback
        ) {
            //This action does not close stories reader and game reader.
            //If you want just close goods widget - you can use `callback.onClose()`
            //If you want to close readers, you should call `InAppStoryManager.closeStoryReader()`
            //for closing all readers and widget
            TODO("Not yet implemented")
        }
    }
)
```

If you want to use [default](#default-widget-sample) implementation (RecyclerView) thеn
the method `getWidgetView()` should return null. In that case you may override other methods
like `getItem()`, `getWidgetAppearance()`, `getDecoration()`, `onItemClick()` as you need. Otherwise
methods won't be called and also might return null values.

## ICustomGoodsItem

Method `ICustomGoodsWidget.getItem()` returns the interface `ICustomGoodsItem`:

```kotlin
interface ICustomGoodsItem {
    fun getView(context: Context): View

    fun bindView(view: View, data: GoodsItemData)
}
```

You can fully customize goods item as you like:

```kotlin
fun getGoodsItem(): ICustomGoodsItem {
    return object : ICustomGoodsItem() {

        override fun getView(context: Context): View {
            return LayoutInflater.from(context).inflate(
                R.layout.custom_goods_list_item,
                null,
                false
            );
        }

        override fun bindView(view: View, data: GoodsItemData) {
            (view.findViewById(R.id.title) as TextView).setText(
                goodsItemData.title
            );
            loadImage(
                (view.findViewById(R.id.image) as ImageView),
                goodsItemData.image
            )
        }
    }
}
```

Or you can use builder class `SimpleCustomGoodsItem` for customizing the default goods item:

```kotlin
//This values is used by default in goods item
fun getGoodsItem(
    itemBackgroundColor: Int = Color.TRANSPARENT,
    itemCornerRadius: Int = dpToPixels(8),
    itemMainTextColor: Int = Color.BLACK,
    itemOldPriceTextColor: Int = Color.parseColor("#CCCCCC"),
    itemTitleTextSize: Int = spToPixels(14),
    itemDescriptionTextSize: Int = spToPixels(12),
    itemPriceTextSize: Int = spToPixels(14),
    itemOldPriceTextSize: Int = spToPixels(14),
): ICustomGoodsItem {
    return SimpleCustomGoodsItem()
        .csGoodsCellImageBackgroundColor(itemBackgroundColor)
        .csGoodsCellImageCornerRadius(itemCornerRadius)
        .csGoodsCellMainTextColor(itemMainTextColor)
        .csGoodsCellOldPriceTextColor(itemOldPriceTextColor)
        .csGoodsCellTitleSize(itemTitleTextSize)
        .csGoodsCellDescriptionSize(itemDescriptionTextSize)
        .csGoodsCellPriceSize(itemPriceTextSize)
        .csGoodsCellOldPriceSize(itemOldPriceTextSize)
}
```

## getWidgetAppearance

Also you can use method `getWidgetAppearance()` if you want customize other parts of the widget (
background line, close button). For the simple cases you can override
`GoodsWidgetAppearanceAdapter()` instead of the interface.
The method returns this interface:

```kotlin
interface IGoodsWidgetAppearance {
    fun getBackgroundHeight(): Int

    fun getBackgroundColor(): Int

    fun getDimColor(): Int

    fun getCloseButtonImage(): Drawable?

    fun getCloseButtonColor(): Int
}
```

#### Example

```kotlin
fun getGoodsWidgetAppearance(): IGoodsWidgetAppearance {
    return object : GoodsWidgetAppearanceAdapter() {
        override fun getBackgroundColor(): Int {
            return Color.BLUE
        }
    }
}
```

## getSkus

In method `getSkus()` you get ids for goods items. When you get the data from your
application for these items, you should create an array of `GoodsItemData` items and call
`getGoodsDataCallback.onSuccess`(`ArrayList<GoodsItemData>` data). In case of any error in
retreiving data for said items, you should call `getGoodsDataCallback.onError().`
Here is an example for this method:

```kotlin
fun getSkus(skus: ArrayList<String>, callback: GetGoodsDataCallback) {
    val goodsItemData = arrayListOf<GoodsItemData>()
    val goods: HashMap<String, CustomGoodsItem> = getGoodsItemsFromServer(skus)
    skus.forEach { sku ->
        val item = goods.get(sku)
        val data = GoodsItemData(
            sku,
            item.title,
            item.description,
            item.imageLink,
            item.price,
            item.oldPrice,
            item
        )
        //last variable can be used in case if you want to represent any additional fields in custom cell with `ICustomGoodsItem.bindView()`
        //or get your object in `onItemClick()`
        goodsItemData.add(data)
    }
    callback.onSuccess(goodsItemData)
}
```

If you want to fully customize your widget, you should override `getWidgetView()` to return `NonNull`
view. In that case all binding logic should be in `getSkus()` method. For example:

```kotlin
AppearanceManager.getCommonInstance().csCustomGoodsWidget(
    object : ICustomGoodsWidget {
        var container: RelativeLayout? = null
        override fun getWidgetView(context: Context): View {
            TODO("Not yet implemented")
        }

        override fun getItem(): ICustomGoodsItem {
            TODO("Not yet implemented")
        }

        override fun getWidgetAppearance(): IGoodsWidgetAppearance {
            TODO("Not yet implemented")
        }

        override fun getDecoration(): RecyclerView.ItemDecoration {
            TODO("Not yet implemented")
        }

        override fun getSkus(
            skus: ArrayList<String?>?,
            getGoodsDataCallback: GetGoodsDataCallback
        ) {
            if (container != null && skus != null) {
                getGoodsDataCallback.onSuccess(ArrayList())
                for (sku in skus) {
                    val textView = TextView(context)
                    val lp = LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                    )
                    textView.layoutParams = lp
                    textView.text = sku
                    textView.setOnClickListener { v1: View? ->
                        getGoodsDataCallback.onItemClick(sku)
                        Toast.makeText(context, textView.text, Toast.LENGTH_LONG).show()
                    }
                    (container!!.findViewById<View>(R.id.container) as LinearLayout).addView(
                        textView
                    )
                }
                container!!.findViewById<View>(R.id.close)
                    .setOnClickListener(object : OnClickListener() {
                        fun onClick(v: View?) {
                            getGoodsDataCallback.onClose()
                        }
                    })
            }
        }

        override fun onItemClick(
            goodsItemView: View,
            goodsItemData: GoodsItemData,
            callback: GetGoodsDataCallback
        ) {
            TODO("Not yet implemented")
        }
    }
)
```

## onItemClick

Method `onItemClick` is called whenever you click on any goods item from the goods widget.

```kotlin
class MyCustomGoodsWidget : ICustomGoodsWidget {

    override fun getWidgetView(context: Context): View {
        TODO("Not yet implemented")
    }

    override fun getItem(): ICustomGoodsItem {
        return SimpleCustomGoodsItem()
    }

    override fun getWidgetAppearance(): IGoodsWidgetAppearance {
        TODO("Not yet implemented")
    }

    override fun getDecoration(): RecyclerView.ItemDecoration {
        TODO("Not yet implemented")
    }

    override fun getSkus(
        skus: ArrayList<String?>?,
        getGoodsDataCallback: GetGoodsDataCallback
    ) {
        callback.onSuccess(getGoodsItemDataFromSkus())
    }

    override fun onItemClick(
        goodsItemView: View,
        goodsItemData: GoodsItemData,
        callback: GetGoodsDataCallback
    ) {
        val myGoodActivity = Intent(goodsItemView.getContext(), MyGoodActivity::class.java)
        myGoodActivity.putExtras(getBundleFromGoodsItemData(data))
        context.startActivity(myGoodActivity)
    }
}
```

:::warning
The method `onItemClick` does not have the direct access to `Context` before v1.17.0.
:::

If you want to open any screen above stories reader after a click, you can get `Context` by creating instance of `ICustomGoodsWidget` and then pass an `applicationContext` to override the class directly (with a setter or a constructor):

```kotlin
class MyCustomGoodsWidget(private val context: Context) : ICustomGoodsWidget {

    override fun getWidgetView(context: Context): View {
        TODO("Not yet implemented")
    }

    override fun getItem(): ICustomGoodsItem {
        return SimpleCustomGoodsItem()
    }

    override fun getWidgetAppearance(): IGoodsWidgetAppearance {
        TODO("Not yet implemented")
    }

    override fun getDecoration(): RecyclerView.ItemDecoration {
        TODO("Not yet implemented")
    }

    override fun getSkus(
        widgetView: View?,
        skus: ArrayList<String>,
        callback: GetGoodsDataCallback
    ) {
        callback.onSuccess(getGoodsItemDataFromSkus())
    }

    override fun onItemClick(
        widgetView: View?,
        goodsItemView: View,
        goodsItemData: GoodsItemData,
        callback: GetGoodsDataCallback
    ) {
        val myGoodActivity = Intent(context, MyGoodActivity::class.java)
        myGoodActivity.putExtras(getBundleFromGoodsItemData(data))
        /**
         * !!! For application context you have to add FLAG_ACTIVITY_NEW_TASK
         */
        myGoodActivity.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(myGoodActivity)
    }
}

fun setGoodsWidget(context: Context) {
    AppearanceManager.getCommonInstance().csCustomGoodsWidget(
        MyCustomGoodsWidget(context.applicationContext)
    )
}
```

## Default widget sample

```kotlin
class DefaultWidgetSample : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_base_list)
        showStories()
    }

    private fun showStories() {
        val storiesList = findViewById<StoriesList>(R.id.stories_list)
        storiesList.appearanceManager = AppearanceManager()
        AppearanceManager.getCommonInstance().csCustomGoodsWidget(object : ICustomGoodsWidget {
            override fun getWidgetView(context: Context): View? {
                return null;
            }

            override fun getItem(): ICustomGoodsItem? {
                return null;
            }

            override fun getWidgetAppearance(): IGoodsWidgetAppearance? {
                return null;
            }

            override fun getDecoration(): RecyclerView.ItemDecoration? {
                return null;
            }

            public override fun getSkus(
                widgetView: View?,
                skus: ArrayList<String>,
                callback: GetGoodsDataCallback
            ) {
                val goodsItemData: ArrayList<GoodsItemData> = ArrayList<GoodsItemData>()
                for (sku: String in skus) {
                    val data = GoodsItemData(
                        sku,
                        "title_$sku",
                        "desc_$sku",
                        "https://media.istockphoto.com/photos/big-and-small-picture-id172759822",
                        "10",
                        "20",
                        sku
                    )
                    goodsItemData.add(data)
                }
                callback.onSuccess(goodsItemData)
            }

            override fun onItemClick(
                widgetView: View?,
                goodsItemView: View,
                goodsItemData: GoodsItemData,
                callback: GetGoodsDataCallback
            ) {
                Toast.makeText(
                    this@DefaultWidgetSample,
                    goodsItemData.toString(),
                    Toast.LENGTH_LONG
                ).show()
            }
        })

        storiesList.loadStories()
    }

    override fun onDestroy() {
        AppearanceManager.getCommonInstance().csCustomGoodsWidget(null)
        super.onDestroy()
    }
}
```

## Custom widget sample

:::warning
It is recommended not to keep context/views as strong references in any of the callbacks to prevent possible memory leaks.
:::

```kotlin
class CustomWidgetSample : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_base_list)
        showStories()
    }

    private fun showStories() {
        val storiesList = findViewById<StoriesList>(R.id.stories_list)
        storiesList.appearanceManager = AppearanceManager()
        val goodsItemMargin = Sizes.dpToPxExt(16, this@CustomWidgetSample)
        val goodsTextViewPadding = Sizes.dpToPxExt(8, this@CustomWidgetSample)
        AppearanceManager.getCommonInstance().csCustomGoodsWidget(object : ICustomGoodsWidget {
            //It is recommended to keep this as weak ref instead of strong ref to prevent memory leaks

            override fun getWidgetView(context: Context): View {
                val container = View.inflate(
                    context,
                    R.layout.custom_goods_widget,
                    null
                ) as RelativeLayout
                return container
            }

            override fun getItem(): ICustomGoodsItem? {
                return null
            }

            override fun getWidgetAppearance(): IGoodsWidgetAppearance? {
                return null
            }

            override fun getDecoration(): RecyclerView.ItemDecoration? {
                return null
            }

            @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
            override fun getSkus(
                widgetView: View?,
                skus: ArrayList<String>?,
                getGoodsDataCallback: GetGoodsDataCallback
            ) {
                val container: RelativeLayout? = widgetView as RelativeLayout?
                container?.let { container ->
                    if (skus != null) {
                        getGoodsDataCallback.onSuccess(ArrayList())
                        for (sku: String in skus) {
                            val textView = AppCompatTextView(
                                this@CustomWidgetSample
                            )
                            val lp = LinearLayout.LayoutParams(
                                ViewGroup.LayoutParams.MATCH_PARENT,
                                ViewGroup.LayoutParams.WRAP_CONTENT
                            )
                            lp.setMargins(
                                goodsItemMargin, goodsItemMargin,
                                goodsItemMargin, 0
                            )
                            textView.layoutParams = lp
                            textView.setPadding(
                                goodsTextViewPadding,
                                goodsTextViewPadding,
                                goodsTextViewPadding,
                                goodsTextViewPadding
                            )
                            textView.background = AppCompatResources.getDrawable(
                                this@CustomWidgetSample,
                                R.drawable.widget_background_solid
                            )
                            textView.textSize = 18f
                            textView.setTextColor(resources.getColor(R.color.white))
                            textView.text = sku
                            textView.setOnClickListener {
                                getGoodsDataCallback.itemClick(sku)
                                Toast.makeText(
                                    this@CustomWidgetSample,
                                    textView.text,
                                    Toast.LENGTH_LONG
                                ).show()
                            }
                            (container.findViewById<View>(R.id.container) as LinearLayout).addView(
                                textView
                            )
                        }
                        container.findViewById<View>(R.id.close).setOnClickListener {
                            getGoodsDataCallback.onClose()
                        }
                    }
                }

            }

            override fun onItemClick(
                widgetView: View?,
                goodsItemView: View,
                goodsItemData: GoodsItemData,
                getGoodsDataCallback: GetGoodsDataCallback
            ) {
                getGoodsDataCallback.onClose()
            }
        })

        storiesList.loadStories()
    }

    override fun onDestroy() {
        AppearanceManager.getCommonInstance().csCustomGoodsWidget(null)
        super.onDestroy()
    }
}
```

## Custom cells

```kotlin
class CustomCellWidgetSample : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_base_list)
        showStories()
    }

    private fun showStories() {
        val storiesList = findViewById<StoriesList>(R.id.stories_list)
        storiesList.appearanceManager = AppearanceManager()
        AppearanceManager.getCommonInstance().csCustomGoodsWidget(object : ICustomGoodsWidget {

            override fun getWidgetView(): View? {
                return null
            }

            override fun getItem(): ICustomGoodsItem? {
                return object : ICustomGoodsItem {

                    override fun getView(): View {
                        return LayoutInflater.from(this@CustomCellWidgetSample)
                            .inflate(
                                R.layout.custom_goods_item,
                                null, false
                            )
                    }

                    override fun bindView(view: View, goodsItemData: GoodsItemData) {
                        ImageLoader.getInstance().displayImage(
                            goodsItemData.image,
                            -1,
                            view.findViewById<View>(R.id.image) as AppCompatImageView,
                            InAppStoryService.getInstance().fastCache
                        )
                        (view.findViewById<View>(R.id.title) as AppCompatTextView).text =
                            goodsItemData.title
                    }
                }
            }

            override fun getWidgetAppearance(): IGoodsWidgetAppearance? {
                return null
            }

            override fun getDecoration(): RecyclerView.ItemDecoration? {
                return null
            }

            override fun getSkus(
                widgetView: View?, 
                skus: ArrayList<String>, 
                callback: GetGoodsDataCallback
            ) {
                val goodsItemData: ArrayList<GoodsItemData> = ArrayList<GoodsItemData>()
                for (sku in skus) {
                    val data = GoodsItemData(
                        sku,
                        sku,
                        "desc_$sku",
                        "https://media.istockphoto.com/photos/big-and-small-picture-id172759822",
                        "10",
                        "20",
                        sku
                    )
                    goodsItemData.add(data)
                }
                callback.onSuccess(goodsItemData)
            }

            override fun onItemClick(widgetView: View?, goodsItemData: GoodsItemData) {
                InAppStoryManager.closeStoryReader()
                Toast.makeText(
                    this@CustomCellWidgetSample,
                    goodsItemData.toString(), Toast.LENGTH_LONG
                ).show()
            }
        })
        storiesList.loadStories()
    }

    override fun onDestroy() {
        AppearanceManager.getCommonInstance().csCustomGoodsWidget(null)
        super.onDestroy()
    }

}
```

Look [here](https://github.com/inappstory/Android-Example/tree/main/kotlinexamples/src/main/java/com/inappstory/kotlinexamples/goodswidget) for a more extensive example on "goods" widget implementation.
