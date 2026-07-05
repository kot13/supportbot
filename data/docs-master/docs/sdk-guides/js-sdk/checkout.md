# Checkout

## What is checkout

**Checkout** is an add-on to the `products` widget that allows displaying
products directly inside stories and managing the user's cart. With
checkout you can:

-   show products inside stories;
-   allow users to add products to their cart;
-   retrieve the current cart state from your host app;
-   react to "Add to cart" and "Go to cart" actions;
{/* -   synchronize the story cart with your application's cart. */}

Checkout is a two‑way integration:\
SDK sends events, and your app responds by updating the cart and
returning its current state.

------------------------------------------------------------------------

## Events

```ts
import { InAppStoryManager } from "@inappstory/js-sdk"

const inAppStoryManager = new InAppStoryManager({ apiKey: "{projectToken}" });
inAppStoryManager.on("productCartUpdated", (payload) => console.log(payload));
inAppStoryManager.on("productCartClicked", (payload) => console.log(payload));
```

---

- [`productCartUpdated`](#productcartupdated)
- [`productCartClicked`](#productcartclicked)
---


### `productCartUpdated`

**Description:** Triggered when the user presses the **"Add to cart"**
button.

**Payload:**

| Field       | Type                                 | Description                                               |
| ----------- | ------------------------------------ | --------------------------------------------------------- |
| `offer`     | object (`ProductCartOffer`)          | Product offer data added to the cart.                     |
| `onSuccess` | function(cart: ProductCart)          | Callback triggered when the cart is successfully updated. |
| `onError`   | `function(error: { message: string })` | Callback triggered when the update fails.                 |

**Use Cases:**

* Update the quantity of products in the local cart;
* Synchronize with a backend;
* Validate data before adding a product.

### `productCartClicked`

**Description:** Triggered when the user clicks the **"Go to cart"**
button.

**Payload:**

Event contains no payload.

**Use Cases:**

* Open the cart screen in the app;
* Save the cart state;
* Show a native screen or modal.

------------------------------------------------------------------------

## API

### `getProductCartState: () => Promise<ProductCart>`

**Description:** A setter used to override the default implementation of the cart state retrieval function from your application.

#### Example
```ts
inAppStoryManager.products.getProductCartState = async () => {
        return {
            offers: Object.values(offersById),
            price: "0",
            priceCurrency: ""
        };
    };
```

| Field           | Type     | Description                  |
| --------------- | -------- | ---------------------------- |
| `offers`        | object[] | List of offers in the cart.  |
| `price`         | string   | Total cart price (optional). |
| `priceCurrency` | string   | Currency (optional).         |

## Example

Below is a basic example of integrating checkout into your application.

``` ts
import { InAppStoryManager } from "@inappstory/js-sdk"

const inAppStoryManager = new InAppStoryManager({ apiKey: "{projectToken}" });

let offersById = {};

const handleCartUpdated = ({ offer, onSuccess, onError }) => {
    try {
        if (offersById[offer.offerId]) {
            offersById[offer.offerId].quantity += offer.quantity;
        } else {
            offersById[offer.offerId] = offer;
        }

        onSuccess({
            offers: Object.values(offersById)
        });
    } catch (e) {
        onError({ message: "Failed to update cart" });
    }
};

const handleCartClicked = () => {
    console.log("Cart clicked. Current offers:", Object.values(offersById));
};

const handleCloseStoryReader = () => {
    offersById = {};
};

inAppStoryManager.products.getProductCartState = async () => {
    return {
        offers: Object.values(offersById),
        price: "0",
        priceCurrency: ""
    };
};

inAppStoryManager.on("productCartUpdated", handleCartUpdated);
inAppStoryManager.on("productCartClicked", handleCartClicked);
inAppStoryManager.on("closeStoryReader", handleCloseStoryReader);
```

## Types

### ProductCartOffer
```ts
interface ProductCartOffer {
  /** Unique identifier of the offer */
  offerId: string;
  /** Identifier of the group (if the offer belongs to a group) */
  groupId?: string;
  /** Human-readable offer name */
  name?: string;
  /** Offer description */
  description?: string;
  /** Link to the product page */
  url?: string;
  /** URL of the main product image */
  coverUrl?: string;
  /** Additional product images */
  imageUrls: Array<string>;
  /** Currency code (e.g. "USD", "EUR") */
  currency?: string;
  /** Current product price */
  price?: string;
  /** Previous price (if applicable) */
  oldPrice?: string;
  /** Whether the product contains adult content */
  adult?: boolean;
  /** Availability count (e.g. remaining stock) */
  availability: number;
  /** Size variation (if applicable) */
  size?: string;
  /** Color variation (if applicable) */
  color?: string;
  /** Quantity of this offer in the cart */
  quantity: number;
};
```