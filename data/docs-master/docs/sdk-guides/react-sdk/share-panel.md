# Share panel 

## Setup `SharePanel` Configuration
To integrate the customized `SharePanel` into the `IASContainer` component, you need use the `storyReaderOptions` prop to pass the `SharePanel` configuration.

Here's an example of how to do this:

```tsx 

const sharePanelConfig: SharePanel = {
    background: "#f8f9fa", // Light grey background color
    borderRadius: 12,      // Rounded corners with a radius of 12 pixels
    divider: {
        background: "#dee2e6", // Light grey color for the divider line
    },
    targets: ["vk", "ok", "facebook", "x", "linkedin", "telegram"], // Share target platforms
}

const App = () => {
    return (
        <IASContainer
            config={{ apiKey: "{project-key}" }}
            storyReaderOptions={{ sharePanel: sharePanelConfig }}
        />
    );
};
```

## Customization 

This guide provides instructions and possibilities for customizing the colors and radius of the `SharePanel`.
### Customization Options

- **Background Color**: Set the background color of the panel.
- **Border Radius**: Set the border radius of the panel.
- **Divider Line Color**: Set the color of the divider line.
- **Button Customizations**: Customize the colors and SVG icons for the buttons.

### Instructions
#### 1. Set the background color

To customize the background color of the `SharePanel`, assign a value to the `background` property in the `SharePanel` configuration.

**Example:**
```ts
    background: "#f8f9fa", // Light grey background color
```

#### 2. Set the border radius

To set the border radius of the `SharePanel`, assign a value to the `borderRadius` property.

**Example:**
```ts
    borderRadius: 12, // Rounded corners with a radius of 12 pixels
```

#### 3.  Set the divider line Color

To customize the color of the divider line, assign a value to the `background` property within the `divider` object.

**Example:**
```ts
    divider: {
        background: "#dee2e6", // Light grey color for the divider line
    }
```

#### 4.  Customize text

- To customize the text color in the `SharePanel`, assign a value to the `color` property within the `text` object.

- To customize the text font in the `SharePanel`, assign a value to the `font` property within the `text` object.

**Example:**
```ts
    text: {
        color: "white",
        font: "inherit",
    }
```

#### 5. Customize button colors and SVG icons

If specific color customizations are needed for the buttons, ensure their SVG content or styles are updated accordingly.

**Example:**
```ts
    copyButton: {
        label: "Copy Link",
        svgSrc: {
            baseState: "<svg>...</svg>", // Replace with the actual SVG content and ensure the SVG itself has the desired colors
            doneState: "<svg>...</svg>", // Replace with the actual SVG content and ensure the SVG itself has the desired colors
        },
    },
    downloadButton: {
        svgSrc: {
            baseState: "<svg>...</svg>", // Same here for the download button
        },
    },
```

### Complete Example

Below is a complete example demonstrating how to customize the colors and radius of the `SharePanel`.

