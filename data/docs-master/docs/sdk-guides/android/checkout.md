# Checkout

The Products widget is a new version of the Goods widget that does not require any settings on the
host application side.
All widget appearance settings are made in the console.

## Shopping cart

Starting with SDK version 1.22.0, the Products widget has added functionality that allows you to add
products to the host application's shopping cart directly from stories. To add interaction with this
widget you need to set `ProductCartInteractionCallback`:

```kotlin
interface ProductCartUpdatedProcessCallback {
    fun onSuccess(productCart: ProductCart)

    fun onError(reason: String?)
}

interface ProductCartInteractionCallback {
    fun cartUpdate(productCartOffer: ProductCartOffer, callback: ProductCartUpdatedProcessCallback)

    fun cartClicked()

    fun cartGetState(callback: ProductCartUpdatedProcessCallback)
}
```

### Method's objects

```kotlin
class ProductCartOffer {
    val offerId: String?
    val groupId: String?
    val name: String?
    val description: String?
    val url: String?
    val coverUrl: String?
    val currency: String?
    val price: String?
    val oldPrice: String?
    val adult: Boolean?
    val availability: Int
    val size: String?
    val color: String?
    val quantity: Int
    val imageUrls: List<String?>?
}

class ProductCart {
    val offers: List<ProductCartOffer>?
    val price: String?
    val oldPrice: String?
    val priceCurrency: String?
}
```

### Updating the cart from stories

To update the cart from stories, override `cartUpdate`. It receives the `productCartOffer`
parameter (the product that was selected in stories to be added)
and `ProductCartUpdatedProcessCallback` with `onSuccess` and `onError` methods.
If succeed, you have to passed a `ProductCart` object is `onSuccess`. If the product could not be added
to the cart for any reason, an `onError` with a description must be invoked.

```kotlin
private fun updateProducts(offer: ProductCartOffer) = TODO("Not yet implemented")
private fun getProductCartOffers(): List<ProductCartOffer> = TODO("Not yet implemented")
private fun getTotalPrice(): String? = TODO("Not yet implemented")
private fun getTotalOldPrice(): String? = TODO("Not yet implemented")
private fun getCurrency(offer: ProductCartOffer): String? = TODO("Not yet implemented")

fun initProductsCallback() {
    InAppStoryManager.getInstance()?.setProductCartInteractionCallback(object : ProductCartInteractionCallback {
        override fun cartUpdate(
            offer: ProductCartOffer?,
            processCallback: ProductCartUpdatedProcessCallback?
        ) {
            offer?.let {
                updateProducts(it)
                processCallback?.onSuccess(
                    ProductCart()
                        .offers(
                            getProductCartOffers()
                        )
                        .price(getTotalPrice())
                        .oldPrice(getTotalOldPrice())
                        .priceCurrency(getCurrency())
                )
                return
            }
            processCallback?.onError("No offer passed")
        }

        override fun cartClicked() {
            TODO("Not yet implemented")
        }

        override fun cartGetState(
            processCallback: ProductCartUpdatedProcessCallback?
        ) {
            processCallback?.onSuccess(
                ProductCart()
                    .offers(
                        getProductCartOffers()
                    )
                    .price(getTotalPrice())
                    .oldPrice(getTotalOldPrice())
                    .priceCurrency(getCurrency())
            )
        }
    })
}
```

### Go to the product cart screen

After successfully adding a product to the cart, a button appears in the widget to go to the cart.
Clicking on it triggers the `cartClicked` method from `ProductCartInteractionCallback`.

```kotlin
private fun openProductCart() = TODO("Not yet implemented")

fun initProductsCallback() {
    InAppStoryManager.getInstance()?.setProductCartInteractionCallback(object : ProductCartInteractionCallback {
        override fun cartUpdate(
            offer: ProductCartOffer?,
            processCallback: ProductCartUpdatedProcessCallback?
        ) {

            TODO("Not yet implemented")
        }

        override fun cartClicked() {
            InAppStoryManager.closeStoryReader(true) {
                openProductCart()
            }
        }

        override fun cartGetState(
            processCallback: ProductCartUpdatedProcessCallback?
        ) {
            TODO("Not yet implemented")
        }
    })
}
```
