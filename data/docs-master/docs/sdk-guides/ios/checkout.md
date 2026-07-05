# Checkout

The Products widget is a new version of the Goods widget that does not require any settings on the host application side. All widget appearance settings are made in the console.

## Shopping cart

Starting with SDK version 1.26.0, the Products widget has added functionality that allows you to add products to the host application's shopping cart directly from stories. For this functionality to work correctly, you need to subscribe to 3 closures at `InAppStory.shared`:

```Swift
var productCartUpdate: ((_ offer: ProductCartOffer,
                         _ complete: @escaping (Result<ProductCart, Error>) -> Void) -> Void)?
var productCartClicked: (() -> Void)?
var productCartGetState: ((_ complete: @escaping (Result<ProductCart, Error>) -> Void) -> Void)?
```

### Updating the cart from stories

To update the cart from stories, use the `productCartUpdate` callback. It contains the `offer` parameter — the product that was selected in stories to be added. The full list of object parameters can be found [here](#productcartoffer).  
The closure also has a `complete` parameter, which must be called after adding the product to the host application's cart. It must be passed as a `Result`, which, if the addition was successful, should contain a `ProductCart` object (description [here](#productcart)). If the product could not be added to the cart by any reason, an error with a description must be passed.

```Swift
InAppStory.shared.productCartUpdate = { [weak self] offer, complete in
    guard let self else { return }
                
    addProductToCart(offer: offer, complete: complete)
}

func addProductToCart(offer: ProductCartOffer, complete: @escaping ((Result<ProductCart, Error>) -> Void)) {
    // add product (offer) to the application cart
    
    // upon completion of adding
    // if the product was added successfully
    complete(.success(/*ProductCart object formed from the current state of the cart*/))
    // if the product was not added for some reason
    complete(.failure(/*Error object indicating the reason*/))
}
```

:::warning[Please note]
The exact number of items that should be reflected in the cart is received in the `productCartUpdate` loop, in the `ProductCartOffer` object. You should not add the number of items to what already is in the cart, but replace it with the number received from `productCartUpdate`.  
:::


### Getting the cart status

To correctly calculate the number of items in the cart, the story requests the `productCartGetState` closure before opening. The closure must pass the cart status in the same way as in the `productCartUpdate` closure. If for any reason the cart cannot be obtained, an `Error` must also be sent with a description of the problem.

```Swift
InAppStory.shared.productCartGetState = { [weak self] complete in
    guard let self else { return }
                
    getProductCart(complete: complete)
}

func getProductCart(complete: @escaping ((Result<ProductCart, Error>) -> Void)) {
    // get the cart status
    
    // upon completion
    // if the status is successfully obtained
    complete(.success(/*ProductCart object formed from the current cart status*/))
    // if the status was not received for any reason
    complete(.failure(/*Error object indicating the reason*/))
}
```

### Go to the shopping cart screen

After successfully adding a product to the cart, a button appears in the widget to go to the cart. Clicking on it triggers the `productCartClicked` callback.

There are two options for displaying the cart when `productCartClicked` is called:

**1. Show the cart after closing the reader**

```Swift
InAppStory.shared.productCartClicked = { [weak self] in
    guard let self else { return }
    
    // close the reader stories
    InAppStory.shared.closeReader {
        // after closing, display the screen
        // cart according to the internal logic of the host application
        showCartScreen()
    }
}
```

**2. Display the cart on top of the story reader**

```Swift
InAppStory.shared.productCartClicked = {
    // display the cart screen controller
    // on top of the story reader screen
    InAppStory.shared.present(controller: /*cart screen controller*/)
}
```

## Cart screen presenting

If you need to show a screen with the cart description, but you don't want to close the stories, you can use the `InAppStory.shared.present(controller: for: with:)` method. For more details and sample code, see [Screen presenting](screen-presenting.md).

## Objects

#### ProductCartOffer

Product object required for correct operation and display in the widget:

```Swift
struct ProductCartOffer: Codable {
    let offerId: String				// product ID
    let groupId: String?			// product group ID
    let name: String?				// product name
    let description: String?		// product description
    let url: String?				// link to external resource for product
    let coverUrl: String?			// cover image address
    let imageUrls: [String] 		// list of addresses for product images
    let currency: String?			// currency in which the product is priced
    let price: String?				// current product price (after discounts)
    let oldPrice: String?			// old product price
    let adult: Bool?				// whether the product has age restrictions
    let availability: Int			// product availability
    let size: String?				// product size
    let color: String?				// product color
    let quantity: Int				// quantity of the product in the cart
}
```
#### ProductCart

Cart contents:

```Swift
struct ProductCart: Codable {
    let offers: [ProductCartOffer]     // list of products in the cart
    let price: String                  // total price of products added to the cart
    let oldPrice: String?              // old total price (without discounts)
    let priceCurrency: String          // currency of the cart
    
    // object initialization
    init(offers: [ProductCartOffer], price: String, oldPrice: String?, priceCurrency: String)
}
```