```ts
const sharePanelConfig: SharePanel<CustomShareTargets> = {
    background: "#f8f9fa", // Light grey background color
    borderRadius: 12,      // Rounded corners with a radius of 12 pixels
    divider: {
        background: "#dee2e6", // Light grey color for the divider line
    },
    text: {
        color: "white",
        font: "inherit",
    },
    targets: ["telegram", "newTarget"], // Include the new target here
    targetParams: {
        telegram: {
            label: "Telegram",
            icon: {
                svgSrc: {
                    baseState: "<svg>...</svg>", // Replace with the actual SVG content
                },
            },
            getUrl: (config: { url: string; text: string }) => `https://t.me/share/url?url=${config.url}&text=${config.text}`,
        },
        newTarget: {
            label: "New Target",
            icon: {
                svgSrc: {
                    baseState: "<svg>...</svg>", // Replace with the actual SVG content
                },
            },
            getUrl: (config: { url: string; text: string }) => `https://newtarget.com/share?url=${config.url}&text=${config.text}`,
        },
    },
    copyButton: {
        label: "Copy Link",
        svgSrc: {
            baseState: "<svg>...</svg>", // Replace with the actual SVG content and ensure the SVG itself has the desired colors
            doneState: "<svg>...</svg>", // Replace with the actual SVG content and ensure the SVG itself has the desired colors
        },
    },
    downloadButton: {
        svgSrc: {
            baseState: "<svg>...</svg>", // Same here for the download button
        },
    },
    title: {
        favicon: {
            background: "white"
            display: true,
        },
        getValue: (config: { url: string; text: string }) => `${config.text} - ${config.url}`,
    },
};
```

Feel free to further customize the `SharePanel` as needed by modifying the configuration object. For example, you can add more target platforms, change button labels, and update SVG icons to match your design requirements.

## How to add a new target?

To add a new target to the `SharePanel`, you need to follow these steps:

1. Define the new target as a string.
2. Create the parameters for the new target.
3. Update the `targets` array in the `SharePanel` configuration to include the new target.
4. Provide the `targetParams` for the new target.

Here's an example of how to do this:

```ts
// Define the new target
type CustomShareTargets = "telegram" | "newTarget";

// Create parameters for the new target
const newTargetParams: ShareTargetParams = {
    label: "New Target",
    icon: {
        svgSrc: {
            baseState: "<svg>...</svg>", // Replace with the actual SVG content
        },
    },
    getUrl: (config: { url: string; text: string }) => `https://newtarget.com/share?url=${config.url}&text=${config.text}`,
};

// Update the SharePanel configuration
const sharePanelConfig: SharePanel<CustomShareTargets> = {
    targets: ["telegram", "newTarget"], // Include the new target here
    targetParams: {
        telegram: {
            label: "Telegram",
            icon: {
                svgSrc: {
                    baseState: "<svg>...</svg>", // Replace with the actual SVG content
                },
            },
            getUrl: (config: { url: string; text: string }) => `https://t.me/share/url?url=${config.url}&text=${config.text}`,
        },
        newTarget: newTargetParams, // Add the parameters for the new target here
    },
};
```
## Default implementation 

The default implementation section outlines the predefined configuration settings and values used when initializing a `SharePanel`. This section is critical for understanding the base behavior and appearance of the `SharePanel` without additional customizations.

### Default Properties and Values

- **Background Color**: Defines the default background color of the panel.
- **Border Radius**: Sets the default border radius of the panel, determining the roundness of its corners.
- **Divider Line Color**: Specifies the default color of the divider line within the panel.
- **Target Platforms**: Lists the default sharing platforms included in the panel.
- **Target Parameters**: Contains the default settings for each target platform, including labels, icons, and URL generation functions.
- **Copy Button Configuration**: Sets the default label and SVG icon for the "Copy Link" button.
- **Download Button Configuration**: Defines the default SVG icon for the "Download Screenshot" button.
- **Title Configuration**: Provides default settings for the panel's title, including the display of the favicon and the function to generate the title.
- **Text Configuration**: Specifies the default color and font of share panel text.

```ts

