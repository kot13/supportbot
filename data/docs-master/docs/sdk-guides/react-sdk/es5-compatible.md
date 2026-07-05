# Legacy Browser Support

Our package utilizes all features of the ES6 (ES2015) standard. To maintain compatibility with ES5 or lower, you must use transpilation tools such as Babel when building your application.

## Requirements for Legacy Browsers

Supporting older browsers requires several additional steps:

- **Transpiling modern JavaScript syntax to ES5** using Babel or a similar tool.
- **Transforming ES modules** into a format compatible with older browsers, such as CommonJS or UMD.
- **Loading polyfills** for missing APIs and functionalities.
- **Ensuring proper handling of Web Components** with polyfills if they are used in your application.

## Browser Compatibility Table

The following table lists browser versions and indicates when transpilation and polyfills are required:

| Browser           | Requires Transpilation for Versions | Requires Polyfills for Versions |
| ----------------- | ----------------------------------- | ------------------------------- |
| Chrome            | < 79                                | < 79                            |
| Firefox           | < 68                                | < 68                            |
| Edge              | < 79                                | < 79                            |
| Safari            | < 13                                | < 13                            |
| Internet Explorer | < 11                                | < 11                            |

## Configuring Transpilation for Older Browsers

To ensure compatibility with legacy browsers, you need to configure your build tools properly. Below are the steps for Webpack and Rollup.

### Using Babel with Webpack

When using Webpack, you must configure `babel-loader` to transpile the necessary packages. Update your Webpack configuration as follows:

```js
module: {
    rules: [
        {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules[\\\/](?!(@inappstory[\\\/]react-sdk|your-other-module))/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ["@babel/preset-env", {
                            targets: "> 0.25%, not dead"
                        }]
                    ]
                },
            }
        }
    ]
}
```

### Using Babel with Rollup

For Rollup, you need to configure `@rollup/plugin-babel` to transpile modern JavaScript properly:

```js
import babel from '@rollup/plugin-babel';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'umd',
        name: 'MyLibrary'
    },
    plugins: [
        babel({
            babelHelpers: 'bundled',
            exclude: /node_modules[\\\/](?!(@inappstory[\\\/]react-sdk|your-other-module))/,
            presets: [
                ["@babel/preset-env", {
                    targets: "> 0.25%, not dead"
                }]
            ]
        })
    ]
};
```

## Web Components and Polyfills

Our package utilizes Web Components, which may not be fully supported in older browsers such as Internet Explorer or older versions of Safari. To ensure proper functionality, you need to load the necessary polyfills.

### Recommended Polyfills

For full support of Web Components, you should include the following polyfills:

1. `@webcomponents/webcomponentsjs` – A collection of polyfills for Shadow DOM, Custom Elements, and other Web Component features.
2. `core-js` – Provides polyfills for modern JavaScript features like `Promise`, `Symbol`, and more.

### Adding Web Component Polyfills

For applications using Web Components, add the following polyfills at the beginning of your entry script:

```html
<script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.8.0/webcomponents-bundle.js"></script>
<script>
    if (!window.customElements) {
        document.write('<script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs@2.8.0/custom-elements-es5-adapter.js"><\/script>');
    }
</script>
```

Alternatively, if you are using a bundler like Webpack or Rollup, install the necessary polyfills:

```sh
npm install @webcomponents/webcomponentsjs core-js --save
```

Then, import them in your entry file:

```js
import 'core-js/stable';
import '@webcomponents/webcomponentsjs/webcomponents-bundle.js';
```

## Conclusion

By properly configuring transpilation and including the necessary polyfills, you can ensure that your application runs smoothly on legacy browsers while leveraging modern JavaScript and Web Component features.

