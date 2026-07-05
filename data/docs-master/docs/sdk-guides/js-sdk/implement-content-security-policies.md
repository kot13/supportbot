# Use JS SDK with a CSP

[Content Security Policy](https://developer.mozilla.org/ru/docs/Web/HTTP/CSP) (CSP) is a widely supported Web security standard intended to prevent certain types of injection-based attacks by giving developers control over the resources loaded by their applications. Use this guide to understand how to deploy Google Tag Manager on sites that use a CSP.

:::tip
**Note:** To ensure the CSP behaves as expected, it is best to use the report-uri and/or report-to directives to get reports of policy violations.
:::

## Enable the container tag to use CSP

To use JS SDK on a page with a CSP, the CSP must allow for the execution of your JS SDK container code. This code is built as inline JavaScript code that injects the IAS.js script. There are several ways to do this, such as the use of a nonce or a hash. The recommended method is to use a nonce, which should be an unguessable, random value that the server generates individually for each response. Supply the nonce value in the Content-Security-Policy script-src directive:

```shell
Content-Security-Policy: default-src 'self' data: https://*.inappstory.ru https://*.inappstory.com 'nonce-{SERVER-GENERATED-NONCE}';
```

Then use the nonce-aware version of the inline JS SDK container code. Set the nonce attribute on the inline script element to this same value:

```html
<script defer src="https://cdn.domain-placeholder/sdk/js-sdk-version-placeholder/dist/js/IAS.js" nonce='{SERVER-GENERATED-NONCE}'></script>
```

Also pass nonce to the StoryManager constructor:

```js
    const inAppStoryManagerConfig = {
        nonce: "{SERVER-GENERATED-NONCE}",
        apiKey: "{project-integration-key}",
        userId: "{user-identifier}",
        tags: [],
        placeholders: { 
            user: "Guest",
        },
        imagePlaceholders: {
        userAvatar: "image_url",
        },
        lang: "en-US",
    };
    
    // StoryManager singleton instance
    const inAppStoryManager = new window.IAS.InAppStoryManager(inAppStoryManagerConfig);
```

JS SDK will then propagate the nonce to any scripts that it adds to the page.\
\
There are other approaches to enabling the execution of an inline script, such as supplying the [hash of the inline script](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#whitelisting_external_scripts_using_hashes) in the CSP. Please consult CSP documentation for more details.\
\
If the recommended nonce or hash approaches are not feasible, it is possible to enable the JS SDK inline script by adding the 'unsafe-inline' directive to the CSP's script-src section.

:::danger
The use of 'unsafe-inline' is discouraged. You should carefully consider the security ramifications of adding this directive to the CSP before using this approach.
:::

The following directives are needed in the CSP to use this approach:

```shell
default-src 'unsafe-inline' 'self' data: https://*.inappstory.ru https://*.inappstory.com;
```