export const SharePanelDefault: SharePanel = {
    targets: ["vk", "ok", "facebook", "x", "linkedin", "telegram"],
    targetParams: {
        vk: {
            label: "VK",
            icon: {
                svgSrc: {
                    baseState: `<svg>...</svg>`
                }
            },
            getUrl: ({ url, text }) => `https://vk.com/share.php?url=${url}&title=${text}`
        },
        facebook: {
            label: "Facebook",
            icon: {
                svgSrc: {
                    baseState: `<svg>...</svg>`
                }
            },
            getUrl: ({ url, text }) => `https://www.facebook.com/sharer.php?u=${url}&t=${text}`
        },
        x: {
            label: "X",
            icon: {
                svgSrc: {
                    baseState: `<svg>...</svg>`
                }
            },
            getUrl: ({ url, text }) => `https://twitter.com/share?url=${url}&text=${text}`
        },
        linkedin: {
            label: "LinkedIn",
            icon: {
                svgSrc: {
                    baseState: `<svg>...</svg>`
                }
            },
            getUrl: ({ url, text }) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}`
        },
        telegram: {
            label: "Telegram",
            icon: {
                svgSrc: {
                    baseState: `<svg>...</svg>`
                }
            },
            getUrl: ({ url, text }) => `https://t.me/share/url?url=${url}&text=${text}`
        },
        ok: {
            label: "OK",
            icon: {
                svgSrc: {
                    baseState: `<svg>...</svg>`
                }
            },
            getUrl: ({ url, text }) => `https://connect.ok.ru/offer?url=${url}&title=${text}`
        }
    },
    copyButton: {
        label: "Copy link",
        svgSrc: {
            baseState: `<svg>...</svg>`
            doneState: `<svg>...</svg>`
        }
    },
    downloadButton: {
        svgSrc: {
            baseState: `<svg>...</svg>`
        }
    },
    title: {
        favicon: {
            background: "white",
            display: true
        },
        getValue: ({ url }) => url
    },
    background: "#202125",
    borderRadius: 20,
    divider: {
        background: "#36373b"
    },
    text: {
        color: "white",
        font: "inherit",
    }
};

```

## Types declaration

The section types declaration is a part of the configuration process for the `SharePanel`. It involves defining the types and structure of the various elements within the `SharePanel`. This includes the target platforms, buttons, and other customizable aspects. Below are detailed descriptions of each section involved in the types declaration.

```ts

type BaseShareTarget = "vk" | "ok" | "facebook" | "x" | "linkedin" | "telegram";
export type ShareTarget<CustomTargets extends string = never> = BaseShareTarget | CustomTargets;

/**
 * Parameters for the target sharing platform
 */
export type ShareTargetParams = {
    /** The name of the target platform */
    label?: string;
    /** The icon associated with the target platform */
    icon?: {
        /** SVG icon */
        svgSrc: {
            baseState: string;
        };
    };
    /**
     * Function to generate a URL for sharing
     * @param config - An object containing the URL and text for sharing
     * @returns The sharing URL for the target platform
     *
     * @example
     * getUrl: (config: { url: string; text: string }) => `https://t.me/share/url?url=${config.url}&text=${config.text}`
     */
    getUrl?: (config: { url: string; text: string }) => string;
};

/**
 * Configuration for the sharing panel
 * @template CustomTargets - Additional target platforms for sharing
 */
export type SharePanel<CustomTargets extends string = never> = {
    /** The background color of the panel */
    background?: React.CSSProperties["background"];

    /** The border radius of the panel */
    borderRadius?: number;

    /** The divider line */
    divider?: {
        background: React.CSSProperties["background"];
    };

    /** Text color and font */
    text?: {
        color?: React.CSSProperties["color"];
        font?: React.CSSProperties["font"];
    };

    /** The list of target platforms for sharing */
    targets?: ShareTarget<CustomTargets>[];

    /** Parameters for each target platform */
    targetParams?: Partial<Record<ShareTarget<CustomTargets>, ShareTargetParams>>;

    /** Configuration for the "Copy Link" button */
    copyButton?: {
        /** The label of the button */
        label?: string;

        /** The SVG of the button */
        svgSrc?: {
            baseState: string;
            doneState: string
        };
    };

    /** Configuration for the "Download Screenshot" button */
    downloadButton?: {
        /** The SVG of the button */
        svgSrc?: {
            baseState: string;
        };
    };

    /** Configuration for the panel title */
    title?: {
        /** Favicon by URL */
        favicon?: {

            /** Favicon background */
            background?: React.CSSProperties["background"],

            /** Display the page favicon by URL */
            display?: boolean;
        };

        /** Function to generate the title considering the share URL and text */
        getValue?: (config: { url: string; text: string }) => string;
    };
};

```