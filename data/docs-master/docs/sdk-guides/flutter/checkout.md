# Checkout

The Products widget is a new version of the Goods widget that does not require any settings on the host application
side.
All widget appearance settings are made in the console.

## Shopping cart

Starting with SDK version 0.7.0, the Products widget has added functionality that allows you to add products to the host
application's shopping cart directly from stories. To add interaction with this widget you need to set callbacks in
`InAppStoryManager`:

```dart
void setupCheckout() {
  InAppStoryManager.instance.setOnProductCartUpdate(
        (offer) async {
      return ProductCart();
    },
  );
  InAppStoryManager.instance.setGetProductCartState(
        () async {
      return ProductCart();
    },
  );
}
```

### Updating the cart from stories

To update the cart from stories, you need to use `setOnProductCartUpdate` function in `InAppStoryManager`. It receives
the `offer` parameter (the product that was selected in stories to be added).
If succeed, you have to passed a `ProductCart` object in the `return` statement. If the product couldn't be added to the
cart for any reason, you need to pass `Future.error(<string>)` in the `return` statement.

```dart
class CheckoutExample extends StatefulWidget {
  const CheckoutExample({super.key});

  @override
  State<CheckoutExample> createState() => _CheckoutExampleState();
}

class _CheckoutExampleState extends State<CheckoutExample> {
  final _productCart =
  ProductCart(offers: [], price: '0.0', priceCurrency: 'USD');

  @override
  void initState() {
    super.initState();
    InAppStoryManager.instance.setOnProductCartUpdate(
          (offer) async {
        _productCart.offers.add(offer);
        setState(() {});
        return _productCart;
        // or
        // return Future.error('Can't add product to cart')
      },
    );
    InAppStoryManager.instance.setGetProductCartState(
          () async {
        return _productCart;
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        'Total: ${_productCart.price} ${_productCart.priceCurrency}',
      ),
    );
  }
}
```

### Go to the product cart screen

After successfully adding a product to the cart, a button appears in the widget to go to the cart.
Clicking on it triggers the `onProductCartClicked` from `IASCheckoutCallback`.

:::warning[Please note]
If you need to close story reader after clicking on "Go to cart" button, you need to call `super.onProductCartClicked`
inside `onProductCartClicked` method.
:::

```dart
class CheckoutExample extends StatefulWidget {
  const CheckoutExample({super.key});

  @override
  State<CheckoutExample> createState() => _CheckoutExampleState();
}

class _CheckoutExampleState extends State<CheckoutExample> with IASCheckoutCallback {
  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }

  @override
  Future<void> onProductCartClicked() async {
    super.onProductCartClicked;
    // TODO: open app product cart
  }
}
```

### Method's objects

```dart
class ProductCartOffer {
  String offerId; // product ID
  String? groupId; // product group ID
  String name; // product name
  String? description; // product description
  String? url; // link to external resource for product
  String? coverUrl; // cover image address
  List<String> imageUrls; // list of addresses for product images
  String? currency; // currency in which the product is priced
  String? price; // current product price (after discounts)
  String? oldPrice; // old product price
  bool? adult; // whether the product has age restrictions
  int availability; // product availability
  String? size; // product size
  String? color; // product color
  int quantity; // quantity of the product in the cart
}

class ProductCart {
  List<ProductCartOffer> offers;
  String price;
  String? oldPrice;
  String priceCurrency;

  ProductCart({
    required this.offers,
    required this.price,
    required this.priceCurrency,
    this.oldPrice,
  });
}
```