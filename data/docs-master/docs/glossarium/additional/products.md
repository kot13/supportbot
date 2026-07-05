# Products

Feeds are used for bulk loading of products. A feed is a file with a list of offers to import into InAppStory.

## Supported feed formats

- [Google Shopping (specification RSS 2.0)](https://support.google.com/merchants/answer/7052112)
- [Yandex Market (specification YML)](https://yandex.ru/support/direct/ru/feeds/requirements-yml)
- CSV with a common structure

## Creating a feed file

### Google Shopping

Format [Google Shopping (specification RSS 2.0)](https://support.google.com/merchants/answer/7052112)

<a href="/files/feed-example-google.xml" target="_blank">Example feed file</a>

| Attribute InAppStory | Attribute feed                                              | Required                                                     | Default value | Value                                                                                                                                                                                                                                                                                    |
|----------------------|-------------------------------------------------------------|--------------------------------------------------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Offer ID             | id                                                          | yes                                                          | no            | String, maximum 50 characters<br/>Example: 1010-12-AC                                                                                                                                                                                                                                     |
| Group ID             | group_id                                                    | no                                                          | no           | String, maximum 255 characters<br/>Identifier for group of products with same model but with different characteristics, such as color or size.                                                                                                                                            |
| Name                 | title                                                       | no                                                           | no            | String, maximum 255 characters                                                                                                                                                                                                                                                           |
| Description          | description                                                 | no                                                           | no            | String, maximum 65535 characters                                                                                                                                                                                                                                                         |
| Url                  | link                                                        | no                                                           | no            | Offer link URL                                                                                                                                                                                                                                                                           |
| Size                 | size                                                        | no                                                           | no            | String, maximum 255 characters                                                                                                                                                                                                                                                           |
| Color                | color                                                       | no                                                           | no            | String, maximum 255 characters                                                                                                                                                                                                                                                           |
| Availability         | availability                                                | no                                                           | In stock      | For value "In stock": in_stock, in stock, y, yes, true, 1<br/><br/>For value "Out of stock": out_of_stock, out of stock, n, no, false, 0<br/><br/>For value "Preorder": preorder, pre-order<br/><br/>For value "Backorder": backorder |
| Price<br/>Currency    | price                                                       | no<br/><br/>currency is required if exists price or old price | no            | Amount and currency in format: X.XX YYY<br/>Example: 199.99 USD                                                                                                                                                                                                                           |
| Old price            | sale_price                                                  | no                                                           | no            | Amount in format: X.XX<br/>Example: 199.99<br/><br/>mount and currency in format: X.XX YYY<br/>Example: 199.99 USD                                                                                                                                                                           |
| Images               | image_link<br/>there may be more than one for several photos | no                                                           | no            | Offer photo URL                                                                                                                                                                                                                                                                          |

### Yandex Market

Format [Yandex Market (specification YML)](https://yandex.ru/support/direct/ru/feeds/requirements-yml)

<a href="/files/feed-example-yandex.xml" target="_blank">Example feed file</a>

| Attribute InAppStory | Attribute feed                                           | Required                                        | Default value | Value                                                                                                                                         |
|----------------------|----------------------------------------------------------|-------------------------------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Offer ID             | id                                                       | yes                                             | no            | String, maximum 50 characters<br/>Example: 1010-12-AC                                                                                          |
| Group ID             | group_id                                                 | no                                             | no           | String, maximum 255 characters<br/>Identifier for group of products with same model but with different characteristics, such as color or size. |
| Name                 | name                                                     | no                                              | no            | String, maximum 255 characters                                                                                                                |
| Description          | description                                              | no                                              | no            | String, maximum 65535 characters                                                                                                              |
| Url                  | url                                                      | no                                              | no            | Offer link URL                                                                                                                                |
| Size                 | size                                                     | no                                              | no            | String, maximum 255 characters                                                                                                                |
| Color                | color                                                    | no                                              | no            | String, maximum 255 characters                                                                                                                |
| Availability         | availability                                             | no                                              | In stock      | For value "In stock": true<br/><br/>For value "Out of stock": false or empty                                                                    |
| Price                | price                                                    | no                                              | no            | Amount in format: X.XX<br/>Example: 199.99                                                                                                     |
| Old price            | oldprice                                                 | no                                              | no            | Amount in format: X.XX<br/>Example: 199.99                                                                                                     |
| Currency             | currencyid                                               | no<br/><br/>required if exists price or old price | no            | Currency in format: YYY<br/>Example: USD                                                                                                       |
| Images               | picture<br/>there may be more than one for several photos | no                                              | no            | Offer photo URL                                                                                                                               |
| Vendor               | vendor                                                   | no                                              | no            | String, maximum 255 characters                                                                                                                |
| Vendor code          | vendorcode                                               | no                                              | no            | String, maximum 100 characters                                                                                                                |
| Model                | model                                                    | no                                              | no            | String, maximum 255 characters                                                                                                                |
| Adult                | adult                                                    | no                                              | enabled       | To enable: true, 1, yes, y, +<br/><br/>To disable: false, 0, no, n, -                                                              |

### CSV

<a href="/files/feed-example-csv.csv" target="_blank">Example feed file</a>

| Attribute InAppStory | Attribute feed                                           | Required                                        | Default value | Value                                                                                                                                         |
|----------------------|----------------------------------------------------------|-------------------------------------------------|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Offer ID             | id, sku                                            | yes                                             | no            | String, maximum 50 characters<br/>Example: 1010-12-AC                                                                                          |
| Group ID             | group_id, group id, group                      | no                                             | no           | String, maximum 255 characters<br/>Identifier for group of products with same model but with different characteristics, such as color or size. |
| Name                 | title, name                        | no                                              | no            | String, maximum 255 characters                                                                                                                |
| Description          | description                                   | no                                              | no            | String, maximum 65535 characters                                                                                                              |
| Url                  | url, link                                     | no                                              | no            | Offer link URL                                                                                                                                |
| Size                 | size                                           | no                                              | no            | String, maximum 255 characters                                                                                                                |
| Color                | color                                             | no                                              | no            | String, maximum 255 characters                                                                                                                |
| Price                | price                                            | no                                              | no            | Amount in format: X.XX<br/>Example: 199.99                                                                                                     |
| Old price            | old price                                  | no                                              | no            | Amount in format: X.XX<br/>Example: 199.99                                                                                                     |
| Currency             | currency, currencyid, currency id, currency code | no<br/><br/>required if exists price or old price | no            | Currency in format: YYY<br/>Example: USD                                                                                                       |
| Images               | image, picture                 | no                                              | no            | A comma-separated list of offer photo URLs                                                                                                    |

## Adding a feed to import offers

1. In the InAppStory console, go to the "Products" section using the menu bar on the left.
2. Go to the "Feeds" section using the page tab menu at the top.
3. Click the "Create" button.
4. In the pop-up window, enter the URL of the feed file or the service that generates the file when accessed.
5. Click the "Save" button.

The created feed will be automatically processed on a regular. Processing progress will be displayed in this section.

## Automatic feed processing interval

| Number of offers in the feed | Interval            |
|------------------------------|---------------------|
| 1-999                        | Once an hour        |
| 1,000-9,999                  | Once every 2 hours  |
| 10,000-99,999                | Once every 6 hours  |
| 100,000 and more             | Once every 12 hours |
