# Use React SDK with a CSP

[Content Security Policy](https://developer.mozilla.org/ru/docs/Web/HTTP/CSP) (CSP) is a widely supported Web security standard intended to prevent certain types of injection-based attacks by giving developers control over the resources loaded by their applications. Use this guide to understand how to deploy Google Tag Manager on sites that use a CSP.

:::tip
**Note:** To ensure the CSP behaves as expected, it is best to use the report-uri and/or report-to directives to get reports of policy violations.
:::

## Enable CSP

Please note that CSPs are not enabled by default. A corresponding `header` Content-Security-Policy or meta tag `<meta http-equiv="Content-Security-Policy" ...>` needs to be sent with the document to instruct the browser to enable the CSP. Here's an example of CSP header to allow access to InAppStory resources. 

```shell
Content-Security-Policy: default-src 'self' data: https://*.inappstory.ru https://*.inappstory.com 'nonce-{SERVER-GENERATED-NONCE}';
```

React SDK will get the `nonce` value by searching for an any element with the `nonce` attribute set. For example you could have the following HTML file with your app bundle that uses react-sdk:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta
            http-equiv="Content-Security-Policy"
            content="default-src 'self' data: blob: https://*.inappstory.ru https://*.inappstory.com https://*.getinappstory.com 'sha256-/ayvprJmXbRDI449BxK/5WRZK0CFzow+6O1VdpQ4of0=' 'nonce-{SERVER-GENERATED-NONCE}';" />
        <script defer src="your-app-bundle.js" nonce="{SERVER-GENERATED-NONCE}"></script>
    </head>
    <body>
    </body>
</html>


```
If the recommended nonce or hash approaches are not feasible, it is possible to enable the JS SDK inline script by adding the 'unsafe-inline' directive to the CSP's script-src section.

:::danger
The use of 'unsafe-inline' is discouraged. You should carefully consider the security ramifications of adding this directive to the CSP before using this approach.
:::

The following directives are needed in the CSP to use this approach:

```shell
default-src 'unsafe-inline' 'self' data: https://*.inappstory.ru https://*.inappstory.com;
```
